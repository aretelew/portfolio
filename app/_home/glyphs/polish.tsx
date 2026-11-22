"use client";
// Polish: a speech bubble with "hi" written in it by hand. While hovered it keeps up a small
// back-and-forth on one clock: "hi" lifts away, the bubble eases wider with a soft overshoot and
// "cześć" writes itself in letter by letter, accents last; it holds, then lifts away in turn, the
// bubble eases back and "hi" writes itself in again. The bubble floats very slightly the whole time.
// Unlike the other glyphs, Polish never pauses mid-way (a half-written word looks broken): a
// hover always plays the whole exchange, back round to "hi", and leaving only stops it once that
// exchange is done. Held hovers play it again and again. The page loads on the "hi" hold.
import GlyphSvg from "./Svg";
import { strokeFor } from "./ink";
import type { GlyphMeta, GlyphProps } from "./types";
import { useEffect, useRef, useState } from "react";
import { TAU, clamp, f2, frac, lerp } from "./loop";

const W = 27;
export const meta: GlyphMeta = { label: "Speech bubble: hi, cześć", aspect: W / 24 };

/** A speech bubble from x 2 to `right`, its tail down to the ground at the left. */
function bubble(right: number): string {
  const l = 2;
  const t = 3;
  const b = 16;
  const r = 4.2;
  const k = r * 0.45;
  return [
    `M${l + r} ${t} H${f2(right - r)}`,
    `C${f2(right - k)} ${t} ${f2(right)} ${f2(t + k)} ${f2(right)} ${f2(t + r)} V${f2(b - r)}`,
    `C${f2(right)} ${f2(b - k)} ${f2(right - k)} ${b} ${f2(right - r)} ${b} H${l + 7.2}`,
    `L${l + 2.4} 19.6 L${l + 4.2} ${b} H${l + r}`,
    `C${f2(l + k)} ${b} ${l} ${f2(b - k)} ${l} ${f2(b - r)} V${f2(t + r)}`,
    `C${l} ${f2(t + k)} ${f2(l + k)} ${t} ${l + r} ${t} Z`,
  ].join(" ");
}
const NARROW_R = 18;
const WIDE_R = 26.4;

// Handwriting in letter space (baseline 0, x-height 1), set into the bubble with a forward slant.
const XH = 4.2;
const SLANT = 0.2;
const BASE = 11.7;
function pen(d: string, x0: number): string {
  const n = d.match(/-?\d*\.?\d+/g)!.map(Number);
  let i = 0;
  return d.replace(/(-?\d*\.?\d+)[ ,]+(-?\d*\.?\d+)/g, () => {
    const x = n[i];
    const y = n[i + 1];
    i += 2;
    return `${f2(x0 + (x - y * SLANT) * XH)} ${f2(BASE + y * XH)}`;
  });
}
const G = {
  h: "M0.06 -1.72 L0 0 M0.01 -0.58 C0.12 -0.9 0.34 -1.02 0.52 -1 C0.76 -0.98 0.84 -0.8 0.84 -0.56 L0.84 -0.12 C0.84 -0.04 0.9 0.02 0.98 0",
  i: "M0 -0.98 L0 -0.14 C0 -0.04 0.06 0.02 0.14 0",
  iDot: "M0.02 -1.42 L0.02 -1.42",
  c: "M0.72 -0.84 C0.6 -0.98 0.42 -1.02 0.28 -0.98 C0.08 -0.9 0 -0.68 0 -0.48 C0 -0.18 0.18 0.02 0.42 0.02 C0.56 0.02 0.68 -0.04 0.76 -0.14",
  z: "M0.04 -0.98 L0.72 -0.98 L0.02 -0.02 L0.76 -0.02",
  e: "M0.04 -0.5 L0.74 -0.5 C0.76 -0.82 0.58 -1.02 0.38 -1 C0.14 -0.98 0 -0.74 0 -0.48 C0 -0.18 0.18 0.02 0.42 0.02 C0.56 0.02 0.68 -0.04 0.76 -0.14",
  s: "M0.66 -0.86 C0.56 -0.98 0.42 -1.02 0.3 -1 C0.14 -0.98 0.04 -0.86 0.08 -0.72 C0.12 -0.56 0.36 -0.52 0.52 -0.44 C0.7 -0.36 0.74 -0.2 0.64 -0.08 C0.54 0.02 0.28 0.04 0.04 -0.06",
  acute: "M0 -1.22 L0.26 -1.56",
};
const HI_X = 7.7;
/** "hi" in writing order: h, i, the dot */
const HI = [pen(G.h, HI_X), pen(G.i, HI_X + 1.3 * XH), pen(G.iDot, HI_X + 1.3 * XH)];
const CZ_X = 5.4;
/** "cześć" in writing order: c z e s c, then the two accents */
const CZ = [
  pen(G.c, CZ_X),
  pen(G.z, CZ_X + 0.98 * XH),
  pen(G.e, CZ_X + 1.94 * XH),
  pen(G.s, CZ_X + 2.92 * XH),
  pen(G.c, CZ_X + 3.84 * XH),
  pen(G.acute, CZ_X + 3.2 * XH),
  pen(G.acute, CZ_X + 4.18 * XH),
];

/** Bounding box of hand-drawn paths (every number pair is a point, control points included). */
function bbox(paths: string[]) {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const d of paths) {
    const n = d.match(/-?\d*\.?\d+/g)!.map(Number);
    for (let i = 0; i + 1 < n.length; i += 2) {
      x0 = Math.min(x0, n[i]);
      x1 = Math.max(x1, n[i]);
      y0 = Math.min(y0, n[i + 1]);
      y1 = Math.max(y1, n[i + 1]);
    }
  }
  return { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
}
/** The bubble's body runs from x 2 to its right edge and y 3 to 16; each word is centred in it. */
const BODY = { left: 2, top: 3, bottom: 16 };
const centre = (paths: string[], right: number) => {
  const b = bbox(paths);
  return { dx: (BODY.left + right) / 2 - b.cx, dy: (BODY.top + BODY.bottom) / 2 - b.cy };
};
const HI_AT = centre(HI, NARROW_R);
const CZ_AT = centre(CZ, WIDE_R);

// ---------------------------------------------------------------- the exchange, over one period
const PERIOD = 3.6; // seconds for hi → cześć → hi
/**
 * where t = 0 falls in the period: at the very end of the "hi" hold, just before "hi" lifts away,
 * so a hover starts the exchange at once. Every whole period lands back here, on the rest pose.
 */
const PHASE = 0.05;
const span = (u: number, a: number, b: number) => clamp((u - a) / (b - a));
const outBack = (x: number) => {
  const c = 1.3;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
};
const out = (x: number) => 1 - Math.pow(1 - x, 3);

/** how wide the bubble is (0 narrow, 1 wide), and how much of each word is showing */
function story(u: number) {
  // hi → cześć
  const goWide = outBack(span(u, 0.1, 0.3));
  const hiLeave = out(span(u, 0.08, 0.16));
  const czIn = CZ.map((_, i) => (i < 5 ? out(span(u, 0.15 + i * 0.026, 0.2 + i * 0.026)) : out(span(u, 0.3 + (i - 5) * 0.02, 0.32 + (i - 5) * 0.02))));
  // cześć → hi
  const goNarrow = outBack(span(u, 0.64, 0.84));
  const czLeave = out(span(u, 0.62, 0.68));
  const hiIn = [out(span(u, 0.655, 0.735)), out(span(u, 0.725, 0.785)), out(span(u, 0.79, 0.81))];
  const wide = goWide - goNarrow;
  const back = u >= 0.62;
  return {
    wide,
    hi: back ? { draw: hiIn, fade: 1, lift: 0 } : { draw: [1, 1, 1], fade: 1 - hiLeave, lift: hiLeave },
    cz: back ? { draw: CZ.map(() => 1), fade: 1 - czLeave, lift: czLeave } : { draw: czIn, fade: u > 0.14 ? 1 : 0, lift: 0 },
  };
}

/**
 * A clock that runs at full speed while `active`, and when `active` ends keeps running to the end
 * of the current period, then stops there. So the exchange always plays whole.
 */
function useWholePeriods(active: boolean, reduced: boolean) {
  const [t, setT] = useState(0);
  const clock = useRef({ t: 0, last: null as number | null, raf: 0, active: false });
  useEffect(() => {
    const c = clock.current;
    c.active = active && !reduced;
    if (!c.active || c.raf) return; // not hovered, or already running (re-hovered mid-period)
    const tick = (now: number) => {
      const dt = c.last === null ? 0 : Math.min(0.1, (now - c.last) / 1000);
      c.last = now;
      const end = (Math.floor(c.t / PERIOD) + 1) * PERIOD;
      const next = c.t + dt;
      if (!c.active && next >= end) {
        c.t = end;
        c.last = null;
        c.raf = 0;
        setT(end);
        return;
      }
      c.t = next;
      setT(next);
      c.raf = requestAnimationFrame(tick);
    };
    c.raf = requestAnimationFrame(tick);
  }, [active, reduced]);
  // losing the hover never cancels the run (it finishes the period); only unmounting does
  useEffect(() => {
    const c = clock.current;
    return () => {
      cancelAnimationFrame(c.raf);
      c.raf = 0;
      c.last = null;
    };
  }, []);
  return t;
}

export default function Polish({ active, reduced, size }: GlyphProps) {
  const t = useWholePeriods(active, reduced);
  const sw = strokeFor(size, 24);
  const ink = sw * (size >= 40 ? 0.9 : 0.95);

  // the whole exchange is a function of t alone; t only ever stops on a whole period (the "hi" rest)
  // reduced motion: a still of "cześć" in the wide bubble while hovered, "hi" otherwise
  const u = reduced ? (active ? 0.45 : PHASE) : frac(t / PERIOD + PHASE);
  const s = story(u);
  const right = lerp(NARROW_R, WIDE_R, s.wide);
  const hiDraw = s.hi.draw;
  const hiFade = s.hi.fade;
  const hiLift = s.hi.lift;
  const czFade = s.cz.fade;
  const float = reduced ? 0 : Math.sin((t / 2.4) * TAU) * 0.22;

  return (
    <GlyphSvg size={size} aspect={W / 24} viewBox={`0 0 ${W} 24`}>
      <g transform={`translate(0 ${f2(float)})`}>
        <path d={bubble(right)} fill="var(--hl-paper, transparent)" />
        <g strokeWidth={ink} opacity={f2(hiFade)} transform={`translate(${f2(HI_AT.dx)} ${f2(HI_AT.dy - 1.3 * hiLift)})`}>
          {HI.map((d, i) =>
            // the i's dot is a zero-length stroke (just its round cap), so it pops in rather than draws
            i === 2 ? (
              <path key={i} d={d} opacity={f2(hiDraw[i])} />
            ) : (
              <path key={i} d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={f2(1 - hiDraw[i])} opacity={hiDraw[i] > 0.02 ? 1 : 0} />
            ),
          )}
        </g>
        <g strokeWidth={ink} opacity={f2(czFade)} transform={`translate(${f2(CZ_AT.dx)} ${f2(CZ_AT.dy - 1.3 * s.cz.lift)})`}>
          {CZ.map((d, i) => (
            <path key={i} d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={f2(1 - s.cz.draw[i])} opacity={s.cz.draw[i] > 0.02 ? 1 : 0} />
          ))}
        </g>
      </g>
    </GlyphSvg>
  );
}
