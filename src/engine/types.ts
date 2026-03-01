export type GeometryType = "particles" | "strokes" | "outline2d" | "custom";

export interface Transform2D { x:number; y:number; rotation:number; sx:number; sy:number; }

export interface MaterialComponent {
  fill: string;
  opacity: number;
  blendMode?: GlobalCompositeOperation;
}

export interface UpdateContext {
  time: number;
  dt: number;
  pointer: { x:number; y:number; down:boolean; clicked:boolean; };
  rng: () => number;
}

export interface FrameContext {
  ctx2d: CanvasRenderingContext2D;
  dpr: number;
  widthPx: number;
  heightPx: number;
}
