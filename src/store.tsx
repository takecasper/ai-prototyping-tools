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
}

const Ctx = createContext<Store | null>(null);

export function useStore(): Store {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore must be used within <StoreProvider>");
  return c;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [systemId, setSystemIdRaw] = useState<SystemId>("acuity");
  const [compareId, setCompareId] = useState<SystemId | null>(null);
  const [maps, setMaps] = useState<MapRegistry>(() => loadMaps());

  // Switching the prototype to the system currently chosen as the compare
  // baseline would compare a system against itself, so deselect the baseline.
  const setSystemId = useCallback((id: SystemId) => {
    setSystemIdRaw(id);
    setCompareId((prev) => (prev === id ? null : prev));
  }, []);
  const [annotations, setAnnotations] = useState(true);
  const usedRef = useRef<Set<CanonicalName>>(new Set());
  const [used, setUsed] = useState<CanonicalName[]>([]);

  useEffect(() => {
    document.documentElement.setAttribute("data-ds", systemId);
  }, [systemId]);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(maps));
  }, [maps]);

  const registerUsed = useCallback((name: CanonicalName) => {
    if (!usedRef.current.has(name)) {
      usedRef.current.add(name);
      setUsed(Array.from(usedRef.current));
    }
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
    }),
    [systemId, setSystemId, compareId, maps, annotations, used, setMap, clearMap, registerUsed],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
