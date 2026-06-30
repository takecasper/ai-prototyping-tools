---
title: Design system source map (where Acuity's systems live)
tags: design-system, sources, census, figma, bitbucket, storybook, links
---

# Design system source map

A working index of Acuity's design systems and where each one actually lives —
Figma, Git (GitHub / Bitbucket), Storybook / Chromatic, or a hosted site. This is
the living artifact the census ([DE-448]) fills in. Treat it as in-progress, not
complete: rows get added and confirmed as sources are located.

> [!WARNING]
> **The names collide and will mislead you.** Acuity has ~seven design systems in
> varied states. Several are *named* "Acuity Design System" (or close to it) but
> are **not current, not canonical, and not equivalent** to one another. Do not
> assume two things are the same system because they share a name — confirm by
> **source**, not by label. The tool's `one45-2020s` system was reverse-engineered
> from one such package and is **not** "the" Acuity DS.
>
> **Direction is decided:** the mid-2025 engineering "Acuity Design System"
> (GitHub + Chromatic + Confluence + Figma; its own row below) is the canonical
> target — now live in the tool as `acuity-canon`. It is **unrelated to one45 or
> `one45-2020s`** despite the shared name. Isabella's "Platform Design System"
> (purely in Figma) is preferred as a source for updating that engineering system,
> not for standalone adoption.
>
> *(Cautionary example, already hit on this very map: the mid-2025 engineering
> "Acuity Design System" was at first wrongly merged into `one45-2020s` because the
> names matched. They are different systems. Confirm by source, never by name.)*

**A system can have multiple sources.** The same design system may exist as a
Figma library *and* a Git repo *and* a Storybook / Chromatic site. Record every
known link per system; the census reconciles which sources back the same system.

## Known sources

| System | In the tool? | Source links | Notes |
|---|---|---|---|
| **Acuity Design System** (engineering, mid-2025) | **yes (`acuity-canon`)** | • npm: `@takecasper/acuity-design-system@1.27.13` (pinned)<br>• GitHub: https://github.com/takecasper/acuity-design-system<br>• Chromatic: https://www.chromatic.com/builds?appId=6603321f619950844820974b (the repo's published Storybook)<br>• Confluence: https://acuityinsights.atlassian.net/wiki/spaces/DS/overview (docs; links to Figma)<br>• Figma: https://www.figma.com/design/WSahvnapDG7dHoJS3tHcqk/Acuity-Design-system?node-id=3-5 | The system **Jason and the engineers built (mid-2025)**. All four sources are confirmed the **same** system. **Unrelated to one45 / `one45-2020s`** despite the "acuity-design-system" name. **Decided: the canonical target** — live in the tool as `acuity-canon`, the store default, with 14 canonical pieces native and 6 gaps (Toggle, SearchField, Breadcrumb, Table, Avatar, Image) filled by flagged bridge interims. Preference: **update it from Isabella's Platform Design System Figma work** (row below), not adopt Platform standalone. ⚠ The Figma file still has **branches with never-completed draft components** — don't treat draft/branch work as canonical. |
| **Platform Design System** | no — Figma-only | Figma org library "Platform design system" (URL `<<TBD>>`) | **Isabella's** work, purely in Figma. Engineering preference (Jason et al.) is to use it to **update the engineering "Acuity Design System"** (mid-2025; row above), **not** adopt it standalone. Spacing is a numbered scale (`spacing/0`–`spacing/7` in a "dimensions" collection) — see [DE-450]. |
| **Fahad's design system** — "One45 2.0" / "One45 Modern Design System" | not yet — incorporate for comparison ([DE-444]) | • Docs + Storybook: https://ds.acuityinsights.io/ and https://ds.acuityinsights.io/storybook/ (Google-SSO-gated; Acuity account)<br>• GitHub: https://github.com/takecasper/one45-modern-design-system (private — 404 to the spencergoldade gh account and an unauthorised browser session)<br>• npm: none found (registry search for `acuityinsights` / `takecasper` / `acuity design` returns only `@takecasper/acuity-design-system`, which is `acuity-canon`) | Verified 2026-06-30 via the authed site. **Fahad's modernization DS for the next One45**, distinct from every other row. Stack: **MUI 7 + Tailwind**, Inter + Source Serif 4, light + dark, WCAG 2.2 AA (claims 120/120 tests, 0 axe). Tokens as `.ts` files: `colors.ts` (50–900 scales), `palette.ts` (MUI adapter), `semantic.ts`, `typography.ts`, `spacing.ts` (4px base, named rungs), `shadows.ts` (6-step slate), `motion.ts`, `dataVisualization.ts`; theme via `createOne45Theme({mode})` + `theme`/`darkTheme`. Storybook surface: Foundations (Palette, Typography, Logo, Buttons, Inputs, Surfaces, Layout, Overlays, **Stat card**), Med-Ed (PersonRow, People primitives, Scheduling, Forms, Reports, AuditLogRow, Audit primitives), Patterns (Navigation transition). **Compare input, not a promotion target** (`acuity-canon` stays canonical, [DE-452]). **Integration blocked on access:** the documented dependency on-ramp needs an installable package; none is published and the repo is private/inaccessible to current credentials. Paths: get repo/package access → on-ramp; reverse-engineer a token skin from the Storybook; or compare-only. |
| **A One45 system** | maybe — fingerprint pending | https://bitbucket.org/one45/one45-design-system/src/master/ | "One of the One45 systems." Which tool system (if any) this backs — `one45-2020s`, `one45-legacy`, or neither — is a census question; do not assume. |
| `one45-2020s` | yes | Reverse-engineered from the One45 staging repo. Canonical / Figma source `<<TBD>>` (may not exist as a separate published library). | The tool's modern One45 system, formerly mislabelled `acuity` ([DE-454]). **Not** the mid-2025 engineering "Acuity Design System" (row above): despite the shared name, this is the reverse-engineered One45 system and is unrelated to Jason's engineering work. |
| `one45-legacy` | yes | Reverse-engineered from the One45 staging repo (`_colors.scss`, `new_branding.scss`). Figma source `<<TBD>>`. | The older one45 brand. |
| *(remaining systems)* | — | `<<TBD via census — [DE-448]>>` | ~7 systems total; the rest are not yet located. |

## How to use and extend this map

- One row per system; **one system, many links** is expected — add every source you find.
- Cite the source you actually verified (URL or repo path). Mark unknowns `<<TBD>>`; never guess a link.
- When the census ([DE-448]) confirms which source backs a tool system, record it here, then unblock the dependent work: the token sync ([DE-421]) and Code Connect ([DE-422]) both need to know which library is the real source.

## Related tickets

- [DE-448] — the census that fills this map in (GitHub / Bitbucket / Figma / Storybook-Chromatic).
- [DE-451] — epic: incorporate additional design systems.
- [DE-444] — incorporate Fahad's system (comparison).
- [DE-450] — Platform Design System spacing / Claude's understanding of it.
- [DE-421] / [DE-422] — Figma token sync / Code Connect (both blocked until a source is mapped).

[DE-421]: https://acuityinsights.atlassian.net/browse/DE-421
[DE-422]: https://acuityinsights.atlassian.net/browse/DE-422
[DE-444]: https://acuityinsights.atlassian.net/browse/DE-444
[DE-448]: https://acuityinsights.atlassian.net/browse/DE-448
[DE-450]: https://acuityinsights.atlassian.net/browse/DE-450
[DE-451]: https://acuityinsights.atlassian.net/browse/DE-451
[DE-454]: https://acuityinsights.atlassian.net/browse/DE-454
