import type { GeometryType, UpdateContext } from "../engine/types";
import type { GlyphInstance } from "../engine/glyph";

export interface Behavior {
  type: string;
  supports: GeometryType[];
  apply(g: GlyphInstance, ctx: UpdateContext): void;
}
