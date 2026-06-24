// Fixture roster for the reviewer-roster pattern. Fabricated demo data (names and ids
// are invented, not real people) — the SHAPE mirrors the real One45 people-picker the
// circle avatar (.profile-img) is drawn from: selecting faculty as reviewers/preceptors,
// each shown with a profile photo + name + role. No photo URLs are stored (the Avatar
// falls back to a placeholder image — the real blank.gif behaviour), so nothing binary
// is committed.

export interface Reviewer {
  id: string;
  name: string;
  role: string;
  year: string;
}

export const REVIEWERS: Reviewer[] = [
  { id: "r1", name: "Dr. Lena Whitfield", role: "Faculty advisor", year: "Internal Medicine" },
  { id: "r2", name: "Dr. Marcus Hale", role: "Preceptor", year: "Cardiology" },
  { id: "r3", name: "Dr. Priya Nair", role: "Site director", year: "Emergency" },
  { id: "r4", name: "Dr. Samuel Adebayo", role: "Preceptor", year: "Surgery" },
  { id: "r5", name: "Dr. Hana Okeke", role: "Faculty advisor", year: "Pediatrics" },
];
