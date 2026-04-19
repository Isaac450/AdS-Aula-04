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
