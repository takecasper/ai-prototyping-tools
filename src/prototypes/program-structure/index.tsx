// Program Structure — a 2-screen prototype for the Data display slice's Tree. A Card with the
// curriculum hierarchy (programme > years > blocks/rotations) as an expandable Tree → a flat
// numbered List outline of the leaf blocks. Mirrors the real curriculum tree the app renders
// (the jQuery dynatree widget in legacy, the indented mappingTable in the modern app). Tree is
// native in lowfi / one45-2020s / one45-legacy and a flagged bridge interim in acuity-canon (the
// package ships no Tree), so switching to the Acuity Design System flags it "AI approx".

import type { Prototype } from "../context";
import { StructureScreen } from "./StructureScreen";
import { OutlineScreen } from "./OutlineScreen";

export const prototype: Prototype = {
  id: "program-structure",
  name: "Program Structure",
  createdAt: "2026-06-30",
  modifiedAt: "2026-06-30",
  start: "structure",
  screens: [
    { id: "structure", label: "Structure", Component: StructureScreen },
    { id: "outline", label: "Outline", Component: OutlineScreen },
  ],
};
