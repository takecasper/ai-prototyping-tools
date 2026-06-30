---
title: Code Connect — Acuity CANONICAL Figma library → tool CANONICAL
tags: code-connect, figma, design-system, acuity-canon, de-422
---

# Code Connect (DE-422)

Maps the engineering Acuity Design System's Figma library —
**"Acuity Design system - CANONICAL"** (`libraryKey lk-4a0722da…`) — to this
tool's `CANONICAL` React pieces, so Figma "get code" / `get_code_connect_map`
returns **our** component (`<Canonical name="…">`) instead of regenerated
markup. This is authoring substrate only; it does not touch the runtime
resolver/bridge (`src/resolver.tsx`).

## Status (this run — authored locally, NOT published)

- **Coverage manifest:** `src/code-connect/coverage.ts` — the verified record of
  which canonical pieces map to a real Figma component, which are gaps, and which
  are unresolved. Locked by `src/code-connect/coverage.test.ts`.
- **First slice mapped (9):** Button, IconButton, Card, Textarea, Checkbox,
  Radio, Tabs, Link, Modal — each with a Figma `componentKey` read first-hand
  from the live library (remote Figma MCP, `search_design_system`, 2026-06-30).
- **Pattern:** `Button.figma.tsx` shows the `figma.connect(Canonical, url, …)`
  shape the rest follow.
- **Not done on purpose:** nothing is published. `get_code_connect_map` still
  returns `{}` until the publish step below runs.

## Two things to resolve before publishing

1. **Node URLs.** `figma.connect()` needs each component's node URL
   (`…/design/<libraryFileKey>/…?node-id=<id>`). We have verified
   `componentKey`s, not node URLs — the library's file key / node ids still need
   resolving (open the library in Figma and copy a component link, or resolve via
   the MCP once the library file key is known).
2. **Prop mappings.** `figma.enum/string` option names must match each
   component's real Figma variant properties — confirm with
   `get_context_for_code_connect` per component. The example's map is illustrative.

## Publishing (the deferred, outward step — needs explicit go)

Publishing writes Code Connect records onto the **engineering-owned** library, so
it is held until separately authorized. When that happens:

```sh
npm i -D @figma/code-connect          # add the toolchain (devDependency)
npx figma connect publish             # reads figma.config.json → publishes
```

Plan/seat are already sufficient (Acuity org, Full seat). After publishing,
`get_code_connect_map` returns the mapped nodes instead of `{}`.

## Files

- `../figma.config.json` — Code Connect config (parser `react`, includes
  `code-connect/**/*.figma.tsx`, excludes `src/`).
- `Button.figma.tsx` — the authored example/pattern.
- `../src/code-connect/coverage.ts` — the coverage + gap manifest (source of
  truth for the remaining `.figma.tsx` files).
