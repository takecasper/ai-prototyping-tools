# Acuity Insights Prototype

A working multi-design-system prototyping tool for Acuity. It delivers two pieces:

1. **Multi-system toggle** — one prototype, switched between design systems via a
   root `data-ds` attribute. Three systems ship today: **Low-fi wireframe** (a
   zero-dependency Balsamiq-style baseline), **Acuity** (One45's modern system),
   and **one45 legacy** (the older brand). The two One45 systems are
   reverse-engineered from staging and documented in
   [`shared/one45-design-systems/`](shared/one45-design-systems/).
2. **Component bridge + graceful degradation** — when the active system lacks a
   component, resolve it from the `/` overlay by a saved **manual map** (ground
   truth) or a flagged **Claude approximation** (visibly marked).

Deliberately dependency-light (React + Vite + TypeScript + CSS vars). Author new
prototypes against [`AGENTS.md`](AGENTS.md); raw markup is blocked by a hard lint
gate (`npm run lint`).

## Getting started

- **Run the app:** see [Run it](#run-it) below.
- **Connect to Figma:** to reuse Acuity's real design system from Figma, follow the
  [Figma connection guide](shared/one45-design-systems/figma-connection-runbook.md).

## Run it

Prerequisites: **Node 20+** and a package manager (`npm` ships with Node).

```bash
npm install      # done when it prints "added N packages"
npm run dev      # opens http://localhost:5173
```

`npm run check` runs the lint gate plus the build.

## Try it

The canvas with controls closed is **only the prototype** — no chrome. Press `/`
to open both panels (left: Prototypes; right: Controls — system switch, divergence,
bridge, annotation toggle).

1. **Toggle re-skins, zero edits.** `/` → switch **Acuity** ↔ **one45 legacy** ↔
   **Low-fi**. The same screen re-skins (Lato/blue ↔ Cabin/purple ↔ sketch). The
   prototype markup never changes. Prototypes live in `src/prototypes/<id>/`,
   auto-discovered.
2. **Auto-interim, flagged.** Open **Casper Score Report** and toggle to **one45
   legacy**: it has no `Alert`, so the alert is auto-filled by a **Claude interim**,
   flagged with a magenta "AI approx" outline. For divergent pieces the interim is a
   real token-driven **build of that piece** in the active system's own language
   (`Alert`→legacy, `Breadcrumb`→acuity, via `INTERIM_BUILDS` in `systems.tsx`), not an
   unrelated substitute. Pieces without a generic build (e.g. `Badge` in low-fi) still
   fall back to the cruder first-native substitution. No button to press — gaps fill
   themselves, marked.
3. **Override → map.** In the **Component Bridge** sub-section, **map the missing
   piece** to an existing component. It renders as a subtle ground-truth map
   instead of an AI interim. Reload — the map survives (localStorage = the bridge
   learning). Revert with **Revert to interim**.
4. **Annotation toggle.** Uncheck **Flag interim and mapped components** → the
   canvas goes clean (interims render as plain components, no flags) while the `/`
   panel still tracks the divergence. On for working, off for demos.
5. **Divergence is measured.** Pick a **Compare to** system in **System
   Divergence** → it counts shared / only-in-A / only-in-B / in-neither for the
   pieces the active screen uses — the convergence signal.

Reset saved maps: clear the `acuity-insights-prototype-maps-v2` key in localStorage
(or use each row's **Revert to interim** button).
