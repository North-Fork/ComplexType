import { mulberry32 } from "../engine/rng";

export interface Point { x: number; y: number; }

export interface SvgGlyph {
  pathD: string;
  viewBox: { x: number; y: number; width: number; height: number; };
}

export async function loadSvgGlyph(url: string): Promise<SvgGlyph> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load SVG: ${url} (${res.status})`);
  const txt = await res.text();

  const doc = new DOMParser().parseFromString(txt, "image/svg+xml");
  const svg = doc.querySelector("svg");
  const path = doc.querySelector("path");

  if (!svg) throw new Error(`No <svg> root in ${url}`);
  if (!path) throw new Error(`No <path> found in ${url}`);

  const d = path.getAttribute("d");
  if (!d) throw new Error(`Path missing 'd' in ${url}`);

  const vb = svg.getAttribute("viewBox") || "0 0 1000 1000";
  const parts = vb.split(/[ ,]+/).map(Number);
  const viewBox = { x: parts[0] || 0, y: parts[1] || 0, width: parts[2] || 1000, height: parts[3] || 1000 };

  return { pathD: d, viewBox };
}

export function sampleFilledPointsFromPath(
  pathD: string,
  viewBox: { x:number; y:number; width:number; height:number; },
  opts: {
    seed: number;
    points: number;
    scale: number;
    pad?: number;
    maxAttemptsFactor?: number;
  }
): Point[] {
  const pad = opts.pad ?? 0;
  const maxAttempts = Math.max(opts.points * (opts.maxAttemptsFactor ?? 40), opts.points);

  const c = document.createElement("canvas");
  c.width = 1; c.height = 1;
  const ctx = c.getContext("2d")!;

  const p = new Path2D(pathD);

  const cx = viewBox.x + viewBox.width / 2;
  const cy = viewBox.y + viewBox.height / 2;

  const rng = mulberry32(opts.seed);
  const out: Point[] = [];

  let attempts = 0;
  while (out.length < opts.points && attempts < maxAttempts) {
    attempts++;

    const xSvg = (viewBox.x - pad) + rng() * (viewBox.width + 2*pad);
    const ySvg = (viewBox.y - pad) + rng() * (viewBox.height + 2*pad);

    if (ctx.isPointInPath(p, xSvg, ySvg)) {
      out.push({ x: (xSvg - cx) * opts.scale, y: (ySvg - cy) * opts.scale });
    }
  }

  return out;
}
