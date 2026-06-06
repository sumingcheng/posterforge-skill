# Scenario Presets

Presets are content blueprints. They are separate from visual styles:

- `preset` decides the business shape of the card.
- `style` decides the visual system.

Use presets when an agent or workflow knows the scenario but does not want to hand-craft a `CardSpec` from scratch.

## CLI

List all presets:

```bash
posterforge presets
```

Create a reusable spec:

```bash
posterforge preset incident-review --out incident.json
```

Render directly from a preset:

```bash
posterforge render --preset alert-brief --out alert.png
```

Override the visual style:

```bash
posterforge preset alert-brief --style terminal --out alert-terminal.json
```

Use a preset as a starting point and override fields:

```bash
posterforge render \
  --preset launch-notes \
  --title "Mobile Onboarding" \
  --summary "The rollout is live with fallback and active monitoring." \
  --item "Scope: First-session onboarding." \
  --item "Watch: Activation, error rate, and completion." \
  --out launch.png
```

## Built-In Presets

| Preset | Default style | Best for |
| --- | --- | --- |
| `alert-brief` | `ledger` | Alert triage, root-cause notes, on-call summaries |
| `incident-review` | `noir` | Incident reports, postmortem snapshots, executive incident updates |
| `weekly-report` | `editorial` | Weekly reviews, team updates, leadership summaries |
| `launch-notes` | `bulletin` | Launch announcements, release notes, internal notices |
| `decision-memo` | `compass` | Architecture decisions, strategy notes, product trade-offs |
| `experiment-result` | `signal` | A/B tests, KPI movement, product analysis |
| `ranking-report` | `arena` | Leaderboards, usage rankings, battle reports |
| `product-feedback` | `prism` | Survey synthesis, user feedback, support themes |
| `daily-digest` | `mercury` | Daily updates, standups, short progress notes |
| `quote-card` | `pulse` | Principles, quotes, sharp takeaways, short social posts |

## Agent Guidance

Agents should pick a preset before picking a style when the user's intent is scenario-specific.

Recommended mapping:

| User intent | Preset |
| --- | --- |
| "make an alert summary card" | `alert-brief` |
| "turn this incident into a card" | `incident-review` |
| "weekly update poster" | `weekly-report` |
| "release announcement" | `launch-notes` |
| "summarize this decision" | `decision-memo` |
| "experiment result card" | `experiment-result` |
| "ranking or battle report" | `ranking-report` |
| "summarize user feedback" | `product-feedback` |
| "daily status card" | `daily-digest` |
| "quote or principle card" | `quote-card` |

After selecting a preset, agents should replace the starter text with user facts, keep each field inside the selected style budget, render, inspect, and shorten if needed.
