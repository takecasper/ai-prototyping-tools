// view.tsx — what the canvas is showing. Independent of the bridge store
// (store.tsx) and the prototype engine (prototypes/context.tsx) so the three
// concerns stay isolated.
//
//   mode "prototype"  → the canvas renders the active prototype (the default).
//   mode "system"     → the canvas renders a component gallery for `viewedSystemId`.
//
// `viewedSystemId` is deliberately separate from the store's active `systemId`
// (the prototype's system): you can inspect system B's gallery while a prototype
// still renders in system A. `compareSystemId` is an optional second column in
// the gallery, also view-local.

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { type SystemId } from "./systems";

export type ViewMode = "prototype" | "system";

interface ViewCtx {
  mode: ViewMode;
  viewedSystemId: SystemId | null;
  compareSystemId: SystemId | null;
  showPrototype: () => void;
  showSystem: (id: SystemId) => void;
  setCompareSystem: (id: SystemId | null) => void;
}

const Ctx = createContext<ViewCtx | null>(null);

export function useView(): ViewCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useView must be used within <ViewProvider>");
  return c;
}

export function ViewProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ViewMode>("prototype");
  const [viewedSystemId, setViewedSystemId] = useState<SystemId | null>(null);
  const [compareSystemId, setCompareSystemId] = useState<SystemId | null>(null);

  const showPrototype = useCallback(() => setMode("prototype"), []);

  const showSystem = useCallback((id: SystemId) => {
    setViewedSystemId(id);
    // A compare target equal to the newly-viewed system would compare it against
    // itself, so drop it.
    setCompareSystemId((prev) => (prev === id ? null : prev));
    setMode("system");
  }, []);

  const setCompareSystem = useCallback((id: SystemId | null) => setCompareSystemId(id), []);

  const value = useMemo<ViewCtx>(
    () => ({
      mode,
      viewedSystemId,
      compareSystemId,
      showPrototype,
      showSystem,
      setCompareSystem,
    }),
    [mode, viewedSystemId, compareSystemId, showPrototype, showSystem, setCompareSystem],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
