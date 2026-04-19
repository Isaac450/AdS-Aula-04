# Alterações no Adaptador de Notificações

Este documento contém o código para o novo padrão de Adaptador de Notificações implementado para desacoplar o Domínio da infraestrutura específica de notificações (Twilio).

## 1. A Interface (Porto)
**Ficheiro: `src/core/ports/INotificationService.js`**

Isto define o contrato (`O QUÊ`) que o domínio necessita para enviar notificações. Ele não sabe *como* elas são enviadas.

```javascript
// src/core/ports/INotificationService.js
// Porto (interface) — define O QUÊ o domínio precisa para notificações.
// Qualquer Adaptador concreto deve implementar estes métodos.

class INotificationService {
  /**
   * Envia um SMS para o número indicado.
   * @param {string} phoneNumber
   * @param {string} message
   */
  async sendSms(phoneNumber, message) {
    throw new Error('Method not implemented');
  }

  /**
   * Envia um e-mail.
   * @param {string} email
   * @param {string} subject
   * @param {string} body
   */
  async sendEmail(email, subject, body) {
    throw new Error('Method not implemented');
  }
}

module.exports = INotificationService;
```

## 2. O Adaptador Concreto
**Ficheiro: `src/infrastructure/ConsoleNotificationAdapter.js`**

Esta é a implementação concreta (`COMO`) do nosso Porto. Em vez de usar o Twilio, ele simplesmente regista (logs) as notificações no terminal.

```javascript
// src/infrastructure/ConsoleNotificationAdapter.js
// Adaptador concreto que implementa INotificationService usando console.log

const INotificationService = require('../core/ports/INotificationService');

class ConsoleNotificationAdapter extends INotificationService {
  /**
   * "Envia" um SMS escrevendo no console.
   * @param {string} phoneNumber
   * @param {string} message
   */
  async sendSms(phoneNumber, message) {
    console.log(`[Console SMS] Para: ${phoneNumber} | Mensagem: ${message}`);
    return { status: 'logged' };
  }

  /**
   * "Envia" um e-mail escrevendo no console.
   * @param {string} email
   * @param {string} subject
   * @param {string} body
   */
  async sendEmail(email, subject, body) {
    console.log(`[Console Email] Para: ${email} | Assunto: ${subject} | Corpo: ${body}`);
    return { status: 'logged' };
  }
}

module.exports = ConsoleNotificationAdapter;
```

## 3. Atualização da Raiz de Composição (Composition Root)
**Ficheiro: `src/composition.js`**

Este é o local onde interligamos a aplicação. Trocamos o `TwilioNotificationService` e fornecemos o `ConsoleNotificationAdapter` à nossa dependência `notificationService`. É de notar que o `AppointmentService` permanece completamente inalterado.

```javascript
// Adaptadores de infraestrutura
const InMemoryEventBus           = require('./infrastructure/InMemoryEventBus');
const SqlAppointmentRepository   = require('./infrastructure/SqlAppointmentRepository');
const SqlPatientRepository       = require('./infrastructure/SqlPatientRepository');
// IMPORTAÇÃO DO NOVO ADAPTADOR EM VEZ DO TWILIO
const ConsoleNotificationAdapter = require('./infrastructure/ConsoleNotificationAdapter');
const SqlBillingRepository       = require('./infrastructure/SqlBillingRepository');
const SqlAuditRepository         = require('./infrastructure/SqlAuditRepository');

// Core
const AppointmentService   = require('./core/services/AppointmentService');
const NotificationConsumer = require('./core/consumers/NotificationConsumer');
const BillingConsumer      = require('./core/consumers/BillingConsumer');
const AuditConsumer        = require('./core/consumers/AuditConsumer');

// 1. Instanciar adaptadores
const eventBus              = new InMemoryEventBus();
const appointmentRepository = new SqlAppointmentRepository();
const patientRepository     = new SqlPatientRepository();
// INSTANCIAR O NOVO ADAPTADOR
const notificationService   = new ConsoleNotificationAdapter();
const billingRepository     = new SqlBillingRepository();
const auditRepository       = new SqlAuditRepository();

// 2. Injetar no AppointmentService (Producer)
const appointmentService = new AppointmentService(appointmentRepository,eventBus);

// 3. Injetar nos Consumers
const notificationConsumer = new NotificationConsumer(notificationService,patientRepository);
const billingConsumer      = new BillingConsumer(billingRepository);
const auditConsumer        = new AuditConsumer(auditRepository);

// 4. Registar os Consumers no Event Bus
//    O Bus chama consumer.handle(event) quando o evento chegar
eventBus.subscribe('ConsultaAgendada', (e) => notificationConsumer.handle(e));
eventBus.subscribe('ConsultaAgendada', (e) => billingConsumer.handle(e));
eventBus.subscribe('ConsultaAgendada', (e) => auditConsumer.handle(e));

// 5. Exportar o serviço para a API Route
module.exports = { appointmentService };
```
