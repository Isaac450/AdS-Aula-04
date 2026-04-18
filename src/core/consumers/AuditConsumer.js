// src/core/consumers/AuditConsumer.js
// Responsabilidade única: registar evento para conformidade regulatória

class AuditConsumer {
  constructor(auditRepository) {
    this.auditRepository = auditRepository; // IAuditRepository
  }

  async handle(event) {
    await this.auditRepository.log({
      eventId:   event.eventId,
      eventType: event.eventType,
      occurredAt: event.occurredAt,
      data:      event.data
    });
  }
}

module.exports = AuditConsumer;