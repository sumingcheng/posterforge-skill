# Text Budgets

These budgets are conservative limits for text-first 1080x1440 cards. They are meant for agents and skill users who need to generate good-looking cards without trial-and-error.

Budgets are counted in CJK/full-width characters. Punctuation counts. For English, the safe capacity is usually about 1.8x the CJK budget, but long unbroken words still need manual shortening.

If source content exceeds a budget, rewrite it before rendering. Do not rely on CSS clipping; clipped cards look broken.

## Global Rules

- Keep `title`, `summary`, and `content` as the only public input fields unless the user explicitly asks for more.
- `title` is the poster headline. It should be short, not a sentence.
- `summary` is the conclusion. It should be one compact paragraph.
- `content[].title` is a label, not a heading paragraph.
- `content[].text` is a short point. Do not paste raw logs or transcripts.
- `footer` should stay under 18 CJK characters.

## Style Budgets

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

## Selection By Content Size

- For very short poster-like output: `pulse`, `delta`, `podium`, `compass`.
- For medium structured summaries: `arena`, `sprint`, `matrix`, `signal`, `atlas`, `graphite`.
- For operational diagnosis with more bullets: `ledger`, `audit`, `terminal`, `noir`, `prism`.
- For the largest summary body: `dossier` or `editorial`, but still keep the input concise.

## Agent Rewrite Rule

Before rendering, agents should check the selected style budget:

1. If any field is over budget, rewrite it shorter.
2. If the content cannot be shortened without losing meaning, choose a roomier style.
3. If the user explicitly asks for a specific style, preserve that style and compress the text.
4. If a rendered card still clips text, do not send it as final; revise the spec and rerender.
