"use client";
// candlestick chart: on hover the chart runs like a live ticker. Candles stream left at a calm
// pace, each new one fades in on the right and fades off the left,
// and a thin trend line rides above them through the highs. When the hover ends the ticker
// coasts to a stop wherever it is and hovering again runs on from there; at page load it shows
// the three resting candles, and the trend line comes in over the first moments of motion.
import { useId } from "react";
import GlyphSvg from "./Svg";
import { strokeFor } from "./ink";
import type { GlyphMeta, GlyphProps } from "./types";
import { f2, lerp, ss, useLoop, warm } from "./loop";

export const meta: GlyphMeta = { label: "Candlestick chart" };

const GAP = 6;
const X0 = 5;
const BARS_PER_SEC = 1.15;

/** A twelve-bar series that wraps seamlessly; bars 0-2 are the rest pose. y is SVG down. */
const SERIES = [
  { top: 13.8, bot: 18.6, up: true },
  { top: 11, bot: 15, up: false },
  { top: 7.8, bot: 12.2, up: true },
  { top: 6.4, bot: 10.4, up: true },
  { top: 8.4, bot: 12.6, up: false },
  { top: 10.2, bot: 14.2, up: false },
  { top: 8.8, bot: 12.6, up: true },
  { top: 6.2, bot: 10.4, up: true },
  { top: 5.4, bot: 9, up: true },
  { top: 7.4, bot: 11.6, up: false },
  { top: 10.4, bot: 15.2, up: false },
  { top: 12.6, bot: 17.2, up: false },
];
const bar = (k: number) => SERIES[((k % SERIES.length) + SERIES.length) % SERIES.length];

/** Catmull-Rom through the points, as cubic Béziers. */
function smoothPath(pts: [number, number][]) {
  if (pts.length < 2) return "";
  let d = `M${f2(pts[0][0])} ${f2(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    d += ` C${f2(p1[0] + (p2[0] - p0[0]) / 6)} ${f2(p1[1] + (p2[1] - p0[1]) / 6)} ${f2(p2[0] - (p3[0] - p1[0]) / 6)} ${f2(p2[1] - (p3[1] - p1[1]) / 6)} ${f2(p2[0])} ${f2(p2[1])}`;
  }
  return d;
}

export default function Quants({ active, reduced, size }: GlyphProps) {
  const { t } = useLoop(active, reduced);
  const sw = strokeFor(size);
  const big = size >= 40;
  const w = big ? 1.55 : 1.85;
  const a = reduced ? (active ? 1 : 0) : warm(t);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  // bars scrolled
  const s = reduced ? 0 : t * BARS_PER_SEC;

  const candles: { k: number; x: number; o: number; grow: number }[] = [];
  for (let k = Math.floor(s) - 1; k <= Math.floor(s) + 4; k++) {
    const x = X0 + (k - s) * GAP;
    if (x < -2 || x > 26) continue;
    // a new bar fades in at full size as it comes in on the right (growing it read as a squashed stub)
    const o = ss(-1, 2.2, x) * (1 - ss(19.5, 23, x));
    const grow = 1;
    candles.push({ k, x, o, grow });
  }

  // the trend line rides 1.6 above each bar's high, across every bar on screen
  const pts: [number, number][] = [];
  for (let k = Math.floor(s) - 1; k <= Math.floor(s) + 4; k++) {
    const x = X0 + (k - s) * GAP;
    pts.push([x, bar(k).top - 2.4]);
  }

  return (
    <GlyphSvg size={size}>
      <defs>
        {/* the trend line fades out toward both edges with a gradient on the stroke itself, and is
            clipped just inside them, so its ends never show as stray caps or soft fringes */}
        <linearGradient id={`hlqf${uid}`} x1="1.4" x2="22.6" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="0.16" stopColor="currentColor" stopOpacity="1" />
          <stop offset="0.84" stopColor="currentColor" stopOpacity="1" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`hlqc${uid}`}>
          <rect x="1.4" y="-6" width="21.2" height="32" />
        </clipPath>
      </defs>
      {big ? <path d="M1.4 20 H22.6" strokeWidth={sw * 0.6} opacity={0.55} /> : null}
      <path d={smoothPath(pts)} clipPath={`url(#hlqc${uid})`} stroke={`url(#hlqf${uid})`} strokeWidth={sw * 0.8} opacity={f2(a * 0.85)} />
      {candles.map((c) => {
        const b = bar(c.k);
        const bot = b.bot;
        const top = lerp(bot, b.top, c.grow);
        const hi = lerp(bot, b.top - 0.8, c.grow);
        const lo = b.bot + 0.9;
        return (
          <g key={c.k} opacity={f2(c.o)}>
            <path d={`M${f2(c.x)} ${f2(hi)} V${f2(top)} M${f2(c.x)} ${f2(bot)} V${f2(lo)}`} strokeWidth={sw * 0.9} />
            <rect x={f2(c.x - w)} y={f2(top)} width={f2(w * 2)} height={f2(Math.max(0.2, bot - top))} rx={0.4} fill={b.up ? "var(--hl-paper, transparent)" : "currentColor"} />
          </g>
        );
      })}
    </GlyphSvg>
  );
}
