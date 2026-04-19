//MADE BY AI!
const { createClient } = require('@supabase/supabase-js');

class SqlAuditRepository {
  constructor() {
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment');
    }

    this.supabase = createClient(url, key);
  }

  async log(auditEntry) {
    const dbEntry = {
      event_id: auditEntry.eventId,
      event_type: auditEntry.eventType,
      occurred_at: auditEntry.occurredAt,
      data: auditEntry.data
    };

    const { data, error } = await this.supabase
      .from('audit_logs')
      .insert([dbEntry])
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
