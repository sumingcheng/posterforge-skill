import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles.css';
import { normalizeSpec } from '../schema/card-spec.mjs';
import { getTemplate, listTemplates } from '../templates/registry.mjs';
import alertFixture from '../../examples/alert.json';
import battleFixture from '../../examples/battle-ranking.json';
import experimentFixture from '../../examples/experiment.json';

const fixtures = {
  arena: { ...battleFixture, style: 'arena', template: undefined },
  ledger: { ...alertFixture, style: 'ledger', template: undefined },
  signal: { ...experimentFixture, style: 'signal', template: undefined }
};

function fixtureForStyle(id, templates) {
  if (fixtures[id]) return fixtures[id];
  const template = templates.find((item) => item.id === id || item.styleName === id || item.aliases?.includes(id));
  if (['arena', 'podium', 'sprint', 'delta', 'matrix', 'heat'].includes(id)) return { ...battleFixture, style: id, template: undefined };
  if (template?.aliases?.some((alias) => ['alert', 'incident', 'diagnosis', 'case'].includes(alias))) {
    return { ...alertFixture, style: id, template: undefined };
  }
  if (['ledger', 'dossier', 'audit', 'terminal', 'bulletin', 'noir', 'graphite'].includes(id)) {
    return { ...alertFixture, style: id, template: undefined };
  }
  return { ...experimentFixture, style: id, template: undefined };
}

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1440;
const PREVIEW_SCALE = 0.48;

function getInitialTemplateId() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  const templateIndex = parts.indexOf('templates');
  if (templateIndex >= 0 && parts[templateIndex + 1]) return parts[templateIndex + 1];
  const styleIndex = parts.indexOf('styles');
  if (styleIndex >= 0 && parts[styleIndex + 1]) return parts[styleIndex + 1];
  return 'arena';
}

function StudioApp() {
  const initialTemplateId = getInitialTemplateId();
  const templates = listTemplates();
  const [templateId, setTemplateId] = useState(initialTemplateId);
  const [fixtureText, setFixtureText] = useState(() => JSON.stringify(fixtureForStyle(initialTemplateId, templates), null, 2));

  const parsed = useMemo(() => {
    try {
      return { spec: normalizeSpec(JSON.parse(fixtureText)), error: null };
    } catch (error) {
      return { spec: null, error: error.message };
    }
  }, [fixtureText]);

  const template = parsed.spec ? getTemplate(templateId || parsed.spec.style || parsed.spec.template) : null;
  const rendered = parsed.spec && template ? template.render({ ...parsed.spec, template: template.id }) : null;

  function selectTemplate(id) {
    setTemplateId(id);
    const fixture = fixtureForStyle(id, templates);
    setFixtureText(JSON.stringify({ ...fixture, style: id }, null, 2));
    window.history.replaceState(null, '', `/styles/${id}`);
  }

  return (
    <div className="min-h-screen bg-[#ece8df] text-ink-900">
      <aside className="studio-scroll fixed bottom-0 left-0 top-0 z-10 w-[240px] overflow-auto border-r border-paper-300 bg-paper-50 p-3">
        <div className="mb-3">
          <div className="font-mono text-[10px] font-black uppercase text-ink-500">PosterForge Skill</div>
          <h1 className="mt-1 text-lg font-black leading-tight">Template Studio</h1>
        </div>

        <div className="grid gap-1">
          {templates.map((template) => (
            <button
              key={template.id}
              className={`group min-w-0 border px-2 py-1.5 text-left transition-colors ${template.id === templateId ? 'border-ink-900 bg-ink-900 text-paper-50' : 'border-paper-300 bg-paper-100 text-ink-900 hover:border-ink-300 hover:bg-white'}`}
              onClick={() => selectTemplate(template.id)}
              title={`${template.name}: ${template.description}`}
            >
              <div className="flex min-w-0 items-baseline justify-between gap-2">
                <div className="min-w-0 truncate text-[12px] font-black leading-tight">{template.name}</div>
                <div className="shrink-0 font-mono text-[9px] font-black uppercase opacity-50">{template.styleName}</div>
              </div>
            </button>
          ))}
        </div>

        <label className="mt-3 block">
          <span className="font-mono text-[10px] font-black uppercase text-ink-500">Fixture JSON</span>
          <textarea
            className="studio-scroll mt-2 h-[360px] w-full resize-y border border-paper-300 bg-white p-2 font-mono text-[10px] leading-relaxed outline-none"
            value={fixtureText}
            onChange={(event) => setFixtureText(event.target.value)}
            spellCheck={false}
          />
        </label>

        {parsed.error && (
          <div className="mt-3 border border-signal-red bg-red-50 p-3 font-mono text-xs font-bold text-signal-red">
            {parsed.error}
          </div>
        )}
      </aside>

      <main className="studio-scroll ml-[240px] flex min-h-screen justify-center overflow-auto p-8">
        <div className="w-fit">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="font-mono text-xs font-black uppercase text-ink-500">Preview</div>
              <div className="text-lg font-black">{template?.name || 'Invalid template'}</div>
            </div>
            <div className="font-mono text-xs font-bold text-ink-500">{CARD_WIDTH}x{CARD_HEIGHT} logical · export 3x</div>
          </div>
          <div
            className="overflow-hidden bg-paper-50 shadow-2xl"
            style={{
              width: CARD_WIDTH * PREVIEW_SCALE,
              height: CARD_HEIGHT * PREVIEW_SCALE
            }}
          >
            <div
              className="origin-top-left"
              style={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                transform: `scale(${PREVIEW_SCALE})`,
                '--card-width': `${CARD_WIDTH}px`,
                '--card-height': `${CARD_HEIGHT}px`
              }}
            >
              {rendered}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<StudioApp />);
