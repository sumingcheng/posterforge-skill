# Architecture

## Goal

Build a quality-first, agent-friendly text-card poster generator for mobile viewing.

The project is not a PPT engine and not an image-generation system. It renders high-quality cards from structured data through reusable React/Tailwind templates.

## Core Ideas

1. Spec first

Agents should output a small JSON document instead of editing large HTML templates. The JSON is the contract.

2. Scenario presets

Presets live in `src/presets/catalog.mjs`. They are business content blueprints for common workflows such as alert summaries, incident reviews, weekly reports, launch notes, and decision memos. Presets create starter `CardSpec` objects; they do not own visual rendering.

3. Template registry

Styles are registered in `src/templates/style-pack.mjs` and resolved by `src/templates/registry.mjs`. Users select them with short names like `arena`, `terminal`, `prism`, or `mercury`. The CLI and renderer should not change when new styles are added.

4. Style pack

Each style is a React/Tailwind render function with metadata: id, aliases, description, and accepted data blocks. Shared helpers are allowed, but a style should not be a cosmetic recolor of another style.

5. Quality first

Rendering should preserve typography, hairlines, spacing, and Chinese text clarity. The default export is 3x high-DPI browser rendering. Speed is secondary as long as the command remains predictable.

## Pipeline

```text
source text
  -> agent chooses preset when scenario is clear
  -> preset creates a starter CardSpec
  -> agent replaces starter text with user facts
  -> schema normalizes fields and legacy aliases
  -> template registry selects a template
  -> React SSR builds HTML
  -> Tailwind builds CSS
  -> headless Chromium captures high-DPI PNG
  -> final image is sent or saved
```

## Project Structure

```text
bin/                         CLI
src/components/              Reusable React components
src/presets/                 Scenario preset catalog
src/schema/                  Public CardSpec normalization
src/templates/               Style templates and registry
src/templates/style-pack.mjs  Registered style pack
src/templates/registry.mjs   Template registry
src/themes/                  Theme tokens
src/render/                  HTML document rendering
src/styles.css               Tailwind entry
examples/                    Runnable input specs
docs/                        Public docs
skill/                       OpenClaw skill wrapper
```

## Text Cards

The primary workflow is text-first. Agents should compress source material into three blocks:

- title
- summary
- content

Legacy structured fields such as `metrics`, `rankings`, and `sections` are accepted for compatibility, but the public workflow should stay simple.

Scenario presets should stay text-first as well. A preset should define the durable content structure for a use case, not a new layout system. If a use case only changes the visual mood, add or select a style instead of creating a new preset.

## Rendering Quality

- Logical canvas: 1080x1440.
- Default scale: 3x.
- Default output: 3240x4320 PNG.
- Rendering uses browser device scale factor, not bitmap upscaling.
- `--scale 1` exists for debugging; production and agent workflows should prefer the default.

## Non-goals

- Generate images from prompts.
- Support every social platform ratio in v0.
- Produce carousels by default.
- Maintain a large visual recipe library.

## OpenClaw Skill Plan

After the CLI is stable, wrap it as a skill with a short `SKILL.md`:

- trigger on "单图", "战报", "告警总结图", "小红书风格单图"
- ask at most one clarification if core content is missing
- generate JSON spec
- run `posterforge render` with the default 3x export
- send the PNG
