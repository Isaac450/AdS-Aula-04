/*
  MADE BY AI!
  # Fix appointments table schema

  Ensure proper column naming for object references.
  The appointments table needs to use camelCase for JavaScript compatibility
  while maintaining snake_case in the database per PostgreSQL conventions.
*/

ALTER TABLE appointments
RENAME COLUMN doctor_id TO doctor_id_ref;

ALTER TABLE appointments
RENAME COLUMN patient_id TO patient_id_ref;

ALTER TABLE billing_invoices
RENAME COLUMN appointment_id TO appointment_id_ref;

ALTER TABLE billing_invoices
RENAME COLUMN patient_id TO patient_id_ref;

ALTER TABLE billing_invoices
RENAME COLUMN doctor_id TO doctor_id_ref;
