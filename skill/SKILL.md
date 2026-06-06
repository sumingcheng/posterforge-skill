---
name: posterforge
description: Generate one mobile-first text card image from operational summaries, alerts, experiment reports, weekly reports, or concise text briefs. Use when the user asks for 单图, 战报图, 小红书风格单图, 告警总结图, 实验战报, mobile-readable poster, or a text-first social card.
---

# PosterForge Skill

Create exactly one high-resolution mobile-readable PNG card from structured data.

## Default

- Produce one 1080x1440 logical card exported at 3x by default.
- Do not create a carousel unless explicitly requested.
- Do not say "I am using this skill"; just produce the card.
- Do not generate new photos or illustrations.
- Optional user-provided images may be used later, but v0 is text-first.

## Workflow

1. Compress the source into a `CardSpec` JSON:
   - `style`: choose one registered style name
   - `title`
   - `subtitle`
   - `summary`
   - `content`: string, string array, or `{ title, text }` array
   - `footer`
2. Check the selected style's text budget below. Rewrite overlong fields before rendering.
3. Save the JSON in the task folder.
4. Run:

```bash
posterforge render spec.json --out output.png
```

This produces a 3240x4320 PNG by default. Use `--scale 2` only if the output file is too large for the destination channel.

5. Inspect the PNG. If text is clipped or visually crowded, shorten the JSON and rerender before sending.
6. Send or return `output.png`.

## Selection

- Battle report / ranking / top list: `arena`, `podium`, `sprint`, `delta`, `matrix`, or `heat`
- Alert / root cause / incident: `ledger`, `dossier`, `audit`, `terminal`, `bulletin`, `noir`, or `graphite`
- Weekly / daily / KPI / experiment summary: `signal`, `pulse`, `atlas`, `prism`, `compass`, `mercury`, or `editorial`
- Default to `ledger` for operational diagnosis, `arena` for rankings, and `signal` for KPI reports.

Keep the image scannable. The preferred shape is always title, summary, and content. Avoid generating extra decorative fields unless the user explicitly asks for them.

## Text Budgets

Budgets are conservative and counted in CJK/full-width characters. Punctuation counts. For English, safe capacity is usually about 1.8x the CJK budget, but long unbroken words still need shortening.

Do not exceed these limits. If the source is longer, compress it before rendering instead of relying on CSS clipping.

| Style | Title | Summary | Content items | Item title | Item text |
| --- | ---: | ---: | ---: | ---: | --- |
| `arena` | 16 | 45 | 4 | 8 | 34 each |
| `podium` | 14 | 45 | 3 | 8 | item 1: 36; items 2-3: 24 each |
| `sprint` | 16 | 42 | 4 | 8 | 34 each |
| `delta` | 12 | 42 | 4 | 8 | 34 each |
| `matrix` | 14 | 55 | 4 | 8 | 38 each |
| `heat` | 16 | 42 | 5 | 8 | 30 each |
| `ledger` | 18 | 36 | 5 | 8 | 28 each |
| `dossier` | 14 | 55 | 4 | 8 | 38 each |
| `audit` | 18 | 34 | 6 | 8 | 24 each |
| `terminal` | 18 | 46 | 4 | 8 | 35 each |
| `bulletin` | 14 | 44 | 4 | 8 | 32 each |
| `noir` | 18 | 36 | 5 | 8 | 28 each |
| `graphite` | 14 | 46 | 4 | 8 | lead item: 55; others: 30 each |
| `signal` | 18 | 55 | 4 | 8 | 30 each |
| `pulse` | 16 | 46 | 4 | 8 | 22 each |
| `atlas` | 16 | 45 | 4 | 8 | 34 each |
| `prism` | 18 | 40 | 6 | 8 | 28 each |
| `compass` | 14 | 42 | 4 | 8 | 28 each |
| `mercury` | 18 | 34 | 5 | 8 | 28 each |
| `editorial` | 18 | 55 | 4 | 8 | first 3: 34 each; side item: 28 |

Use roomier styles for denser content: `dossier`, `editorial`, `matrix`, `terminal`, `audit`, or `prism`.
