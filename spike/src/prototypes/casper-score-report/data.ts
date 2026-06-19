// Mock seed for the Casper Score Report prototype.

export interface ScoreSection {
  label: string;
  icon: string;
  score: string;
}

export const SECTIONS: ScoreSection[] = [
  { label: "Collaboration", icon: "people", score: "Q3" },
  { label: "Ethics", icon: "shield", score: "Q4" },
  { label: "Empathy", icon: "heart", score: "Q2" },
  { label: "Communication", icon: "chat", score: "Q3" },
];
