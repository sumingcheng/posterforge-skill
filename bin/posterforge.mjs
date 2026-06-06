#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { renderCardDocument } from '../src/render/html.mjs';
import { listTemplates } from '../src/templates/registry.mjs';

const VERSION = '0.1.1';
const DEFAULT_SCALE = 3;
const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function usage() {
  console.log(`posterforge ${VERSION}

Usage:
  posterforge render <spec.json> --out <output.png> [--html <debug.html>] [--width 1080] [--height 1440] [--scale 3]
  posterforge html <spec.json> --out <output.html>
  posterforge templates

Examples:
  posterforge render examples/alert.json --out dist/alert.png
  posterforge render examples/alert.json --out dist/alert.png --scale 2
  posterforge html examples/alert.json --out dist/alert.html
  posterforge templates

Defaults:
  logical canvas: 1080x1440
  render scale:   ${DEFAULT_SCALE}x (${1080 * DEFAULT_SCALE}x${1440 * DEFAULT_SCALE} output)
`);
}

function parseArgs(argv) {
  if (argv[0] === '--help' || argv[0] === '-h') {
    return { help: true };
  }

  const [command, input, ...rest] = argv;
  const opts = {
    command,
    input,
    width: 1080,
    height: 1440,
    scale: Number(process.env.MOBILE_TEXT_CARD_SCALE || DEFAULT_SCALE)
  };

  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i];
    if (arg === '--out') opts.out = rest[++i];
    else if (arg === '--html') opts.html = rest[++i];
    else if (arg === '--width') opts.width = Number(rest[++i]);
    else if (arg === '--height') opts.height = Number(rest[++i]);
    else if (arg === '--scale') opts.scale = Number(rest[++i]);
    else if (arg === '--help' || arg === '-h') opts.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  return opts;
}

function validateOptions(opts) {
  if (opts.command === 'templates') return;
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

  if (!opts.input) throw new Error('Missing spec.json input.');
  if (!opts.out) throw new Error('Missing --out.');

  const spec = readSpec(opts.input);
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

  const htmlPath = opts.html || resolve(dirname(resolve(opts.out)), '.posterforge.html');
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
