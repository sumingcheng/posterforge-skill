import { html } from '../ui/html.mjs';
import { getTheme } from '../themes/index.mjs';

export function Hero({ spec, titleClass = 'text-[82px]' }) {
  return html`
    <section>
      <h1 className=${`${titleClass} max-h-[236px] overflow-hidden font-black leading-[0.98] tracking-normal text-ink-900`}>
        ${spec.title}
      </h1>
      ${spec.subtitle && html`
        <p className="mt-6 max-h-[82px] overflow-hidden text-[30px] font-bold leading-[1.35] text-ink-500">
          ${spec.subtitle}
        </p>
      `}
    </section>
  `;
}

export function Verdict({ spec }) {
  const theme = getTheme(spec.theme);
  if (!spec.summary) return null;

  return html`
    <section className=${`relative mt-9 max-h-[202px] overflow-hidden px-9 py-8 pl-[142px] ${theme.dark} ${theme.darkText}`}>
      <div className=${`absolute left-[30px] top-9 font-mono text-[18px] font-black uppercase [writing-mode:vertical-rl] ${theme.secondary}`}>
        Verdict
      </div>
      <div className="absolute bottom-8 left-[86px] top-8 w-px bg-paper-50/35" />
      <p className="m-0 text-[37px] font-extrabold leading-[1.34]">
        ${spec.summary}
      </p>
    </section>
  `;
}
