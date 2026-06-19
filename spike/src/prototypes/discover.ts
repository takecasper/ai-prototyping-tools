// discover.ts — auto-discovers every prototype. Each prototype lives in its own
// subfolder with an index.tsx that exports `prototype`. Vite globs them at build
// time, so adding a prototype is just adding a folder. No central list to edit.

import type { Prototype } from "./context";

const modules = import.meta.glob("./*/index.tsx", { eager: true }) as Record<
  string,
  { prototype?: Prototype }
>;

export const PROTOTYPES: Prototype[] = Object.values(modules)
  .map((m) => m.prototype)
  .filter((p): p is Prototype => Boolean(p))
  .sort((a, b) => a.name.localeCompare(b.name));
