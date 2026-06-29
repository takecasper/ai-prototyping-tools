// Fixture data for the Rotation Checklist prototype. One45 is a med-ed assessment
// platform; a clinical rotation has ordered completion steps, required assessments, and
// reference links. Fabricated demo data (the items are illustrative, not real One45 content).

export interface ResourceLink {
  label: string;
  href: string;
}

export const COMPLETION_STEPS: string[] = [
  "Confirm your rotation dates with the coordinator",
  "Complete the mid-rotation self-assessment",
  "Request feedback from your supervising preceptor",
  "Submit the end-of-rotation evaluation",
];

export const REQUIRED_ASSESSMENTS: string[] = [
  "Mini-CEX — bedside clinical encounter",
  "Case-based discussion",
  "Multi-source feedback summary",
];

export const RESOURCES: ResourceLink[] = [
  { label: "Rotation handbook", href: "#handbook" },
  { label: "Assessment policy", href: "#policy" },
  { label: "Coordinator contact", href: "#contact" },
];
