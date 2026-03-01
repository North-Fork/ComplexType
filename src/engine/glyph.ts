import type { Transform2D, MaterialComponent, UpdateContext, GeometryType } from "./types";
import type { RuntimeGeometry } from "../render/geometry";
import type { Behavior } from "../behaviors/behavior";

export interface GlyphInstance {
  id: string;
  codepoint: number;
  transform: Transform2D;
  material: MaterialComponent;
  geometryType: GeometryType;
  geometry: RuntimeGeometry;
  behaviors: Behavior[];
  seed: number;
}

export function defaultTransform(): Transform2D {
  return { x: 0, y: 0, rotation: 0, sx: 1, sy: 1 };
}

export function updateGlyph(g: GlyphInstance, ctx: UpdateContext) {
  for (const b of g.behaviors) {
    if (b.supports.includes(g.geometryType)) b.apply(g, ctx);
  }
}
