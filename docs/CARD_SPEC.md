# CardSpec

`CardSpec` is the public input contract. Agents and external tools inject data through this JSON shape. Templates decide how to present it.

## Top-Level Shape

```json
{
  "style": "arena",
  "title": "Lorem Ipsum",
  "subtitle": "Dolor Sit / Amet / Elit",
  "summary": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae lorem at ipsum facilisis gravida.",
  "content": [
    { "title": "Dolor Sit", "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { "title": "Amet Elit", "text": "Praesent commodo cursus magna, vel scelerisque nisl consectetur et." }
  ],
  "footer": "Lorem Ipsum · Dolor Sit"
}
```

## Blocks

The recommended content primitives are:

- `title`: first read.
- `summary`: second read, usually the conclusion.
- `content`: third read, one or more short paragraphs or points.

`content` accepts:

- a string
- an array of strings
- an array of `{ "title": "...", "text": "..." }`

Legacy `metrics`, `rankings`, and `sections` are still accepted and normalized into `content`, but new specs should not depend on them.

## Text Budgets

Each style has a conservative text budget. Agents should check this before rendering, because templates intentionally use fixed poster-like layouts and may clip overlong text.

Budgets are counted in CJK/full-width characters. Punctuation counts. English capacity is usually about 1.8x the CJK number, but long unbroken words still need shortening.

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

The maintained budget reference is [TEXT_BUDGETS.md](TEXT_BUDGETS.md).

## Style

`style` selects the visual template family. Keep names short so users and agents can ask for them naturally.

| Style | Use for | Old aliases |
| --- | --- | --- |
| `arena` | ranking-first battle reports, leaderboards, top lists | `battle-ranking`, `battle`, `ranking` |
| `podium` | top-three medal reports | `medal`, `top3` |
| `sprint` | fast ranked readouts | `race`, `speed-rank` |
| `delta` | change, lift, before-after comparisons | `lift`, `improvement` |
| `matrix` | dense candidate comparison | `comparison-matrix` |
| `heat` | alert or traffic hot spots | `heatmap`, `hotlist` |
| `ledger` | alerts, incidents, diagnosis, root-cause notes | `operations-brief`, `diagnosis`, `incident`, `alert` |
| `dossier` | investigation case files | `case`, `case-file` |
| `audit` | verification and checklist reports | `review`, `inspection` |
| `terminal` | technical command or diagnosis summaries | `console`, `ops-terminal` |
| `bulletin` | short notices and concise updates | `notice`, `briefing` |
| `noir` | serious dark incident reports | `dark-ledger` |
| `graphite` | monochrome analytical reports | `mono`, `monochrome` |
| `signal` | executive summaries, experiment reports, KPI reports | `executive-scorecard`, `experiment`, `report`, `scorecard` |
| `pulse` | service health and heartbeat reports | `health`, `heartbeat` |
| `atlas` | broad multi-area overviews | `overview`, `map` |
| `prism` | segmented multi-signal summaries | `multi-signal` |
| `compass` | decision and direction briefs | `direction`, `strategy` |
| `mercury` | compact mobile-native briefs | `fast-brief` |
| `editorial` | magazine-like narrative reports | `magazine`, `feature` |

Registered style names:

```text
arena, podium, sprint, delta, matrix, heat,
ledger, dossier, audit, terminal, bulletin, noir, graphite,
signal, pulse, atlas, prism, compass, mercury, editorial
```

`template` is still accepted for compatibility, but new specs should use `style`.

## Legacy Ranking

```json
{
  "title": "TOP 排版方案",
  "unit": "score",
  "items": [
    {
      "rank": 1,
      "label": "Strict Grid",
      "value": 95,
      "displayValue": "95",
      "note": "clear hierarchy",
      "delta": "+5",
      "status": "winner"
    }
  ]
}
```

### Legacy Ranking Display Modes

Battle reports can compare items in many ways. Templates should choose from reusable ranking components:

- `podium`: top 3 winner emphasis.
- `bar-list`: horizontal bars for 5-10 items.
- `table`: dense ordered comparison.
- `delta`: before/after or lift-oriented ranking.
- `matrix`: two-dimensional comparison.

The schema still accepts ranking data for compatibility, then converts it into text content. The current templates are text-first.

## Template Contract

Every template exports:

```js
export const template = {
  id: 'arena',
  name: 'Arena',
  styleName: 'arena',
  aliases: ['battle-ranking', 'battle', 'ranking'],
  description: 'Text-first mobile card style.',
  accepts: ['content'],
  render(spec) {}
};
```

This makes template contribution simple:

1. Add a render function in `src/templates/style-pack.mjs`.
2. Register the template metadata in `stylePackTemplates`.
3. Add or update an example JSON when the data shape changes.
4. Run `pnpm check`.
