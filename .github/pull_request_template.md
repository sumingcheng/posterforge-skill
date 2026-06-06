## Summary

<!-- What changed, and why? Keep this short and concrete. -->

## Type Of Change

<!-- Mark all that apply. -->

- [ ] New template or visual style
- [ ] Template/layout fix
- [ ] CLI or rendering change
- [ ] Documentation update
- [ ] Example or preview update
- [ ] CI, lint, or repository maintenance

## Screenshots / Previews

<!-- Required for template, layout, preview, or visual changes. Add before/after images when possible. -->

## Validation

<!-- Mark the checks you ran. -->

- [ ] `pnpm lint`
- [ ] `pnpm build`
- [ ] `pnpm check`
- [ ] `pnpm generate:previews` if templates or previews changed
- [ ] Visual inspection of affected preview images

## Checklist

- [ ] The change keeps the public input shape small: `title`, `summary`, `content`, and optional `footer`.
- [ ] Long text is handled with clear layout constraints and does not silently break the card.
- [ ] New or changed templates have conservative text budgets in `docs/TEXT_BUDGETS.md`.
- [ ] `docs/previews/` is updated when template output changes.
- [ ] README or docs are updated if usage, styles, or public behavior changed.
- [ ] No generated `dist`, `build`, `.cache`, or local editor files are included.
