---
name: posterforge
description: Generate one mobile-first text card image from operational summaries, alerts, incident reports, rankings, experiment updates, weekly reports, or concise text briefs. Use when the user asks for 单图, 海报, 战报图, 小红书风格单图, 告警总结图, 实验战报, mobile-readable poster, text poster, text card, or social card.
---

# PosterForge Skill

Create exactly one high-resolution mobile-readable PNG text poster from a small JSON spec.

## When To Use

Use this skill when the user asks for a polished single image from text, for example:

- "把这段告警排查结果生成一张海报"
- "做一张小红书单图"
- "把这个排行榜做成战报图"
- "给这个实验结果生成一张移动端卡片"
- "Turn this incident summary into a mobile poster"
- "Make a text-first social card from this report"

Do not use this skill for photo generation, illustration generation, general graphic design, slides, or multi-image carousels unless the user explicitly asks for that output.

## Defaults

- Produce one `1080x1440` logical card.
- Export at `3x` by default, producing a `3240x4320` PNG.
- If the destination rejects large files, rerender with `--scale 2`.
- If the user did not choose a style, pick one from the selection rules below.
- If the user gives too little content, create a concise card from the facts they provided. Do not invent metrics, names, dates, causes, or outcomes.
- Do not say "I am using this skill". Just produce the image.

## Public Input Shape

Prefer this `CardSpec` shape:

```json
{
  "style": "signal",
  "title": "Short Title",
  "summary": "One compact conclusion paragraph.",
  "content": [
    { "title": "Point", "text": "Short supporting detail." },
    { "title": "Action", "text": "Short next step or result." }
  ],
  "footer": "Optional Footer"
}
```

Use only `style`, `title`, `summary`, `content`, and optional `footer` unless the user explicitly asks for a custom data shape. `subtitle`, `metrics`, `rankings`, and `sections` may still work as legacy fields, but they are not the recommended agent output.

## Happy Path

1. Read the source material.
2. Compress it into the recommended `CardSpec` JSON.
3. Pick a style using the selection rules.
4. Check the selected style's text budget. Rewrite overlong fields before rendering.
5. Save the JSON as `spec.json` in the task folder.
6. Run:

```bash
posterforge render spec.json --out output.png
```

7. Inspect `output.png`.
8. If text is clipped, crowded, or visually awkward, shorten the JSON and rerender.
9. Send or return `output.png`.

## CLI Fallback

If `posterforge` is not available in `PATH`, try the source checkout:

```bash
node ./bin/posterforge.mjs render spec.json --out output.png
```

If that fails, check that dependencies are installed:

```bash
pnpm install
pnpm build
```

PNG export requires Chromium, Google Chrome, or another compatible headless browser available to the runtime.

## Style Selection

- Alert / root cause / incident: default to `ledger`; use `terminal` for technical command/log summaries, `audit` for checklist verification, `noir` for serious incident notes, `dossier` for investigation-style case files.
- Ranking / battle report / top list: default to `arena`; use `podium` for top-three reports, `sprint` for fast ranking readouts, `matrix` for comparisons, `heat` for hot spots.
- Weekly / daily / KPI / experiment summary: default to `signal`; use `editorial` for narrative briefs, `atlas` for broad overviews, `prism` for multi-signal summaries, `mercury` for compact mobile briefs.
- Announcement / strong visual poster: use `bulletin`, `delta`, `pulse`, or `compass`.
- Unknown intent: use `signal` for general business/report cards.

Keep the image scannable. The preferred shape is always title, summary, and content. Avoid decorative fields, fake data, and raw transcript dumps.

## Text Budgets

Budgets are conservative and counted in CJK/full-width characters. Punctuation counts. For English, safe capacity is usually about `1.8x` the CJK budget, but long unbroken words still need shortening.

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

## Failure Handling

- If rendering fails because `posterforge` is missing, use the source CLI fallback above.
- If rendering fails because no browser is available, report that Chromium/Chrome is required for PNG export.
- If text is clipped or crowded, shorten the `CardSpec`; do not edit CSS for a one-off task.
- If the user asks for multiple images but did not explicitly request a carousel, create one strong card first and ask only if they need more.
- If facts are missing, keep the card generic or ask for the missing fact. Do not fabricate metrics, incident causes, owners, dates, or results.
