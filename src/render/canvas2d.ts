import type { RenderBackend, HitResult } from "./backend";
import type { FrameContext } from "../engine/types";
import type { GlyphInstance } from "../engine/glyph";
import type { ParticleGlyphGeometry } from "./geometry";

export class Canvas2DBackend implements RenderBackend {
  readonly type = "canvas2d" as const;

  constructor(private canvas: HTMLCanvasElement, private ctx: CanvasRenderingContext2D) {}

  resize(widthCssPx: number, heightCssPx: number, dpr: number) {
    this.canvas.width = Math.max(1, Math.floor(widthCssPx * dpr));
    this.canvas.height = Math.max(1, Math.floor(heightCssPx * dpr));
  }

  beginFrame(fc: FrameContext) {
    const ctx = fc.ctx2d;
    ctx.setTransform(1,0,0,1,0,0);
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0,0,fc.widthPx, fc.heightPx);
    ctx.fillStyle = "#0b0b0f";
    ctx.fillRect(0,0,fc.widthPx, fc.heightPx);
  }

  drawGlyph(g: GlyphInstance, fc: FrameContext) {
    const ctx = fc.ctx2d;
    const geom = g.geometry as ParticleGlyphGeometry;

    ctx.save();
    ctx.globalAlpha = g.material.opacity;
    if (g.material.blendMode) ctx.globalCompositeOperation = g.material.blendMode;

    ctx.translate(g.transform.x, g.transform.y);
    ctx.rotate(g.transform.rotation);
    ctx.scale(g.transform.sx, g.transform.sy);

    ctx.fillStyle = g.material.fill;

    for (const p of geom.particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.55, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  endFrame(_fc: FrameContext) {}

  hitTest(_xCssPx: number, _yCssPx: number): HitResult | null { return null; }
}
