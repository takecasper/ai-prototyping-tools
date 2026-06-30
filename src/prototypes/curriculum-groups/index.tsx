// Curriculum Groups — a 2-screen prototype for the Data display slice's Accordion. A Card with a
// single-open Accordion of curriculum groups (each revealing a bulleted List of objectives) → a
// planner whose session panels open independently (single={false}). Mirrors the real legacy
// curricGroups.php — the canonical .subheader-sticky.collapsible accordion. Accordion is native in
// lowfi / one45-2020s / one45-legacy and a flagged bridge interim in acuity-canon (the package
// ships no Accordion), so switching to the Acuity Design System flags it "AI approx".

import type { Prototype } from "../context";
import { GroupsScreen } from "./GroupsScreen";
import { GroupPlannerScreen } from "./GroupPlannerScreen";

export const prototype: Prototype = {
  id: "curriculum-groups",
  name: "Curriculum Groups",
  createdAt: "2026-06-30",
  modifiedAt: "2026-06-30",
  start: "groups",
  screens: [
    { id: "groups", label: "Groups", Component: GroupsScreen },
    { id: "planner", label: "Planner", Component: GroupPlannerScreen },
  ],
};
