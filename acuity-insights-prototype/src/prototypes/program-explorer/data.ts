// Fixture data for the Program Explorer nav pattern. One45 is a med-ed assessment
// product, so the flow browses programs → a program's rotations/learners, the kind
// of dense navigated list the real app is full of.

export interface Program {
  id: string;
  name: string;
  site: string;
  status: "Active" | "Draft" | "Archived";
  learners: number;
}

export const PROGRAMS: Program[] = [
  { id: "im", name: "Internal Medicine", site: "North America", status: "Active", learners: 84 },
  { id: "peds", name: "Pediatrics", site: "North America", status: "Active", learners: 61 },
  { id: "surg", name: "General Surgery", site: "North America", status: "Active", learners: 47 },
  { id: "fm", name: "Family Medicine", site: "North America", status: "Draft", learners: 0 },
  { id: "psych", name: "Psychiatry", site: "Europe", status: "Active", learners: 38 },
  { id: "anes", name: "Anesthesiology", site: "Europe", status: "Active", learners: 29 },
  { id: "emed", name: "Emergency Medicine", site: "Europe", status: "Archived", learners: 12 },
  { id: "obgyn", name: "Obstetrics & Gynecology", site: "North America", status: "Active", learners: 33 },
  { id: "rad", name: "Radiology", site: "Europe", status: "Draft", learners: 0 },
  { id: "path", name: "Pathology", site: "North America", status: "Active", learners: 21 },
];

// Region tabs for the browse screen. The badge mirrors the real Acuity Tab badgeText
// (e.g. "CA"/"FR" on the live DS gallery); here it counts programs per region.
export const REGION_TABS = [
  { id: "all", label: "All programs" },
  { id: "North America", label: "North America" },
  { id: "Europe", label: "Europe" },
];

// Section tabs for the program detail screen.
export const DETAIL_TABS = [
  { id: "overview", label: "Overview" },
  { id: "rotations", label: "Rotations" },
  { id: "learners", label: "Learners" },
];

export function programsForRegion(region: string): Program[] {
  return region === "all" ? PROGRAMS : PROGRAMS.filter((p) => p.site === region);
}
