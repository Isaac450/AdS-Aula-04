// tests/unit/NotificationConsumer.test.js
const NotificationConsumer = require('../../src/core/consumers/NotificationConsumer');

const mockNotificationService = { sendSms: jest.fn().mockResolvedValue(true)
};
const mockPatientRepository   = {
  findById: jest.fn().mockResolvedValue({ phone: '+351910000000' })
};

test('deve enviar SMS ao paciente quando ConsultaAgendada é recebido', async () => {
  const consumer = new NotificationConsumer(
    mockNotificationService,
    mockPatientRepository
  );

  await consumer.handle({
    eventId: 'evt-1', eventType: 'ConsultaAgendada',
    occurredAt: '2025-11-01T09:30:00Z', version: '1.0',
    data: {
      appointmentId: 'appt-001', patientId: 'pat-42',
      speciality: 'Cardiologia', scheduledAt: '2025-11-15T10:00:00Z'
    }
  });

  expect(mockPatientRepository.findById).toHaveBeenCalledWith('pat-42');
  expect(mockNotificationService.sendSms).toHaveBeenCalledWith(
    '+351910000000',
    expect.stringContaining('Cardiologia')
  );
  // Teste corre em < 5ms — sem Redis, sem Twilio, sem PostgreSQL
});