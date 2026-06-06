import { renderToStaticMarkup } from 'react-dom/server';
import { normalizeSpec } from '../schema/card-spec.mjs';
import { getTemplate } from '../templates/registry.mjs';

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
<body>${markup}</body>
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
