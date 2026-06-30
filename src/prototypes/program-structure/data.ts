// Fixture data for the Program Structure prototype. One45 is a med-ed platform; a programme's
// curriculum is a hierarchy — programme > years > blocks > sessions. This mirrors the real
// curriculum tree the app renders (the dynatree widget in legacy, the indented mappingTable in
// the modern app). Fabricated demo data (illustrative, not real One45 content).

export interface CurriculumNode {
  id: string;
  label: string;
  children?: CurriculumNode[];
  defaultExpanded?: boolean;
}

export const CURRICULUM: CurriculumNode[] = [
  {
    id: "md",
    label: "MD Program",
    defaultExpanded: true,
    children: [
      {
        id: "y1",
        label: "Year 1 — Foundations",
        children: [
          { id: "y1-anatomy", label: "Anatomy & Physiology" },
          { id: "y1-clinical", label: "Clinical Skills" },
        ],
      },
      {
        id: "y2",
        label: "Year 2 — Systems",
        children: [
          { id: "y2-cardio", label: "Cardiovascular block" },
          { id: "y2-neuro", label: "Neuroscience block" },
        ],
      },
      {
        id: "y3",
        label: "Year 3 — Clerkships",
        children: [
          { id: "y3-peds", label: "Pediatrics rotation" },
          { id: "y3-surg", label: "Surgery rotation" },
        ],
      },
    ],
  },
];

// The leaf blocks/rotations, flattened for the outline summary List.
export const OUTLINE: string[] = [
  "Anatomy & Physiology",
  "Clinical Skills",
  "Cardiovascular block",
  "Neuroscience block",
  "Pediatrics rotation",
  "Surgery rotation",
];
