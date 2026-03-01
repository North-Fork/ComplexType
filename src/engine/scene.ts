import type { FrameContext, UpdateContext } from "./types";
import { mulberry32 } from "./rng";
import type { GlyphInstance } from "./glyph";
import { updateGlyph } from "./glyph";
import type { RenderBackend } from "../render/backend";

export class SceneGraph {
  readonly glyphs: GlyphInstance[] = [];
  time = 0;

  pointer = { x: 0, y: 0, down: false, clicked: false };

  constructor(public backend: RenderBackend, public frameCtx: FrameContext) {}

  step(dt: number) {
    this.time += dt;

    const clicked = this.pointer.clicked;
    const base: Omit<UpdateContext, "rng"> = {
      time: this.time,
      dt,
      pointer: { ...this.pointer, clicked }
    };

    for (const g of this.glyphs) {
      const rng = mulberry32(g.seed ^ ((this.time * 1000) | 0));
      updateGlyph(g, { ...base, rng });
    }

    this.pointer.clicked = false;
  }

  render() {
    for (const g of this.glyphs) this.backend.drawGlyph(g, this.frameCtx);
  }
}
