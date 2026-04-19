//MADE BY AI!
const { createClient } = require('@supabase/supabase-js');

class SqlPatientRepository {
  constructor() {
    this.supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    );
  }

  async findById(patientId) {
    const { data, error } = await this.supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async save(patient) {
    const { data, error } = await this.supabase
      .from('patients')
      .insert([patient])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async findByEmail(email) {
    const { data, error } = await this.supabase
      .from('patients')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
}

module.exports = SqlPatientRepository;
