import { renderToStaticMarkup } from 'react-dom/server';
import { normalizeSpec } from '../schema/card-spec.mjs';
import { getTemplate } from '../templates/registry.mjs';

const TEXT_FIT_SCRIPT = String.raw`
(() => {
  const MIN_FONT_SIZE = 13;
  const MIN_RATIO = 0.72;
  const MAX_STEPS = 18;

  function isTextLeaf(element) {
    if (!element.textContent || !element.textContent.trim()) return false;
    for (const child of element.children) {
      if (child.textContent && child.textContent.trim()) return false;
    }
    return true;
  }

  function isOverflowing(element) {
    return element.scrollHeight > element.clientHeight + 1 || element.scrollWidth > element.clientWidth + 1;
  }

  function hasConstrainedBox(element, style) {
    return style.overflowY === 'hidden' ||
      style.overflowY === 'clip' ||
      style.overflowX === 'hidden' ||
      style.overflowX === 'clip' ||
      style.maxHeight !== 'none' ||
      style.webkitLineClamp !== 'none';
  }

  function protectText(element) {
    if (!isTextLeaf(element)) return;
    if (!element.clientWidth || !element.clientHeight) return;

    const style = window.getComputedStyle(element);
    element.style.overflowWrap = 'anywhere';
    element.style.wordBreak = 'break-word';
    element.style.textWrap = 'pretty';

    if (!hasConstrainedBox(element, style) && !isOverflowing(element)) return;

    const fontSize = Number.parseFloat(style.fontSize);
    if (!Number.isFinite(fontSize) || fontSize <= MIN_FONT_SIZE) return;

    const minFontSize = Math.max(MIN_FONT_SIZE, fontSize * MIN_RATIO);
    let current = fontSize;
    let step = 0;

    while (isOverflowing(element) && current > minFontSize && step < MAX_STEPS) {
      current = Math.max(minFontSize, current * 0.94);
      element.style.fontSize = current.toFixed(2) + 'px';
      step += 1;
    }
  }

  for (const element of document.querySelectorAll('h1,h2,h3,p,li,span,div')) {
    protectText(element);
  }

  document.documentElement.dataset.posterforgeTextFit = 'done';
})();
`;

export function renderCardDocument(inputSpec, options = {}) {
  const spec = normalizeSpec(inputSpec);
  const template = getTemplate(spec.template);
  const width = options.width || 1080;
  const height = options.height || 1440;
  const css = options.css || '';
  const markup = renderToStaticMarkup(template.render(spec));

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=${width}, initial-scale=1">
  <title>${escapeHtml(spec.title)}</title>
  <style>
    :root {
      --card-width: ${width}px;
      --card-height: ${height}px;
    }
    ${css}
  </style>
</head>
<body>${markup}<script>${TEXT_FIT_SCRIPT}</script></body>
</html>`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
