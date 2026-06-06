# Contributing

PosterForge Skill is designed to be easy to extend. The best contribution is a useful text-first template that can render a polished mobile poster from the small `CardSpec` shape.

## Local Setup

```bash
pnpm install
pnpm build
pnpm lint
pnpm check
pnpm dev
```

Generate the committed preview gallery:

```bash
pnpm generate:previews
```

## Add A New Style

1. Add a render function in `src/templates/style-pack.mjs`.
2. Register it in `stylePackTemplates` with `id`, `styleName`, `name`, `aliases`, `description`, and `accepts`.
3. Add a conservative text budget in `docs/TEXT_BUDGETS.md`.
4. Add the style to `docs/CARD_SPEC.md`.
5. Run `pnpm generate:previews`.
6. Run `pnpm lint`, `pnpm build`, and `pnpm check`.

## Template Rules

- Keep the public input shape small: `title`, `summary`, `content`, and optional `footer`.
- Prefer typography, spacing, hierarchy, and color over decoration.
- Do not depend on remote images, network calls, or proprietary assets.
- Do not hard-code fake business metrics into templates.
- Do not accept raw logs or transcripts as final poster text. Compress them first.
- Keep mobile readability at `1080x1440`.
- Use fixed layout constraints so long text fails predictably and can be shortened.

## Preview Rules

Preview images live in `docs/previews/` and are intentionally generated at `scale 1` to keep the repository small. The CLI still exports `scale 3` by default for production output.

## Pull Request Checklist

- `pnpm build` passes.
- `pnpm lint` passes.
- `pnpm check` passes.
- `pnpm generate:previews` was run if templates changed.
- README or docs were updated if the public API changed.
- The template works with the basic `CardSpec` fields.
