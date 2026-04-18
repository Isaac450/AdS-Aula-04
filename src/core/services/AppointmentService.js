// src/core/services/AppointmentService.js

class AppointmentService {
  constructor(appointmentRepository, eventBus) {
    // Injeção de dependência — dois Portos, sem implementações concretas
    this.appointmentRepository = appointmentRepository; // IAppointmentRepository
    this.eventBus              = eventBus;              // IEventBus
  }

  async schedule(doctorId, patientId, date, speciality) {
    // 1. Regra de negócio (domínio puro)
    const isAvailable = await this.appointmentRepository.isDoctorAvailable(doctorId, date);
    if (!isAvailable) throw new Error('Médico indisponível neste horário.');

    // 2. Persistir via Porto
    const appointment = await this.appointmentRepository.save({
      doctorId, patientId, date, speciality, status: 'SCHEDULED'
    });

    // 3. Emitir evento via Porto — o Core NÃO sabe quem vai reagir
    //    Nome no passado: 'ConsultaAgendada'
    await this.eventBus.publish('ConsultaAgendada', {
      appointmentId: appointment.id,
      patientId,
      doctorId,
      speciality,
      scheduledAt:  date,
      occurredAt:   new Date().toISOString()
    });

    return appointment;
    // O serviço termina aqui — não coordena os Consumers
  }
}

module.exports = AppointmentService;