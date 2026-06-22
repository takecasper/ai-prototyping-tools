// Learner withdrawal — the Feedback & status slice's pattern (Modal-confirm). Auto-
// discovered by Vite. A rotation roster where a destructive action is guarded by a
// confirm Modal and acknowledged by an Alert, exercised across all three systems.

import type { Prototype } from "../context";
import { RosterScreen } from "./RosterScreen";

export const prototype: Prototype = {
  id: "learner-withdrawal",
  name: "Learner withdrawal (modal confirm)",
  createdAt: "2026-06-22",
  modifiedAt: "2026-06-22",
  start: "roster",
  screens: [{ id: "roster", label: "Roster", Component: RosterScreen }],
};
