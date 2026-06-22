// Casper Score Report — a 2-screen prototype. Authored against AGENTS.md to
// prove the agent-authoring path: add this folder and it auto-appears.

import type { Prototype } from "../context";
import { SummaryScreen } from "./SummaryScreen";
import { BreakdownScreen } from "./BreakdownScreen";

export const prototype: Prototype = {
  id: "casper-score-report",
  name: "Casper Score Report",
  createdAt: "2026-06-19",
  modifiedAt: "2026-06-19",
  start: "summary",
  screens: [
    { id: "summary", label: "Summary", Component: SummaryScreen },
    { id: "breakdown", label: "Breakdown", Component: BreakdownScreen },
  ],
};
