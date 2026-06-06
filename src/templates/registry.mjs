import { stylePackTemplates } from './style-pack.mjs';

export const templates = stylePackTemplates;

export function getTemplate(id) {
  return templates.find((template) => {
    return template.id === id || template.styleName === id || template.aliases?.includes(id);
  }) || templates.find((template) => template.id === 'ledger') || templates[0];
}

export function listTemplates() {
  return templates.map(({ id, name, styleName, aliases, description, accepts }) => ({
    id,
    name,
    styleName,
    aliases,
    description,
    accepts
  }));
}
