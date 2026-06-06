#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import { listTemplates } from '../src/templates/registry.mjs';

const ROOT_DIR = new URL('..', import.meta.url).pathname;
const IGNORE_DIRS = new Set(['.git', '.vscode', 'node_modules', 'dist', 'build', '.cache']);
const markdownFiles = [];
const jsonFiles = [];
const jsFiles = [];
const failures = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (IGNORE_DIRS.has(name)) continue;
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      walk(path);
      continue;
    }

    const ext = extname(path);
    if (ext === '.md') markdownFiles.push(path);
    else if (ext === '.json') jsonFiles.push(path);
    else if (ext === '.js' || ext === '.mjs') jsFiles.push(path);
  }
}

function rel(path) {
  return relative(ROOT_DIR, path);
}

function checkJson() {
  for (const file of jsonFiles) {
    try {
      JSON.parse(readFileSync(file, 'utf8'));
    } catch (error) {
      failures.push(`${rel(file)}: invalid JSON: ${error.message}`);
    }
  }
}

function checkJavaScriptSyntax() {
  for (const file of jsFiles) {
    const result = spawnSync(process.execPath, ['--check', file], {
      cwd: ROOT_DIR,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    });

    if (result.status !== 0) {
      failures.push(`${rel(file)}: JavaScript syntax check failed\n${result.stderr || result.stdout}`);
    }
  }
}

function checkMarkdownLinks() {
  const linkPattern = /\[[^\]]*\]\(([^)]+)\)/g;
  for (const file of markdownFiles) {
    const text = readFileSync(file, 'utf8');
    let match;
    while ((match = linkPattern.exec(text))) {
      const target = match[1].split('#')[0];
      if (!target || /^(https?:|mailto:)/.test(target)) continue;

      const resolved = join(file, '..', target);
      if (!existsSync(resolved)) {
        failures.push(`${rel(file)}: missing markdown link target: ${match[1]}`);
      }
    }
  }
}

function checkPreviewGallery() {
  const templateNames = listTemplates().map((template) => template.styleName).sort();
  const previewDir = join(ROOT_DIR, 'docs', 'previews');
  const previewNames = readdirSync(previewDir)
    .filter((name) => name.endsWith('.png'))
    .map((name) => name.slice(0, -4))
    .sort();

  const expected = templateNames.join(',');
  const actual = previewNames.join(',');
  if (expected !== actual) {
    failures.push(`docs/previews: template previews are out of sync\nexpected: ${expected}\nactual:   ${actual}`);
  }
}

walk(ROOT_DIR);
checkJson();
checkJavaScriptSyntax();
checkMarkdownLinks();
checkPreviewGallery();

if (failures.length) {
  console.error(failures.join('\n\n'));
  process.exit(1);
}

console.log(`lint ok: ${jsonFiles.length} JSON, ${jsFiles.length} JS, ${markdownFiles.length} Markdown files`);
