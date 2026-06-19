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

| name   | props              | notes                                          |
| ------ | ------------------ | ---------------------------------------------- |
| Button | children, onClick  | action control                                 |
| Card   | title?, children   | content container                              |
| Badge  | children           | small status label                             |
| Image  | w, h, label?       | placeholder via placehold.co; never add assets |
| Icon   | icon (name string) | placeholder until Acuity's real icons land     |

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
