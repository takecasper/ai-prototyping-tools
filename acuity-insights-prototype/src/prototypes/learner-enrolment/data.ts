// Fixture data for the Learner Enrolment form prototype. One45 is a med-ed
// assessment product, so the field shapes mirror a real enrolment row: program,
// academic year, learner role.

export const PROGRAMS = ["FM Postgrad", "IM Postgrad", "AFC Cardiology (Fellows)", "OSCE Events"];

export const YEARS = ["2025/26", "2024/25", "2023/24"];

export const ROLES = ["Student", "Resident", "Fellow"];

export interface EnrolmentDraft {
  name: string;
  email: string;
  program: string;
  year: string;
  role: string;
  notes: string;
  consent: boolean;
  notify: boolean;
}

// A loose email check — enough to drive the validation states in the demo.
export function emailState(email: string): "default" | "error" | "success" {
  if (email.length === 0) return "default";
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? "success" : "error";
}
