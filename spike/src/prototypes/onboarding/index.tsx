// Onboarding Welcome — a 2-screen prototype.

import type { Prototype } from "../context";
import { WelcomeScreen } from "./WelcomeScreen";
import { ProfileScreen } from "./ProfileScreen";

export const prototype: Prototype = {
  id: "onboarding",
  name: "Onboarding Welcome",
  createdAt: "2026-06-15",
  modifiedAt: "2026-06-16",
  start: "welcome",
  screens: [
    { id: "welcome", label: "Welcome", Component: WelcomeScreen },
    { id: "profile", label: "Profile", Component: ProfileScreen },
  ],
};
