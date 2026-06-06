const presetCatalog = [
  {
    id: 'alert-brief',
    name: 'Alert Brief',
    style: 'ledger',
    aliases: ['alert', 'root-cause', 'ops-alert'],
    description: 'A concise alert root-cause card for operations updates.',
    useCase: 'Alert triage, root-cause notes, on-call summaries',
    spec: {
      style: 'ledger',
      title: 'Alert Brief',
      summary: 'One route started returning elevated errors. The issue is isolated and the service is stable.',
      content: [
        { title: 'Trigger', text: 'Error rate increased on a single route during the current window.' },
        { title: 'Cause', text: 'Upstream returned repeated not-found responses for one model alias.' },
        { title: 'Impact', text: 'Only requests on the affected route were impacted.' },
        { title: 'Action', text: 'Remove or down-weight the route, then keep fallback enabled.' },
        { title: 'Status', text: 'Traffic has recovered. Continue watching errors and latency.' }
      ],
      footer: 'Ops Brief'
    }
  },
  {
    id: 'incident-review',
    name: 'Incident Review',
    style: 'noir',
    aliases: ['incident', 'postmortem', 'incident-brief'],
    description: 'A serious incident summary with timeline, impact, fix, and follow-up.',
    useCase: 'Incident reports, postmortem snapshots, executive incident updates',
    spec: {
      style: 'noir',
      title: 'Incident Review',
      summary: 'The incident was mitigated after isolating the failing dependency and restoring healthy traffic.',
      content: [
        { title: 'Start', text: 'The first abnormal signal appeared during peak traffic.' },
        { title: 'Impact', text: 'A narrow user path degraded while fallback traffic remained healthy.' },
        { title: 'Fix', text: 'The unhealthy dependency was removed from rotation.' },
        { title: 'Learned', text: 'Alert labels must preserve enough context to identify the failing path.' },
        { title: 'Next', text: 'Add a runbook check and verify the fallback path in the next drill.' }
      ],
      footer: 'Incident Review'
    }
  },
  {
    id: 'weekly-report',
    name: 'Weekly Report',
    style: 'editorial',
    aliases: ['weekly', 'weekly-brief', 'team-report'],
    description: 'A narrative weekly report with progress, risks, and next steps.',
    useCase: 'Weekly reviews, team updates, leadership summaries',
    spec: {
      style: 'editorial',
      title: 'Weekly Report',
      summary: 'The team shipped the planned improvements and reduced operational risk across key flows.',
      content: [
        { title: 'Shipped', text: 'Delivered the main release items and closed the highest-priority follow-ups.' },
        { title: 'Signals', text: 'Quality metrics stayed stable after rollout, with no new severe regressions.' },
        { title: 'Risk', text: 'One dependency still needs monitoring before the next large traffic window.' },
        { title: 'Next', text: 'Complete the remaining cleanup and prepare the next experiment batch.' }
      ],
      footer: 'Weekly Brief'
    }
  },
  {
    id: 'launch-notes',
    name: 'Launch Notes',
    style: 'bulletin',
    aliases: ['launch', 'release', 'announcement'],
    description: 'A strong release or product launch card for a short announcement.',
    useCase: 'Launch announcements, release notes, internal notices',
    spec: {
      style: 'bulletin',
      title: 'Launch Notes',
      summary: 'The release is live with a focused scope, clear rollout guardrails, and active monitoring.',
      content: [
        { title: 'Scope', text: 'The launch covers the new mobile onboarding flow.' },
        { title: 'Guardrail', text: 'Rollback remains available if activation or latency regresses.' },
        { title: 'Watch', text: 'Monitor conversion, error rate, and first-session completion.' },
        { title: 'Next', text: 'Collect feedback and decide whether to expand the rollout.' }
      ],
      footer: 'Product Launch'
    }
  },
  {
    id: 'decision-memo',
    name: 'Decision Memo',
    style: 'compass',
    aliases: ['decision', 'strategy', 'memo'],
    description: 'A direction-setting card for a decision, trade-off, and next action.',
    useCase: 'Architecture decisions, strategy notes, product trade-offs',
    spec: {
      style: 'compass',
      title: 'Decision Memo',
      summary: 'Choose the path that lowers operational risk while preserving room for future iteration.',
      content: [
        { title: 'Context', text: 'The current approach works but creates repeated manual coordination.' },
        { title: 'Choice', text: 'Adopt the simpler path first and keep the advanced option reversible.' },
        { title: 'Tradeoff', text: 'The first version is less flexible but easier to operate.' },
        { title: 'Next', text: 'Ship the small version, measure usage, then revisit the broader design.' }
      ],
      footer: 'Decision Memo'
    }
  },
  {
    id: 'experiment-result',
    name: 'Experiment Result',
    style: 'signal',
    aliases: ['experiment', 'ab-test', 'kpi'],
    description: 'A clean experiment or KPI result card with outcome and interpretation.',
    useCase: 'A/B tests, KPI movement, product analysis',
    spec: {
      style: 'signal',
      title: 'Experiment Result',
      summary: 'The treatment improved the primary metric without a meaningful regression in guardrails.',
      content: [
        { title: 'Primary', text: 'Activation increased in the target cohort.' },
        { title: 'Guardrail', text: 'Latency and error rate stayed within the expected range.' },
        { title: 'Read', text: 'The result supports rollout, but the long-tail segment needs review.' },
        { title: 'Next', text: 'Expand the sample and monitor retention before full release.' }
      ],
      footer: 'Experiment Brief'
    }
  },
  {
    id: 'ranking-report',
    name: 'Ranking Report',
    style: 'arena',
    aliases: ['ranking', 'leaderboard', 'battle-report'],
    description: 'A ranking-first card for top lists, battle reports, and competitive summaries.',
    useCase: 'Leaderboards, usage rankings, battle reports',
    spec: {
      style: 'arena',
      title: 'Ranking Report',
      summary: 'The top performers are clearly separated, while the middle group remains tightly clustered.',
      content: [
        { title: 'Top 1', text: 'Mercury wins on readability and mobile density.' },
        { title: 'Top 2', text: 'Signal stays strongest for executive summaries.' },
        { title: 'Top 3', text: 'Ledger remains the safest operational brief style.' },
        { title: 'Watch', text: 'Matrix is useful when comparison detail matters more than speed.' }
      ],
      footer: 'Ranking Brief'
    }
  },
  {
    id: 'product-feedback',
    name: 'Product Feedback',
    style: 'prism',
    aliases: ['feedback', 'survey', 'user-feedback'],
    description: 'A multi-signal user feedback card for product and research summaries.',
    useCase: 'Survey synthesis, user feedback, support themes',
    spec: {
      style: 'prism',
      title: 'Product Feedback',
      summary: 'Users like the clearer flow, but repeated friction still appears around setup and recovery.',
      content: [
        { title: 'Positive', text: 'Users understood the new first step faster.' },
        { title: 'Friction', text: 'Setup failures still need clearer recovery guidance.' },
        { title: 'Pattern', text: 'New users ask for examples before they trust the workflow.' },
        { title: 'Action', text: 'Add an empty-state guide and improve failed-state copy.' },
        { title: 'Measure', text: 'Track completion, retry rate, and support contacts.' }
      ],
      footer: 'Feedback Brief'
    }
  },
  {
    id: 'daily-digest',
    name: 'Daily Digest',
    style: 'mercury',
    aliases: ['daily', 'digest', 'standup'],
    description: 'A compact daily digest for status, blockers, and next actions.',
    useCase: 'Daily updates, standups, short progress notes',
    spec: {
      style: 'mercury',
      title: 'Daily Digest',
      summary: 'The day is stable: key work moved forward, one blocker remains, and the next action is clear.',
      content: [
        { title: 'Done', text: 'Closed the main review and shipped the small fix.' },
        { title: 'Signal', text: 'No new severe alerts appeared in the latest window.' },
        { title: 'Blocker', text: 'One dependency is waiting on external confirmation.' },
        { title: 'Next', text: 'Finish validation and prepare the follow-up release note.' }
      ],
      footer: 'Daily Digest'
    }
  },
  {
    id: 'quote-card',
    name: 'Quote Card',
    style: 'pulse',
    aliases: ['quote', 'thought', 'mantra'],
    description: 'A short high-emphasis quote or principle card.',
    useCase: 'Principles, quotes, sharp takeaways, short social posts',
    spec: {
      style: 'pulse',
      title: 'Sharp Takeaway',
      summary: 'Make the important thing impossible to miss, then remove everything that competes with it.',
      content: [
        { title: 'Context', text: 'The card carries one central idea.' },
        { title: 'Rule', text: 'Shorter copy creates stronger rhythm.' },
        { title: 'Use', text: 'Best for quotes, principles, and decisive statements.' },
        { title: 'Avoid', text: 'Do not pack a full report into this format.' }
      ],
      footer: 'PosterForge'
    }
  }
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function getPreset(id) {
  return presetCatalog.find((preset) => {
    return preset.id === id || preset.aliases?.includes(id);
  }) || null;
}

export function listPresets() {
  return presetCatalog.map(({ id, name, style, aliases, description, useCase }) => ({
    id,
    name,
    style,
    aliases,
    description,
    useCase
  }));
}

export function buildPresetSpec(id) {
  const preset = getPreset(id);
  if (!preset) {
    const known = presetCatalog.map((item) => item.id).join(', ');
    throw new Error(`Unknown preset: ${id}. Available presets: ${known}`);
  }
  return clone(preset.spec);
}
