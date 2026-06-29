---
title: Adding a design system (dependency route)
tags: design-system, on-ramp, acuity-canon, setup, tokens, coverage
---

# Adding a design system (dependency route)

This is the only supported path for adding a real design system to the prototyper.
It assumes the system is distributed as an npm package. Systems that exist purely in
Figma (Platform Design System) or as a hosted site without a package (Fahad's) are
out of scope for this route.

**The canonical system is `acuity-canon`** — the mid-2025 Acuity Design System
(`@takecasper/acuity-design-system@1.27.13`), the tool's store default. Coverage is
measured relative to it: a piece is "native" when it resolves to a real ADS component,
and "gap" when the ADS ships none and the bridge must fill it.

---

## Steps

### 1. Install and pin the package

```bash
npm install <package-name>@<exact-version>
```

Pin the version in `package.json` — no `^` or `~`. Exact pins keep
adapter/gap sets from silently breaking when the upstream package updates.

### 2. Import the package CSS

In `src/main.tsx`, add the package's stylesheet import **before** the
tool-local stylesheets:

```tsx
import "@scope/design-system/dist/design-system.css";
```

### 3. Register the system ID and adapters

In `src/systems.tsx`:

1. Add a `SystemId` literal to the union type.
2. Add an entry to `SYSTEMS` with `id`, `label`, `blurb`, and `skins`.
3. For each canonical piece the system implements natively, write an adapter
   in `skins`. An adapter maps the canonical props to the real package
   component. Wrap each in a `<span className="preflight">` so the build
   check can confirm the real component rendered.

### 4. Add gaps to INTERIM_BUILDS

Any canonical piece the system ships no component for is a gap. Add each gap
to `INTERIM_BUILDS` in `src/systems.tsx` under your new `SystemId`. The bridge
resolves it to a flagged interim (`.res--ai`, "AI approx" tag) when annotations
are on, and renders it plain when off. Never add a gap as a silent stand-in.

### 5. Add the token JSON and both `[data-ds]` selectors

1. Create `shared/one45-design-systems/tokens/<system-id>.json` — extract
   values from the package's published tokens or CSS variables.
2. In `src/styles/tokens.css`, add a token block under both selectors:

```css
:root[data-ds="<system-id>"] {
  --token-name: value;
  /* … */
}

[data-ds="<system-id>"] {
  --token-name: value;
  /* … */
}
```

The bare `[data-ds="…"]` selector scopes tokens to gallery stages (Systems
tab); without it the gallery renders the wrong system's tokens.

### 6. Add contrast pairs

In `contrast.mjs`, add the system's foreground/background colour pairs. The
build check (`npm run check`) uses these to verify accessible contrast ratios.

### 7. Update the gallery selfcheck rows

In `src/gallery-selfcheck.ts`, add the system to the per-piece coverage matrix.
The gallery reads this at runtime to show the status chip and coverage summary.

### 8. Wire the coverage guard

`shared/one45-design-systems/scripts/check-system-coverage.mjs` audits that
every canonical piece is either natively skinned or explicitly in
`INTERIM_BUILDS` for every registered system. It runs as part of `npm run
check`. After wiring a new system, run the check — it will fail for any piece
you missed.

### 9. Make it the store default (if it is the canonical system)

If this system is the canonical target — the one prototypes are authored and
measured against — set it as the default in `src/store.tsx`. Only one system is
canonical at a time. Today that system is `acuity-canon`.

### 10. Verify

```bash
npm run check
```

Must pass with zero errors. Then open the running app and:

- Open the **Systems** tab → the new system. Confirm every canonical piece
  renders (native plain, gap flagged).
- Toggle **"Flag interim and mapped components"** on: every gap piece must show
  the `.res--ai` flag. Toggle it off: all flags must clear. Native pieces are
  never flagged in either state.
- If the new system is the canonical default, run a prototype too — make sure
  the real components render and gaps are clearly flagged.

---

## Updating an existing system (bumping the pin)

When a new version of the package is released:

1. Update the version in `package.json` and run `npm install`.
2. Re-verify every adapter — the package API may have changed. Update
   adapters for any renamed or removed props.
3. Re-check the gap set — new components may cover existing gaps, or removed
   components may open new ones. Update `INTERIM_BUILDS` accordingly.
4. Re-extract the token JSON from the new package and update
   `tokens/<system-id>.json` and the `tokens.css` block.
5. Run `npm run check`.
6. Open the gallery and toggle annotations as in step 10 above.

---

## Reference: `acuity-canon` (current canonical system)

| Field | Value |
|---|---|
| System ID | `acuity-canon` |
| Package | `@takecasper/acuity-design-system@1.27.13` (pinned) |
| Store default | yes |
| Native pieces | 14 canonical pieces resolve to real ADS components |
| Gap pieces | Toggle, SearchField, Breadcrumb, Table, Avatar, Image (bridge interims) |
| Token file | `shared/one45-design-systems/tokens/acuity-canon.json` |
| Direction | Decided: the canonical target — not "still settling" |
