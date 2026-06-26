# Acuity Insights Prototyper

A shared tool for building clickable prototypes out of Acuity's real design
systems and components, so ideas can be validated quickly and every prototype
comes out structurally "Acuity" no matter who built it.

It works two ways:

- **It guides Claude to build to our standards.** The repo holds the canonical
  components, the design systems, and the authoring rules. When you build here
  with Claude, it uses those pieces, so the result carries Acuity's real
  components and principles, not a generic one-off.
- **It lets you preview and compare.** Once a prototype exists, you can switch it
  between design systems, see where one system has a component the other lacks,
  and compare systems side by side.

> [!NOTE]
> Today the tool builds in **code** (React + Vite + TypeScript). Reusing the same
> systems straight from **Figma** is in progress. See [Where it's heading](#where-its-heading).

## Why it exists

**Acuity runs more than one design system (naughty).** We want to bring cohesion across them:
compare them easily, and see the gaps between a design in one system versus
another, so we can bridge between them and eventually move to just one, shared system. As our design-system approach matures, the goal is to reuse those
standardized "puzzle pieces" to automate the UI, so our effort goes to UX,
discovery, and product design instead of rebuilding the same components by hand.

**It also fixes a quieter problem.** People were building prototypes with no shared
guidelines. They could validate an idea, but the result often wasn't structurally
"Acuity": it didn't use our components or principles. This is in part why we arrived at multiple design systems in the first place— well-meaning folks kept reinventing the wheel. This repo is the shared
starting point that trains Claude to build the same way for everyone, every time, and one of many levers to help us *coalesce*.

## Who it's for

- **Designers** prototype real flows in real Acuity systems, without rebuilding
  components.
- **Product managers** see and click an idea early, in something that looks like
  the product.
- **Engineers** get a dependency-light, lint-gated codebase that mirrors our
  component standards.
- **Research** can put a faithful, interactive prototype in front of participants
  rather than a flat mock.

## What it does today

### Build to Acuity standards with Claude

The repo is the guide Claude reads. It defines the canonical components you may
use, the design systems they render in, and the rules for authoring a prototype
([`AGENTS.md`](AGENTS.md)). A hard lint gate enforces it: a prototype that reaches
past the approved components, with raw HTML, stray colours, or off-pattern markup,
fails the check.

> [!IMPORTANT]
> Because every prototype builds from the same canonical components, the output
> is structurally "Acuity" no matter who made it. That consistency *is* the point.

### Preview, compare, and see the gaps

Open the running app for the second half:

- **One prototype, every system.** Switch a single prototype between Low-fi
  wireframe, Acuity (One45 modern), and one45 legacy. The screen re-skins; the
  prototype itself doesn't change.
- **Gaps are shown, not hidden.** When a system is missing a component, the tool
  fills it with a clearly flagged stand-in, so you can see exactly where systems
  diverge.
- **Systems, side by side.** A Systems view documents every component in a chosen
  system, with a coverage matrix that compares all systems at a glance.

## Where it's heading

The bigger goals are to (1) build with our design systems in **both** Figma and code,
and have a prototype in one match its counterpart in the other, and (2) coalesce all these design systems and other permutations into one, shared system, library, language, and standards.

The connection to read Acuity's real design system from Figma is validated and
documented (see the
[Figma connection guide](shared/one45-design-systems/figma-connection-runbook.md)).
Building on that connection is in progress (and moving quickly): For example, we're currently mapping those Figma components to the
tool's components (Code Connect), syncing design tokens, and reconciling a code
prototype against its Figma version.

## Getting started

Start by understanding what you're looking at when you run the dev server: The app has a **canvas** (just the
prototype, no chrome) and a **controls panel** you open with a `/` on your keyboard to show:

| Panel | What it does |
|-------|--------------|
| Left  | A tabbed view, defaults to listing the prototypes and the available flows for the currently selected prototype. You can switch to the Systems tab to view examples of just the components from the currently catalogued design systems, too. |
| Right | Switches design systems the current prototype is built/displayed in, manages the component bridge, toggles the gap flags visually. |

<details>
<summary><b>How to run it locally (open me for a code snippet)</b> (Node 20+)</summary>

```bash
npm install      # done when it prints "added N packages"
npm run dev      # opens http://localhost:5173
```

`npm run check` runs the lint gate and the build together.

</details>

To author a prototype, work in Claude Code against the rules in
[`AGENTS.md`](AGENTS.md). It covers the folder shape, the canonical components,
and the guardrails. The design systems themselves are documented in
[`shared/one45-design-systems/`](shared/one45-design-systems/). Notice a gap? Provide feedback via this repo or to Spencer on the design team.

## Tracking and improvements

Improvements to the Prototyper are tracked on the **[Design (DE) board](https://acuityinsights.atlassian.net/jira/software/c/projects/DE/list?jql=project%20%3D%20DE%20ORDER%20BY%20created%20DESC%2C%20cf%5B10011%5D%20ASC&hideDone=true)** in Jira.
Tickets that concern the tool are prefaced with **`[prototyper]`** in their title.
If you have board access, you'll know where to look.
