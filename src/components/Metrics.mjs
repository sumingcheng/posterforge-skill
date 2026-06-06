import { html } from '../ui/html.mjs';
import { getTheme } from '../themes/index.mjs';

export function MetricTable({ spec }) {
  const theme = getTheme(spec.theme);
  const metrics = spec.metrics.slice(0, 3);
  if (!metrics.length) return null;

  return html`
    <section className="mt-9 grid border-y border-paper-300" style=${{ gridTemplateColumns: `repeat(${metrics.length}, minmax(0, 1fr))` }}>
      ${metrics.map((metric, index) => {
        const color = index === 0 ? theme.accent : index === 1 ? theme.secondary : 'text-ink-900';
        return html`
          <div key=${`${metric.label}-${index}`} className="min-h-[164px] border-r border-paper-300 px-7 py-6 last:border-r-0">
            <div className=${`${color} truncate text-[52px] font-black leading-none`}>${metric.value}</div>
            <div className="mt-5 text-[24px] font-black leading-tight text-ink-900">${metric.label}</div>
            ${metric.note && html`<div className="mt-2 text-[20px] font-bold leading-tight text-ink-500">${metric.note}</div>`}
          </div>
        `;
      })}
    </section>
  `;
}
