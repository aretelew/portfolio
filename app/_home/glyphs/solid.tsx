// A tiny solid modeller for the CAD glyph: a prism with round holes in its faces, seen by a camera
// that orbits the vertical axis and looks down at `elev`. Faces that look away are dropped and the
// rest are painted back to front with page-coloured fills, so hidden edges are covered. Shading
// comes from a light fixed to the camera, so a turning part changes tone face by face, the way a
// shaded CAD view does.
import { f2 } from "./loop";

export const DEG = Math.PI / 180;

type V2 = [number, number];
type V3 = [number, number, number];
interface Face {
  pts: V3[];
  n: V3;
  holes: V3[][];
}
/** A round hole: its centre on a face, that face's outward normal, and its radius. */
export interface Hole {
  at: V3;
  n: V3;
  r: number;
}

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (v: V3): V3 => {
  const m = Math.hypot(...v);
  return [v[0] / m, v[1] / m, v[2] / m];
};

/** Light from the upper left, a little in front (camera space: x right, y up, z toward the viewer). */
const LIGHT = unit([-0.55, 0.75, 0.38]);
const TONE = 0.3;
const HOLE_TONE = 0.32;

/** A circle of 32 points round a hole, in the plane its normal sets. */
function ring({ at, n, r }: Hole): V3[] {
  // any two unit vectors across the normal span the plane
  const u = unit(Math.abs(n[1]) > 0.9 ? [1, 0, 0] : [-n[2], 0, n[0]]);
  const v: V3 = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]];
  return Array.from({ length: 32 }, (_, i) => {
    const a = (i / 32) * Math.PI * 2;
    const k = Math.cos(a) * r;
    const j = Math.sin(a) * r;
    return [at[0] + u[0] * k + v[0] * j, at[1] + u[1] * k + v[1] * j, at[2] + u[2] * k + v[2] * j];
  });
}

/**
 * A prism: a counter-clockwise profile in the x-y plane, extruded from z = -d to z = d. Each hole
 * goes on the face it lies on: the one with its normal whose plane holds its centre.
 */
export function prism(profile: V2[], d: number, holes: Hole[] = []): Face[] {
  const faces: Omit<Face, "holes">[] = [
    { pts: profile.map(([x, y]) => [x, y, d]), n: [0, 0, 1] },
    { pts: [...profile].reverse().map(([x, y]) => [x, y, -d]), n: [0, 0, -1] },
    ...profile.map(([x0, y0], i) => {
      const [x1, y1] = profile[(i + 1) % profile.length];
      const m = Math.hypot(x1 - x0, y1 - y0);
      return {
        pts: [[x0, y0, d], [x1, y1, d], [x1, y1, -d], [x0, y0, -d]] as V3[],
        n: [(y1 - y0) / m, -(x1 - x0) / m, 0] as V3,
      };
    }),
  ];
  const on = (f: Omit<Face, "holes">, h: Hole) => dot(f.n, h.n) > 0.999 && Math.abs(dot(f.n, h.at) - dot(f.n, f.pts[0])) < 1e-6;
  return faces.map((f) => ({ ...f, holes: holes.filter((h) => on(f, h)).map(ring) }));
}

/** A camera turned `theta` about the vertical axis, looking down at `elev`, `s` units to the px. */
export function makeCam({ theta, elev, s, cx, cy }: { theta: number; elev: number; s: number; cx: number; cy: number }) {
  const ct = Math.cos(theta);
  const st = Math.sin(theta);
  const ce = Math.cos(elev);
  const se = Math.sin(elev);
  const rot = (p: V3): V3 => [p[0] * ct + p[2] * st, p[1], -p[0] * st + p[2] * ct];
  return {
    proj: (p: V3): V2 => {
      const r = rot(p);
      return [cx + s * r[0], cy - s * (r[1] * ce - r[2] * se)];
    },
    /** how far a point (or direction) points toward the viewer */
    toward: (p: V3) => {
      const r = rot(p);
      return r[1] * se + r[2] * ce;
    },
    lit: (n: V3) => dot(rot(n), LIGHT),
  };
}
type Cam = ReturnType<typeof makeCam>;

const path = (pts: V2[]) => `M${pts.map((p) => `${f2(p[0])} ${f2(p[1])}`).join(" L")} Z`;

/** The visible faces, back to front, each painted as paper, tone, edges, then its holes. */
export function Solid({ faces, cam, edge }: { faces: Face[]; cam: Cam; edge: number }) {
  const shown = faces
    .map((f, key) => ({ f, key, depth: f.pts.reduce((s, p) => s + cam.toward(p), 0) / f.pts.length }))
    .filter(({ f }) => cam.toward(f.n) > 1e-3)
    .sort((a, b) => a.depth - b.depth);
  return (
    <g strokeWidth={edge}>
      {shown.map(({ f, key }) => {
        const d = path(f.pts.map(cam.proj));
        const dark = 1 - Math.max(0, cam.lit(f.n));
        const tone = TONE * dark * dark;
        return (
          <g key={key}>
            <path d={d} fill="var(--hl-paper, transparent)" stroke="none" />
            {tone > 0.01 ? <path d={d} fill="currentColor" fillOpacity={f2(tone)} stroke="none" /> : null}
            <path d={d} />
            {f.holes.map((h, j) => (
              <path key={j} d={path(h.map(cam.proj))} fill="currentColor" fillOpacity={HOLE_TONE} />
            ))}
          </g>
        );
      })}
    </g>
  );
}
