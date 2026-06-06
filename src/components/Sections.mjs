import { html } from '../ui/html.mjs';
import { getTheme } from '../themes/index.mjs';

export function SectionList({ spec }) {
  const theme = getTheme(spec.theme);
  if (!spec.sections.length) return null;

  return html`
    <section className="mt-9 grid border-t border-paper-300">
      ${spec.sections.map((section, sectionIndex) => html`
        <div key=${`${section.title}-${sectionIndex}`} className="grid grid-cols-[168px_1fr] gap-7 border-b border-paper-300 py-6">
          <h2 className="m-0 text-[24px] font-black leading-tight text-ink-900">
            <span className=${`mb-4 block h-[5px] w-8 ${theme.secondaryBg}`} />
            ${section.title}
          </h2>
          <ol className="m-0 grid list-none gap-3 p-0">
            ${section.items.map((item, index) => html`
              <li key=${`${section.title}-${index}`} className="grid grid-cols-[42px_1fr] gap-4 text-[27px] font-bold leading-[1.33] text-ink-900">
                <span className=${`${theme.secondary} font-mono text-[21px] font-black`}>
                  ${index + 1}<span className="ml-1 text-paper-300">/</span>
                </span>
                <span>${item}</span>
              </li>
            `)}
          </ol>
        </div>
      `)}
    </section>
  `;
}
