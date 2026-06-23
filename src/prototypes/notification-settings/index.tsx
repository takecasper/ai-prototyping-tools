// Notification Settings — a single-screen prototype, to show the table handles
// flows of different lengths.

import type { Prototype } from "../context";
import { SettingsScreen } from "./SettingsScreen";

export const prototype: Prototype = {
  id: "notification-settings",
  name: "Notification Settings",
  createdAt: "2026-06-05",
  modifiedAt: "2026-06-12",
  start: "settings",
  screens: [{ id: "settings", label: "Settings", Component: SettingsScreen }],
};
