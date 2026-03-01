export interface Particle { x:number; y:number; vx:number; vy:number; mass:number; }
export interface Attractor { x:number; y:number; strength:number; radius:number; }
export interface ParticleGlyphGeometry {
  type: "particles";
  particles: Particle[];
  attractors: Attractor[];
}
export type RuntimeGeometry = ParticleGlyphGeometry;
