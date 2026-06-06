import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles.css';
import { normalizeSpec } from '../schema/card-spec.mjs';
import { getTemplate } from '../templates/registry.mjs';
import { buildPresetSpec, listPresets } from '../presets/catalog.mjs';

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1440;
const PREVIEW_SCALE = 0.48;
const PRESET_GROUPS = [
  {
    id: 'operations',
    label: 'Operations',
    eyebrow: 'Templates',
    ids: ['alert-brief', 'incident-review']
  },
  {
    id: 'reports',
    label: 'Reports',
    eyebrow: 'Templates',
    ids: ['weekly-report', 'daily-digest']
  },
  {
    id: 'product',
    label: 'Product',
    eyebrow: 'Templates',
    ids: ['launch-notes', 'experiment-result', 'product-feedback']
  },
  {
    id: 'strategy',
    label: 'Strategy',
    eyebrow: 'Templates',
    ids: ['decision-memo']
  },
  {
    id: 'ranking',
    label: 'Ranking',
    eyebrow: 'Templates',
    ids: ['ranking-report']
  },
  {
    id: 'social',
    label: 'Social',
    eyebrow: 'Templates',
    ids: ['quote-card']
  }
];

function categoryForPreset(id) {
  return PRESET_GROUPS.find((group) => group.ids.includes(id))?.id || PRESET_GROUPS[0].id;
}

function getInitialPresetId() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  const presetIndex = parts.indexOf('presets');
  if (presetIndex >= 0 && parts[presetIndex + 1]) return parts[presetIndex + 1];
  return 'alert-brief';
}

function StudioApp() {
  const initialPresetId = getInitialPresetId();
  const presets = listPresets();
  const categories = PRESET_GROUPS.map((group) => ({
    ...group,
    items: group.ids
      .map((id) => presets.find((preset) => preset.id === id))
      .filter(Boolean)
  }));
  const initialPresetSpec = buildPresetSpec(initialPresetId);
  const [templateId, setTemplateId] = useState(initialPresetSpec.style);
  const [presetId, setPresetId] = useState(initialPresetId);
  const [categoryId, setCategoryId] = useState(() => categoryForPreset(initialPresetId));
  const [fixtureText, setFixtureText] = useState(() => JSON.stringify(initialPresetSpec, null, 2));

  const parsed = useMemo(() => {
    try {
      return { spec: normalizeSpec(JSON.parse(fixtureText)), error: null };
    } catch (error) {
      return { spec: null, error: error.message };
    }
  }, [fixtureText]);

  const template = parsed.spec ? getTemplate(templateId || parsed.spec.style || parsed.spec.template) : null;
  const rendered = parsed.spec && template ? template.render({ ...parsed.spec, template: template.id }) : null;
  const activeCategory = categories.find((category) => category.id === categoryId) || categories[0];

  function selectPreset(id) {
    const spec = buildPresetSpec(id);
    setPresetId(id);
    setTemplateId(spec.style);
    setFixtureText(JSON.stringify(spec, null, 2));
    window.history.replaceState(null, '', `/presets/${id}`);
  }

  function selectCategory(category) {
    setCategoryId(category.id);
    const currentPreset = category.items.some((item) => item.id === presetId);
    if (!currentPreset && category.items[0]) selectPreset(category.items[0].id);
  }

  return (
    <div className="h-screen overflow-hidden bg-[#ece8df] text-ink-900">
      <aside className="fixed bottom-0 left-0 top-0 z-20 w-[190px] border-r border-paper-300 bg-paper-50 p-4">
        <div className="mb-5">
          <div className="font-mono text-[10px] font-black uppercase text-ink-500">PosterForge Skill</div>
          <h1 className="mt-1 text-lg font-black leading-tight">Template Studio</h1>
        </div>

        <div className="grid gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`min-w-0 border px-3 py-3 text-left transition-colors ${category.id === categoryId ? 'border-ink-900 bg-ink-900 text-paper-50' : 'border-paper-300 bg-paper-100 text-ink-900 hover:border-ink-300 hover:bg-white'}`}
              onClick={() => selectCategory(category)}
              title={`${category.label}: ${category.items.length} items`}
            >
              <div className="font-mono text-[9px] font-black uppercase opacity-50">{category.eyebrow}</div>
              <div className="mt-1 flex min-w-0 items-baseline justify-between gap-2">
                <div className="min-w-0 truncate text-[14px] font-black leading-tight">{category.label}</div>
                <div className="shrink-0 font-mono text-[10px] font-black opacity-45">{category.items.length}</div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <main className="ml-[190px] flex h-screen min-w-0 flex-col overflow-hidden">
        <header className="z-10 shrink-0 border-b border-paper-300 bg-[#ece8df]/95 px-6 py-2.5 backdrop-blur">
          <div className="studio-scroll flex gap-1.5 overflow-x-auto pb-1">
            {activeCategory.items.map((item) => {
              const id = item.id;
              const isActive = id === presetId;
              return (
                <button
                  key={id}
                  className={`shrink-0 border px-2.5 py-1.5 text-left transition-colors ${isActive ? 'border-ink-900 bg-ink-900 text-paper-50' : 'border-paper-300 bg-paper-100 text-ink-900 hover:border-ink-300 hover:bg-white'}`}
                  onClick={() => selectPreset(id)}
                  title={`${item.name}: ${item.description}`}
                >
                  <div className="text-[12px] font-black leading-tight">{item.name}</div>
                  <div className="mt-0.5 font-mono text-[8px] font-black uppercase opacity-50">{item.style}</div>
                </button>
              );
            })}
          </div>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-[minmax(560px,1fr)_390px] gap-7 overflow-hidden p-7">
          <section className="studio-scroll flex min-w-0 justify-center overflow-auto">
            <div className="w-fit">
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
          </section>

          <aside className="flex min-h-0 min-w-0 flex-col overflow-hidden">
            <label className="flex min-h-0 flex-1 flex-col">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] font-black uppercase text-ink-500">Fixture JSON</span>
                <span className="shrink-0 font-mono text-[10px] font-bold text-ink-500">{CARD_WIDTH}x{CARD_HEIGHT} logical · export 3x</span>
              </div>
              <textarea
                className="mt-2 min-h-0 flex-1 resize-none border border-paper-300 bg-white p-3 font-mono text-[11px] leading-relaxed outline-none"
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
        </div>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<StudioApp />);
