import type { Behavior } from "./behavior";
import type { GlyphInstance } from "../engine/glyph";
import type { UpdateContext } from "../engine/types";
import type { ParticleGlyphGeometry } from "../render/geometry";

export function particleAttractor(params?: { strength?: number; damping?: number }): Behavior {
  const strength = params?.strength ?? 38;
  const damping = params?.damping ?? 0.92;

  return {
    type: "particle-attractor",
    supports: ["particles"],
    apply(g: GlyphInstance, ctx: UpdateContext) {
      const geom = g.geometry as ParticleGlyphGeometry;

      for (const p of geom.particles) {
        let ax = 0, ay = 0;

        for (const a of geom.attractors) {
          const dx = a.x - p.x;
          const dy = a.y - p.y;
          const dist2 = dx*dx + dy*dy + 1e-6;
          const dist = Math.sqrt(dist2);
          const falloff = Math.max(0, 1 - dist / a.radius);
          const f = (a.strength * strength) * falloff / dist2;
          ax += dx * f;
          ay += dy * f;
        }

        const px = (ctx.pointer.x - g.transform.x) / g.transform.sx;
        const py = (ctx.pointer.y - g.transform.y) / g.transform.sy;
        const pdx = p.x - px;
        const pdy = p.y - py;
        const pDist2 = pdx*pdx + pdy*pdy + 10;
        const rep = ctx.pointer.down ? 9000 : 3500;
        const rf = rep / pDist2;
        ax += pdx * rf;
        ay += pdy * rf;

        p.vx = (p.vx + ax * ctx.dt) * damping;
        p.vy = (p.vy + ay * ctx.dt) * damping;
        p.x += p.vx * ctx.dt;
        p.y += p.vy * ctx.dt;
      }

      if (ctx.pointer.clicked) {
        for (const p of geom.particles) {
          p.vx += (ctx.rng() - 0.5) * 240;
          p.vy += (ctx.rng() - 0.5) * 240;
        }
      }
    }
  };
}
