import type { GlyphInstance } from "../engine/glyph";
import type { FrameContext } from "../engine/types";

export interface HitResult { glyphId: string; }

export interface RenderBackend {
  readonly type: "canvas2d" | "webgl";
  resize(widthCssPx: number, heightCssPx: number, dpr: number): void;
  beginFrame(ctx: FrameContext): void;
  drawGlyph(g: GlyphInstance, ctx: FrameContext): void;
  endFrame(ctx: FrameContext): void;
  hitTest(xCssPx: number, yCssPx: number): HitResult | null;
}
