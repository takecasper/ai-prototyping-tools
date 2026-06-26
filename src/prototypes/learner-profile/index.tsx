// Learner Profile — a 2-screen prototype for the Data display slice's Card
// (formalised). A directory Table of learners → a profile built from icon/title/footer
// Cards (the real DS person-panel pattern, domain_demo_person_info.jsx). Toggleable
// across all three systems; Card is native in each (one45-2020s headerless / legacy grey
// band / lowfi sketch), so nothing here is bridged.

import type { Prototype } from "../context";
import { DirectoryScreen } from "./DirectoryScreen";
import { ProfileScreen } from "./ProfileScreen";

export const prototype: Prototype = {
  id: "learner-profile",
  name: "Learner Profile",
  createdAt: "2026-06-23",
  modifiedAt: "2026-06-23",
  start: "directory",
  screens: [
    { id: "directory", label: "Directory", Component: DirectoryScreen },
    { id: "profile", label: "Profile", Component: ProfileScreen },
  ],
};
