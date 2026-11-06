import { ageOn } from "@/lib/dates";

/**
 * Columns included in CSV exports. Deliberately excludes medical history,
 * full-application sections, photos and reproductive-health answers.
 */
export const EXPORT_SELECT =
  "id,created_at,first_name,last_name,email,phone,sms_consent,donor_type,state,zip,date_of_birth,education,how_heard,bmi,eligible,status,referral_code";

export const EXPORT_HEADERS = [
  "Submitted",
  "First name",
  "Last name",
  "Email",
  "Phone",
  "SMS consent",
  "Type",
  "State",
  "ZIP",
  "Age",
  "Education",
  "Source",
  "BMI",
  "Pre-qualified",
  "Status",
  "Referral code",
  "Application ID",
];

export interface ExportRow {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  sms_consent: boolean | null;
  donor_type: string;
  state: string;
  zip: string;
  date_of_birth: string;
  education: string | null;
  how_heard: string | null;
  bmi: number | null;
  eligible: boolean;
  status: string;
  referral_code: string | null;
}

export function exportRow(r: ExportRow, now = new Date()): unknown[] {
  return [
    r.created_at,
    r.first_name,
    r.last_name,
    r.email,
    r.phone,
    r.sms_consent ? "yes" : "no",
    r.donor_type,
    r.state,
    r.zip,
    ageOn(r.date_of_birth, now),
    r.education,
    r.how_heard,
    r.bmi,
    r.eligible ? "yes" : "no",
    r.status,
    r.referral_code,
    r.id,
  ];
}
