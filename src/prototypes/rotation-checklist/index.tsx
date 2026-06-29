// Rotation Checklist — a 2-screen prototype for the Data display slice's List. A Card with a
// NUMBERED list of completion steps + a BULLETED list of required assessments → a PLAIN list of
// resource links. List is native in lowfi / one45-2020s / one45-legacy and a flagged bridge
// interim in acuity-canon (the package ships no List component) — so toggling to the Acuity
// Design System shows the List flagged "AI approx" while the other three render it plainly.

import type { Prototype } from "../context";
import { ChecklistScreen } from "./ChecklistScreen";
import { ResourcesScreen } from "./ResourcesScreen";

export const prototype: Prototype = {
  id: "rotation-checklist",
  name: "Rotation Checklist",
  createdAt: "2026-06-29",
  modifiedAt: "2026-06-29",
  start: "checklist",
  screens: [
    { id: "checklist", label: "Checklist", Component: ChecklistScreen },
    { id: "resources", label: "Resources", Component: ResourcesScreen },
  ],
};
