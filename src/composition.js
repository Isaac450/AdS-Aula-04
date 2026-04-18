// src/composition.js

// Adaptadores de infraestrutura
const RedisEventBus              = require('./infrastructure/RedisEventBus');
const SqlAppointmentRepository   = require('./infrastructure/SqlAppointmentRepository');
const SqlPatientRepository       = require('./infrastructure/SqlPatientRepository');
const TwilioNotificationService  = require('./infrastructure/TwilioNotificationService');
const SqlBillingRepository       = require('./infrastructure/SqlBillingRepository');
const SqlAuditRepository         = require('./infrastructure/SqlAuditRepository');

// Core
const AppointmentService   = require('./core/services/AppointmentService');
const NotificationConsumer = require('./core/consumers/NotificationConsumer');
const BillingConsumer      = require('./core/consumers/BillingConsumer');
const AuditConsumer        = require('./core/consumers/AuditConsumer');

// 1. Instanciar adaptadores
const eventBus              = new RedisEventBus();
const appointmentRepository = new SqlAppointmentRepository();
const patientRepository     = new SqlPatientRepository();
const notificationService   = new TwilioNotificationService();
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