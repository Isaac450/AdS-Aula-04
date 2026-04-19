//MADE BY AI!
const { createClient } = require('@supabase/supabase-js');

class SqlAuditRepository {
  constructor() {
    this.supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    );
  }

  async log(auditEntry) {
    const { data, error } = await this.supabase
      .from('audit_logs')
      .insert([auditEntry])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async findByEventType(eventType) {
    const { data, error } = await this.supabase
      .from('audit_logs')
      .select('*')
      .eq('event_type', eventType);

    if (error) throw error;
    return data || [];
  }

  async findAll() {
    const { data, error } = await this.supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findById(id) {
    const { data, error } = await this.supabase
      .from('audit_logs')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
}

module.exports = SqlAuditRepository;
