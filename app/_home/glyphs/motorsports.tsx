"use client";
// SR26: on hover the car drives. The road rolls under it with a rock every so often; each
// wheel rides up over the rock it meets and the body pitches and heaves on soft suspension, the
// wheels turn at road speed and a thin stream of dust trails off the rear tyre. Everything is a
// function of the distance driven, so it loops forever without a seam; on leave it coasts to a stop
// wherever it is (mid-bump included) and hovering again drives on from there. The road and rocks
// come in over the first moments of motion, so the page loads on the bare car.
import GlyphSvg from "./Svg";
import { strokeFor } from "./ink";
import type { GlyphMeta, GlyphProps } from "./types";
import { clamp, f2, hash, ss, stream, useLoop, warm } from "./loop";

export const meta: GlyphMeta = { label: "Baja off-road car" };

const R = 3;
const HUB_Y = 20 - R;
const XR = 3.6;
const XF = 20.8;
const PIVOT = { x: 12.2, y: 12 };

const SPEED = 14; // road units per second
const PERIOD = 15; // a rock every PERIOD units of road
const HALF = 3.1; // half-width of a rock as a wheel feels it
/** road already driven at t = 0: puts both wheels on flat road, with a few units before the next rock */
const D0 = 0.6;

/** Rock k sits at road position k*PERIOD; every other one is smaller, so the rhythm isn't a metronome. */
const rockH = (k: number, big: boolean) => (big ? 1.9 : 2.2) * (hash(k) > 0.45 ? 1 : 0.65);

/** Height of the road under road position x: a smooth cosine hump at each rock. */
function road(x: number, big: boolean) {
  const k = Math.round(x / PERIOD);
  const dx = x - k * PERIOD;
  if (Math.abs(dx) >= HALF) return 0;
  return (rockH(k, big) * (1 + Math.cos((Math.PI * dx) / HALF))) / 2;
}
/** The tyre and spring soften the hump: average a few samples across the contact patch. */
const felt = (x: number, big: boolean) => (road(x - 0.9, big) + road(x - 0.3, big) + road(x + 0.3, big) + road(x + 0.9, big)) / 4;

// Traced from the SR26 side render (front to the right): a tall cage with a flat roof bar, the
// front hoop curving down off the roof and sloping forward to the floor, an A of tubes behind
// the seat, a floor rail, and the side rail running out past the front tyre as a flat bumper.
/** roof bar, then the front hoop curving down and sloping forward to the floor */
const HOOP = "M6.7 4.7 H15.4 Q16.3 4.7 16.5 5.7 L17.7 12 V16.3";
/** the A behind the seat: rear brace down to the back of the frame, main hoop down to the floor */
const REAR_A = "M6.7 4.7 L5 11.2 L5.6 15 L6.6 16.3 M6.7 4.7 L10.4 16.4 M5 11.2 L9.2 12.5";
/** floor rail */
const FLOOR = "M6.6 16.3 H17.7";
/** side rail from the seat to the front bumper, which stands out past the front tyre */
const SIDE = "M9.2 12.5 L21.9 12.2 L22.8 12.2 M21.9 12.2 V13.8";
/** big sizes: the roof cross-brace */
const BRACE = "M7.6 7.3 L12.7 4.75";
/**
 * The steering wheel, from the render: a small rim seen almost edge-on, standing just above the
 * side rail and square to its column (so it leans forward, toward the front hoop). The column runs
 * from the wheel's hub down to where the front hoop meets the side rail.
 */
const COLUMN_END = { x: 17.65, y: 12.15 };
const WHEEL = { cx: 15, cy: 11.3, rx: 0.36, ry: 0.82 };
const WHEEL_TILT = (Math.atan2(COLUMN_END.y - WHEEL.cy, COLUMN_END.x - WHEEL.cx) * 180) / Math.PI;
const COLUMN = `M${WHEEL.cx} ${WHEEL.cy} L${COLUMN_END.x} ${COLUMN_END.y}`;
/** suspension mounts on the frame (body coordinates): arm pivots low, shock tops high */
const MOUNTS = { rearArm: [6.6, 16.3], rearShock: [5.2, 11.6], frontArm: [17.7, 16.3], frontShock: [19.2, 12.25] } as const;
const SPOKES = [0, 1, 2, 3, 4].map((i) => (i / 5) * Math.PI * 2 - Math.PI / 2);
const SPOKES_INLINE = [0, 1, 2].map((i) => (i / 3) * Math.PI * 2 - Math.PI / 2);
const TREAD =Array.from({ length: 14 }, (_, i) => (i / 14) * Math.PI * 2);

function Wheel({ cx, lift, spin, big, sw }: { cx: number; lift: number; spin: number; big: boolean; sw: number }) {
  const cy = HUB_Y - lift;
  return (
    <g transform={`rotate(${f2(spin)} ${f2(cx)} ${f2(cy)})`}>
      <circle cx={cx} cy={cy} r={R} fill="var(--hl-paper, transparent)" />
      {big ? (
        <>
          {/* knobbly tread: short blocks around the outside */}
          <path d={TREAD.map((t) => `M${f2(cx + Math.cos(t) * (R - 0.05))} ${f2(cy + Math.sin(t) * (R - 0.05))} L${f2(cx + Math.cos(t) * (R - 0.6))} ${f2(cy + Math.sin(t) * (R - 0.6))}`).join(" ")} strokeWidth={sw * 0.75} />
          <circle cx={cx} cy={cy} r={1.6} strokeWidth={sw * 0.8} />
          <path
            d={SPOKES.map((a) => `M${f2(cx + Math.cos(a) * 0.45)} ${f2(cy + Math.sin(a) * 0.45)} L${f2(cx + Math.cos(a) * 1.45)} ${f2(cy + Math.sin(a) * 1.45)}`).join(" ")}
            strokeWidth={sw * 0.8}
          />
        </>
      ) : (
        // inline: a rim inside the tyre with three spokes, the most a 32px wheel can hold and still
        // read as a wheel (five spokes or lug nuts blur into a smudge); the spokes show it turning
        <>
          <circle cx={cx} cy={cy} r={1.6} strokeWidth={sw * 0.7} />
          <path d={SPOKES_INLINE.map((a) => `M${f2(cx + Math.cos(a) * 0.3)} ${f2(cy + Math.sin(a) * 0.3)} L${f2(cx + Math.cos(a) * 1.6)} ${f2(cy + Math.sin(a) * 1.6)}`).join(" ")} strokeWidth={sw * 0.7} />
        </>
      )}
      <circle cx={cx} cy={cy} r={big ? 0.3 : 0.38} fill="currentColor" stroke="none" />
    </g>
  );
}

export default function Motorsports({ active, reduced, size }: GlyphProps) {
  const { t, amp } = useLoop(active, reduced);
  const big = size >= 40;
  const sw = strokeFor(size);
  // reduced motion: a still of the car halfway over a rock
  const d = reduced ? PERIOD - XF + 1.2 : D0 + t * SPEED;
  const on = reduced ? (active ? 1 : 0) : 1;
  /** the road and rocks: in once moving, and they stay (pausing freezes them with the car) */
  const scene = reduced ? on : warm(t);
  /** loose dust only: gone while paused */
  const dustA = reduced ? 0 : ss(0, 0.6, amp);

  const lf = felt(XF + d, big) * on;
  const lr = felt(XR + d, big) * on;
  const heave = ((lf + lr) / 2) * 0.85;
  const pitch = (Math.atan2(lr - lf, XF - XR) * 180) / Math.PI * (big ? 1 : 1.5);
  // a frame point after the body's heave and pitch, so the suspension stays attached
  const th = (pitch * Math.PI) / 180;
  const body = ([x, y]: readonly [number, number]): [number, number] => [
    PIVOT.x + (x - PIVOT.x) * Math.cos(th) - (y - PIVOT.y) * Math.sin(th),
    PIVOT.y + (x - PIVOT.x) * Math.sin(th) + (y - PIVOT.y) * Math.cos(th) - heave,
  ];
  const hubR: [number, number] = [XR, HUB_Y - lr];
  const hubF: [number, number] = [XF, HUB_Y - lf];
  const link = (a: [number, number], b: [number, number]) => `M${f2(a[0])} ${f2(a[1])} L${f2(b[0])} ${f2(b[1])}`;
  /** a coilover from the frame to just above the hub: rod plus a few spring rings that bunch as it compresses */
  const shock = (top: [number, number], hub: [number, number]) => {
    const bot: [number, number] = [hub[0] + (top[0] - hub[0]) * 0.18, hub[1] + (top[1] - hub[1]) * 0.18];
    const dx = bot[0] - top[0];
    const dy = bot[1] - top[1];
    const len = Math.hypot(dx, dy) || 1;
    const nx = (-dy / len) * 0.45;
    const ny = (dx / len) * 0.45;
    let d = link(top, bot);
    if (big)
      for (let i = 0; i < 3; i++) {
        const k = 0.2 + 0.13 * i;
        const cx = top[0] + dx * k;
        const cy = top[1] + dy * k;
        d += ` M${f2(cx - nx)} ${f2(cy - ny)} L${f2(cx + nx)} ${f2(cy + ny)}`;
      }
    return d;
  };
  const spin = ((reduced ? d : t * SPEED) / R) * (180 / Math.PI);

  // rocks on screen: road position minus distance driven
  const rocks: { x: number; h: number; o: number }[] = [];
  for (let k = Math.floor(d / PERIOD); k <= Math.floor((d + 28) / PERIOD) + 1; k++) {
    const x = k * PERIOD - d;
    if (x < -4 || x > 28) continue;
    rocks.push({ x, h: rockH(k, big), o: scene * ss(-2.5, 1, x) * (1 - ss(22, 25, x)) });
  }

  const dust = reduced ? [] : stream(t, 8, 2);

  return (
    <GlyphSvg size={size}>
      {big ? (
        <path d="M0.8 20 H23.2" strokeDasharray="1.3 2.1" strokeDashoffset={f2(d)} strokeWidth={sw * 0.8} opacity={0.55 * scene} />
      ) : null}
      {rocks.map((r) => {
        const h = r.h * (big ? 0.85 : 0.9);
        return (
          <g key={r.x.toFixed(1)} opacity={r.o}>
            {big ? null : <path d={`M${f2(r.x - 3.4)} 20 H${f2(r.x + 3.4)}`} strokeWidth={sw * 0.8} />}
            <path
              d={`M${f2(r.x - 2.1)} 20 C${f2(r.x - 1.8)} ${f2(20 - h * 0.95)} ${f2(r.x - 0.4)} ${f2(20 - h * 1.15)} ${f2(r.x + 0.6)} ${f2(20 - h)} C${f2(r.x + 1.5)} ${f2(20 - h * 0.7)} ${f2(r.x + 1.9)} ${f2(20 - h * 0.35)} ${f2(r.x + 2.1)} 20`}
              fill="var(--hl-paper, transparent)"
            />
          </g>
        );
      })}

      <g transform={`translate(0 ${(-heave).toFixed(4)}) rotate(${pitch.toFixed(3)} ${PIVOT.x} ${PIVOT.y})`}>
        {big ? (
          <>
            <path d={BRACE} strokeWidth={sw * 0.8} />
          </>
        ) : null}
        <path d={REAR_A} />
        {big ? (
          <>
            <path d={COLUMN} strokeWidth={sw * 0.8} />
            <ellipse cx={WHEEL.cx} cy={WHEEL.cy} rx={WHEEL.rx} ry={WHEEL.ry} transform={`rotate(${f2(WHEEL_TILT)} ${WHEEL.cx} ${WHEEL.cy})`} fill="var(--hl-paper, transparent)" strokeWidth={sw * 0.8} />
            <circle cx={WHEEL.cx} cy={WHEEL.cy} r={0.16} fill="currentColor" stroke="none" />
          </>
        ) : null}
        <path d={HOOP} />
        <path d={FLOOR} />
        <path d={SIDE} />
      </g>

      {/* suspension arms and shocks from the frame to each hub. They sit behind the tyres (the car is
          seen from the side), so they're drawn first and each tyre's paper fill hides what's behind it */}
      <path d={`${link(body(MOUNTS.rearArm), hubR)} ${link(body(MOUNTS.frontArm), hubF)}`} strokeWidth={sw * 0.9} />
      <path d={`${shock(body(MOUNTS.rearShock), hubR)} ${shock(body(MOUNTS.frontShock), hubF)}`} strokeWidth={sw * (big ? 0.75 : 0.8)} />
      <Wheel cx={XR} lift={lr} spin={spin} big={big} sw={sw} />
      <Wheel cx={XF} lift={lf} spin={spin} big={big} sw={sw} />

      {dust.map((p) => {
        const e = 1 - (1 - p.u) * (1 - p.u);
        const x = XR - 2.2 - (2.8 + 2.2 * p.h) * e;
        const y = 19.5 - (1.2 + 1.8 * p.h) * e + 0.6 * p.u * p.u;
        const o = dustA * Math.pow(Math.sin(Math.PI * p.u), 1.4) * 0.75;
        const r = strokeFor(size) * (0.42 + 0.35 * e);
        return <circle key={p.i} cx={f2(x)} cy={f2(y)} r={f2(r)} fill="currentColor" stroke="none" opacity={f2(clamp(o))} />;
      })}
    </GlyphSvg>
  );
}
