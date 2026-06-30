// store.tsx — app state: active system, manual MAPS (persisted), the
// annotation toggle, and which canonical pieces the prototype uses.
//
// Model (corrected): a component missing in the active system is NEVER left
// broken. Claude Code builds an interim, auto-flagged. The only thing worth
// persisting is a user's MANUAL OVERRIDE — mapping the missing piece to an
// existing component. So the registry stores maps only; the AI interim is the
// derived default for any missing piece without a map.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { type CanonicalName, type SystemId } from "./systems";

// systemId → (missing canonical → manual map target)
export type MapRegistry = Record<string, Partial<Record<CanonicalName, CanonicalName>>>;

const LS_KEY = "acuity-insights-prototype-maps-v2";
// Original key from before the tool was renamed off "spike". Read it once as a
// fallback so a returning user's saved overrides survive the rename rather than
// silently resetting; the next maps write persists them under the new key.
const LEGACY_LS_KEY = "acuity-spike-maps-v2";

function loadMaps(): MapRegistry {
  try {
    const raw = localStorage.getItem(LS_KEY) ?? localStorage.getItem(LEGACY_LS_KEY);
    return JSON.parse(raw || "{}") as MapRegistry;
  } catch {
    return {};
  }
}

// Pure, ordered set of canonical pieces a single prototype has rendered. Extracted
// from the provider so the accumulate/reset semantics (DE-473) are unit-testable
// without a DOM or React-effect harness. `register` returns whether the membership
// changed so the provider only re-renders when the emitted list actually grows;
// `reset` is called when the active prototype changes so one prototype's usage never
// leaks into another's "Components missing here" readout.
export interface UsageTracker {
  register: (name: CanonicalName) => boolean;
  reset: () => void;
  list: () => CanonicalName[];
}

export function createUsageTracker(): UsageTracker {
  let set = new Set<CanonicalName>();
  return {
    register(name) {
      if (set.has(name)) return false;
      set.add(name);
      return true;
    },
    reset() {
      set = new Set<CanonicalName>();
    },
    list() {
      return Array.from(set);
    },
  };
}

interface Store {
  systemId: SystemId;
  setSystemId: (id: SystemId) => void;
  compareId: SystemId | null;
  setCompareId: (id: SystemId | null) => void;
  maps: MapRegistry;
  setMap: (systemId: SystemId, name: CanonicalName, target: CanonicalName) => void;
  clearMap: (systemId: SystemId, name: CanonicalName) => void;
  annotations: boolean;
  setAnnotations: (v: boolean) => void;
  used: CanonicalName[];
  registerUsed: (name: CanonicalName) => void;
  // Clear the tracked `used` set. Called when the active prototype changes so the
  // set reflects only the current prototype's components (DE-473).
  resetUsed: () => void;
}

const Ctx = createContext<Store | null>(null);

export function useStore(): Store {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore must be used within <StoreProvider>");
  return c;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [systemId, setSystemIdRaw] = useState<SystemId>("acuity-canon");
  const [compareId, setCompareId] = useState<SystemId | null>(null);
  const [maps, setMaps] = useState<MapRegistry>(() => loadMaps());

  // Switching the prototype to the system currently chosen as the compare
  // baseline would compare a system against itself, so deselect the baseline.
  const setSystemId = useCallback((id: SystemId) => {
    setSystemIdRaw(id);
    setCompareId((prev) => (prev === id ? null : prev));
  }, []);
  const [annotations, setAnnotations] = useState(true);
  const trackerRef = useRef<UsageTracker>();
  if (!trackerRef.current) trackerRef.current = createUsageTracker();
  const [used, setUsed] = useState<CanonicalName[]>([]);

  useEffect(() => {
    document.documentElement.setAttribute("data-ds", systemId);
  }, [systemId]);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(maps));
  }, [maps]);

  const registerUsed = useCallback((name: CanonicalName) => {
    if (trackerRef.current!.register(name)) {
      setUsed(trackerRef.current!.list());
    }
  }, []);

  // Reset tracked usage when the active prototype changes. The PrototypesProvider
  // drives this (it owns the active id); resetting both the tracker and the emitted
  // array keeps `used` scoped to the current prototype (DE-473).
  const resetUsed = useCallback(() => {
    trackerRef.current!.reset();
    setUsed([]);
  }, []);

  const setMap = useCallback((s: SystemId, n: CanonicalName, t: CanonicalName) => {
    setMaps((m) => ({ ...m, [s]: { ...m[s], [n]: t } }));
  }, []);

  const clearMap = useCallback((s: SystemId, n: CanonicalName) => {
    setMaps((m) => {
      const sys = { ...m[s] };
      delete sys[n];
      return { ...m, [s]: sys };
    });
  }, []);

  const value = useMemo<Store>(
    () => ({
      systemId,
      setSystemId,
      compareId,
      setCompareId,
      maps,
      setMap,
      clearMap,
      annotations,
      setAnnotations,
      used,
      registerUsed,
      resetUsed,
    }),
    [systemId, setSystemId, compareId, maps, annotations, used, setMap, clearMap, registerUsed, resetUsed],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
