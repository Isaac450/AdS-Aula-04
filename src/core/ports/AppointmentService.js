// O Serviço NÃO sabe que existe SQL ou 'pg' driver.
class AppointmentService {
  constructor(appointmentRepo) {
    // Recebe o repositório via Injeção de Dependência
    this.appointmentRepo = appointmentRepo;
  }
// DIP

  async schedule(doctorId, patientId, date) {
    // Fala com a abstração. Foca-se APENAS na Regra de Negócio.
    // O domínio chama o Porto, não a Base de Dados
    const isAvailable = await this.appointmentRepo.isDoctorAvailable(doctorId,date);
    // domínio isolado

    if (!isAvailable) {
      throw new Error("O médico já tem uma consulta agendada para esta data.");
    }
    // regra pura

    const appointment = { doctorId, patientId, date };
    return await this.appointmentRepo.save(appointment);
  }
}

module.exports = AppointmentService;