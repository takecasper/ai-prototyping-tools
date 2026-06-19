---
title: Acuity Prototype Spike — README
tags: spike, prototyping, multi-design-system, throwaway
---

# Acuity Prototype Spike

A **throwaway** spike proving the two no-prior-art pieces of the Acuity
prototyping tool ([plan](../

1. **Multi-system toggle** — one prototype, switched between design systems via a
   root `data-ds` attribute (here: **Low-fi wireframe** ↔ **Modern**, a stand-in
   for the reverse-engineered One45-legacy).
2. **Component bridge + graceful degradation** — when the active system lacks a
   component, resolve it from the `/` overlay by a saved **manual map** (ground
   truth) or a flagged **Claude approximation** (visibly marked).

This is deliberately dependency-light (React + Vite + TypeScript + CSS vars — no
Tailwind/Storybook). The real Phase-1 foundation uses the full stack per the
plan. **Do not build on this code** — it exists to validate feel, then gets
thrown away.

## Run it

Prerequisites: **Node 18+** and a package manager (`npm` ships with Node).

```bash
cd spike
npm install      # done when it prints "added N packages"
npm run dev      # opens http://localhost:5173
```

## Try the spike

The canvas with controls closed is **only the prototype** — no chrome. Press `/`
to open controls (header, system switch, bridge, annotation toggle, divergence).

1. **Toggle re-skins, zero edits.** `/` → switch **Low-fi** ↔ **Modern**. The
   same screen re-skins. The prototype markup (`src/DemoScreen.tsx`) never
   changes.
2. **Auto-interim, flagged.** Low-fi has no `Badge`. Toggle to Low-fi → the badge
   is auto-filled by a **Claude interim**, flagged with a magenta "AI approx"
   outline. No button to press — gaps fill themselves, marked. (In this spike the
   "interim" is a heuristic stand-in; the real tool has Claude Code build a new
   component in the system's own language.)
3. **Override → map.** In `/`, **map `Badge` to `Button`** (or `Card`). It
   renders as a subtle ground-truth map instead of an AI interim. Reload — the
   map survives (localStorage = the bridge learning). Revert with **↺ Claude
   interim**.
4. **Annotation toggle.** Uncheck **Show annotations** → the canvas goes clean
   (interims render as plain components, no flags) while the `/` panel still
   tracks the divergence. On for working, off for demos.
5. **Divergence is measured.** The **Divergence** readout in `/` counts
   native / mapped / AI-interim for the active system — the convergence signal.

Reset state: clear the `acuity-spike-maps-v2` key in localStorage (or each row's
**↺ Claude interim** button).

## What's stubbed / out of scope

- The "Claude interim" is a heuristic substitution, not a real Claude Code build.
- Skins are shared generic token-driven components; real systems ship distinct
  implementations.
- No Storybook, CI lint gate, real token pipeline, multi-screen flows, or Figma —
  all Phase 1+.
