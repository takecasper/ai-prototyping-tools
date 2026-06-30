// Fixture data for the Curriculum Groups prototype. One45 is a med-ed platform; a curriculum
// is organised into groups (themes/blocks), each carrying learning objectives, and a group is
// planned as a set of teaching sessions. This mirrors the real legacy curricGroups.php page —
// the canonical example of the .subheader-sticky.collapsible accordion. Fabricated demo data
// (the items are illustrative, not real One45 content).

export interface CurriculumGroup {
  id: string;
  name: string;
  summary: string;
  objectives: string[];
}

export interface PlannerSession {
  title: string;
  detail: string;
}

export const GROUPS: CurriculumGroup[] = [
  {
    id: "foundations",
    name: "Foundations of Pediatric Care",
    summary: "Core principles every learner covers before rotating onto the wards.",
    objectives: [
      "Take a developmentally appropriate history",
      "Perform a paediatric physical examination",
      "Calculate weight-based medication doses",
    ],
  },
  {
    id: "acute",
    name: "Acute & Emergency Presentations",
    summary: "Recognising and stabilising the unwell child in the first hour.",
    objectives: [
      "Assess and manage respiratory distress",
      "Recognise the signs of paediatric sepsis",
      "Run a structured resuscitation handover",
    ],
  },
  {
    id: "chronic",
    name: "Chronic & Developmental Conditions",
    summary: "Longitudinal care for children with ongoing health needs.",
    objectives: [
      "Plan care for a child with asthma",
      "Screen for developmental milestones",
      "Coordinate a multidisciplinary care plan",
    ],
  },
];

export const SESSIONS: PlannerSession[] = [
  {
    title: "Learning objectives",
    detail:
      "Three to five objectives mapped to the programme's competency framework, reviewed each cycle.",
  },
  {
    title: "Assessment plan",
    detail:
      "A mid-block formative check and an end-of-block summative encounter, each with a rubric.",
  },
  {
    title: "Resources & readings",
    detail:
      "The block handbook, two core readings, and the simulation booking link for the practical session.",
  },
];
