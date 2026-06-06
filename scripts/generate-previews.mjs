#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { listTemplates } from '../src/templates/registry.mjs';
import { buildPresetSpec, listPresets } from '../src/presets/catalog.mjs';

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SPEC_DIR = join(ROOT_DIR, '.cache', 'preview-specs');
const HTML_DIR = join(ROOT_DIR, '.cache', 'preview-html');
const OUT_DIR = join(ROOT_DIR, 'docs', 'previews');
const PRESET_OUT_DIR = join(ROOT_DIR, 'docs', 'preset-previews');

function titleCase(value) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

function buildSpec(template) {
  const name = template.name || titleCase(template.styleName);
  return {
    style: template.styleName,
    title: `${name} Brief`,
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae lorem at ipsum facilisis gravida.',
    content: [
      {
        title: 'Signal',
        text: 'Vestibulum id ligula porta felis euismod semper.'
      },
      {
        title: 'Motion',
        text: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
      },
      {
        title: 'Focus',
        text: 'Donec ullamcorper nulla non metus auctor fringilla.'
      },
      {
        title: 'Result',
        text: 'Maecenas faucibus mollis interdum, vivamus sagittis lacus vel augue.'
      }
    ],
    footer: 'PosterForge Skill'
  };
}

function renderPreview(template) {
  const specPath = join(SPEC_DIR, `${template.styleName}.json`);
  const htmlPath = join(HTML_DIR, `${template.styleName}.html`);
  const outPath = join(OUT_DIR, `${template.styleName}.png`);

  writeFileSync(specPath, `${JSON.stringify(buildSpec(template), null, 2)}\n`);

  const result = spawnSync(process.execPath, [
    join(ROOT_DIR, 'bin', 'posterforge.mjs'),
    'render',
    specPath,
    '--out',
    outPath,
    '--html',
    htmlPath,
    '--scale',
    '1'
  ], {
    cwd: ROOT_DIR,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });

  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout || '');
    throw new Error(`Failed to render ${template.styleName}`);
  }

  process.stdout.write(`${template.styleName}\t${outPath}\n`);
}

function renderPresetPreview(preset) {
  const specPath = join(SPEC_DIR, `preset-${preset.id}.json`);
  const htmlPath = join(HTML_DIR, `preset-${preset.id}.html`);
  const outPath = join(PRESET_OUT_DIR, `${preset.id}.png`);

  writeFileSync(specPath, `${JSON.stringify(buildPresetSpec(preset.id), null, 2)}\n`);

  const result = spawnSync(process.execPath, [
    join(ROOT_DIR, 'bin', 'posterforge.mjs'),
    'render',
    specPath,
    '--out',
    outPath,
    '--html',
    htmlPath,
    '--scale',
    '1'
  ], {
    cwd: ROOT_DIR,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });

  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout || '');
    throw new Error(`Failed to render preset ${preset.id}`);
  }

  process.stdout.write(`preset:${preset.id}\t${outPath}\n`);
}

mkdirSync(SPEC_DIR, { recursive: true });
mkdirSync(HTML_DIR, { recursive: true });
mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(PRESET_OUT_DIR, { recursive: true });

for (const template of listTemplates()) {
  renderPreview(template);
}

for (const preset of listPresets()) {
  renderPresetPreview(preset);
}
