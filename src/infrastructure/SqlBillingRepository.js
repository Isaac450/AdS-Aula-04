//MADE BY AI!
const { createClient } = require('@supabase/supabase-js');

class SqlBillingRepository {
  constructor() {
    this.supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    );
  }

  async createPreInvoice(invoice) {
    const dbInvoice = {
      appointment_id_ref: invoice.appointmentId,
      patient_id_ref: invoice.patientId,
      doctor_id_ref: invoice.doctorId,
      status: invoice.status || 'PENDING',
      amount: invoice.amount || 0
    };

    const { data, error } = await this.supabase
      .from('billing_invoices')
      .insert([dbInvoice])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async findByAppointmentId(appointmentId) {
    const { data, error } = await this.supabase
      .from('billing_invoices')
      .select('*')
      .eq('appointment_id_ref', appointmentId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async updateInvoice(id, updates) {
    const { data, error } = await this.supabase
      .from('billing_invoices')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async findByPatientId(patientId) {
    const { data, error } = await this.supabase
      .from('billing_invoices')
      .select('*')
      .eq('patient_id_ref', patientId);

    if (error) throw error;
    return data || [];
  }
}

module.exports = SqlBillingRepository;
