"use client";

// The iLiterate mark: the open book from the app's header logo (Lucide's BookOpen), without its
// tile, a touch lighter than Lucide's 2px stroke so it sits with the other marks.
//
// Hover: lines of text write themselves across the left page, then the right, then fade. The loop
// starts and ends on the plain book, and when the hover ends the cycle in progress finishes first.

import type { GlyphProps } from "../glyphs/types";
import { useRunToCycleEnd } from "./run-to-cycle-end";

const STROKE = 1.5;

/** Empty space above the drawn top (the book's top edge at y 3, less half the stroke), as a fraction of the box. */
export const TOP = (3 - STROKE / 2) / 24;

const SPINE = "M12 7v14";
const BOOK =
  "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z";
/** Text lines, in reading order: left page top to bottom, then the right. */
const LINES = [8, 11, 14].map((y) => `M4.7 ${y}H9.3`).concat([8, 11, 14].map((y) => `M14.7 ${y}H19.3`));

const pct = (n: number) => `${+n.toFixed(2)}%`;

/** Each line draws in turn (7% of the cycle apart), they all hold, then fade together. */
const line = (k: number) => {
  const a = 4 + k * 7;
  return `
.il.is-run .il-l:nth-of-type(${k + 1}) { animation-name: il-read${k}; }
@keyframes il-read${k} {
  0%, ${pct(a)} { stroke-dashoffset: 1.1; opacity: 1; animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1); }
  ${pct(a + 10)}, 66% { stroke-dashoffset: 0; opacity: 1; }
  78% { stroke-dashoffset: 0; opacity: 0; }
  78.01%, 100% { stroke-dashoffset: 1.1; opacity: 0; }
}`;
};

const CSS = /* css */ `
/* hidden = offset 1.1 on a 1-on/2-off dash, so not even the round cap of the dash end shows */
.il-l { stroke-dasharray: 1 2; stroke-dashoffset: 1.1; animation-iteration-count: infinite; animation-fill-mode: both; }
.il.is-run .il-l { animation-duration: 2.2s; }
${LINES.map((_, k) => line(k)).join("")}
@media (prefers-reduced-motion: reduce) {
  .il.is-run * { animation: none !important; }
}
`;

export default function ILiterateLogo({ active, reduced, size }: GlyphProps) {
  const [running, ref] = useRunToCycleEnd<SVGGElement>(active && !reduced);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden focusable="false" style={{ display: "block", overflow: "visible" }}>
      <style>{CSS}</style>
      <g
        ref={ref}
        className={`il${running && !reduced ? " is-run" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={BOOK} />
        <g strokeWidth={STROKE * 0.8}>
          {LINES.map((d) => (
            <path key={d} className="il-l" d={d} pathLength={1} />
          ))}
        </g>
        <path d={SPINE} />
      </g>
    </svg>
  );
}
