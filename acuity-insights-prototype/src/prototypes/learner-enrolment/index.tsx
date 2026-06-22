// Learner Enrolment — a forms-with-validation flow that exercises the full
// Inputs & controls slice across all three systems. Auto-discovered by Vite.

import type { Prototype } from "../context";
import { FormScreen } from "./FormScreen";
import { ConfirmScreen } from "./ConfirmScreen";

export const prototype: Prototype = {
  id: "learner-enrolment",
  name: "Learner Enrolment (form + validation)",
  createdAt: "2026-06-22",
  modifiedAt: "2026-06-22",
  start: "form",
  screens: [
    { id: "form", label: "Form", Component: FormScreen },
    { id: "confirm", label: "Confirm", Component: ConfirmScreen },
  ],
};
