// Fixture data for the Assessment History prototype. One45 is a med-ed platform; a learner's
// assessment (e.g. an EPA — Entrustable Professional Activity) moves through dated status stages,
// the real status-history the modern app renders (StagesTrainingBundle _history.scss). Fabricated
// demo data (illustrative, not real One45 content).

export interface HistoryEntry {
  date: string;
  title: string;
  description?: string;
  status?: string;
}

export const HISTORY: HistoryEntry[] = [
  {
    date: "20 Mar",
    title: "Sign-off pending",
    description: "Awaiting final supervisor sign-off before the EPA is closed.",
    status: "In progress",
  },
  {
    date: "14 Mar",
    title: "Feedback returned",
    description: "Preceptor returned written feedback and an entrustment rating.",
    status: "Reviewed",
  },
  {
    date: "12 Mar",
    title: "Assessment submitted",
    description: "Mini-CEX submitted for review after the bedside encounter.",
    status: "Complete",
  },
  {
    date: "05 Mar",
    title: "Assessment requested",
    description: "Learner requested an assessment for the cardiology rotation.",
    status: "Complete",
  },
];

// The outstanding next steps, shown as a List on the detail screen.
export const NEXT_STEPS: string[] = [
  "Supervisor reviews the returned feedback",
  "Supervisor records the final entrustment level",
  "EPA is marked complete on the learner's record",
];
