// Program Explorer — a navigation pattern that exercises the Navigation slice
// (Tabs, Breadcrumb, Link) across all three systems. Auto-discovered by Vite. Browse
// programs (region tabs filter the list) → open one (section tabs + deeper breadcrumb).

import type { Prototype } from "../context";
import { BrowseScreen } from "./BrowseScreen";
import { DetailScreen } from "./DetailScreen";

export const prototype: Prototype = {
  id: "program-explorer",
  name: "Program Explorer (tabs + breadcrumb)",
  createdAt: "2026-06-22",
  modifiedAt: "2026-06-22",
  start: "browse",
  screens: [
    { id: "browse", label: "Browse", Component: BrowseScreen },
    { id: "detail", label: "Detail", Component: DetailScreen },
  ],
};
