// src/core/consumers/BillingConsumer.js
// Responsabilidade única: criar pré-fatura ao agendar consulta

class BillingConsumer {
  constructor(billingRepository) {
    this.billingRepository = billingRepository; // IBillingRepository
  }

  async handle(event) {
    const { appointmentId, patientId, doctorId } = event.data;

    await this.billingRepository.createPreInvoice({
      appointmentId,
      patientId,
      doctorId,
      status:    'PENDING',
      createdAt: new Date()
    });
  }
}

module.exports = BillingConsumer;

// ---
