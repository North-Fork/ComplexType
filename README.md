# ComplexType Browser Canvas v1.1 — SVG → Filled Attractors

Upgrade: generate particle attractor fields from **real SVG glyph outlines**.
Mode: **filled interior sampling**, **one SVG per glyph**.

## Run
```bash
npm install
npm run dev
```

## Glyphs (one SVG per glyph)
Place SVG files in `public/glyphs/`.
This demo expects:
- `public/glyphs/A.svg`
- `public/glyphs/I.svg`

Each SVG should include at least one `<path d="...">` and a `viewBox`.

## Notes
- Sampling uses `CanvasRenderingContext2D.isPointInPath(Path2D, x, y)`.
- Sampling is deterministic (seeded) per glyph instance.
- Next: multi-path union + hole handling, optional SDF force field.
