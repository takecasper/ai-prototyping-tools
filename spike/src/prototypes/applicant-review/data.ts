// Mock seed for the Applicant Review prototype. Fixture data the flow declares.

export interface Applicant {
  id: string;
  name: string;
  role: string;
  status: string;
}

export const APPLICANTS: Applicant[] = [
  { id: "a1", name: "Priya Nair", role: "Medicine, Year 1", status: "In review" },
  { id: "a2", name: "Marcus Lee", role: "Medicine, Year 1", status: "New" },
  { id: "a3", name: "Sofia Alvarez", role: "Medicine, Year 1", status: "In review" },
];
