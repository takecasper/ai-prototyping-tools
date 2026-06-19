// Applicant Review — a 3-screen prototype. The manifest: metadata plus the
// ordered screens. This is the only file discover.ts looks at per folder.

import type { Prototype } from "../context";
import { ListScreen } from "./ListScreen";
import { DetailScreen } from "./DetailScreen";
import { ConfirmScreen } from "./ConfirmScreen";

export const prototype: Prototype = {
  id: "applicant-review",
  name: "Applicant Review",
  createdAt: "2026-06-10",
  modifiedAt: "2026-06-18",
  start: "list",
  screens: [
    { id: "list", label: "Applicants", Component: ListScreen },
    { id: "detail", label: "Review", Component: DetailScreen },
    { id: "confirm", label: "Decision", Component: ConfirmScreen },
  ],
};
