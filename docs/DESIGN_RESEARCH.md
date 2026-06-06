# Design Research

This project is a text-first graphic design generator. The main references should be contemporary and internationally recognized graphic designers, studios, and design practices, not mobile UI platform guidelines.

The goal is not to imitate any designer directly. The goal is to translate proven graphic-design ideas into reusable text-card systems:

- strong typographic hierarchy
- deliberate grid or deliberate grid-breaking
- distinctive composition logic
- limited but memorable color use
- every style visibly different from the previous one

## Reference Pillars

### Paula Scher / Pentagram

References:

- https://www.family.style/culture/paula-scher-graphic-designer-pentagram-interview
- https://www.madamearchitect.org/interviews/2020/7/16/paula-scher

Useful ideas:

- typography as image
- dense but intentional information fields
- expressive scale and civic poster energy
- graphic design starts with ideas, not decoration

Current translation:

- `delta`: red triangular field, oversized delta symbol, stepped information rhythm.

### Josef Muller-Brockmann / Swiss Poster Systems

Useful ideas:

- ranking and hierarchy through scale, not decoration
- strong asymmetry with controlled grid logic
- poster-like first read, detail as secondary read

Current translation:

- `podium`: one dominant winner block, two secondary blocks, black/yellow/red ranking field.

### Otl Aicher

Useful ideas:

- sports/event identity systems
- motion from geometry and repeated directional forms
- simple shapes that stay legible at distance

Current translation:

- `sprint`: angled speed band, repeated lane rows, compressed operational reading rhythm.

### Experimental Jetset

References:

- https://www.designboom.com/design/experimental-jetset-interview/
- https://www.itsnicethat.com/features/experimental-jetset-interview-280616

Useful ideas:

- restrained palette
- late-modernist typography
- black/white/red/blue systems
- simple elements pushed to graphic intensity

Current translation:

- legacy influence for hard modernist color blocking.

### Wim Crouwel / Total Design

Useful ideas:

- modular typography and grid discipline
- coordinate-like information systems
- technical modernism without decorative softness

Current translation:

- `matrix`: blue coordinate grid, coded cells, modular comparison blocks.

### David Carson

Reference:

- https://www.marklives.com/2019/03/media-design-reviving-graphic-design-craft-david-carson-interview/

Useful ideas:

- expressive editorial typography
- controlled disruption
- layout energy from offset, rotation, cropping, and tension

Current translation:

- `heat`: loud orange field, broken poster rhythm, offset text blocks.

### Irma Boom

References:

- https://www.wallpaper.com/design-interiors/visual-comms/irma-boom-design-interview
- https://www.printmag.com/design-resources/interview-with-irma-boom/

Useful ideas:

- book as object
- sequencing and material structure
- editorial design as architecture
- page spread logic

Current translation:

- `dossier`: book-spread composition with spine, folio, and structured right-page notes.

### Michael Bierut / Pentagram

References:

- https://www.wallpaper.com/design-interiors/corporate-design-branding/michael-bierut-interview
- https://yalebooks.yale.edu/2015/12/22/from-the-designers-desk-michael-bierut/

Useful ideas:

- identity systems
- memorable visual forms
- typography as narrative and brand signal
- distilling complexity into accessible structure

Current translation:

- `signal`: typographic mark + brand-system layout.

### Anthony Burrill

Useful ideas:

- public-message posters
- direct statement, hard contrast, limited color
- type as a clear social signal

Current translation:

- `bulletin`: yellow/black public notice poster with vertical notice rail.

### Massimo Vignelli

Useful ideas:

- disciplined editorial grids
- monochrome authority
- simple typographic systems carried by proportion

Current translation:

- `graphite`: monochrome editorial spread with index rail, lead text, and secondary notes.

### Command-Line Interfaces / Technical Trace Boards

Useful ideas:

- information density through command/output structure
- side rails for navigation context
- mono typography for machine-readable confidence

Current translation:

- `terminal`: command stack sidebar, stdout rows, neon system header.

### Stefan Sagmeister

References:

- https://www.gq-magazin.de/artikel/stefan-sagmeister-interview
- https://www.luerzersarchive.com/interviews/stefan-sagmeister/

Useful ideas:

- typographic manifesto
- human-scale statement
- strong concept before polish
- emotional poster presence

Current translation:

- `pulse`: centered typographic manifesto with strong border rhythm.

### Karel Martens

Reference:

- https://www.gsd.harvard.edu/2025/04/interview-with-karel-martens/

Useful ideas:

- print experiments
- color, type, and production methods in tension
- playful but exacting layout
- interaction between system and accident

Current translation:

- `atlas`: coordinate grid, print markers, colored registration points.

### Studio Dumbar

Reference:

- https://www.studiodumbar.com/

Useful ideas:

- dynamic identity
- motion-like composition in static systems
- directional energy
- visual branding with strong typographic movement

Current translation:

- `compass`: directional quadrant system with cardinal typography.

## Rules

- Do not make style variants by merely changing colors.
- Each style needs a different composition idea.
- Prefer text, type, rules, fields, spatial rhythm, and color systems over decorative illustration.
- Placeholder examples should use Lorem Ipsum-style content.
- Keep the public input simple: `title`, `summary`, `content`.

## Registered Styles

```text
arena, podium, sprint, delta, matrix, heat,
ledger, dossier, audit, terminal, bulletin, noir, graphite,
signal, pulse, atlas, prism, compass, mercury, editorial
```
