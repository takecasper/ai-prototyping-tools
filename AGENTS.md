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

Prototypes are authored against **`acuity-canon`** — the real Acuity Design System
(`@takecasper/acuity-design-system`) — by default. It is the tool's active system
on boot and the reference all canonical coverage is measured against. Other systems
(Low-fi, one45 (2020s), one45 legacy) re-skin the same prototype; they do not change
what you author against.

The catalogue is the `CANONICAL` array in `src/systems.tsx` — the single source of
truth for the canonical name, its props, and its notes. Do not maintain a second
copy of that table here; it would drift. To see every piece with its props and a
live rendering in each design system, open the running tool, press `/`, and pick
the **Systems** tab → a design system: that gallery is generated from `CANONICAL`,
so it is always complete and current.

The pieces, by slice:

- **Actions & containers** — Button, Card, IconButton
- **Inputs & controls** — TextField, Textarea, Select, Checkbox, Radio, Toggle, SearchField
- **Navigation** — Tabs, Link, Breadcrumb
- **Data display** — Table, Avatar
- **Feedback & status** — Badge, Alert, Modal
- **Media** — Image, Icon

The Inputs & controls pieces (TextField … SearchField) are token-driven and present
in all three systems — they re-skin by tokens, not by structure. Their look is
reverse-engineered from the real Acuity DS form API + the live DS gallery
(`/test/designSystem`) and the legacy skin; see
`shared/one45-design-systems/01-one45-2020s.md` / `02-one45-legacy.md`.

The Navigation pieces Tabs and Link are present in all three systems. Link re-skins purely
by tokens; **Tabs shares one API but renders a per-system visual model** (one45 (2020s)'s underline
indicator vs legacy's Bootstrap box tabs) — accurate to each system, not a flattened shared
skin. **Breadcrumb is legacy-only** (the Acuity DS ships none): in `one45-2020s` it resolves
through the bridge to a flagged AI build — the mirror of **`Badge` being one45-2020s-only**. There is
**no Pagination piece**: neither One45 system defines one, so the tool does not fabricate it.

The Data display piece **Table** is present in all three systems. It carries one canonical
columns+rows+sort API (`columns: {key, header, align?, width?, sortable?, cell?}[]`, `rows`,
`rowKey?`, `sort?`/`onSort?` for table-wide sort, `selectable?`/`selected?`/`onSelectionChange?`
for bulk-select, `empty?`, `caption?`) — pass a `cell` render function for a custom cell (use
`<Canonical>` pieces inside it, never raw markup). It is the data-display group's first piece and
the long-predicted "first true API break" test, which it **passed**: the Acuity DS ships **no**
table component (its tables are app-level react-table over Bootstrap, so the skin reproduces that
minimal reality), while legacy carries the real `_tables.scss` skin — yet the one API + a **pure
token swap** absorb both. The divergence is **inventory, not API/structure**; Table is native in
all three, so it never bridges. See `shared/one45-design-systems/01`/`02` L "Data display" / §4i.

**Card** (in the Actions & containers slice) is the data-display group's second piece, **formalised**
to the real Acuity DS Card API — `title?`, `iconName?`, `children` (body), `footer?` (put the action
`Button`s here). It is present in all three systems and never bridges: `one45-2020s` renders a headerless
white card (icon + title row on the panel — `[R]` border 1px, radius 8px, **no shadow**), `legacy`
adds a full-bleed grey header band (the one per-system flourish, like the box tabs), `lowfi` is the
dashed sketch. `iconName` renders the per-system token glyph stand-in (real artwork is a recorded
asset gap, like Icon). The divergence is again **inventory** (one45 (2020s) owns a real Card; legacy borrows
Bootstrap + the `.dashboard-widget` tile). See `shared/one45-design-systems/01`/`02` L "Data display" / §4j.

**Avatar** is the data-display group's third piece — a person photo with a **`shape` variant**
(`personName`, `src?`, `shape?` ∈ circle/card, `size?` ∈ sm/lg). The person name is **`personName`**,
NOT `name` (`name` selects the canonical piece, the same collision `Icon`'s `iconName` avoids). It is
**legacy-only**: legacy owns two real photo widgets (the inline `.profile-img` circle + the webeval
`.photo` yearbook card), the Acuity DS ships **none**, so in `one45-2020s` it resolves through the bridge to
a flagged build — the mirror of `Badge`. Native in legacy + lowfi. A missing `src` falls back to a
placeholder **image** (the real `blank.gif` behaviour), never an initials monogram. See
`shared/one45-design-systems/01`/`02` L "Data display" / §4k.

The Feedback & status pieces:

- **Modal** is present in all three systems — the structural API-survival test: one canonical
  API absorbs both the Acuity DS dialog and the legacy Bootstrap modal, and the look (including
  legacy's grey header band vs one45 (2020s)'s headerless title) is a **pure token swap**, no per-system
  override unlike Tabs. Pass the action buttons via the `footer` prop.
- **Alert** is native in **one45-2020s + legacy** (the bridge fills lowfi). One canonical API
  (`variant` ∈ info/success/warning/error + `title` + body), but — like Tabs — the skin is
  **per-system**: one45 (2020s) a tinted banner with an accent border, legacy a solid pale fill (the
  real `.one45-alert`). "Different mechanism, same surface."
- **Badge** is **one45-2020s-only** (legacy has no status badge): in `legacy` + `lowfi` it resolves
  through the bridge to a flagged build — the genuine present-vs-absent piece, the mirror of
  one45 (2020s) lacking Breadcrumb.

**Toast, tag/chip and empty-state are not enshrined**: they exist in neither One45 system, so
the tool does not fabricate them (the Pagination rule).

The Media / iconography pieces:

- **Icon** and **IconButton** are present in all three systems. They carry the real DS API
  (`iconName` + `size`/`iconSize` ∈ small/medium + `altText`/`label`, plus an optional `tone`),
  recovered from the Acuity DS islands and the legacy FontAwesome/sprite skin. The real glyph
  **artwork** is unavailable in both systems (the Acuity DS package is not vendored; legacy uses a
  paid FA Pro webfont + binary sprites) — a recorded **asset gap**, so the tool renders a
  token-sized stand-in glyph (a monogram for brand, a sketch box for lowfi), **never the real
  icon**. See `shared/one45-design-systems/README.md` "Gaps and legitimate omissions" and
  reconciliation §4g.

## Rules

- Build only from `<Canonical>` pieces. No raw `<button>`, `<img>`, hex colours,
  or arbitrary inline/Tailwind styles for design. A missing piece in the active
  system is filled by a flagged interim, so reference the canonical name and let
  the bridge handle it.
- Images: always `<Canonical name="Image" w={..} h={..} label=".." />`. Never
  commit binary image files.
- Icons: always `<Canonical name="Icon" iconName=".." size="small|medium" altText=".." />`
  (decorative icons may omit `altText`). For an icon-only button use
  `<Canonical name="IconButton" iconName=".." label=".." onClick={..} />`.
- Plain wrapper elements (`<div className="flow-row">`, `<p className="proto__text">`)
  are allowed for layout and spacing only, never for colour or design tokens.

## Enforcement (the hard gate)

These rules are not just documented, they are linted. Run `npm run lint` (or
`npm run check` for lint plus build). It fails on any prototype that reaches past
the canonical pieces: raw `<button>`/`<img>`/`<a>`/`<h1>`..., inline `style={...}`,
hex colour literals, or a `className` outside the `proto`/`flow` layout
namespaces. A failing lint is the gate, so a violating prototype does not pass.

The rules live in `eslint-plugin-canonical/`. Their allowlists (which raw
wrappers and class prefixes are legal) are scoped to the tool's CURRENT primitives
and provisional: they encode the current low-fi primitives, not the real per-system
components, which do not exist yet. When real design-system components land, those allowlists must
be revisited. See the `REVISIT WHEN REAL COMPONENTS LAND` banner in
`eslint-plugin-canonical/index.js`.

## Bridge invariant (do not regress)

Every non-native resolution in `src/resolver.tsx` — a **user-mapped** target (`.res--map`,
`↔` tag) or a **Claude interim** (`.res--ai`, "AI approx" tag, from `INTERIM_BUILDS` or the
first-native fallback) — MUST be gated by the store's `annotations` toggle ("Flag interim and
mapped components"): flagged when on, plain when off. Native pieces are never flagged. Toggle
off clears every flag; toggle on flags every bridged/mapped piece. A new one-system-only or
mechanism-divergent canonical MUST flow through a flagged path — never a silent stand-in.
Before marking any bridge/skin work done, **verify both toggle states in-browser**: on →
every bridged/mapped piece flagged, off → all flags gone.

## Adding a canonical component

A new canonical piece must display and operate correctly everywhere it appears —
in prototypes AND in every system's gallery. When you add a `CanonicalName`:

1. Add it to `CANONICAL` in `src/systems.tsx` with a `category` (its slice), a
   `props` summary, and `notes` if it diverges. This drives the lint allowlist,
   the gallery's auto-listing, and the live docs.
2. Provide the skin(s): add it to each system's `skins` in `SYSTEMS` that
   implements it natively.
3. If it is one-system-only or mechanism-divergent, wire the flagged bridge path
   (`INTERIM_BUILDS`) so the systems that lack it get a flagged interim — never a
   silent stand-in. (See the Bridge invariant below.)
4. Add a specimen to `src/specimens.tsx` (props bag, or a render function for
   pieces with composed children). Without one the gallery shows a dev-only
   `needs specimen` marker.
5. Open the **Systems** tab for every system and confirm the piece renders:
   native plain, non-native flagged, status chip correct. Toggle annotations on
   and off (see the Gallery invariant below).

## Adding a design system

When you add a `SystemId`:

1. Add it to `SYSTEMS` in `src/systems.tsx` with `label`, `blurb`, and `skins`.
2. Wire its token block in `src/styles/tokens.css` for the new `data-ds` value —
   include both the `:root[data-ds="…"]` and bare `[data-ds="…"]` selectors so the
   tokens scope to a gallery stage, not just the root active system.
3. Open its gallery (Systems tab → the system): confirm every canonical piece
   renders (native plain / bridged flagged), the coverage matrix is right, and the
   blurb reads well.

## Gallery / Systems-view invariant (do not regress)

The Systems tab renders a self-documenting gallery per design system. Keep these
true:

- The gallery lists **every** `CANONICAL` piece, always — completeness is
  structural (it iterates the catalogue), never a hand-maintained list. Adding a
  piece to `CANONICAL` is what makes it appear.
- A piece with no specimen still appears (with a dev-only `needs specimen`
  marker); missing example data never hides a component.
- Specimens render through the real resolver (`<Canonical system={…}>`), so the
  annotations toggle governs the on-canvas flags in the gallery exactly as in a
  prototype: on → every bridged/mapped piece flagged, off → all flags gone, native
  never flagged. The status chip and coverage matrix are separate documentation
  chrome, always shown.
- After any component / system / skin / bridge change, open the gallery across all
  systems and toggle annotations on and off before marking the work done.

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
