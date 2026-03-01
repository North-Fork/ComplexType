import type { Point } from "./svgGlyph";
import type { Attractor } from "../render/geometry";

export function pointsToAttractors(points: Point[], opts?: { radius?: number; strength?: number }): Attractor[] {
  const radius = opts?.radius ?? 34;
  const strength = opts?.strength ?? 1.0;
  return points.map(p => ({ x: p.x, y: p.y, strength, radius }));
}
