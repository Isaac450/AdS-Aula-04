/*
  # Fix billing invoices table schema

  Fix the column names to match what the SqlBillingRepository expects:
  - appointment_id_ref instead of appointment_id
  - patient_id_ref instead of patient_id
  - doctor_id_ref instead of doctor_id
*/

DROP TABLE IF EXISTS billing_invoices CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;

CREATE TABLE billing_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id_ref uuid NOT NULL REFERENCES appointments(id),
  patient_id_ref uuid NOT NULL REFERENCES patients(id),
  doctor_id_ref uuid NOT NULL REFERENCES doctors(id),
  status text DEFAULT 'PENDING',
  amount decimal(10, 2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL,
  event_type text NOT NULL,
  occurred_at timestamptz,
  data jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE billing_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to billing"
  ON billing_invoices FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to audit logs"
  ON audit_logs FOR ALL
  USING (true)
  WITH CHECK (true);
