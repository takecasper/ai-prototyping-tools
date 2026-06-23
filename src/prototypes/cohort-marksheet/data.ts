// Fixture marksheet for the cohort-marksheet pattern. Fabricated demo data (names are
// not real people) — the point is the data-table interaction (sort / filter / bulk
// release), modelled on the real One45 marksheet (admin/pages/marksOverview2.php) and the
// bulk-permission grid (groupTable.jsx useRowSelect → onChange).

export interface MarkRow {
  id: string;
  learner: string;
  year: string;
  score: number;
  status: "Draft" | "Released";
}

export const MARKS: MarkRow[] = [
  { id: "m1", learner: "Amara Okafor", year: "PGY-2", score: 88, status: "Draft" },
  { id: "m2", learner: "Daniel Reyes", year: "PGY-1", score: 73, status: "Draft" },
  { id: "m3", learner: "Priya Nair", year: "PGY-3", score: 91, status: "Released" },
  { id: "m4", learner: "Sam Whitefeather", year: "PGY-2", score: 64, status: "Draft" },
  { id: "m5", learner: "Lena Petrov", year: "PGY-1", score: 79, status: "Draft" },
  { id: "m6", learner: "Tomas Alvarez", year: "PGY-3", score: 85, status: "Released" },
];
