// Fixture roster for the learner-withdrawal pattern. Fabricated demo data (names /
// emails are not real people) — the point is the Modal-confirm interaction, not the data.

export interface Learner {
  id: string;
  name: string;
  year: string;
  email: string;
}

export const ROSTER: Learner[] = [
  { id: "l1", name: "Amara Okafor", year: "PGY-2", email: "a.okafor@med.example.edu" },
  { id: "l2", name: "Daniel Reyes", year: "PGY-1", email: "d.reyes@med.example.edu" },
  { id: "l3", name: "Priya Nair", year: "PGY-3", email: "p.nair@med.example.edu" },
  { id: "l4", name: "Sam Whitefeather", year: "PGY-2", email: "s.whitefeather@med.example.edu" },
];
