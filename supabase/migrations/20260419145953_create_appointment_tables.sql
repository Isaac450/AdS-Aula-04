/*
  MADE BY AI!
  # Create appointment system tables

  1. New Tables
    - `doctors` - Doctor profiles
    - `patients` - Patient information
    - `appointments` - Appointment records
    - `billing_invoices` - Billing records
    - `audit_logs` - Audit trail

  2. Security
    - Enable RLS on all tables
    - Add policies for data access
*/

CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  speciality text NOT NULL,
  available_slots jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid NOT NULL REFERENCES doctors(id),
  patient_id uuid NOT NULL REFERENCES patients(id),
  date timestamptz NOT NULL,
  speciality text NOT NULL,
  status text DEFAULT 'SCHEDULED',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS billing_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL REFERENCES appointments(id),
  patient_id uuid NOT NULL REFERENCES patients(id),
  doctor_id uuid NOT NULL REFERENCES doctors(id),
  status text DEFAULT 'PENDING',
  amount decimal(10, 2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL,
  event_type text NOT NULL,
  occurred_at timestamptz,
  data jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to doctors"
  ON doctors FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to patients"
  ON patients FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to appointments"
  ON appointments FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to billing"
  ON billing_invoices FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to audit logs"
  ON audit_logs FOR ALL
  USING (true)
  WITH CHECK (true);
