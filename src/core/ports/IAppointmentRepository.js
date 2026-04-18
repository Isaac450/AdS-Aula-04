// Define o contrato, o "O QUÊ" o domínio precisa.
class IAppointmentRepository {
  async isDoctorAvailable(doctorId, date) { throw new Error("Method not implemented"); }
  async save(appointment) { throw new Error("Method not implemented"); }
}
// CONTRATO DO DOMÍNIO
module.exports = IAppointmentRepository;