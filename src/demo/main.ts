import { Canvas2DBackend } from "../render/canvas2d";
import type { FrameContext } from "../engine/types";
import { SceneGraph } from "../engine/scene";
import { attachInput } from "../input/pointer";
import { makeParticleGlyphFromSVG } from "./glyphFactory";

const canvas = document.getElementById("stage") as HTMLCanvasElement;
const ctx2d = canvas.getContext("2d", { alpha: true, desynchronized: true })!;
const backend = new Canvas2DBackend(canvas, ctx2d);

function makeFrameCtx(): FrameContext {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  backend.resize(window.innerWidth, window.innerHeight, dpr);
  return { ctx2d, dpr, widthPx: canvas.width, heightPx: canvas.height };
}

let frameCtx = makeFrameCtx();
const scene = new SceneGraph(backend, frameCtx);
attachInput(canvas, scene);

window.addEventListener("resize", () => {
  frameCtx = makeFrameCtx();
  scene.frameCtx = frameCtx;
});

async function init() {
  const cx = scene.frameCtx.widthPx * 0.5;
  const cy = scene.frameCtx.heightPx * 0.5;

  const glyphA = await makeParticleGlyphFromSVG({
    id: "glyph-A",
    codepoint: "A".codePointAt(0)!,
    svgUrl: `${import.meta.env.BASE_URL}glyphs/A.svg`,
    x: cx - 140,
    y: cy,
    seed: 1337,
    scale: 0.12,
    particleCount: 520,
    attractorSamples: 520
  });

  const glyphI = await makeParticleGlyphFromSVG({
    id: "glyph-I",
    codepoint: "I".codePointAt(0)!,
    svgUrl: `${import.meta.env.BASE_URL}glyphs/I.svg`,
    x: cx + 140,
    y: cy,
    seed: 7331,
    scale: 0.12,
    particleCount: 420,
    attractorSamples: 420
  });

  scene.glyphs.push(glyphA, glyphI);
}

init().catch(console.error);

let last = performance.now();
let acc = 0;
const fixedDt = 1 / 60;

function loop(now: number) {
  const elapsed = Math.min(0.1, (now - last) / 1000);
  last = now;
  acc += elapsed;

  scene.backend.beginFrame(scene.frameCtx);

  while (acc >= fixedDt) {
    scene.step(fixedDt);
    acc -= fixedDt;
  }

  scene.render();
  scene.backend.endFrame(scene.frameCtx);

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
