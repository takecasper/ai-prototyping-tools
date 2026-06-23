// Fixture people for the learner-profile pattern. Fabricated demo data (names,
// emails and ids are invented, not real learners) — the SHAPE mirrors the real
// One45 person panels the Acuity DS Card backs (domain_demo_person_info.jsx: a
// person's identity, enrolment and contact details grouped into Cards).

export interface Person {
  id: string;
  name: string;
  year: string;
  program: string;
  status: "Active" | "On leave";
  email: string;
  advisor: string;
  site: string;
}

export const PEOPLE: Person[] = [
  {
    id: "p1",
    name: "Amara Okafor",
    year: "PGY-2",
    program: "Internal Medicine",
    status: "Active",
    email: "a.okafor@example.edu",
    advisor: "Dr. Lena Whitfield",
    site: "Central Teaching Hospital",
  },
  {
    id: "p2",
    name: "Daniel Reyes",
    year: "PGY-1",
    program: "Internal Medicine",
    status: "Active",
    email: "d.reyes@example.edu",
    advisor: "Dr. Marcus Hale",
    site: "Riverside General",
  },
  {
    id: "p3",
    name: "Priya Nair",
    year: "PGY-3",
    program: "Internal Medicine",
    status: "On leave",
    email: "p.nair@example.edu",
    advisor: "Dr. Lena Whitfield",
    site: "Central Teaching Hospital",
  },
];
