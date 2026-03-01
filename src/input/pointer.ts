import type { SceneGraph } from "../engine/scene";

export function attachInput(canvas: HTMLCanvasElement, scene: SceneGraph) {
  const rect = () => canvas.getBoundingClientRect();

  canvas.addEventListener("pointermove", (e) => {
    const r = rect();
    scene.pointer.x = (e.clientX - r.left) * scene.frameCtx.dpr;
    scene.pointer.y = (e.clientY - r.top) * scene.frameCtx.dpr;
  });

  canvas.addEventListener("pointerdown", () => {
    scene.pointer.down = true;
    scene.pointer.clicked = true;
  });

  window.addEventListener("pointerup", () => {
    scene.pointer.down = false;
  });
}
