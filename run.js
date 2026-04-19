require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { createClient } = require('@supabase/supabase-js');
const { appointmentService } = require('./src/composition');

async function main() {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
  );

  const doctorId = uuidv4();
  const patientId = uuidv4();
  const appointmentDate = '2025-11-15T10:00:00Z';
  const speciality = 'Cardiologia';

  try {
    // Create doctor
    const { error: doctorError } = await supabase
      .from('doctors')
      .insert({
        id: doctorId,
        name: 'Dr. Silva',
        speciality: speciality
      });

    if (doctorError) throw doctorError;

    // Create patient
    const { error: patientError } = await supabase
      .from('patients')
      .insert({
        id: patientId,
        name: 'João Santos',
        phone: '+351912345678',
        email: 'joao@example.com'
      });

    if (patientError) throw patientError;

    // Schedule appointment
    const result = await appointmentService.schedule(
      doctorId,
      patientId,
      appointmentDate,
      speciality
    );

    console.log('Appointment created:', result);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
