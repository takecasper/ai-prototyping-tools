// Cohort marksheet — the Data display slice's pattern (a real data table with sort,
// filter, and bulk row-actions). Auto-discovered by Vite. An OSCE marksheet where draft
// results are filtered, sorted, multi-selected, and released through a confirm Modal to a
// summary screen — exercised across all three systems. Modelled on the real One45
// marksheet + bulk-permission grid.

import type { Prototype } from "../context";
import { MarksheetScreen } from "./MarksheetScreen";
import { DoneScreen } from "./DoneScreen";

export const prototype: Prototype = {
  id: "cohort-marksheet",
  name: "Cohort marksheet (sort / filter / bulk release)",
  createdAt: "2026-06-23",
  modifiedAt: "2026-06-23",
  start: "marksheet",
  screens: [
    { id: "marksheet", label: "Marksheet", Component: MarksheetScreen },
    { id: "done", label: "Released", Component: DoneScreen },
  ],
};
