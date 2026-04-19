// src/core/consumers/NotificationConsumer.js
// Responsabilidade única: reagir a ConsultaAgendada enviando SMS ao paciente

class NotificationConsumer {
  constructor(notificationService, patientRepository) {
    this.notificationService = notificationService; // INotificationService
    this.patientRepository = patientRepository; // IPatientRepository
  }

  // Handler passado ao IEventBus.subscribe()
  async handle(event) {
    const { patientId, speciality, scheduledAt, appointmentId } = event.data;

    const patient = await this.patientRepository.findById(patientId);
    await this.notificationService.sendSms(
      patient.phone,
      `Consulta de ${speciality} agendada para ${scheduledAt}. Ref: ${appointmentId}`
    );
  }
}

module.exports = NotificationConsumer;