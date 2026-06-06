#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { renderCardDocument } from '../src/render/html.mjs';
import { listTemplates } from '../src/templates/registry.mjs';
import { buildPresetSpec, listPresets } from '../src/presets/catalog.mjs';

const VERSION = '0.3.2';
const DEFAULT_SCALE = 3;
const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function usage() {
  console.log(`posterforge ${readPackageVersion()}

Usage:
  posterforge render <spec.json> --out <output.png> [--html <debug.html>] [--width 1080] [--height 1440] [--scale 3]
  posterforge render --style <name> --title <text> --summary <text> --item "Title: text" --out <output.png>
  posterforge render --preset <id> --out <output.png>
  posterforge html <spec.json> --out <output.html>
  posterforge html --style <name> --title <text> --summary <text> --item "Title: text" --out <output.html>
  posterforge spec --style <name> --title <text> --summary <text> --item "Title: text" [--out <spec.json>]
  posterforge spec --preset <id> [--out <spec.json>]
  posterforge preset <id> [--style <name>] [--out <spec.json>]
  posterforge init [--style <name>] [--out <spec.json>]
  posterforge skill-path
  posterforge presets
  posterforge templates

Examples:
  posterforge render examples/alert.json --out dist/alert.png
  posterforge render --style signal --title "Service Health" --summary "Errors are down." --item "Impact: One route was affected." --item "Action: Keep fallback enabled." --out dist/card.png
  posterforge render --preset alert-brief --out dist/alert.png
  posterforge spec --style ledger --title "Alert Brief" --summary "Kong 4xx increased." --item "Cause: Upstream returned model-not-found." --out card.json
  posterforge preset incident-review --out incident.json
  posterforge skill-path
  posterforge render examples/alert.json --out dist/alert.png --scale 2
  posterforge html examples/alert.json --out dist/alert.html
  posterforge presets
  posterforge templates

Defaults:
  logical canvas: 1080x1440
  render scale:   ${DEFAULT_SCALE}x (${1080 * DEFAULT_SCALE}x${1440 * DEFAULT_SCALE} output)
`);
}

function readPackageVersion() {
  try {
    return JSON.parse(readFileSync(join(ROOT_DIR, 'package.json'), 'utf8')).version || VERSION;
  } catch {
    return VERSION;
  }
}

function splitFlag(arg) {
  const index = arg.indexOf('=');
  if (index === -1) return [arg, null];
  return [arg.slice(0, index), arg.slice(index + 1)];
}

function readFlagValue(argv, index, inlineValue, flag) {
  if (inlineValue !== null) return [inlineValue, index];
  const next = argv[index + 1];
  if (!next || next.startsWith('--')) {
    throw new Error(`${flag} requires a value.`);
  }
  return [next, index + 1];
}

function parseContentItem(value) {
  const text = String(value || '').trim();
  if (!text) return null;

  const match = text.match(/^([^:\n：]{1,48})\s*[:：]\s*(.+)$/s);
  if (!match) return { title: '', text };

  return {
    title: match[1].trim(),
    text: match[2].trim()
  };
}

function parseArgs(argv) {
  if (argv[0] === '--help' || argv[0] === '-h') {
    return { help: true };
  }

  const first = argv[0];
  const command = first && !first.startsWith('-') ? first : 'render';
  const rest = first && !first.startsWith('-') ? argv.slice(1) : argv;
  const opts = {
    command,
    width: 1080,
    height: 1440,
    scale: Number(process.env.MOBILE_TEXT_CARD_SCALE || DEFAULT_SCALE),
    content: []
  };

  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i];
    if (arg === '--help' || arg === '-h') {
      opts.help = true;
      continue;
    }

    if (!arg.startsWith('--')) {
      if (opts.input) throw new Error(`Unexpected positional argument: ${arg}`);
      opts.input = arg;
      continue;
    }

    const [flag, inlineValue] = splitFlag(arg);
    const [value, nextIndex] = readFlagValue(rest, i, inlineValue, flag);
    i = nextIndex;

    if (flag === '--out') opts.out = value;
    else if (flag === '--html') opts.html = value;
    else if (flag === '--width') opts.width = Number(value);
    else if (flag === '--height') opts.height = Number(value);
    else if (flag === '--scale') opts.scale = Number(value);
    else if (flag === '--style' || flag === '--template') opts.style = value;
    else if (flag === '--preset') opts.preset = value;
    else if (flag === '--title') opts.title = value;
    else if (flag === '--summary') opts.summary = value;
    else if (flag === '--subtitle') opts.subtitle = value;
    else if (flag === '--footer') opts.footer = value;
    else if (flag === '--generated-at') opts.generatedAt = value;
    else if (flag === '--content' || flag === '--item') {
      const item = parseContentItem(value);
      if (item) opts.content.push(item);
    } else {
      throw new Error(`Unknown argument: ${flag}`);
    }
  }

  return opts;
}

function validateOptions(opts) {
  if (opts.command === 'templates') return;
  if (opts.command === 'presets') return;
  if (opts.command === 'skill-path') return;
  if (opts.command === 'spec' || opts.command === 'init' || opts.command === 'preset') return;
  if (!Number.isFinite(opts.width) || opts.width <= 0) throw new Error('--width must be a positive number.');
  if (!Number.isFinite(opts.height) || opts.height <= 0) throw new Error('--height must be a positive number.');
  if (!Number.isFinite(opts.scale) || opts.scale <= 0 || opts.scale > 4) {
    throw new Error('--scale must be a number in the range 1..4.');
  }
}

function readSpec(path) {
  const raw = readFileSync(path, 'utf8');
  return JSON.parse(raw);
}

function hasInlineSpec(opts) {
  return Boolean(
    opts.style ||
    opts.title ||
    opts.summary ||
    opts.subtitle ||
    opts.footer ||
    opts.generatedAt ||
    opts.preset ||
    opts.content.length
  );
}

function inlineSpec(opts) {
  const spec = {};
  if (opts.style) spec.style = opts.style;
  if (opts.title) spec.title = opts.title;
  if (opts.summary) spec.summary = opts.summary;
  if (opts.subtitle) spec.subtitle = opts.subtitle;
  if (opts.footer) spec.footer = opts.footer;
  if (opts.generatedAt) spec.generatedAt = opts.generatedAt;
  if (opts.content.length) spec.content = opts.content;
  return spec;
}

function starterSpec(style = 'signal') {
  return {
    style,
    title: 'Service Health',
    summary: 'Errors dropped after the routing fix. Latency is back within the normal range.',
    content: [
      { title: 'Impact', text: 'Only one provider route was affected.' },
      { title: 'Action', text: 'Keep the fallback route enabled and monitor for one hour.' },
      { title: 'Status', text: 'Traffic is stable and no new alerts are firing.' }
    ],
    footer: 'Ops Brief'
  };
}

function loadSpec(opts) {
  if (opts.command === 'init') {
    if (opts.preset) {
      return {
        ...buildPresetSpec(opts.preset),
        ...inlineSpec(opts)
      };
    }
    return starterSpec(opts.style);
  }

  if (opts.command === 'preset') {
    if (!opts.input) throw new Error('Missing preset id.');
    return {
      ...buildPresetSpec(opts.input),
      ...inlineSpec(opts)
    };
  }

  if (!opts.input && !hasInlineSpec(opts)) {
    throw new Error('Missing spec.json input, --preset, or inline fields such as --style, --title, --summary, and --item.');
  }

  return {
    ...(opts.preset ? buildPresetSpec(opts.preset) : {}),
    ...(opts.input ? readSpec(opts.input) : {}),
    ...inlineSpec(opts)
  };
}

function writeJson(path, value) {
  const json = `${JSON.stringify(value, null, 2)}\n`;
  if (path) {
    writeFileEnsured(path, json);
    console.log(`saved spec: ${resolve(path)}`);
    return;
  }
  process.stdout.write(json);
}

function writeFileEnsured(path, content) {
  mkdirSync(dirname(resolve(path)), { recursive: true });
  writeFileSync(path, content);
}

function buildCss() {
  const outPath = join(ROOT_DIR, '.cache', 'tailwind.css');
  const tailwindBin = join(ROOT_DIR, 'node_modules', '.bin', process.platform === 'win32' ? 'tailwindcss.cmd' : 'tailwindcss');

  if (!existsSync(tailwindBin)) {
    throw new Error('Missing Tailwind dependency. Run pnpm install first.');
  }

  mkdirSync(dirname(outPath), { recursive: true });

  const result = spawnSync(tailwindBin, [
    '-c',
    join(ROOT_DIR, 'tailwind.config.mjs'),
    '-i',
    join(ROOT_DIR, 'src', 'styles.css'),
    '-o',
    outPath,
    '--minify'
  ], {
    cwd: ROOT_DIR,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });

  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout || '');
    throw new Error(`tailwind build failed with exit code ${result.status}`);
  }

  return readFileSync(outPath, 'utf8');
}

function commandPath(name) {
  const result = spawnSync('/bin/sh', ['-lc', `command -v ${name}`], {
    encoding: 'utf8'
  });
  if (result.status !== 0) return null;
  return result.stdout.trim().split('\n')[0] || null;
}

function renderWithHtmlToPng(htmlPath, outPath, width, height, scale) {
  if (scale !== 1) return false;

  const exe = process.env.HTML_TO_PNG || commandPath('html-to-png');
  if (!exe) return false;

  const result = spawnSync(exe, [resolve(htmlPath), resolve(outPath), String(width), String(height)], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });

  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout || '');
    throw new Error(`html-to-png failed with exit code ${result.status}`);
  }

  return true;
}

function renderWithChromium(htmlPath, outPath, width, height, scale) {
  const exe = process.env.CHROME_BIN ||
    commandPath('chromium') ||
    commandPath('chromium-browser') ||
    commandPath('google-chrome');

  if (!exe) {
    throw new Error('No renderer found. Install chromium/google-chrome or provide html-to-png in PATH.');
  }

  const result = spawnSync(exe, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-color-profile=srgb',
    '--enable-font-antialiasing',
    `--force-device-scale-factor=${scale}`,
    `--window-size=${width},${height}`,
    `--screenshot=${resolve(outPath)}`,
    `file://${resolve(htmlPath)}`
  ], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });

  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout || '');
    throw new Error(`chromium screenshot failed with exit code ${result.status}`);
  }
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help || !opts.command) {
    usage();
    return;
  }
  validateOptions(opts);

  if (opts.command === 'templates') {
    for (const template of listTemplates()) {
      const aliases = template.aliases?.length ? ` aliases=${template.aliases.join(',')}` : '';
      const accepts = template.accepts?.length ? ` accepts=${template.accepts.join(',')}` : '';
      console.log(`${template.styleName}\t${template.name}\t${template.description}${aliases}${accepts}`);
    }
    return;
  }

  if (opts.command === 'presets') {
    for (const preset of listPresets()) {
      const aliases = preset.aliases?.length ? ` aliases=${preset.aliases.join(',')}` : '';
      console.log(`${preset.id}\t${preset.name}\tstyle=${preset.style}\t${preset.description}${aliases}`);
    }
    return;
  }

  if (opts.command === 'skill-path') {
    console.log(join(ROOT_DIR, 'skill', 'SKILL.md'));
    return;
  }

  if (opts.command === 'spec' || opts.command === 'init' || opts.command === 'preset') {
    writeJson(opts.out, loadSpec(opts));
    return;
  }

  if (!opts.out) throw new Error('Missing --out.');

  const spec = loadSpec(opts);
  const css = buildCss();
  const html = renderCardDocument(spec, { width: opts.width, height: opts.height, css });

  if (opts.command === 'html') {
    writeFileEnsured(opts.out, html);
    console.log(`saved html: ${resolve(opts.out)}`);
    return;
  }

  if (opts.command !== 'render') {
    throw new Error(`Unknown command: ${opts.command}`);
  }

  const outPath = resolve(opts.out);
  const htmlPath = opts.html || resolve(dirname(outPath), `.posterforge-${basename(outPath)}.html`);
  writeFileEnsured(htmlPath, html);
  writeFileEnsured(opts.out, '');

  if (!renderWithHtmlToPng(htmlPath, opts.out, opts.width, opts.height, opts.scale)) {
    renderWithChromium(htmlPath, opts.out, opts.width, opts.height, opts.scale);
  }

  console.log(`saved png: ${resolve(opts.out)}`);
  console.log(`logical size: ${opts.width}x${opts.height}; scale: ${opts.scale}x; output size: ${Math.round(opts.width * opts.scale)}x${Math.round(opts.height * opts.scale)}`);
  if (opts.html) console.log(`saved html: ${resolve(opts.html)}`);
}

try {
  main();
} catch (error) {
  console.error(`posterforge: ${error.message}`);
  process.exit(1);
}
