import { useEffect, useState } from "react";
import { StoreProvider, useStore } from "./store";
import { SYSTEMS } from "./systems";
import { PrototypesProvider, usePrototypes } from "./prototypes/context";
import { PROTOTYPES } from "./prototypes/discover";
import { PrototypeRenderer } from "./prototypes/Renderer";
import { Library } from "./library";
import { ControlOverlay } from "./overlay";
import { ViewProvider, useView } from "./view";
import { SystemGallery } from "./gallery";
import { SystemInfo } from "./system-info";

function Shell() {
  const { systemId } = useStore();
  const { active } = usePrototypes();
  const { mode, viewedSystemId, compareSystemId } = useView();
  const [panelsOpen, setPanelsOpen] = useState(false);

  // "/" toggles both side panels (Prototypes on the left, Controls on the
  // right). Closed, the canvas is just the prototype, as it would really look.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing =
        ["INPUT", "TEXTAREA", "SELECT"].includes(t?.tagName) || t?.isContentEditable;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        setPanelsOpen((o) => !o);
      }
      if (e.key === "Escape") setPanelsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Null unless a system gallery is on the canvas; narrows to SystemId where truthy.
  const gallerySystem = mode === "system" ? viewedSystemId : null;

  return (
    <div className="app">
      {panelsOpen && (
        <header className="app__bar">
          <h1 className="app__title">Acuity Insights Prototype</h1>
          <span className="app__sys">
            {gallerySystem
              ? `${SYSTEMS[gallerySystem].label} · component gallery`
              : `${active.name} · ${SYSTEMS[systemId].label}`}
          </span>
        </header>
      )}

      {panelsOpen && <Library />}

      <main className={"app__main" + (panelsOpen && gallerySystem ? " app__main--galleryopen" : "")}>
        {gallerySystem ? (
          <SystemGallery systemId={gallerySystem} compareId={compareSystemId} />
        ) : (
          <PrototypeRenderer />
        )}
      </main>

      {panelsOpen &&
        (gallerySystem ? (
          <SystemInfo onClose={() => setPanelsOpen(false)} />
        ) : (
          <ControlOverlay onClose={() => setPanelsOpen(false)} />
        ))}
    </div>
  );
}

export function App() {
  return (
    <StoreProvider>
      <PrototypesProvider prototypes={PROTOTYPES}>
        <ViewProvider>
          <Shell />
        </ViewProvider>
      </PrototypesProvider>
    </StoreProvider>
  );
}
