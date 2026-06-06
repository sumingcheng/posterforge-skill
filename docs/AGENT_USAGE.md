# Agent Usage

PosterForge Skill is built for agents, bots, and automation workflows that need to turn a short report into a polished mobile image.

## Install For An Agent

Install the CLI:

```bash
npm install -g posterforge
```

Then expose `skill/SKILL.md` to your agent runtime as a skill definition. The runtime should be able to call:

```bash
posterforge render spec.json --out output.png
```

For quick one-off cards, the runtime can also call the CLI without writing a JSON file first:

```bash
posterforge render --style signal --title "Service Health" --summary "Errors are down." --item "Impact: One route was affected." --item "Action: Keep fallback enabled." --out output.png
```

For source-based usage:

```bash
git clone https://github.com/sumingcheng/posterforge-skill.git
cd posterforge-skill
pnpm install
pnpm build
node ./bin/posterforge.mjs render ./examples/alert.json --out ./dist/alert.png
```

## Recommended Agent Flow

1. Read the source material.
2. Compress it into `title`, `summary`, and `content`.
3. Choose a style by intent.
4. Check the style budget in `docs/TEXT_BUDGETS.md`.
5. Render the PNG.
6. Inspect the image.
7. If text is crowded or clipped, rewrite shorter and render again.

Agents should not announce that they are using the skill. They should simply return the generated image.

## Style Selection

- Alert or incident: `ledger`, `audit`, `terminal`, `noir`, `dossier`.
- Ranking or battle report: `arena`, `podium`, `sprint`, `matrix`, `heat`.
- Weekly update or KPI brief: `signal`, `editorial`, `atlas`, `prism`, `mercury`.
- Strong visual announcement: `bulletin`, `delta`, `pulse`, `compass`.

## Output Contract

Default logical canvas:

```text
1080x1440
```

Default production PNG:

```text
3240x4320
```

Preview images in this repository are smaller `scale 1` screenshots to keep the repo lightweight.
