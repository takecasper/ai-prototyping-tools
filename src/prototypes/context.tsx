// context.tsx — the prototype engine. Manages the library of prototypes, the
// active one, navigation within its flow, and a generic shared-state bag the
// flow's screens read and write.
//
// A prototype is metadata plus an ordered list of screens; shared state is an
// untyped key/value bag. Adding a prototype or a screen never touches this file.

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from "react";

export interface FlowScreen {
  id: string;
  label: string;
  Component: FC;
}

export interface Prototype {
  id: string;
  name: string;
  createdAt: string; // ISO date
  modifiedAt: string; // ISO date
  start: string; // screen id
  screens: FlowScreen[];
}

interface PrototypesCtx {
  prototypes: Prototype[];
  activeId: string;
  active: Prototype;
  setActive: (id: string) => void;
  current: string;
  currentScreen: FlowScreen;
  goTo: (screenId: string) => void;
  back: () => void;
  canBack: boolean;
  data: Record<string, unknown>;
  set: (key: string, value: unknown) => void;
  reset: () => void;
}

const Ctx = createContext<PrototypesCtx | null>(null);

export function usePrototypes(): PrototypesCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePrototypes must be used within <PrototypesProvider>");
  return c;
}

export function PrototypesProvider({
  prototypes,
  children,
}: {
  prototypes: Prototype[];
  children: ReactNode;
}) {
  // Open the newest prototype by createdAt on load, matching the prototypes
  // table's newest-first default (T-019). Stable sort keeps discover.ts's
  // alphabetical order for equal/missing dates, so the choice is deterministic.
  const [activeId, setActiveId] = useState(
    () => [...prototypes].sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))[0].id,
  );
  const active = prototypes.find((p) => p.id === activeId) ?? prototypes[0];

  const [history, setHistory] = useState<string[]>([active.start]);
  const [data, setData] = useState<Record<string, unknown>>({});

  const setActive = useCallback(
    (id: string) => {
      const p = prototypes.find((x) => x.id === id);
      if (!p) return;
      setActiveId(id);
      setHistory([p.start]);
      setData({});
    },
    [prototypes],
  );

  const current = history[history.length - 1];
  const currentScreen = active.screens.find((s) => s.id === current) ?? active.screens[0];

  const goTo = useCallback((sid: string) => setHistory((h) => [...h, sid]), []);
  const back = useCallback(() => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h)), []);
  const set = useCallback((k: string, v: unknown) => setData((d) => ({ ...d, [k]: v })), []);
  const reset = useCallback(() => {
    setHistory([active.start]);
    setData({});
  }, [active.start]);

  const value = useMemo<PrototypesCtx>(
    () => ({
      prototypes,
      activeId,
      active,
      setActive,
      current,
      currentScreen,
      goTo,
      back,
      canBack: history.length > 1,
      data,
      set,
      reset,
    }),
    [prototypes, activeId, active, current, currentScreen, history.length, data, setActive, goTo, back, set, reset],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
