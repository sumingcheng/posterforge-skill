import { html } from '../ui/html.mjs';
import { getTheme } from '../themes/index.mjs';

function maxValue(items) {
  return Math.max(...items.map((item) => Number(item.value || 0)), 1);
}

export function RankingPodium({ spec, ranking }) {
  const theme = getTheme(spec.theme);
  const top = ranking.items.slice(0, 3);
  if (!top.length) return null;

  return html`
    <section className="mt-8 border-y border-paper-300 py-7">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="m-0 text-[28px] font-black leading-none text-ink-900">${ranking.title}</h2>
        ${ranking.unit && html`<span className="font-mono text-[18px] font-black uppercase text-ink-500">${ranking.unit}</span>`}
      </div>
      <div className="grid grid-cols-[1.1fr_0.92fr_0.82fr] items-end gap-4">
        ${top.map((item, index) => {
          const heights = ['h-[248px]', 'h-[222px]', 'h-[214px]'];
          const fill = index === 0 ? `${theme.dark} ${theme.darkText}` : 'bg-paper-100 text-ink-900';
          return html`
            <div key=${`${item.rank}-${item.label}`} className=${`flex flex-col justify-between border border-paper-300 p-5 ${heights[index]} ${fill}`}>
              <div className=${`${index === 0 ? theme.secondary : theme.accent} font-mono text-[22px] font-black`}>
                #${item.rank}
              </div>
              <div>
                <div className="line-clamp-2 text-[26px] font-black leading-[1.08]">${item.label}</div>
                ${item.note && html`<div className="mt-3 line-clamp-1 text-[17px] font-bold opacity-70">${item.note}</div>`}
              </div>
              <div className="flex items-end justify-between gap-3">
                <span className=${`${index === 0 ? theme.secondary : theme.accent} text-[42px] font-black leading-none`}>
                  ${item.displayValue}
                </span>
                ${item.delta && html`<span className="max-w-[76px] font-mono text-[14px] font-black uppercase leading-tight opacity-70">${item.delta}</span>`}
              </div>
            </div>
          `;
        })}
      </div>
    </section>
  `;
}

export function RankingBars({ spec, ranking }) {
  const theme = getTheme(spec.theme);
  const items = ranking.items.slice(0, 8);
  const max = maxValue(items);
  if (!items.length) return null;

  return html`
    <section className="mt-6">
      <div className="mb-4 flex items-end justify-between border-b border-paper-300 pb-3">
        <h2 className="m-0 text-[24px] font-black text-ink-900">${ranking.title}</h2>
        ${ranking.unit && html`<span className="font-mono text-[17px] font-bold uppercase text-ink-500">${ranking.unit}</span>`}
      </div>
      <div className="grid gap-3">
        ${items.map((item) => {
          const width = Math.max(8, Math.round((Number(item.value || 0) / max) * 100));
          return html`
            <div key=${`${item.rank}-${item.label}`} className="grid grid-cols-[44px_1fr_94px] items-center gap-4">
              <div className=${`${theme.secondary} font-mono text-[19px] font-black`}>${item.rank}</div>
              <div className="min-w-0">
                <div className="mb-2 truncate text-[22px] font-black leading-tight text-ink-900">${item.label}</div>
                <div className="h-[14px] bg-paper-200">
                  <div className=${`h-full ${theme.accentBg}`} style=${{ width: `${width}%` }} />
                </div>
              </div>
              <div className="text-right font-mono text-[20px] font-black text-ink-900">${item.displayValue}</div>
            </div>
          `;
        })}
      </div>
    </section>
  `;
}
