"use client";
// CAD: an isometric machined block with a round boss on top, drawn like a CAD view. While
// hovered the part turns on a turntable, a true rotation: the block's corners are recomputed from
// the turning angle every frame, only the side faces that face the viewer are drawn (paper-filled,
// so the back edges are hidden by the front faces), and the stipple tone stays on whichever face
// looks to the right. The boss's dash-dot centre axis stands up through it, and at large sizes a
// turn arrow circles the axis and the turntable plate shows under the block. The angle is a
// function of the clock alone: on leave the part eases to a stop at whatever angle it is at (the
// construction overlays fade out with the speed), and hovering again turns it on from there.
import GlyphSvg from "./Svg";
import { stipple, strokeFor } from "./ink";
import type { GlyphMeta, GlyphProps } from "./types";
import { clamp, f2, lerp, ss, useLoop } from "./loop";

export const meta: GlyphMeta = { label: "CAD part" };

// ---------------------------------------------------------------- geometry (24 box, ground y=20)
// The block's top face: a square seen isometrically, its corners on an ellipse round (12, 12)
// with half-axes 7 by 4. At angle 0 they are right (19,12), front (12,16), left (5,12), back (12,8).
const CX = 12;
const CY = 12;
const RX = 7;
const RY = 4;
const H = 4; // block height
// Boss: a cylinder standing on the top face, centred on the turntable axis.
const BOSS = { rx: 3.3, ry: 1.9, h: 1.3 };

const QUARTER = 0.8; // seconds per quarter turn: one full turn in 3.2s
const DEG = Math.PI / 180;

/** Stipple for a side face, in face coordinates (u along the top edge, v down the face). */
const TONE = [0, 1, 2, 3].map((j) =>
  stipple(7 + j * 11, 34, 0.1, 0.18, 0.8, 0.66, "bottom").map((d) => ({ u: d.x, v: d.y })),
);

const pt = (phi: number): [number, number] => [CX + RX * Math.cos(phi), CY + RY * Math.sin(phi)];

export default function Cad({ active, reduced, size }: GlyphProps) {
  const { t, amp } = useLoop(active, reduced);
  const sw = strokeFor(size);
  const big = size >= 40;
  const a = reduced ? (active ? 1 : 0) : amp;

  // quarter turns so far; at t = 0 the part sits at its original angle.
  // reduced motion: a still a third of the way into a quarter turn
  const turns = reduced ? (active ? 1 / 3 : 0) : t / QUARTER;
  // the front corner swings to the right
  const theta = -turns * 90 * DEG;

  const top = [0, 1, 2, 3].map((j) => pt(theta + j * 90 * DEG));
  // side face j runs from corner j to corner j+1; its outward normal points at their mid angle
  const faces = top.map((p0, j) => {
    const p1 = top[(j + 1) % 4];
    const mid = theta + (j * 90 + 45) * DEG;
    const facing = Math.sin(mid); // > 0: the face looks toward the viewer
    const lit = Math.cos(mid); // > 0: it looks to the right, the shaded side
    return { j, p0, p1, facing, lit };
  });
  const visible = faces.filter((f) => f.facing > 1e-3);

  const P = (p: [number, number], dy = 0) => `${f2(p[0])} ${f2(p[1] + dy)}`;
  const topFace = `M${top.map((p) => P(p)).join(" L")} Z`;

  const bossTop = CY - BOSS.h;
  const xl = CX - BOSS.rx;
  const xr = CX + BOSS.rx;

  // construction: in with the motion
  const axisO = clamp(a * 1.2) * 0.75;
  const axisTop = bossTop - (big ? 5.2 : 4.2);
  const axisBot = CY + BOSS.ry + (big ? 1.2 : 0.6);
  // turn arrow round the axis, above the boss
  const arc = { cy: bossTop - 3.1, rx: 2.9, ry: 1.2 };
  const arcPt = (deg: number) => `${f2(CX + arc.rx * Math.cos(deg * DEG))} ${f2(arc.cy + arc.ry * Math.sin(deg * DEG))}`;
  // the arc's front (bottom of the ellipse) runs left to right, like the front corner: it starts
  // behind on the left, comes round the front and ends with its head behind on the right
  const tail = 220;
  const head = 322;
  const hx = CX + arc.rx * Math.cos(head * DEG);
  const hy = arc.cy + arc.ry * Math.sin(head * DEG);
  // tangent at the head, in the direction of travel (decreasing angle on screen)
  const tx = Math.sin(head * DEG) * arc.rx;
  const ty = -Math.cos(head * DEG) * arc.ry;
  const tl = Math.hypot(tx, ty);
  const ux = tx / tl;
  const uy = ty / tl;
  const ah = 0.85;
  const arrowHead = `M${f2(hx - ux * ah - uy * ah * 0.6)} ${f2(hy - uy * ah + ux * ah * 0.6)} L${f2(hx)} ${f2(hy)} L${f2(hx - ux * ah + uy * ah * 0.6)} ${f2(hy - uy * ah - ux * ah * 0.6)}`;

  return (
    <GlyphSvg size={size}>
      {/* the turntable plate under the block, at large sizes, while it turns */}
      {big && a > 0.01 ? (
        <ellipse cx={CX} cy={CY + H} rx={RX + 0.9} ry={RY + 0.55} strokeWidth={sw * 0.55} strokeDasharray="0.9 0.7" opacity={f2(0.55 * a)} />
      ) : null}

      {/* side faces that look toward the viewer, paper-filled so nothing behind shows through */}
      {visible.map((f) => (
        <path
          key={f.j}
          d={`M${P(f.p0)} L${P(f.p1)} L${P(f.p1, H)} L${P(f.p0, H)} Z`}
          fill="var(--hl-paper, transparent)"
        />
      ))}
      {big
        ? visible.map((f) => {
            const o = 0.7 * ss(0.05, 0.6, f.lit) * ss(0, 0.3, f.facing);
            if (o < 0.01) return null;
            return (
              <g key={`s${f.j}`} fill="currentColor" stroke="none" opacity={f2(o)}>
                {TONE[f.j].map((d, i) => (
                  <circle
                    key={i}
                    cx={f2(lerp(f.p0[0], f.p1[0], d.u))}
                    cy={f2(lerp(f.p0[1], f.p1[1], d.u) + H * d.v)}
                    r={f2(sw * 0.42)}
                  />
                ))}
              </g>
            );
          })
        : null}
      <path d={topFace} fill="var(--hl-paper, transparent)" />

      {/* the boss: paper body and sides, its front base arc, and the top face */}
      <rect x={xl} y={bossTop} width={BOSS.rx * 2} height={BOSS.h} fill="var(--hl-paper, transparent)" stroke="none" />
      <path d={`M${xl} ${CY} V${bossTop} M${xr} ${CY} V${bossTop}`} strokeLinecap="butt" />
      <path d={`M${xl} ${CY} A${BOSS.rx} ${BOSS.ry} 0 0 0 ${xr} ${CY}`} fill="var(--hl-paper, transparent)" />
      <ellipse cx={CX} cy={bossTop} rx={BOSS.rx} ry={BOSS.ry} fill="var(--hl-paper, transparent)" />

      {/* the centre axis: dash-dot, over the part like a CAD centreline */}
      {axisO > 0.01 ? (
        <path
          d={`M${CX} ${f2(axisBot)} V${f2(axisTop)}`}
          strokeWidth={sw * 0.55}
          strokeDasharray={big ? "1.5 0.45 0.1 0.45" : "2.2 0.7 0.1 0.7"}
          opacity={f2(axisO)}
        />
      ) : null}

      {/* the turn arrow, at large sizes */}
      {big && a > 0.01 ? (
        <g strokeWidth={sw * 0.6} opacity={f2(0.85 * a)}>
          <path d={`M${arcPt(tail)} A${arc.rx} ${arc.ry} 0 1 0 ${arcPt(head)}`} />
          <path d={arrowHead} />
        </g>
      ) : null}
    </GlyphSvg>
  );
}
