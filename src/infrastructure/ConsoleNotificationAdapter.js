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
