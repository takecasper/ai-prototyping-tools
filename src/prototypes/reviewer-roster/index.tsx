// Reviewer Roster — a 2-screen prototype for the Data display slice's Avatar (legacy-only).
// A selectable roster of faculty led by a circle Avatar (the real people-picker .profile-img)
// → a photo wall of the chosen reviewers as card Avatars (the webeval .photo yearbook tile).
// Toggleable across all three systems: Avatar is native in legacy + lowfi, and a FLAGGED
// bridge build in one45-2020s (the Acuity DS ships no avatar) — the mirror of Breadcrumb.

import type { Prototype } from "../context";
import { RosterScreen } from "./RosterScreen";
import { WallScreen } from "./WallScreen";

export const prototype: Prototype = {
  id: "reviewer-roster",
  name: "Reviewer Roster",
  createdAt: "2026-06-23",
  modifiedAt: "2026-06-23",
  start: "roster",
  screens: [
    { id: "roster", label: "Roster", Component: RosterScreen },
    { id: "wall", label: "Panel", Component: WallScreen },
  ],
};
