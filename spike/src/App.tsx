import { useEffect, useState } from "react";
import { StoreProvider, useStore } from "./store";
import { SYSTEMS } from "./systems";
import { PrototypesProvider, usePrototypes } from "./prototypes/context";
import { PROTOTYPES } from "./prototypes/discover";
import { PrototypeRenderer } from "./prototypes/Renderer";
import { Library } from "./library";
import { ControlOverlay } from "./overlay";

function Shell() {
  const { systemId } = useStore();
  const { active } = usePrototypes();
  const [panelsOpen, setPanelsOpen] = useState(false);

  // "/" toggles both side panels (Prototypes on the left, Controls on the
  // right). Closed, the canvas is just the prototype, as it would really look.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(t?.tagName);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        setPanelsOpen((o) => !o);
      }
      if (e.key === "Escape") setPanelsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="app">
      {panelsOpen && (
        <header className="app__bar">
          <strong className="app__title">Acuity Prototype Spike</strong>
          <span className="app__sys">
            {active.name} · {SYSTEMS[systemId].label}
          </span>
        </header>
      )}

      {panelsOpen && <Library />}

      <main className="app__main">
        <PrototypeRenderer />
      </main>

      {panelsOpen && <ControlOverlay onClose={() => setPanelsOpen(false)} />}
    </div>
  );
}

export function App() {
  return (
    <StoreProvider>
      <PrototypesProvider prototypes={PROTOTYPES}>
        <Shell />
      </PrototypesProvider>
    </StoreProvider>
  );
}
