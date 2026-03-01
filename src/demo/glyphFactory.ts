import type { GlyphInstance } from "../engine/glyph";
import { defaultTransform } from "../engine/glyph";
import type { ParticleGlyphGeometry, Particle } from "../render/geometry";
import { particleAttractor } from "../behaviors/particleAttractor";
import { loadSvgGlyph, sampleFilledPointsFromPath } from "../geometry/svgGlyph";
import { pointsToAttractors } from "../geometry/attractors";
import { mulberry32 } from "../engine/rng";

function makeParticles(n: number, spread: number, seed: number): Particle[] {
  const rng = mulberry32(seed);
  const out: Particle[] = [];
  for (let i=0;i<n;i++) out.push({ x:(rng()-0.5)*spread, y:(rng()-0.5)*spread, vx:0, vy:0, mass:1 });
  return out;
}

export async function makeParticleGlyphFromSVG(opts: {
  id: string;
  codepoint: number;
  svgUrl: string;
  x: number; y: number;
  seed: number;
  scale: number;
  particleCount: number;
  attractorSamples: number;
}): Promise<GlyphInstance> {
  const g = await loadSvgGlyph(opts.svgUrl);

  const pts = sampleFilledPointsFromPath(g.pathD, g.viewBox, {
    seed: opts.seed ^ 0xA53A,
    points: opts.attractorSamples,
    scale: opts.scale,
    maxAttemptsFactor: 60
  });

  const attractors = pointsToAttractors(pts, { radius: 34, strength: 1.0 });

  const geom: ParticleGlyphGeometry = {
    type: "particles",
    particles: makeParticles(opts.particleCount, 260, opts.seed ^ 0xBEEF),
    attractors
  };

  return {
    id: opts.id,
    codepoint: opts.codepoint,
    transform: { ...defaultTransform(), x: opts.x, y: opts.y, sx: 1, sy: 1 },
    material: { fill: "#f4f0ff", opacity: 0.95, blendMode: "screen" },
    geometryType: "particles",
    geometry: geom,
    behaviors: [particleAttractor({ strength: 1.0 })],
    seed: opts.seed
  };
}
