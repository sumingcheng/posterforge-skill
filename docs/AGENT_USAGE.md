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

The npm package includes the skill file. Print its path with:

```bash
posterforge skill-path
```

For quick one-off cards, the runtime can also call the CLI without writing a JSON file first:

```bash
posterforge render --style signal --title "Service Health" --summary "Errors are down." --item "Impact: One route was affected." --item "Action: Keep fallback enabled." --out output.png
```

For common scenarios, start from a preset:

```bash
posterforge render --preset alert-brief --out output.png
posterforge preset incident-review --out incident.json
```

For source-based usage:

```bash
git clone https://github.com/sumingcheng/posterforge-skill.git
cd posterforge-skill
pnpm install
pnpm build
node ./bin/posterforge.mjs render ./examples/alert.json --out ./dist/alert.png
```

## OpenClaw Install Or Upgrade

If the runtime previously used a local checkout or an older package name, uninstall it first so the CLI does not keep pointing at a stale symlink:

```bash
npm uninstall -g posterforge posterforge-skill
npm install -g posterforge@latest
```

Then copy the bundled skill into the OpenClaw workspace:

```bash
mkdir -p ~/.openclaw/workspace/skills/posterforge
cp "$(posterforge skill-path)" ~/.openclaw/workspace/skills/posterforge/SKILL.md
```

Restart the gateway or agent runtime if it caches skill files at startup.

## Recommended Agent Flow

1. Read the source material.
2. Choose a scenario preset when the intent is clear.
3. Replace the preset starter text with the user's facts.
4. Choose or override the visual style by intent.
5. Check the style budget in `docs/TEXT_BUDGETS.md`.
6. Render the PNG.
7. Inspect the image.
8. If text is crowded or clipped, rewrite shorter and render again.

Agents should not announce that they are using the skill. They should simply return the generated image.

The renderer has an automatic text-fit guard for constrained poster text blocks, but agents should still keep the input concise. If a card looks crowded, shorten the spec instead of relying on the guard to rescue long content.

## Style Selection

- Alert or incident: `ledger`, `audit`, `terminal`, `noir`, `dossier`.
- Ranking or battle report: `arena`, `podium`, `sprint`, `matrix`, `heat`.
- Weekly update or KPI brief: `signal`, `editorial`, `atlas`, `prism`, `mercury`.
- Strong visual announcement: `bulletin`, `delta`, `pulse`, `compass`.

## Preset Selection

- Alert triage or root cause: `alert-brief`.
- Incident or postmortem snapshot: `incident-review`.
- Weekly update: `weekly-report`.
- Release or launch note: `launch-notes`.
- Decision or trade-off memo: `decision-memo`.
- Experiment or KPI result: `experiment-result`.
- Ranking or battle report: `ranking-report`.
- User feedback synthesis: `product-feedback`.
- Daily status update: `daily-digest`.
- Quote or principle card: `quote-card`.

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
