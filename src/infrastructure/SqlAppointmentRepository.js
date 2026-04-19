//MADE BY AI!

const { createClient } = require('@supabase/supabase-js');
const IAppointmentRepository = require('../core/ports/IAppointmentRepository');

class SqlAppointmentRepository extends IAppointmentRepository {
  constructor() {
    super();
    this.supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    );
  }

  async isDoctorAvailable(doctorId, date) {
    const { data, error } = await this.supabase
      .from('appointments')
      .select('id')
      .eq('doctor_id', doctorId)
      .eq('date', date)
      .maybeSingle();

    if (error) throw error;
    return !data;
  }

  async save(appointment) {
    const dbAppointment = {
      doctor_id: appointment.doctorId,
      patient_id: appointment.patientId,
      date: appointment.date,
      speciality: appointment.speciality,
      status: appointment.status
    };

    const { data, error } = await this.supabase
      .from('appointments')
      .insert([dbAppointment])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async findById(appointmentId) {
    const { data, error } = await this.supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
}

module.exports = SqlAppointmentRepository;
