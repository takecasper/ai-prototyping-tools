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
> varied states, and there is **no single canonical "Acuity Design System."**
> Several are *named* "Acuity Design System" (or close to it) but are **not
> current, not canonical, and not equivalent** to one another. Do not assume two
> things are the same system because they share a name — confirm by **source**,
> not by label. The tool's `one45-2020s` system was reverse-engineered from one
> such package and is **not** "the" Acuity DS. The likely promotion target (the
> canonical system the project intends to move toward) is the **Platform Design
> System**, not any of the others.

**A system can have multiple sources.** The same design system may exist as a
Figma library *and* a Git repo *and* a Storybook / Chromatic site. Record every
known link per system; the census reconciles which sources back the same system.

## Known sources

| System | In the tool? | Source links | Notes |
|---|---|---|---|
| **Platform Design System** | no — likely promotion target | Figma org library "Platform design system" (URL `<<TBD>>`) | The likely canonical system. Spacing is a numbered scale (`spacing/0`–`spacing/7` in a "dimensions" variable collection) — see [DE-450]. |
| **Fahad's design system** | not yet — incorporate for comparison ([DE-444]) | https://ds.acuityinsights.io/ | Hosted DS site. Brought in to compare against / interpret Fahad's work, **not** to promote to canonical. |
| **A One45 system** | maybe — fingerprint pending | https://bitbucket.org/one45/one45-design-system/src/master/ | "One of the One45 systems." Which tool system (if any) this backs — `one45-2020s`, `one45-legacy`, or neither — is a census question; do not assume. |
| `one45-2020s` | yes | • GitHub: https://github.com/takecasper/acuity-design-system — the repo for the `@takecasper/acuity-design-system` package this system was reverse-engineered from (same `takecasper` org as this tool's repo). Provided mid-2025; **confirm currency** — likely newer than the staging snapshot the tool was built from.<br>• Chromatic (maybe): https://www.chromatic.com/builds?appId=6603321f619950844820974b — *possibly* this system's published Storybook builds, **unconfirmed** (could be a different system).<br>• Originally reverse-engineered from the One45 staging repo. Figma source `<<TBD>>`. | The system formerly mislabelled `acuity` ([DE-454]). The repo name "acuity-design-system" is itself part of the naming confusion: it is one package, not a company-wide canonical DS. |
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
