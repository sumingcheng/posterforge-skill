# PosterForge Skill

[中文说明](README.zh-CN.md)

Generate high-quality mobile text-card posters from a small JSON spec.

PosterForge Skill is a lightweight React/Tailwind poster renderer for agents, bots, and automation workflows. Give it a title, a short summary, and a few content points; it renders a polished 1080x1440 mobile-readable PNG.

It is designed for:

- alert and incident summaries
- ranking and battle-report cards
- experiment and KPI updates
- weekly or daily briefings
- text-first social posts

It does not generate photos, illustrations, carousels, or general-purpose social layouts. The goal is one good text image, fast.

## Preview

```json
{
  "style": "ledger",
  "title": "Lorem Ipsum",
  "summary": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "content": [
    { "title": "Dolor Sit", "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { "title": "Amet Elit", "text": "Praesent commodo cursus magna, vel scelerisque nisl consectetur et." }
  ],
  "footer": "PosterForge Skill"
}
```

```bash
posterforge render card.json --out card.png
```

By default this exports a `3240x4320` PNG from a `1080x1440` logical canvas.

## Theme Gallery

These previews are generated from the same JSON shape with `pnpm generate:previews`.

| Arena | Podium | Sprint |
| --- | --- | --- |
| ![Arena preview](docs/previews/arena.png) | ![Podium preview](docs/previews/podium.png) | ![Sprint preview](docs/previews/sprint.png) |

| Delta | Matrix | Heat |
| --- | --- | --- |
| ![Delta preview](docs/previews/delta.png) | ![Matrix preview](docs/previews/matrix.png) | ![Heat preview](docs/previews/heat.png) |

| Ledger | Dossier | Audit |
| --- | --- | --- |
| ![Ledger preview](docs/previews/ledger.png) | ![Dossier preview](docs/previews/dossier.png) | ![Audit preview](docs/previews/audit.png) |

| Terminal | Bulletin | Noir |
| --- | --- | --- |
| ![Terminal preview](docs/previews/terminal.png) | ![Bulletin preview](docs/previews/bulletin.png) | ![Noir preview](docs/previews/noir.png) |

| Graphite | Signal | Pulse |
| --- | --- | --- |
| ![Graphite preview](docs/previews/graphite.png) | ![Signal preview](docs/previews/signal.png) | ![Pulse preview](docs/previews/pulse.png) |

| Atlas | Prism | Compass |
| --- | --- | --- |
| ![Atlas preview](docs/previews/atlas.png) | ![Prism preview](docs/previews/prism.png) | ![Compass preview](docs/previews/compass.png) |

| Mercury | Editorial |
| --- | --- |
| ![Mercury preview](docs/previews/mercury.png) | ![Editorial preview](docs/previews/editorial.png) |

## Install

Requirements:

- Node.js `>=20`
- `pnpm` for development
- Chromium, Google Chrome, or another compatible headless browser for high-DPI PNG export

Install directly from GitHub:

```bash
npm install -g github:sumingcheng/posterforge-skill
```

Or install from a published package after it is released to npm:

```bash
pnpm add -g posterforge-skill
```

Or use the repository directly:

```bash
git clone https://github.com/sumingcheng/posterforge-skill.git
cd posterforge-skill
pnpm install
pnpm build
node ./bin/posterforge.mjs render ./examples/alert.json --out ./dist/alert.png
```

To expose the local CLI while developing:

```bash
npm install -g .
posterforge templates
```

## Quick Start

Create `card.json`:

```json
{
  "style": "signal",
  "title": "Service Health",
  "summary": "Errors dropped after the routing fix. Latency is back within the normal range.",
  "content": [
    { "title": "Impact", "text": "Only one provider route was affected." },
    { "title": "Action", "text": "Keep the fallback route enabled and monitor for one hour." },
    { "title": "Status", "text": "Traffic is stable and no new alerts are firing." }
  ],
  "footer": "Ops Brief"
}
```

Render it:

```bash
posterforge render card.json --out card.png
```

Useful commands:

```bash
posterforge templates
posterforge render card.json --out card.png --scale 2
posterforge html card.json --out card.html
```

If you are running from source, replace `posterforge` with `node ./bin/posterforge.mjs`.

## CardSpec

The recommended input is intentionally small:

```ts
type CardSpec = {
  style: string;
  title: string;
  summary: string;
  content: Array<{ title: string; text: string }> | string[] | string;
  footer?: string;
};
```

New specs should prefer `title`, `summary`, and `content`. Legacy `metrics`, `rankings`, and `sections` are still accepted and normalized into `content`.

Read the full schema in [docs/CARD_SPEC.md](docs/CARD_SPEC.md).

## Styles

Use `style` to pick a visual system:

| Group | Styles | Best for |
| --- | --- | --- |
| Ranking | `arena`, `podium`, `sprint`, `delta`, `matrix`, `heat` | battle reports, leaderboards, top lists |
| Operations | `ledger`, `dossier`, `audit`, `terminal`, `bulletin`, `noir`, `graphite` | alerts, incident notes, diagnosis summaries |
| Briefing | `signal`, `pulse`, `atlas`, `prism`, `compass`, `mercury`, `editorial` | KPI reports, experiments, weekly updates |

List all registered templates:

```bash
posterforge templates
```

## Text Budgets

Each style has a conservative text budget. Agents should check it before rendering, because these templates are fixed poster layouts and long text will damage the design.

See [docs/TEXT_BUDGETS.md](docs/TEXT_BUDGETS.md) for per-style limits.

Short version:

- keep titles short
- keep summaries to one compact paragraph
- keep content points brief
- compress raw logs or transcripts before rendering
- rerender if the output looks clipped or crowded

## Agent Usage

This project includes a skill definition in [skill/SKILL.md](skill/SKILL.md).

When used by an agent:

1. Compress the source into `CardSpec`.
2. Choose a style.
3. Check the style's text budget.
4. Render the PNG.
5. Inspect the image before returning it.

The agent should not announce that it is using the skill. It should simply produce the image.

## Architecture

```text
CardSpec JSON
  -> schema normalization
  -> template registry
  -> React/HTM templates
  -> Tailwind CSS
  -> high-DPI Chromium PNG
```

Important files:

- [src/schema/card-spec.mjs](src/schema/card-spec.mjs): input normalization
- [src/templates/style-pack.mjs](src/templates/style-pack.mjs): template implementations
- [src/templates/registry.mjs](src/templates/registry.mjs): style registry
- [bin/posterforge.mjs](bin/posterforge.mjs): CLI renderer
- [docs/DESIGN_RESEARCH.md](docs/DESIGN_RESEARCH.md): design references

## Development

```bash
pnpm install
pnpm build
pnpm check
pnpm dev
```

Render examples:

```bash
pnpm render:alert
pnpm render:experiment
pnpm render:battle
```

## Design Principles

- One image by default.
- Text-first layouts.
- Strong typography over decoration.
- Small JSON input.
- No fake metrics.
- No raw transcripts.
- Conservative text budgets.
- High-DPI output by default.

## License

MIT. See [LICENSE](LICENSE).
