const DEFAULT_STYLE = 'ledger';
const DEFAULT_THEME = 'blue-copper';

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function normalizeMetric(metric) {
  if (typeof metric === 'string') {
    return { label: 'Metric', value: metric, note: '' };
  }
  return {
    label: String(metric.label ?? ''),
    value: String(metric.value ?? ''),
    note: String(metric.note ?? '')
  };
}

function normalizeSection(section) {
  if (typeof section === 'string') {
    return { title: '要点', items: [section] };
  }
  return {
    title: String(section.title ?? '要点'),
    items: asArray(section.items).map((item) => String(item)).filter(Boolean).slice(0, 6)
  };
}

function normalizeContentItem(item, index) {
  if (typeof item === 'string') {
    return {
      title: '',
      text: String(item).trim()
    };
  }

  return {
    title: String(item.title ?? item.heading ?? item.label ?? '').trim(),
    text: String(item.text ?? item.body ?? item.content ?? item.value ?? `内容 ${index + 1}`).trim()
  };
}

function normalizeContent(value) {
  if (!value) return [];
  if (typeof value === 'string') {
    return value
      .split(/\n{2,}|\n- |\n\d+[.)、]\s*/)
      .map((item) => item.replace(/^-\s*/, '').trim())
      .filter(Boolean)
      .map((text) => ({ title: '', text }));
  }
  return asArray(value).map(normalizeContentItem).filter((item) => item.title || item.text).slice(0, 10);
}

function normalizeRankingItem(item, index) {
  if (typeof item === 'string') {
    return {
      rank: index + 1,
      label: item,
      value: 0,
      displayValue: '',
      note: '',
      delta: '',
      status: ''
    };
  }

  return {
    rank: Number(item.rank ?? index + 1),
    label: String(item.label ?? ''),
    value: Number(item.value ?? 0),
    displayValue: String(item.displayValue ?? item.value ?? ''),
    note: String(item.note ?? ''),
    delta: String(item.delta ?? ''),
    status: String(item.status ?? '')
  };
}

function normalizeRanking(ranking) {
  return {
    title: String(ranking.title ?? 'Ranking'),
    unit: String(ranking.unit ?? ''),
    mode: String(ranking.mode ?? ''),
    items: asArray(ranking.items).map(normalizeRankingItem).filter((item) => item.label).slice(0, 10)
  };
}

function metricsToContent(metrics) {
  if (!metrics.length) return [];
  return metrics.map((metric) => ({
    title: metric.label,
    text: [metric.value, metric.note].filter(Boolean).join(' · ')
  }));
}

function rankingsToContent(rankings) {
  return rankings.flatMap((ranking) => {
    return ranking.items.slice(0, 6).map((item) => ({
      title: `${item.rank}. ${item.label}`,
      text: [item.displayValue, item.note, item.delta || item.status].filter(Boolean).join(' · ')
    }));
  });
}

function sectionsToContent(sections) {
  return sections.flatMap((section) => {
    return section.items.slice(0, 5).map((item, index) => ({
      title: section.items.length === 1 ? section.title : `${section.title} ${index + 1}`,
      text: item
    }));
  });
}

function mapLegacyTemplate(template) {
  if (template === 'battle') return 'arena';
  if (template === 'battle-ranking') return 'arena';
  if (template === 'ranking') return 'arena';
  if (template === 'diagnosis') return 'ledger';
  if (template === 'operations-brief') return 'ledger';
  if (template === 'incident') return 'ledger';
  if (template === 'alert') return 'ledger';
  if (template === 'experiment') return 'signal';
  if (template === 'report') return 'signal';
  if (template === 'executive-scorecard') return 'signal';
  if (template === 'scorecard') return 'signal';
  if (template === 'brief') return 'ledger';
  return template || DEFAULT_STYLE;
}

function mapLegacyTheme(theme) {
  if (theme === 'paper-green') return 'green-copper';
  if (theme === 'warm-red') return 'red-ink';
  if (theme === 'graphite') return 'graphite';
  return theme || DEFAULT_THEME;
}

export function normalizeSpec(input) {
  const style = mapLegacyTemplate(String(input.style || input.template || DEFAULT_STYLE));
  const metrics = asArray(input.metrics).map(normalizeMetric).filter((metric) => metric.label || metric.value).slice(0, 4);
  const rankings = asArray(input.rankings).map(normalizeRanking).filter((ranking) => ranking.items.length).slice(0, 3);
  const sections = asArray(input.sections).map(normalizeSection).filter((section) => section.items.length).slice(0, 4);
  const explicitContent = normalizeContent(input.content);
  const fallbackContent = [
    ...rankingsToContent(rankings),
    ...sectionsToContent(sections),
    ...metricsToContent(metrics)
  ].slice(0, 10);

  return {
    style,
    template: style,
    theme: mapLegacyTheme(String(input.theme || DEFAULT_THEME)),
    title: String(input.title || 'Untitled Card'),
    subtitle: String(input.subtitle || ''),
    summary: String(input.summary || ''),
    content: explicitContent.length ? explicitContent : fallbackContent,
    metrics,
    rankings,
    sections,
    footer: String(input.footer || 'PosterForge Skill'),
    generatedAt: String(input.generatedAt || new Date().toISOString().slice(0, 10))
  };
}
