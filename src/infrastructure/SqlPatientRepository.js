//MADE BY AI!
const { createClient } = require('@supabase/supabase-js');

class SqlPatientRepository {
  constructor() {
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment');
    }

    this.supabase = createClient(url, key);
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
