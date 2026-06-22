# Authoring a prototype

This tool runs inside Claude Code. To add a prototype, create one folder under
`src/prototypes/<id>/`. It is auto-discovered (Vite globs `*/index.tsx`), so no
central list needs editing. Add the folder and it shows up in the Prototypes
table.

## Folder shape

```
src/prototypes/<id>/
  index.tsx       manifest: exports `prototype`
  <Screen>.tsx    one component file per screen
  data.ts         optional fixture data
```

Name `<id>` in kebab-case. It is the folder name and the prototype id.

## The manifest (index.tsx)

```tsx
import type { Prototype } from "../context";
import { FirstScreen } from "./FirstScreen";

export const prototype: Prototype = {
  id: "<id>",              // same as the folder name
  name: "Human Readable Name",
  createdAt: "YYYY-MM-DD", // today, when you create it
  modifiedAt: "YYYY-MM-DD",
  start: "first",          // id of the first screen
  screens: [
    { id: "first", label: "First", Component: FirstScreen },
  ],
};
```

## Screens

A screen is a function component. It MUST build only from canonical components
through `<Canonical name="...">`. Navigation and shared state come from
`usePrototypes()`.

```tsx
import { Canonical } from "../../resolver";
import { usePrototypes } from "../context";

export function FirstScreen() {
  const { goTo, back, data, set, reset } = usePrototypes();
  return (
    <Canonical name="Card" title="Title">
      <p className="proto__text">Body copy.</p>
      <div className="proto__actions">
        <Canonical name="Button" onClick={() => goTo("next")}>
          Continue
        </Canonical>
      </div>
    </Canonical>
  );
}
```

## Canonical components (the only pieces you may use)

| name        | props                                                      | notes                                                  |
| ----------- | ---------------------------------------------------------- | ------------------------------------------------------ |
| Button      | children, variant?, onClick                                | variant: primary (default) / secondary / danger / inline |
| Card        | title?, children                                           | content container                                      |
| Badge       | children                                                   | small status label                                     |
| Alert       | title?, children                                           | inline message banner; acuity-only (bridge fills legacy) |
| TextField   | label, type?, value, onChange, state?, message?, helpText?, optionalityLabel? | labelled text input; state: default/error/success |
| Textarea    | label, value, onChange, state?, message?, rows?            | multi-line; same validation surface as TextField       |
| Select      | label, value, onChange, state?, message?, children         | children are `<option>`s                               |
| Checkbox    | label, checked, onChange                                   | single checkbox; brand-tinted via accent-color         |
| Radio       | label, name, value, checked, onChange                      | group by shared name                                   |
| Toggle      | label, checked, onChange                                   | on/off switch                                          |
| SearchField | value, onChange, placeholder?                              | pill search input with leading icon                    |
| Tabs        | tabs (string[] or {id,label,badge?}[]), active, onSelect, children | tabbed nav; active by id; children are the panel; per-system visual model (acuity underline / legacy box tabs) |
| Link        | children (or text), href?, variant?, external?            | variant: default / inline; external opens a new tab    |
| Breadcrumb  | items (string[] or {label,href?}[])                       | trail; last item is the current page; legacy-only (bridge fills acuity) |
| Modal       | open, title?, onClose?, dismissible?, icon?, footer?, children | centred dialog overlay; one API across both systems; `footer` holds the action Buttons; closes on Esc / scrim click when `dismissible` |
| Image       | w, h, label?                                               | placeholder via placehold.co; never add assets         |
| Icon        | icon (name string)                                         | placeholder until Acuity's real icons land             |

The Inputs & controls pieces (TextField … SearchField) are token-driven and present
in all three systems — they re-skin by tokens, not by structure. Their look is
reverse-engineered from the real Acuity DS form API + the live DS gallery
(`/test/designSystem`) and the legacy skin; see
`shared/one45-design-systems/01-acuity-modern.md` / `02-one45-legacy.md`.

The Navigation pieces Tabs and Link are present in all three systems. Link re-skins purely
by tokens; **Tabs shares one API but renders a per-system visual model** (Acuity's underline
indicator vs legacy's Bootstrap box tabs) — accurate to each system, not a flattened shared
skin. **Breadcrumb is legacy-only** (the Acuity DS ships none): in `acuity` it resolves
through the bridge to a flagged AI build — the mirror of `Alert` being acuity-only. There is
**no Pagination piece**: neither One45 system defines one, so the tool does not fabricate it.

The Feedback & status piece **Modal** is present in all three systems. It is the structural
API-survival test: one canonical API absorbs both the Acuity DS dialog and the legacy
Bootstrap modal, and the look (including legacy's grey header band vs Acuity's headerless
title) is a **pure token swap** — no per-system structural override, unlike Tabs. Pass the
action buttons via the `footer` prop. **Toast, tag/chip and empty-state are not enshrined**:
they exist in neither One45 system, so the tool does not fabricate them (the Pagination rule).

## Rules

- Build only from `<Canonical>` pieces. No raw `<button>`, `<img>`, hex colours,
  or arbitrary inline/Tailwind styles for design. A missing piece in the active
  system is filled by a flagged interim, so reference the canonical name and let
  the bridge handle it.
- Images: always `<Canonical name="Image" w={..} h={..} label=".." />`. Never
  commit binary image files.
- Icons: always `<Canonical name="Icon" icon=".." />`.
- Plain wrapper elements (`<div className="flow-row">`, `<p className="proto__text">`)
  are allowed for layout and spacing only, never for colour or design tokens.

## Enforcement (the hard gate)

These rules are not just documented, they are linted. Run `npm run lint` (or
`npm run check` for lint plus build). It fails on any prototype that reaches past
the canonical pieces: raw `<button>`/`<img>`/`<a>`/`<h1>`..., inline `style={...}`,
hex colour literals, or a `className` outside the `proto`/`flow` layout
namespaces. A failing lint is the gate, so a violating prototype does not pass.

The rules live in `eslint-plugin-canonical/`. Their allowlists (which raw
wrappers and class prefixes are legal) are SPIKE-SCOPED and provisional: they
encode the throwaway low-fi primitives, not the real per-system components, which
do not exist yet. When real design-system components land, those allowlists must
be revisited. See the `REVISIT WHEN REAL COMPONENTS LAND` banner in
`eslint-plugin-canonical/index.js`.

## Navigation and shared state

- `goTo(screenId)` pushes a screen, `back()` pops, `reset()` returns to the start
  screen and clears shared state.
- `data` and `set(key, value)` are a shared bag carried across the flow's
  screens. One screen writes with `set("applicantId", id)`, a later screen reads
  `data.applicantId`.

## Worked example

See `src/prototypes/applicant-review/`: three screens (list to detail to
confirm), shared state for the selected applicant and decision, and a mock save
on the confirm screen.
