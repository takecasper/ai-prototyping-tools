---
title: Connect this prototyping tool to Figma — step-by-step runbook
tags: figma, mcp, oauth, code-connect, design-tokens, runbook, setup, claude-code
verified: true
---

# Connect the prototyping tool to Figma — runbook

A do-this-then-that guide for wiring **Claude Code** (the terminal AI coding
agent that edits this repo) to Acuity's Figma, so generated prototypes reuse the
real design system instead of re-deriving it. Follow it top to bottom; you do not
need to read the background research to use it.

**Three words you'll see throughout:**

- **MCP** (Model Context Protocol) — a standard way for an AI agent to call an
  external tool. Figma ships an MCP "server" that lets Claude Code read your Figma
  files. ([Figma — Set up the MCP server][mcp-setup])
- **OAuth** — the "Sign in with…" browser pop-up that grants access without you
  pasting a secret key into a file. Figma's official server uses it, so there is no
  long-lived token to leak. ([Figma — Set up the MCP server][mcp-setup])
- **Code Connect** — a Figma feature that links a Figma component to the matching
  React component in *this* repo, so the agent reaches for our real `Button`
  instead of inventing one. ([Figma — Code Connect][code-connect])
- **Plan / seat** — Figma bills two ways: the **plan** is the whole org's tier
  (Starter / Professional / Organization / Enterprise); the **seat** is the access
  level on *your* account (View, Collab, Dev, or Full). Both gate what you can do.
  ([Figma — Rate limits & access][rate-limits])

---

## 1. Prerequisites Acuity must provide

You need three things before anything else works. Check each:

1. **An Organization or Enterprise plan.** Code Connect (section 4) and the usable
   rate limits (section 6) require it.
   **How to check:** run `whoami` through the Figma MCP tools once connected
   (section 2, step 5) — it reports the org's plan tier. *Acuity is on the
   **Organization** tier — sufficient for everything here except bulk token export
   over REST, which is Enterprise-only (section 5).*
   **Success:** the plan reads Organization or Enterprise.
2. **One Dev or Full seat** on Acuity's Figma org for whoever runs Claude Code.
   View/Collab seats are capped at roughly 6 design reads per month — unusable for
   real work. ([Figma — Rate limits & access][rate-limits])
   **How to check:** Figma → your avatar → account, or ask the Figma admin to
   confirm your seat. `whoami` also reports it.
   **Success:** your seat shows **Dev** or **Full**.
3. **Admin approval of the official Figma connector.** Enterprise tenants can
   require an admin to allow third-party/AI connectors before they authenticate.
   **How to check:** attempt the OAuth step (section 2, step 3); if it is blocked,
   the admin must approve the Figma plugin/MCP connector for the tenant.
   **Success:** the OAuth browser flow completes without an admin-block message.

---

## 2. Install and authenticate the official Figma MCP plugin

Use Figma's **official** plugin, authenticated over OAuth — not a personal-access
token or a third-party community server. The official path is OAuth-scoped to what
you can already see, revocable, and the easier security review.
([Figma — Set up the MCP server][mcp-setup])

1. **Install** (installs at user scope):
   ```
   claude plugin install figma@claude-plugins-official
   ```
2. **Register the server** without a full restart:
   ```
   /reload-plugins
   ```
   **Success:** Claude Code reports `1 plugin MCP server` registered.
3. **Authenticate over OAuth:**
   ```
   /mcp
   ```
   Select **figma** → **Authenticate** → a browser opens → **Allow access** with
   the Acuity Figma account. (`/plugin` → Installed → figma reaches the same auth.)
   **Success:** the browser shows access granted and returns you to Claude Code.
4. **Confirm the connection:**
   ```
   claude mcp list
   ```
   **Success:** `plugin:figma:figma … ✔ Connected`.
5. **Confirm account, plan, and seat:** run the `whoami` Figma tool.
   **Success:** it returns the signed-in Acuity account plus the plan tier and seat
   from section 1. (`whoami` is rate-limit-exempt, so it is a free sanity check.)

---

## 3. Verify the connection against a safe sandbox file

Prove reads work before going near anything important. **Create your own throwaway
Figma file** (a couple of frames with text and colours) and use its file key — do
**not** point these first tests at a production or shared library. A file's "key"
is the string in its URL: `figma.com/design/<FILE_KEY>/<name>`. Reads never modify
a file, but practising on a sandbox keeps the first run consequence-free.
([Figma — Rate limits & access][rate-limits])

1. **Structure read** — run `get_metadata` with the file key and a page/canvas node
   id. It returns an XML outline of layer ids, types, names, and sizes — no styling.
   **Success:** you get a node tree back, no selection required.
2. **Code read** — run `get_design_context` with the file key and a **leaf** node id
   (an actual component or layer, not the page). It returns reference code for that
   selection. ([Figma — Tools and prompts][tools])
   **Success:** you get a code representation back (it defaults to React + Tailwind —
   see section 6).
3. **Token read** — run `get_variable_defs` with the file key and a **leaf** node id.
   It returns the design tokens used there (colours, spacing, typography) as
   data, separate from the code. ([Figma — Tools and prompts][tools])
   **Success:** you get a token map such as `{ "White": "#FFFFFF", … }`.

If step 2 or 3 errors with "nothing selected," you targeted a page node — see
section 6.

---

## 4. Set up Code Connect (Figma components → `CANONICAL`)

This is the step that turns "generate a button" into "use *our* button." Code
Connect maps each Figma library component to the matching React component in this
repo's `CANONICAL` set (`src/systems.tsx`), so the agent reuses real pieces.
Requires Organization/Enterprise + a Dev/Full seat (section 1).
([Figma — Code Connect][code-connect])

> **Prerequisite to confirm first:** Code Connect only pays off if Acuity publishes
> a real Figma **component library** (published components + Variables), not just an
> ad-hoc file. Confirm that library exists before investing the mapping effort.

1. **Check the current state:** run `get_code_connect_map`. Before setup it returns
   `{}` — empty, expected, not an error. It is the gap this section closes.
2. **Pick the setup path** ([Figma — Code Connect][code-connect]):
   - **UI flow** — inside Figma, map components to a repo path/name (optionally via
     GitHub).
   - **CLI flow** — runs in this repo; richer property mappings and dynamic examples.
     React/Vite is first-class, so the CLI flow fits this codebase.
3. **Map one component end to end first** — e.g. the Figma `Button` → this repo's
   canonical `Button`. Mapping is per-component, so start with one to learn the loop
   before doing the set.
4. **Verify:** run `get_code_connect_map` again.
   **Success:** it now returns your mapping (component name → source path), and
   `get_design_context` on that component references the real `CANONICAL` piece
   instead of generic markup.

---

## 5. Pull tokens into the `--ds-*` model

Figma **Variables** are the native token primitive (colours, numbers, typography;
"modes" for theming). Bring them into this tool's `--ds-*` CSS variables in
`src/styles/tokens.css`. ([Figma — Guide to variables][variables])

1. **Read tokens per node:** run `get_variable_defs` with the file key and a leaf
   node id (as in section 3, step 3).
   **Success:** a token map for that selection.
2. **Map into the token model:** translate each returned value to the matching
   `--ds-*` variable for the right system. New `data-ds` blocks must include **both**
   `:root[data-ds="…"]` and the bare `[data-ds="…"]` selector (the second scopes
   tokens to the Systems-tab gallery — see the tokens invariant in the project
   docs). Add any new colour pair to `scripts/contrast.mjs` with computed ratios,
   never hand-written.
3. **Bulk export (Enterprise only):** Figma's **REST Variables** endpoint
   (`file_variables:read`) can dump all variables in one scripted call — but it is
   **Enterprise-plan-only**. ([Figma — REST API scopes][scopes]) On the Organization
   tier this pipe is **closed**; use per-node `get_variable_defs` over MCP instead.
   **Success (either route):** the system's `--ds-*` values match Figma, the gallery
   renders the right system's tokens, and `contrast.mjs` carries every new pair.

---

## 6. Troubleshooting and known limits

- **`get_variable_defs` / `get_design_context` says "You currently have nothing
  selected. You need to select a layer first."** You passed a page/canvas node id.
  These tools need a **concrete leaf node** (an actual layer or component instance).
  Pass a real layer id and it works — it is not a selection bug.
- **Generated code comes back as React + Tailwind even though this repo uses CSS
  variables.** `get_design_context` defaults to React + Tailwind regardless of stack;
  the response itself says to convert it. Treat the output as a **starting point** to
  wire onto `CANONICAL` + `--ds-*`, never a drop-in. ([Figma — Tools and prompts][tools])
- **Image/asset URLs stop working after a few days.** Asset URLs in
  `get_design_context` are remote and **expire after 7 days** — download anything you
  need to keep.
- **Rate limits.** Read tools are capped per seat/plan. **Organization + Dev/Full =
  600 reads/day, 20/min** — ample for prototyping. (`whoami`, `add_code_connect_map`,
  and `generate_figma_design` are exempt.) ([Figma — Rate limits & access][rate-limits])
- **No bulk token export on Organization.** The REST Variables endpoint is
  Enterprise-only; per-node `get_variable_defs` is the supported token path on Org
  (section 5). ([Figma — REST API scopes][scopes])
- **Reads never mutate a file**, and access is permission-scoped to what your account
  can already view — but still practise writes-or-unknowns on a sandbox file first.
  ([Figma — Rate limits & access][rate-limits])
- **Avoid third-party PAT servers** (e.g. Framelink) for Acuity: they hold a static
  token to your Figma content and offer no Code Connect, so the agent still
  re-derives components. The official OAuth server is the sanctioned path.
  ([Figma — Set up the MCP server][mcp-setup])

---

## Sources

Official Figma documentation:

[mcp-setup]: https://help.figma.com/hc/en-us/articles/39888612464151-Claude-Code-and-Figma-Set-up-the-MCP-server
[tools]: https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/
[rate-limits]: https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/
[scopes]: https://developers.figma.com/docs/rest-api/scopes/
[code-connect]: https://help.figma.com/hc/en-us/articles/23920389749655-Code-Connect
[variables]: https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma

- Set up the MCP server: <https://help.figma.com/hc/en-us/articles/39888612464151-Claude-Code-and-Figma-Set-up-the-MCP-server>
- Tools and prompts: <https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/>
- Rate limits & access: <https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/>
- REST API scopes: <https://developers.figma.com/docs/rest-api/scopes/>
- Code Connect: <https://help.figma.com/hc/en-us/articles/23920389749655-Code-Connect>
- Guide to variables: <https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma>
