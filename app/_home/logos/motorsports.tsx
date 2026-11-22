"use client";

// The CWRU Motorsports M, from the team site (baja/baja-website/v2/src/components/MLogo.tsx),
// with its transforms flattened to plain polygons in the same 86 x 33.8 viewBox. The M is three
// parallel slanted stripes. One ink.
//
// Hover: the M is drawn, on a loop. Each cycle starts and ends on the full logo, so the loop
// has no seam and the M can stop cleanly. Per stripe, back to front:
//   the fill fades out and leaves the outline -> the outline erases itself, carrying on in the
//   direction it was drawn -> a short empty beat -> the outline traces back on -> it fills -> hold.
// When the hover ends, the cycle in progress plays out and the M stops on the full logo rather
// than snapping back mid-draw.
// Keep the geometry in sync with the team site if the logo changes there.

import type { GlyphProps } from "../glyphs/types";
import { useRunToCycleEnd } from "./run-to-cycle-end";

const VB_W = 86.032;
const VB_H = 33.81;

/** The M fills the mark box's width; at 32px that makes it ~12.6px tall, about the title's cap height, so it reads like a capital. */
const WIDTH_K = 1;

/** The drawn top is the box top: no empty space above. */
export const TOP = 0;

/** Back to front: the bar-and-stripe on the left, the middle stripe, the front stripe. */
const PIECES = [
  "27.36,11.27 14.32,33.81 27.36,33.81 46.92,0 0,0",
  "33.93,33.81 47,33.81 66.51,0 53.44,0",
  "86.03,0 73.05,0 53.49,33.81 66.47,33.81",
];

/** Stagger between stripes, back to front. Shorter than the cycle's closing hold, so a cycle always ends with all three full. */
const STAGGER_MS = 140;

/*
 * One cycle (2.8s), per stripe. The outline uses pathLength 1 with a 1-on/1-off dash, so an
 * offset of 0 shows it whole and +-1 hides it; it erases towards -1 and redraws from +1, so the
 * pen keeps going the same way round. The jump from -1 to +1 happens while it is hidden.
 *   0-6%    full (a beat after the hover lands); the outline's width grows in under the fill
 *   6-22%   fill fades out, outline stays
 *   22-42%  outline erases
 *   42-50%  empty
 *   50-72%  outline traces on
 *   72-84%  fills
 *   84-100% full (covers the stagger, so the cycle ends with all three full); the outline's
 *           width shrinks back over the last 6%, so the M never looks bolder than at rest
 */
const CSS = /* css */ `
.mm-p { stroke: currentColor; stroke-width: 0; stroke-linejoin: round; stroke-dasharray: 1 1; }
.mm.is-run .mm-p { animation: mm-draw 2.8s cubic-bezier(0.45, 0, 0.3, 1) infinite; }
.mm.is-run .mm-p:nth-child(2) { animation-delay: ${STAGGER_MS}ms; }
.mm.is-run .mm-p:nth-child(3) { animation-delay: ${STAGGER_MS * 2}ms; }
@keyframes mm-draw {
  0% { stroke-dashoffset: 0; fill-opacity: 1; stroke-width: 0; }
  6% { stroke-dashoffset: 0; fill-opacity: 1; stroke-width: 2.4; }
  22% { stroke-dashoffset: 0; fill-opacity: 0; }
  42% { stroke-dashoffset: -1; fill-opacity: 0; }
  42.01%, 50% { stroke-dashoffset: 1; fill-opacity: 0; }
  72% { stroke-dashoffset: 0; fill-opacity: 0; }
  84%, 94% { stroke-dashoffset: 0; fill-opacity: 1; stroke-width: 2.4; }
  100% { stroke-dashoffset: 0; fill-opacity: 1; stroke-width: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .mm.is-run .mm-p { animation: none; }
}
`;

export default function MotorsportsLogo({ active, reduced, size }: GlyphProps) {
  const [running, ref] = useRunToCycleEnd<SVGSVGElement>(active && !reduced);
  const w = size * WIDTH_K;
  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      width={w}
      height={(w * VB_H) / VB_W}
      overflow="visible"
      aria-hidden
      className={`mm${running && !reduced ? " is-run" : ""}`}
    >
      <style>{CSS}</style>
      <g fill="currentColor">
        {PIECES.map((points) => (
          <polygon key={points} className="mm-p" points={points} pathLength={1} />
        ))}
      </g>
    </svg>
  );
}
