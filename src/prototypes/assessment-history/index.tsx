// Assessment History — a 2-screen prototype for the Data display slice's Timeline. A Card with the
// dated status history of an EPA assessment (the Timeline) → a summary of the current status and
// outstanding steps. Mirrors the real EPA status-history the modern app renders
// (StagesTrainingBundle _history.scss). Timeline is one45-2020s-only — native in one45-2020s + lowfi
// and a flagged bridge interim in one45-legacy + acuity-canon (neither ships a history/timeline),
// so switching to legacy or the Acuity Design System flags it "AI approx".

import type { Prototype } from "../context";
import { HistoryScreen } from "./HistoryScreen";
import { NextStepsScreen } from "./NextStepsScreen";

export const prototype: Prototype = {
  id: "assessment-history",
  name: "Assessment History",
  createdAt: "2026-06-30",
  modifiedAt: "2026-06-30",
  start: "history",
  screens: [
    { id: "history", label: "History", Component: HistoryScreen },
    { id: "next", label: "Next steps", Component: NextStepsScreen },
  ],
};
