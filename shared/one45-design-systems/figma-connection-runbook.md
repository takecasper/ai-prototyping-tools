# How to connect the prototyping tool to Figma

Connect **Claude Code** (the terminal AI coding agent) to Acuity's Figma so
generated prototypes reuse the real design system instead of re-deriving it. Work
through the sections in order.

> [!NOTE]
> **Terms used below**
>
> - **MCP** (Model Context Protocol): how an AI agent calls an external tool.
>   Figma's MCP "server" lets Claude Code read your Figma files.
> - **OAuth**: the "Sign in with…" browser pop-up. Nothing secret gets pasted into
>   a file, and nothing long-lived can leak.
> - **Code Connect**: links a Figma component to its real React component in this
>   repo, so the agent uses our `Button` instead of inventing one.
> - **Plan / seat**: the **plan** is the org's tier (Starter up to Enterprise); the
>   **seat** is your account level (View, Collab, Dev, or Full). Both gate access.

---

## 1. Prerequisites (ask Acuity for these)

| You need | Why | How to check | Looks right when |
|---|---|---|---|
| **Organization or Enterprise plan** | Code Connect (§4) and usable rate limits (§6) | run `whoami` once connected (§2) | plan reads Organization or Enterprise |
| **One Dev or Full seat** | View/Collab caps at ~6 reads a month, too few to work | Figma → avatar → account, or ask your admin; `whoami` shows it | seat shows Dev or Full |
| **Admin approval of the connector** | Enterprise tenants can block AI connectors | try the OAuth step (§2); if blocked, an admin must approve it | OAuth finishes with no block message |

On the Organization plan everything here works except bulk token export over REST,
which is Enterprise-only (see §5). ([rate limits & access][rate-limits])

---

## 2. Install and connect over OAuth

Use Figma's **official** plugin over OAuth, not a personal token or a third-party
server. Access is scoped to what you can already see, and it is revocable.
([set up the MCP server][mcp-setup])

1. Install: `claude plugin install figma@claude-plugins-official`
2. Register it: `/reload-plugins` → Claude Code reports `1 plugin MCP server`.
3. Authenticate: `/mcp` → **figma** → **Authenticate** → browser → **Allow access**
   with the Acuity account.
4. Confirm: `claude mcp list` shows `plugin:figma:figma … ✔ Connected`.
5. Check plan and seat: run `whoami`. It is rate-limit-exempt, so it is a free check.

---

## 3. Test on a throwaway file first

> [!WARNING]
> Don't point your first tests at a production or shared library. Make your own
> scratch Figma file (a few frames) and use its file key, the string in the URL:
> `figma.com/design/<FILE_KEY>/<name>`. Reads never change a file, but a sandbox
> keeps the first run low-stakes.

Run each with the file key:

1. `get_metadata` + a page node returns an XML outline of layers, no styling. No
   selection needed.
2. `get_design_context` + a **leaf** node (a real layer, not the page) returns
   reference code. It comes back as React + Tailwind (see §6).
3. `get_variable_defs` + a **leaf** node returns the tokens used there, for example
   `{ "White": "#FFFFFF", … }`.

A "nothing selected" error means you targeted a page node instead of a leaf (see §6).
([tools and prompts][tools])

---

## 4. Map components with Code Connect

Code Connect points the agent at our real components. It maps each Figma library
component to a `CANONICAL` React component (`src/systems.tsx`), so "generate a
button" becomes "use *our* `Button`." Needs an Org/Enterprise plan and a Dev/Full
seat. ([Code Connect][code-connect])

> [!IMPORTANT]
> This only pays off if Acuity publishes a real Figma component library (published
> components plus Variables), not a one-off file. Confirm that exists first.

1. `get_code_connect_map` returns `{}` before setup. That is the gap, not an error.
2. Pick a path: the **Figma UI** (map to a repo path or name) or the **CLI** in this
   repo (richer mappings; React/Vite is first-class).
3. Map one component end to end first (Figma `Button` to our `Button`) to learn the
   loop before doing the rest.
4. `get_code_connect_map` now returns the mapping, and `get_design_context` cites the
   real `CANONICAL` piece instead of generic markup.

---

## 5. Pull tokens into `--ds-*`

Figma **Variables** are the tokens: colours, numbers, and type, with "modes" for
theming. Map them into the tool's `--ds-*` CSS variables in `src/styles/tokens.css`.
([guide to variables][variables])

1. `get_variable_defs` + a leaf node returns a token map (as in §3).
2. Translate each value to its `--ds-*` variable. New `data-ds` blocks need **both**
   `:root[data-ds="…"]` and the bare `[data-ds="…"]` selector (the bare one scopes the
   Systems-tab gallery). Add new colour pairs to `scripts/contrast.mjs` with computed
   ratios.
3. No bulk export on Org: the REST Variables endpoint (`file_variables:read`) is
   Enterprise-only, so read per node with `get_variable_defs`. ([REST API scopes][scopes])

---

## 6. Troubleshooting

<details>
<summary>Common errors and limits</summary>

- **"You currently have nothing selected"** from `get_variable_defs` or
  `get_design_context`: you passed a page node. Pass a real **leaf** layer id. It is
  not a bug.
- **Code comes back as React + Tailwind** whatever your stack. Treat it as a starting
  point to adapt onto `CANONICAL` + `--ds-*`, not a drop-in. ([tools and prompts][tools])
- **Asset URLs expire after 7 days.** Download anything you want to keep.
- **Rate limits:** Org + Dev/Full = 600 reads a day, 20 a minute. Plenty for
  prototyping. (`whoami`, `add_code_connect_map`, and `generate_figma_design` are
  exempt.) ([rate limits & access][rate-limits])
- **No bulk token export on Org** (the REST route is Enterprise-only); use per-node
  `get_variable_defs`. ([REST API scopes][scopes])
- **Skip third-party PAT servers** such as Framelink: a static token over your Figma
  content, no Code Connect, so the agent still re-derives components. The official
  OAuth server is the sanctioned path. ([set up the MCP server][mcp-setup])

</details>

---

## Sources

Official Figma documentation:

- [Set up the MCP server][mcp-setup]
- [Tools and prompts][tools]
- [Rate limits & access][rate-limits]
- [REST API scopes][scopes]
- [Code Connect][code-connect]
- [Guide to variables][variables]

[mcp-setup]: https://help.figma.com/hc/en-us/articles/39888612464151-Claude-Code-and-Figma-Set-up-the-MCP-server
[tools]: https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/
[rate-limits]: https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/
[scopes]: https://developers.figma.com/docs/rest-api/scopes/
[code-connect]: https://help.figma.com/hc/en-us/articles/23920389749655-Code-Connect
[variables]: https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma
