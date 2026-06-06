import { html } from '../ui/html.mjs';

function cleanItems(spec, limit = 6) {
  const items = spec.content?.length ? spec.content : [];
  return items.slice(0, limit).map((item, index) => ({
    title: item.title || String(index + 1).padStart(2, '0'),
    text: item.text || ''
  }));
}

function renderPlainItems(spec, options = {}) {
  const items = cleanItems(spec, options.limit || 5);
  const titleClass = options.titleClass || 'font-mono text-[17px] font-black uppercase opacity-55';
  const textClass = options.textClass || 'mt-2 text-[25px] font-bold leading-[1.32]';
  const rowClass = options.rowClass || 'border-t border-current/20 py-5';

  return html`
    <div className=${options.className || ''}>
      ${items.map((item, index) => html`
        <div key=${`${item.title}-${index}`} className=${rowClass}>
          <div className=${titleClass}>${item.title}</div>
          <div className=${textClass}>${item.text}</div>
        </div>
      `)}
    </div>
  `;
}

function renderNumberedItems(spec, options = {}) {
  const items = cleanItems(spec, options.limit || 5);
  return html`
    <div className=${options.className || 'grid gap-4'}>
      ${items.map((item, index) => html`
        <div key=${`${item.title}-${index}`} className=${options.rowClass || 'grid grid-cols-[72px_1fr] gap-5 border-t border-current/20 pt-5'}>
          <div className=${options.numberClass || 'font-mono text-[30px] font-black opacity-45'}>${String(index + 1).padStart(2, '0')}</div>
          <div>
            ${item.title && html`<div className=${options.titleClass || 'text-[24px] font-black leading-tight'}>${item.title}</div>`}
            <div className=${options.textClass || 'mt-2 text-[25px] font-bold leading-[1.32]'}>${item.text}</div>
          </div>
        </div>
      `)}
    </div>
  `;
}

function footer(spec, className = '') {
  return html`<footer className=${className || 'absolute bottom-10 left-12 right-12 flex justify-between border-t border-current/20 pt-5 font-mono text-[16px] font-black uppercase opacity-55'}><span>${spec.footer}</span><span>${spec.generatedAt}</span></footer>`;
}

function renderArena(spec) {
  return html`
    <main className="h-[var(--card-height)] w-[var(--card-width)] bg-[#070707] p-10 font-sans text-[#f4efe3]">
      <article className="relative h-full overflow-hidden border border-[#34302a] p-12">
        <header className="max-w-[830px]">
          <div className="font-mono text-[18px] font-black uppercase text-[#ffb000]">Arena</div>
          <h1 className="mt-7 max-h-[260px] overflow-hidden text-[98px] font-black leading-[0.9]">${spec.title}</h1>
          <p className="mt-8 max-h-[150px] overflow-hidden text-[38px] font-black leading-[1.18] text-[#ffb000]">${spec.summary}</p>
        </header>
        <section className="absolute bottom-[120px] left-12 right-12 grid grid-cols-2 gap-8">
          ${cleanItems(spec, 4).map((item, index) => html`
            <div key=${`${item.title}-${index}`} className="border-t border-[#686055] pt-5">
              <div className="font-mono text-[18px] font-black uppercase text-[#ffb000]">${item.title}</div>
              <div className="mt-3 text-[27px] font-bold leading-[1.25]">${item.text}</div>
            </div>
          `)}
        </section>
        ${footer(spec)}
      </article>
    </main>
  `;
}

function renderPodium(spec) {
  const items = cleanItems(spec, 3);
  return html`
    <main className="h-[var(--card-height)] w-[var(--card-width)] bg-[#161513] p-8 font-sans text-[#14130f]">
      <article className="relative h-full overflow-hidden bg-[#f4ead8]">
        <div className="absolute inset-0 opacity-15" style=${{ backgroundImage: 'repeating-linear-gradient(135deg,#14130f 0,#14130f 2px,transparent 2px,transparent 44px)' }} />
        <header className="absolute left-10 right-10 top-10 h-[352px] overflow-hidden bg-[#14130f] p-10 text-[#f4ead8]">
          <div className="font-mono text-[16px] font-black uppercase text-[#ffcf2f]">Josef Muller-Brockmann inspired / ranked field</div>
          <h1 className="mt-8 max-h-[205px] max-w-[660px] overflow-hidden text-[92px] font-black uppercase leading-[0.84]">${spec.title}</h1>
          <div className="absolute right-9 top-8 font-mono text-[160px] font-black leading-none text-[#ffcf2f]">${String(items.length).padStart(2, '0')}</div>
        </header>

        <p className="absolute left-10 right-10 top-[430px] max-h-[142px] overflow-hidden bg-[#ffcf2f] p-7 text-[34px] font-black leading-[1.18]">${spec.summary}</p>

        <section className="absolute bottom-[108px] left-10 right-10 top-[610px] grid grid-cols-2 grid-rows-[300px_1fr] gap-5">
          ${items.map((item, index) => html`
            <div key=${`${item.title}-${index}`} className=${`${index === 0 ? 'col-span-2 grid grid-cols-[190px_1fr] bg-[#f4ead8] text-[#14130f]' : index === 1 ? 'bg-[#d92f24] text-[#f4ead8]' : 'bg-[#14130f] text-[#f4ead8]'} overflow-hidden border-[6px] border-[#14130f] p-7`}>
              <div className=${`${index === 0 ? 'text-[150px]' : 'text-[82px]'} font-mono font-black leading-none text-[#ffcf2f]`}>0${index + 1}</div>
              <div className=${index === 0 ? 'pt-4' : 'mt-5'}>
                <div className=${`${index === 0 ? 'text-[32px]' : 'text-[28px]'} font-black uppercase leading-tight`}>${item.title}</div>
                <div className=${`${index === 0 ? 'max-w-[650px] text-[28px]' : 'text-[22px]'} mt-4 font-bold leading-[1.16]`}>${item.text}</div>
              </div>
            </div>
          `)}
        </section>
        ${footer(spec, 'absolute bottom-8 left-10 right-10 flex justify-between border-t-[6px] border-[#14130f] pt-4 font-mono text-[15px] font-black uppercase text-[#5f584d]')}
      </article>
    </main>
  `;
}

function renderSprint(spec) {
  const items = cleanItems(spec, 4);
  return html`
    <main className="h-[var(--card-height)] w-[var(--card-width)] bg-[#e9ecdf] p-8 font-sans text-[#101820]">
      <article className="relative h-full overflow-hidden bg-[#f8f7ed]">
        <div className="absolute -right-[130px] top-[-40px] h-[1520px] w-[260px] rotate-[10deg] bg-[#ff4a00]" />
        <div className="absolute -right-[38px] top-[78px] h-[1200px] w-[28px] rotate-[10deg] bg-[#101820]" />
        <header className="relative px-12 pt-12">
          <div className="font-mono text-[16px] font-black uppercase text-[#ff4a00]">Otl Aicher inspired / sprint lanes</div>
          <h1 className="mt-8 max-h-[210px] max-w-[730px] overflow-hidden text-[92px] font-black uppercase leading-[0.84]">${spec.title}</h1>
          <p className="mt-8 max-h-[118px] max-w-[700px] overflow-hidden text-[33px] font-black leading-[1.18]">${spec.summary}</p>
        </header>

        <section className="absolute bottom-[115px] left-12 right-[126px] top-[500px] grid grid-rows-4 gap-5">
          ${items.map((item, index) => html`
            <div key=${`${item.title}-${index}`} className="relative overflow-hidden bg-[#101820] text-[#f8f7ed]">
              <div className="absolute left-0 top-0 h-full w-[116px] bg-[#ff4a00]" style=${{ clipPath: 'polygon(0 0,78% 0,100% 100%,0 100%)' }} />
              <div className="relative grid h-full grid-cols-[128px_1fr] gap-4 p-5">
                <div className="font-mono text-[42px] font-black leading-none">0${index + 1}</div>
                <div>
                  <div className="font-mono text-[15px] font-black uppercase text-[#ffb199]">${item.title}</div>
                  <div className="mt-2 max-h-[80px] overflow-hidden text-[25px] font-black leading-[1.18]">${item.text}</div>
                </div>
              </div>
            </div>
          `)}
        </section>
        ${footer(spec, 'absolute bottom-8 left-12 right-[126px] flex justify-between border-t-[6px] border-[#101820] pt-4 font-mono text-[15px] font-black uppercase')}
      </article>
    </main>
  `;
}

function renderDelta(spec) {
  const items = cleanItems(spec, 4);
  return html`
    <main className="h-[var(--card-height)] w-[var(--card-width)] bg-[#0f0e0c] p-8 font-sans text-[#12100d]">
      <article className="relative h-full overflow-hidden bg-[#f2eadc]">
        <div className="absolute inset-y-0 right-0 w-[58%] bg-[#df2f25]" style=${{ clipPath: 'polygon(34% 0,100% 0,100% 100%,0 100%)' }} />
        <div className="absolute right-[-26px] top-[118px] font-mono text-[520px] font-black leading-none text-[#f2eadc] opacity-20">Δ</div>
        <header className="relative px-12 pt-12">
          <div className="font-mono text-[16px] font-black uppercase text-[#df2f25]">Paula Scher inspired / delta shift</div>
          <h1 className="mt-10 max-h-[248px] max-w-[610px] overflow-hidden text-[108px] font-black uppercase leading-[0.78]">${spec.title}</h1>
          <p className="mt-8 max-h-[154px] max-w-[650px] overflow-hidden bg-[#12100d] p-6 text-[31px] font-black leading-[1.18] text-[#f2eadc]">${spec.summary}</p>
        </header>

        <section className="absolute bottom-[104px] left-12 right-12 grid gap-4">
          ${items.map((item, index) => html`
            <div key=${`${item.title}-${index}`} className=${`${index % 2 === 0 ? 'bg-[#f2eadc] text-[#12100d]' : 'bg-[#12100d] text-[#f2eadc]'} grid grid-cols-[118px_1fr] gap-5 border-[5px] border-[#12100d] p-5`} style=${{ marginLeft: `${index * 58}px`, marginRight: `${(3 - index) * 42}px` }}>
              <div className="font-mono text-[52px] font-black leading-none text-[#df2f25]">0${index + 1}</div>
              <div>
                <div className="font-mono text-[15px] font-black uppercase text-[#df2f25]">${item.title}</div>
                <div className="mt-2 max-h-[82px] overflow-hidden text-[24px] font-black leading-[1.2]">${item.text}</div>
              </div>
            </div>
          `)}
        </section>
        ${footer(spec, 'absolute bottom-8 left-12 right-12 flex justify-between border-t-[5px] border-[#12100d] pt-4 font-mono text-[15px] font-black uppercase text-[#524b42]')}
      </article>
    </main>
  `;
}

function renderMatrix(spec) {
  const items = cleanItems(spec, 4);
  return html`
    <main className="h-[var(--card-height)] w-[var(--card-width)] bg-[#101820] p-8 font-sans text-[#101820]">
      <article className="relative h-full overflow-hidden bg-[#e8efff] p-10">
        <div className="absolute inset-10 opacity-35" style=${{ backgroundImage: 'linear-gradient(90deg,#1d4dff 1px,transparent 1px),linear-gradient(0deg,#1d4dff 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        <header className="relative grid grid-cols-[210px_1fr] gap-8 border-b-[10px] border-[#101820] pb-8">
          <div className="pl-4 font-mono text-[16px] font-black uppercase text-[#1d4dff]">Wim Crouwel inspired<br />modular matrix</div>
          <div>
            <h1 className="max-h-[205px] overflow-hidden text-[96px] font-black uppercase leading-[0.84]">${spec.title}</h1>
            <p className="mt-7 max-h-[154px] overflow-hidden bg-[#101820] p-6 text-[29px] font-black leading-[1.16] text-[#e8efff]">${spec.summary}</p>
          </div>
        </header>

        <section className="relative mt-10 grid grid-cols-2 gap-5">
          ${items.map((item, index) => html`
            <div key=${`${item.title}-${index}`} className=${`${index === 1 ? 'bg-[#1d4dff] text-[#e8efff]' : index === 2 ? 'bg-[#ff3b2f] text-[#101820]' : 'bg-[#e8efff] text-[#101820]'} min-h-[258px] border-[8px] border-[#101820] p-6`}>
              <div className="flex justify-between font-mono text-[18px] font-black uppercase">
                <span>${String.fromCharCode(65 + index)}${index + 1}</span>
                <span>${item.title}</span>
              </div>
              <div className="mt-12 max-h-[126px] overflow-hidden text-[27px] font-black leading-[1.18]">${item.text}</div>
            </div>
          `)}
        </section>
        ${footer(spec, 'absolute bottom-8 left-10 right-10 flex justify-between border-t-[10px] border-[#101820] pt-4 font-mono text-[15px] font-black uppercase text-[#42506d]')}
      </article>
    </main>
  `;
}

function renderHeat(spec) {
  const items = cleanItems(spec, 5);
  const positions = [
    'left-10 top-[610px] w-[470px] rotate-[-2deg]',
    'right-10 top-[670px] w-[450px] rotate-[2deg]',
    'left-[150px] top-[850px] w-[470px] rotate-[1deg]',
    'right-[64px] top-[990px] w-[390px] rotate-[-1deg]',
    'left-10 top-[1110px] w-[440px] rotate-[2deg]'
  ];
  return html`
    <main className="h-[var(--card-height)] w-[var(--card-width)] bg-[#ff4b00] p-8 font-sans text-[#0c0908]">
      <article className="relative h-full overflow-hidden bg-[#ff4b00]">
        <div className="absolute -right-10 top-[110px] font-sans text-[230px] font-black uppercase leading-none text-[#0c0908] opacity-10">HEAT</div>
        <div className="absolute -left-8 top-[360px] font-sans text-[210px] font-black uppercase leading-none text-[#0c0908] opacity-10">HEAT</div>
        <section className="relative px-10 pt-10">
          <div className="font-mono text-[16px] font-black uppercase">David Carson inspired / expressive type</div>
          <h1 className="mt-8 max-h-[230px] max-w-[760px] overflow-hidden bg-[#0c0908] px-6 py-5 text-[96px] font-black uppercase leading-[0.82] text-[#fff8eb]">${spec.title}</h1>
          <p className="mt-8 max-h-[170px] max-w-[720px] overflow-hidden border-y-[10px] border-[#0c0908] py-5 text-[34px] font-black leading-[1.12]">${spec.summary}</p>
        </section>

        <section className="absolute inset-0">
          ${items.map((item, index) => html`
            <div key=${`${item.title}-${index}`} className=${`${positions[index]} absolute bg-[#fff8eb] p-5 shadow-[10px_10px_0_#0c0908]`}>
              <div className="font-mono text-[15px] font-black uppercase text-[#ff4b00]">${item.title}</div>
              <div className="mt-2 text-[24px] font-black leading-[1.18]">${item.text}</div>
            </div>
          `)}
        </section>
        ${footer(spec, 'absolute bottom-8 left-10 right-10 flex justify-between border-t-[8px] border-[#0c0908] pt-4 font-mono text-[15px] font-black uppercase')}
      </article>
    </main>
  `;
}

function renderLedger(spec) {
  return html`
    <main className="h-[var(--card-height)] w-[var(--card-width)] bg-[#e7e1d3] p-10 font-sans text-[#201b17]">
      <article className="relative grid h-full grid-cols-[170px_1fr] overflow-hidden border border-[#b9ad96] bg-[#fbf7ed]">
        <aside className="border-r border-[#b9ad96] px-7 py-9">
          <div className="font-mono text-[15px] font-black uppercase text-[#7b2e21]">Ledger</div>
          <div className="mt-12 [writing-mode:vertical-rl] font-mono text-[38px] font-black uppercase">Record</div>
        </aside>
        <section className="relative p-10">
          <header className="border-b border-[#b9ad96] pb-7">
            <div className="font-mono text-[16px] font-black uppercase text-[#716757]">${spec.generatedAt}</div>
            <h1 className="mt-7 max-h-[180px] overflow-hidden text-[76px] font-black leading-[0.98]">${spec.title}</h1>
            <p className="mt-5 max-h-[118px] overflow-hidden text-[32px] font-black leading-[1.26] text-[#7b2e21]">${spec.summary}</p>
          </header>
          ${renderPlainItems(spec, {
            className: 'mt-7',
            rowClass: 'grid grid-cols-[148px_1fr] gap-7 border-b border-[#b9ad96] py-5',
            titleClass: 'font-mono text-[18px] font-black uppercase text-[#7b2e21]',
            textClass: 'text-[25px] font-bold leading-[1.32]'
          })}
          ${footer(spec, 'absolute bottom-8 left-10 right-10 flex justify-between border-t border-[#b9ad96] pt-4 font-mono text-[16px] font-black uppercase text-[#716757]')}
        </section>
      </article>
    </main>
  `;
}

function renderDossier(spec) {
  return html`
    <main className="h-[var(--card-height)] w-[var(--card-width)] bg-[#ece5d7] p-8 font-serif text-[#171411]">
      <article className="relative grid h-full grid-cols-[1fr_34px_1fr] overflow-hidden bg-[#fbf8ef] shadow-[0_22px_70px_rgba(23,20,17,0.16)]">
        <section className="relative p-12">
          <div className="font-sans text-[15px] font-black uppercase text-[#8b2f1d]">Irma Boom inspired / book object</div>
          <h1 className="mt-20 max-h-[390px] overflow-hidden text-[92px] font-black leading-[0.86]">${spec.title}</h1>
          <p className="absolute bottom-20 left-12 right-12 max-h-[230px] overflow-hidden border-t border-[#171411] pt-7 text-[34px] font-black leading-[1.18]">${spec.summary}</p>
        </section>
        <div className="bg-[#171411]" />
        <section className="relative p-12 font-sans">
          <div className="flex justify-between font-mono text-[15px] font-black uppercase text-[#8b2f1d]">
            <span>Dossier</span>
            <span>${spec.generatedAt}</span>
          </div>
          <div className="mt-20 grid gap-6">
            ${cleanItems(spec, 4).map((item, index) => html`
              <div key=${`${item.title}-${index}`} className="grid grid-cols-[68px_1fr] gap-5 border-b border-[#b9ad96] pb-5">
                <div className="font-mono text-[22px] font-black text-[#8b2f1d]">${String(index + 1).padStart(2, '0')}</div>
                <div>
                  <div className="text-[25px] font-black leading-tight">${item.title}</div>
                  <div className="mt-2 text-[23px] font-bold leading-[1.3]">${item.text}</div>
                </div>
              </div>
            `)}
          </div>
          <footer className="absolute bottom-10 left-12 right-12 flex justify-between border-t border-[#171411] pt-5 font-mono text-[15px] font-black uppercase text-[#70675b]">
            <span>${spec.footer}</span>
            <span>folio</span>
          </footer>
        </section>
      </article>
    </main>
  `;
}

function renderAudit(spec) {
  return html`
    <main className="h-[var(--card-height)] w-[var(--card-width)] bg-[#f1f4f2] p-10 font-sans text-[#101815]">
      <article className="relative h-full overflow-hidden border-2 border-[#101815] bg-white p-10">
        <header className="border-b-2 border-[#101815] pb-8">
          <div className="font-mono text-[17px] font-black uppercase text-[#52796f]">Audit</div>
          <h1 className="mt-5 max-h-[190px] overflow-hidden text-[76px] font-black leading-[0.96]">${spec.title}</h1>
          <p className="mt-6 max-h-[112px] overflow-hidden text-[32px] font-black leading-[1.22] text-[#52796f]">${spec.summary}</p>
        </header>
        <section className="mt-8">
          ${cleanItems(spec, 6).map((item, index) => html`
            <div key=${`${item.title}-${index}`} className="grid grid-cols-[52px_190px_1fr] gap-5 border-b-2 border-[#dbe2df] py-5">
              <div className="h-8 w-8 border-2 border-[#101815]" />
              <div className="font-mono text-[17px] font-black uppercase text-[#52796f]">${item.title}</div>
              <div className="text-[25px] font-bold leading-[1.3]">${item.text}</div>
            </div>
          `)}
        </section>
        ${footer(spec, 'absolute bottom-10 left-10 right-10 flex justify-between font-mono text-[16px] font-black uppercase text-[#6d7773]')}
      </article>
    </main>
  `;
}

function renderTerminal(spec) {
  const items = cleanItems(spec, 4);
  return html`
    <main className="h-[var(--card-height)] w-[var(--card-width)] bg-[#050607] p-8 font-mono text-[#dfffe9]">
      <article className="relative h-full overflow-hidden bg-[#07100b]">
        <div className="flex h-[58px] items-center justify-between bg-[#b7ff4a] px-8 text-[15px] font-black uppercase text-[#07100b]">
          <span>terminal.session</span>
          <span>${spec.generatedAt}</span>
        </div>
        <div className="absolute bottom-0 left-0 top-[58px] w-[214px] border-r border-[#2cff7a]/50 bg-[#051009] px-7 py-8">
          <div className="text-[14px] font-black uppercase text-[#b7ff4a]">cmd stack</div>
          <div className="mt-10 grid gap-7">
            ${items.map((item, index) => html`
              <div key=${`${item.title}-${index}`} className="text-[15px] font-black uppercase text-[#54ff8f]">
                <div>run 0${index + 1}</div>
                <div className="mt-1 text-[#dfffe9]/55">${item.title}</div>
              </div>
            `)}
          </div>
        </div>
        <header className="ml-[214px] px-10 pt-10">
          <div className="text-[16px] font-black uppercase text-[#54ff8f]">$ posterforge --style terminal --trace</div>
          <h1 className="mt-7 max-h-[178px] overflow-hidden font-sans text-[82px] font-black leading-[0.9] text-white">${spec.title}</h1>
          <p className="mt-7 max-h-[126px] overflow-hidden border-l-[10px] border-[#b7ff4a] pl-5 font-sans text-[31px] font-black leading-[1.18] text-[#b7ff4a]">${spec.summary}</p>
        </header>
        <section className="absolute bottom-[92px] left-[254px] right-10 top-[470px] grid gap-4">
          ${items.map((item, index) => html`
            <div key=${`${item.title}-${index}`} className="border-t border-[#2cff7a]/45 pt-4">
              <div className="text-[15px] font-black uppercase text-[#54ff8f]">stdout.${String(index + 1).padStart(2, '0')} / ${item.title}</div>
              <div className="mt-2 max-h-[72px] overflow-hidden font-sans text-[24px] font-bold leading-[1.22] text-[#ecfff0]">${item.text}</div>
            </div>
          `)}
        </section>
        ${footer(spec, 'absolute bottom-8 left-[254px] right-10 flex justify-between border-t border-[#2cff7a]/45 pt-4 text-[15px] font-black uppercase text-[#7dffad]')}
      </article>
    </main>
  `;
}

function renderBulletin(spec) {
  const items = cleanItems(spec, 4);
  return html`
    <main className="h-[var(--card-height)] w-[var(--card-width)] bg-[#111] p-8 font-sans text-[#111]">
      <article className="relative h-full overflow-hidden bg-[#ffd92f]">
        <div className="absolute bottom-0 right-0 top-0 w-[158px] bg-[#111]" />
        <div className="absolute right-[42px] top-12 [writing-mode:vertical-rl] font-mono text-[38px] font-black uppercase text-[#ffd92f]">public bulletin</div>
        <header className="absolute left-10 right-[196px] top-10 border-b-[14px] border-[#111] pb-8">
          <div className="font-mono text-[17px] font-black uppercase">Anthony Burrill inspired / public notice</div>
          <h1 className="mt-8 max-h-[255px] overflow-hidden text-[104px] font-black uppercase leading-[0.82]">${spec.title}</h1>
        </header>
        <p className="absolute left-10 right-[196px] top-[395px] max-h-[156px] overflow-hidden bg-[#111] p-6 text-[30px] font-black leading-[1.16] text-[#ffd92f]">${spec.summary}</p>
        <section className="absolute bottom-[104px] left-10 right-[196px] top-[570px] grid gap-4">
          ${items.map((item, index) => html`
            <div key=${`${item.title}-${index}`} className=${`${index % 2 === 0 ? 'bg-[#fff7c7]' : 'bg-[#111] text-[#ffd92f]'} grid grid-cols-[84px_1fr] gap-5 p-5`}>
              <div className="font-mono text-[34px] font-black leading-none">0${index + 1}</div>
              <div>
                <div className="font-mono text-[15px] font-black uppercase">${item.title}</div>
                <div className="mt-2 max-h-[92px] overflow-hidden text-[22px] font-black leading-[1.14]">${item.text}</div>
              </div>
            </div>
          `)}
        </section>
        ${footer(spec, 'absolute bottom-8 left-10 right-[196px] flex justify-between border-t-[8px] border-[#111] pt-4 font-mono text-[15px] font-black uppercase')}
      </article>
    </main>
  `;
}

function renderNoir(spec) {
  return html`
    <main className="h-[var(--card-height)] w-[var(--card-width)] bg-[#050505] p-10 font-sans text-[#f4ead8]">
      <article className="relative h-full overflow-hidden bg-[#111] p-12">
        <header className="max-w-[760px]">
          <div className="font-mono text-[17px] font-black uppercase text-[#d13c32]">Noir</div>
          <h1 className="mt-7 max-h-[260px] overflow-hidden text-[88px] font-black leading-[0.92]">${spec.title}</h1>
          <p className="mt-8 max-h-[126px] overflow-hidden text-[34px] font-black leading-[1.22] text-[#c8bba6]">${spec.summary}</p>
        </header>
        <section className="absolute bottom-[120px] left-12 right-12 grid gap-4">
          ${cleanItems(spec, 5).map((item, index) => html`
            <div key=${`${item.title}-${index}`} className="grid grid-cols-[145px_1fr] gap-5 border-t border-[#524536] pt-4">
              <div className="font-mono text-[17px] font-black uppercase text-[#d13c32]">${item.title}</div>
              <div className="text-[25px] font-bold leading-[1.3]">${item.text}</div>
            </div>
          `)}
        </section>
        ${footer(spec, 'absolute bottom-9 left-12 right-12 flex justify-between border-t border-[#524536] pt-4 font-mono text-[15px] font-black uppercase text-[#8c8172]')}
      </article>
    </main>
  `;
}

function renderGraphite(spec) {
  const items = cleanItems(spec, 4);
  return html`
    <main className="h-[var(--card-height)] w-[var(--card-width)] bg-[#d5d5cf] p-8 font-sans text-[#111]">
      <article className="relative h-full overflow-hidden bg-[#f3f3ee] p-10">
        <div className="absolute right-[-60px] top-[90px] font-sans text-[520px] font-black leading-none text-[#111] opacity-[0.06]">G</div>
        <header className="relative grid grid-cols-[1fr_230px] gap-8 border-b-[12px] border-[#111] pb-8">
          <div>
            <div className="font-mono text-[16px] font-black uppercase">Massimo Vignelli inspired / graphite editorial</div>
            <h1 className="mt-7 max-h-[220px] overflow-hidden text-[94px] font-black uppercase leading-[0.84]">${spec.title}</h1>
          </div>
          <div className="border-l-[12px] border-[#111] pl-7 font-mono text-[18px] font-black uppercase">
            <div>Index</div>
            <div className="mt-6 text-[64px] leading-none">${items.length}</div>
            <div className="mt-6 text-[#666]">${spec.generatedAt}</div>
          </div>
        </header>

        <section className="relative mt-8 bg-[#111] p-7 text-[#f3f3ee]">
          <div className="font-mono text-[15px] font-black uppercase text-[#a7a7a0]">summary</div>
          <p className="mt-4 max-h-[126px] overflow-hidden text-[34px] font-black leading-[1.18]">${spec.summary}</p>
        </section>

        <section className="relative mt-8 grid grid-cols-[1.1fr_0.9fr] gap-8">
          <div className="border-t-[8px] border-[#111] pt-5">
            ${items[0] && html`
              <div>
                <div className="font-mono text-[15px] font-black uppercase text-[#666]">lead / ${items[0].title}</div>
                <div className="mt-5 max-h-[245px] overflow-hidden text-[36px] font-black leading-[1.08]">${items[0].text}</div>
              </div>
            `}
          </div>
          <div className="grid gap-5">
            ${items.slice(1).map((item, index) => html`
              <div key=${`${item.title}-${index}`} className="border-t border-[#777] pt-4">
                <div className="font-mono text-[15px] font-black uppercase text-[#666]">${String(index + 2).padStart(2, '0')} / ${item.title}</div>
                <div className="mt-3 max-h-[100px] overflow-hidden text-[24px] font-bold leading-[1.22]">${item.text}</div>
              </div>
            `)}
          </div>
        </section>
        ${footer(spec, 'absolute bottom-8 left-10 right-10 flex justify-between border-t-[12px] border-[#111] pt-4 font-mono text-[15px] font-black uppercase text-[#444]')}
      </article>
    </main>
  `;
}

function renderSignal(spec) {
  const items = cleanItems(spec, 4);
  return html`
    <main className="h-[var(--card-height)] w-[var(--card-width)] bg-[#f2f2ed] p-8 font-sans text-[#101010]">
      <article className="relative h-full overflow-hidden bg-[#fdfdf8]">
        <div className="absolute left-0 top-0 h-full w-[320px] bg-[#101010]" />
        <div className="absolute left-[48px] top-[56px] font-sans text-[270px] font-black leading-none text-[#fdfdf8]">S</div>
        <div className="absolute left-[60px] bottom-[150px] [writing-mode:vertical-rl] font-mono text-[20px] font-black uppercase tracking-normal text-[#fdfdf8]">Signal / Identity System</div>
        <section className="ml-[320px] p-12">
          <div className="font-mono text-[16px] font-black uppercase text-[#0057ff]">Michael Bierut / Pentagram inspired</div>
          <h1 className="mt-10 max-h-[260px] overflow-hidden text-[98px] font-black leading-[0.86]">${spec.title}</h1>
          <p className="mt-8 max-h-[188px] overflow-hidden border-l-[14px] border-[#0057ff] pl-6 text-[30px] font-black leading-[1.18]">${spec.summary}</p>
          <section className="mt-10 grid gap-4">
            ${items.map((item, index) => html`
              <div key=${`${item.title}-${index}`} className="grid grid-cols-[150px_1fr] gap-6 border-t border-[#101010] pt-4">
                <div className="font-mono text-[16px] font-black uppercase text-[#0057ff]">${item.title}</div>
                <div className="text-[25px] font-bold leading-[1.26]">${item.text}</div>
              </div>
            `)}
          </section>
        </section>
        ${footer(spec, 'absolute bottom-9 left-[372px] right-12 flex justify-between border-t border-[#101010] pt-4 font-mono text-[15px] font-black uppercase text-[#6b6b63]')}
      </article>
    </main>
  `;
}

function renderPulse(spec) {
  const items = cleanItems(spec, 4);
  return html`
    <main className="h-[var(--card-height)] w-[var(--card-width)] bg-[#f8305b] p-8 font-sans text-[#1b090d]">
      <article className="relative h-full overflow-hidden bg-[#f8305b]">
        <div className="absolute left-8 top-8 right-8 border-t-[16px] border-[#1b090d]" />
        <div className="absolute bottom-8 left-8 right-8 border-b-[16px] border-[#1b090d]" />
        <header className="absolute left-16 right-16 top-[150px] text-center">
          <div className="font-mono text-[16px] font-black uppercase">Sagmeister inspired / typographic manifesto</div>
          <h1 className="mx-auto mt-12 max-h-[330px] max-w-[850px] overflow-hidden text-[118px] font-black uppercase leading-[0.78] tracking-normal">${spec.title}</h1>
          <p className="mx-auto mt-10 max-h-[136px] max-w-[760px] overflow-hidden text-[34px] font-black leading-[1.18]">${spec.summary}</p>
        </header>

        <section className="absolute bottom-[128px] left-16 right-16 grid grid-cols-4 gap-5">
          ${items.map((item, index) => html`
            <div key=${`${item.title}-${index}`} className="border-t-[8px] border-[#1b090d] pt-4">
              <div className="font-mono text-[14px] font-black uppercase">${item.title}</div>
              <div className="mt-3 text-[21px] font-black leading-[1.18]">${item.text}</div>
            </div>
          `)}
        </section>
        ${footer(spec, 'absolute bottom-12 left-16 right-16 flex justify-between font-mono text-[15px] font-black uppercase')}
      </article>
    </main>
  `;
}

function renderAtlas(spec) {
  const items = cleanItems(spec, 4);
  const markerColors = ['bg-[#2458ff]', 'bg-[#f3c400]', 'bg-[#e43d30]', 'bg-[#1e9c73]'];
  return html`
    <main className="h-[var(--card-height)] w-[var(--card-width)] bg-[#f6f1df] p-8 font-sans text-[#15120e]">
      <article className="relative h-full overflow-hidden bg-[#fbf6e6] p-12">
        <div className="absolute inset-12 opacity-25" style=${{ backgroundImage: 'linear-gradient(90deg,#15120e 1px,transparent 1px),linear-gradient(0deg,#15120e 1px,transparent 1px)', backgroundSize: '72px 72px' }} />
        <div className="absolute left-[540px] top-12 bottom-12 w-px bg-[#15120e]" />
        <div className="absolute left-12 right-12 top-[690px] h-px bg-[#15120e]" />
        <header className="relative ml-2 max-w-[760px]">
          <div className="font-mono text-[16px] font-black uppercase text-[#2458ff]">Karel Martens inspired / print coordinates</div>
          <h1 className="mt-8 max-h-[245px] overflow-hidden text-[96px] font-black leading-[0.86]">${spec.title}</h1>
          <p className="mt-9 max-h-[132px] overflow-hidden text-[34px] font-black leading-[1.18]">${spec.summary}</p>
        </header>
        <section className="relative mt-20 grid grid-cols-2 gap-x-12 gap-y-12">
          ${items.map((item, index) => html`
            <div key=${`${item.title}-${index}`} className="relative min-h-[185px] pl-12">
              <div className=${`${markerColors[index]} absolute left-0 top-1 h-8 w-8 rounded-full`} />
              <div className="font-mono text-[15px] font-black uppercase opacity-55">0${index + 1} / ${item.title}</div>
              <div className="mt-4 text-[25px] font-bold leading-[1.3]">${item.text}</div>
            </div>
          `)}
        </section>
        ${footer(spec, 'absolute bottom-10 left-12 right-12 flex justify-between border-t border-[#15120e] pt-4 font-mono text-[15px] font-black uppercase text-[#6f6654]')}
      </article>
    </main>
  `;
}

function renderPrism(spec) {
  const colors = ['border-[#ff4d6d]', 'border-[#4d96ff]', 'border-[#43aa8b]', 'border-[#ffd166]', 'border-[#11121a]'];
  return html`
    <main className="h-[var(--card-height)] w-[var(--card-width)] bg-[#f6f6fb] p-10 font-sans text-[#11121a]">
      <article className="relative h-full overflow-hidden p-10">
        <header className="grid grid-cols-[1fr_110px] gap-8">
          <div>
            <div className="font-mono text-[17px] font-black uppercase text-[#4d96ff]">Prism</div>
            <h1 className="mt-5 max-h-[220px] overflow-hidden text-[84px] font-black leading-[0.94]">${spec.title}</h1>
            <p className="mt-7 max-h-[126px] overflow-hidden text-[34px] font-black leading-[1.22]">${spec.summary}</p>
          </div>
          <div className="grid h-[360px]">
            <div className="bg-[#ff4d6d]" /><div className="bg-[#4d96ff]" /><div className="bg-[#43aa8b]" /><div className="bg-[#ffd166]" />
          </div>
        </header>
        <section className="mt-10 grid grid-cols-2 gap-5">
          ${cleanItems(spec, 6).map((item, index) => html`
            <div key=${`${item.title}-${index}`} className=${`${colors[index % colors.length]} border-t-[10px] bg-white p-5`}>
              <div className="font-mono text-[15px] font-black uppercase opacity-55">${item.title}</div>
              <div className="mt-3 text-[24px] font-bold leading-[1.3]">${item.text}</div>
            </div>
          `)}
        </section>
        ${footer(spec)}
      </article>
    </main>
  `;
}

function renderCompass(spec) {
  const items = cleanItems(spec, 4);
  const slots = [
    'left-14 top-[735px] w-[390px]',
    'right-14 top-[735px] w-[390px]',
    'left-14 bottom-[150px] w-[390px]',
    'right-14 bottom-[150px] w-[390px]'
  ];
  return html`
    <main className="h-[var(--card-height)] w-[var(--card-width)] bg-[#111316] p-8 font-sans text-[#f4f1e8]">
      <article className="relative h-full overflow-hidden bg-[#111316]">
        <div className="absolute bottom-0 left-1/2 top-[610px] z-0 w-[14px] -translate-x-1/2 bg-[#f4f1e8] opacity-30" />
        <div className="absolute left-0 top-[690px] z-0 h-[14px] w-full bg-[#f4f1e8] opacity-30" />
        <div className="absolute left-[64px] top-[70px] z-10 max-w-[420px] font-mono text-[18px] font-black uppercase leading-tight text-[#f4f1e8]">Studio Dumbar inspired / dynamic identity</div>
        <div className="absolute right-12 top-10 z-10 font-mono text-[96px] font-black leading-none text-[#ffcc19]">N</div>
        <div className="absolute left-12 top-[610px] z-10 font-mono text-[96px] font-black leading-none text-[#ef3f35]">W</div>
        <div className="absolute right-12 top-[610px] z-10 font-mono text-[96px] font-black leading-none text-[#42a5ff]">E</div>
        <div className="absolute bottom-12 left-12 z-10 font-mono text-[96px] font-black leading-none text-[#42d27d]">S</div>
        <header className="absolute left-[86px] right-[86px] top-[160px] z-10 text-center">
          <h1 className="mx-auto max-h-[260px] max-w-[780px] overflow-hidden text-[108px] font-black uppercase leading-[0.8]">${spec.title}</h1>
          <p className="mx-auto mt-9 max-h-[132px] max-w-[720px] overflow-hidden text-[34px] font-black leading-[1.16] text-[#ffcc19]">${spec.summary}</p>
        </header>
        <section>
          ${items.map((item, index) => html`
            <div key=${`${item.title}-${index}`} className=${`${slots[index]} absolute z-10 border-t-[8px] border-[#f4f1e8] pt-4`}>
              <div className="font-mono text-[15px] font-black uppercase text-[#ffcc19]">${item.title}</div>
              <div className="mt-3 text-[23px] font-bold leading-[1.24]">${item.text}</div>
            </div>
          `)}
        </section>
        ${footer(spec, 'absolute bottom-8 left-[210px] right-12 flex justify-between font-mono text-[15px] font-black uppercase text-[#9b9a92]')}
      </article>
    </main>
  `;
}

function renderMercury(spec) {
  return html`
    <main className="h-[var(--card-height)] w-[var(--card-width)] bg-[#e9eef0] p-10 font-sans text-[#101820]">
      <article className="relative mx-auto h-full max-w-[900px] overflow-hidden rounded-[36px] border-[12px] border-[#101820] bg-[#fdfefe] p-9">
        <header className="border-b border-[#cbd5e1] pb-7">
          <div className="font-mono text-[16px] font-black uppercase text-[#3366cc]">Mercury</div>
          <h1 className="mt-5 max-h-[190px] overflow-hidden text-[74px] font-black leading-[0.94]">${spec.title}</h1>
          <p className="mt-6 max-h-[118px] overflow-hidden text-[31px] font-black leading-[1.24] text-[#3366cc]">${spec.summary}</p>
        </header>
        <section className="mt-8 grid gap-4">
          ${cleanItems(spec, 5).map((item, index) => html`
            <div key=${`${item.title}-${index}`} className="rounded-[24px] bg-[#edf2f7] p-5">
              <div className="font-mono text-[15px] font-black uppercase text-[#64748b]">${item.title}</div>
              <div className="mt-2 text-[25px] font-bold leading-[1.3]">${item.text}</div>
            </div>
          `)}
        </section>
        ${footer(spec, 'absolute bottom-9 left-9 right-9 flex justify-between font-mono text-[15px] font-black uppercase text-[#64748b]')}
      </article>
    </main>
  `;
}

function renderEditorial(spec) {
  return html`
    <main className="h-[var(--card-height)] w-[var(--card-width)] bg-[#e8e1d6] p-10 font-serif text-[#17130f]">
      <article className="relative h-full overflow-hidden bg-[#fffdf7] p-12">
        <header className="border-b border-[#17130f] pb-8">
          <div className="font-sans text-[17px] font-black uppercase text-[#9a2f22]">Editorial</div>
          <h1 className="mt-6 max-h-[250px] overflow-hidden text-[88px] font-black leading-[0.94]">${spec.title}</h1>
          <p className="mt-8 max-h-[150px] overflow-hidden text-[39px] font-black leading-[1.18]">${spec.summary}</p>
        </header>
        <section className="mt-9 grid grid-cols-[1fr_260px] gap-8">
          <div>
            ${cleanItems(spec, 3).map((item, index) => html`
              <div key=${`${item.title}-${index}`} className="mb-7">
                <h2 className="font-sans text-[28px] font-black text-[#9a2f22]">${item.title}</h2>
                <p className="mt-3 max-h-[112px] overflow-hidden font-sans text-[25px] font-bold leading-[1.34]">${item.text}</p>
              </div>
            `)}
          </div>
          <aside className="border-l border-[#17130f] pl-7 font-sans">
            ${cleanItems(spec, 4).slice(3, 6).map((item) => html`
              <div key=${item.title} className="border-b border-[#17130f] py-5">
                <div className="text-[21px] font-black text-[#9a2f22]">${item.title}</div>
                <div className="mt-2 text-[21px] font-bold leading-[1.3]">${item.text}</div>
              </div>
            `)}
          </aside>
        </section>
        ${footer(spec, 'absolute bottom-10 left-12 right-12 flex justify-between border-t border-[#17130f] pt-5 font-sans text-[16px] font-black uppercase text-[#6c6258]')}
      </article>
    </main>
  `;
}

function createTemplate({ id, name, aliases, description, accepts, render }) {
  return { id, name, styleName: id, aliases, description, accepts, render };
}

export const stylePackTemplates = [
  createTemplate({ id: 'arena', name: 'Arena', aliases: ['battle', 'battle-ranking', 'ranking'], description: 'High-contrast typographic poster with a strong first read.', accepts: ['content'], render: renderArena }),
  createTemplate({ id: 'podium', name: 'Podium', aliases: ['medal', 'top3'], description: 'Swiss poster-inspired ranked field with one dominant winner block.', accepts: ['content'], render: renderPodium }),
  createTemplate({ id: 'sprint', name: 'Sprint', aliases: ['race', 'speed-rank'], description: 'Otl Aicher-inspired sprint-lane card with strong motion geometry.', accepts: ['content'], render: renderSprint }),
  createTemplate({ id: 'delta', name: 'Delta', aliases: ['lift', 'improvement'], description: 'Paula Scher-inspired delta-shift poster with a red triangular field.', accepts: ['content'], render: renderDelta }),
  createTemplate({ id: 'matrix', name: 'Matrix', aliases: ['comparison-matrix'], description: 'Wim Crouwel-inspired modular coordinate matrix.', accepts: ['content'], render: renderMatrix }),
  createTemplate({ id: 'heat', name: 'Heat', aliases: ['heatmap', 'hotlist'], description: 'David Carson-inspired expressive orange editorial poster.', accepts: ['content'], render: renderHeat }),
  createTemplate({ id: 'ledger', name: 'Ledger', aliases: ['operations-brief', 'diagnosis', 'incident', 'alert'], description: 'Quiet operational record with a clear reading order.', accepts: ['content'], render: renderLedger }),
  createTemplate({ id: 'dossier', name: 'Dossier', aliases: ['case', 'case-file'], description: 'Irma Boom-inspired book-spread card with spine and folio structure.', accepts: ['content'], render: renderDossier }),
  createTemplate({ id: 'audit', name: 'Audit', aliases: ['review', 'inspection'], description: 'Checklist-style verification card.', accepts: ['content'], render: renderAudit }),
  createTemplate({ id: 'terminal', name: 'Terminal', aliases: ['console', 'ops-terminal'], description: 'Command-stack terminal board with sidebar traces and stdout rows.', accepts: ['content'], render: renderTerminal }),
  createTemplate({ id: 'bulletin', name: 'Bulletin', aliases: ['notice', 'briefing'], description: 'Anthony Burrill-inspired public notice poster in yellow and black.', accepts: ['content'], render: renderBulletin }),
  createTemplate({ id: 'noir', name: 'Noir', aliases: ['dark-ledger'], description: 'Dark editorial card for serious concise reports.', accepts: ['content'], render: renderNoir }),
  createTemplate({ id: 'graphite', name: 'Graphite', aliases: ['mono', 'monochrome'], description: 'Massimo Vignelli-inspired monochrome editorial spread.', accepts: ['content'], render: renderGraphite }),
  createTemplate({ id: 'signal', name: 'Signal', aliases: ['executive-scorecard', 'scorecard', 'experiment', 'report'], description: 'Michael Bierut-inspired identity-system card with a large typographic mark.', accepts: ['content'], render: renderSignal }),
  createTemplate({ id: 'pulse', name: 'Pulse', aliases: ['health', 'heartbeat'], description: 'Sagmeister-inspired typographic manifesto with a single emotional field.', accepts: ['content'], render: renderPulse }),
  createTemplate({ id: 'atlas', name: 'Atlas', aliases: ['overview', 'map'], description: 'Karel Martens-inspired print-coordinate card with registration markers.', accepts: ['content'], render: renderAtlas }),
  createTemplate({ id: 'prism', name: 'Prism', aliases: ['multi-signal'], description: 'Minimal color-system card with clean content tiles.', accepts: ['content'], render: renderPrism }),
  createTemplate({ id: 'compass', name: 'Compass', aliases: ['direction', 'strategy'], description: 'Studio Dumbar-inspired dynamic quadrant identity card.', accepts: ['content'], render: renderCompass }),
  createTemplate({ id: 'mercury', name: 'Mercury', aliases: ['fast-brief'], description: 'Soft mobile-first brief for quick reading.', accepts: ['content'], render: renderMercury }),
  createTemplate({ id: 'editorial', name: 'Editorial', aliases: ['magazine', 'feature'], description: 'Magazine-like text-only report with strong title rhythm.', accepts: ['content'], render: renderEditorial })
];
