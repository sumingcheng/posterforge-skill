import { html } from '../ui/html.mjs';
import { getTheme } from '../themes/index.mjs';

export function Frame({ spec, children }) {
  const theme = getTheme(spec.theme);
  return html`
    <main className="card-grid-bg h-[var(--card-height)] w-[var(--card-width)] p-9 font-sans text-ink-900">
      <article className="relative h-full w-full overflow-hidden border border-paper-300 bg-paper-50 px-[68px] pb-[54px] pt-[58px] shadow-plate">
        <div className=${`absolute left-0 right-0 top-0 h-3 bg-gradient-to-r ${theme.bar}`} />
        <div className="absolute right-0 top-3 h-40 w-40 opacity-60 [background:linear-gradient(135deg,transparent_49%,#b86a22_50%,transparent_51%)]" />

        <header className="mb-10 flex items-center justify-between gap-6 border-b border-paper-300 pb-5">
          <div className="flex items-center gap-5 font-mono text-[19px] font-bold uppercase text-ink-500">
            <span className=${`block h-3 w-3 ${theme.secondaryBg}`} />
            <span>Mobile Intelligence Brief</span>
          </div>
          <div className="font-mono text-[19px] font-black uppercase text-ink-900">
            ${spec.template} / ${spec.generatedAt}
          </div>
        </header>

        ${children}

        <footer className="absolute bottom-[42px] left-[68px] right-[68px] flex justify-between gap-5 border-t border-paper-300 pt-5 font-mono text-[20px] font-bold text-ink-500">
          <span className="min-w-0 truncate">${spec.footer}</span>
          <span>${spec.generatedAt}</span>
        </footer>
      </article>
    </main>
  `;
}
