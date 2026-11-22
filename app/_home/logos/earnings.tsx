"use client";

// Earnings Call Research: a speech bubble holding a voice waveform (the call itself).
// No existing logo, so this is drawn in the line-glyph hand: one ink, strokeFor() lines.
//
// Hover: the waveform talks, on a loop. Each cycle is a spoken phrase then a breath, and it starts
// and ends on the resting waveform, so when the hover ends the phrase in progress finishes and the
// bars settle instead of snapping back.

import type { GlyphProps } from "../glyphs/types";
import GlyphSvg from "../glyphs/Svg";
import { strokeFor } from "../glyphs/ink";
import { useRunToCycleEnd } from "./run-to-cycle-end";

/** Empty space above the drawn top (the bubble's top edge, y 3 of 24, less half a stroke), as a fraction of the box. */
export const TOP = 2.4 / 24;

const BUBBLE = "M6 3 H18 A4 4 0 0 1 22 7 V12.5 A4 4 0 0 1 18 16.5 H10.5 L5.8 20 L6.6 16.5 H6 A4 4 0 0 1 2 12.5 V7 A4 4 0 0 1 6 3 Z";
const MID = 9.75;

/** Bar x and resting half-height: a quiet waveform, tallest in the middle. */
const BARS = [
  { x: 7, rest: 1.1 },
  { x: 9.5, rest: 2.3 },
  { x: 12, rest: 3.3 },
  { x: 14.5, rest: 2 },
  { x: 17, rest: 1.1 },
];

/** Half-heights through the phrase (10%..70% of the cycle), per bar. 80-100% is the breath, back at rest. */
const PHRASE = [
  [2.2, 0.9, 3, 1.5, 2.6, 1.1, 1.9],
  [3.8, 1.7, 4.4, 2.3, 3.5, 1.5, 3.1],
  [2.1, 4.8, 2.9, 4.6, 1.7, 4.3, 2.5],
  [3.6, 1.9, 4.2, 1.5, 4, 2.7, 1.7],
  [1.5, 2.9, 1.3, 2.5, 1.9, 3.2, 1.2],
];

const at = (h: number) => `y: ${(MID - h).toFixed(2)}px; height: ${(2 * h).toFixed(2)}px;`;

const CSS = /* css */ `
.ec.is-run .ec-b { animation: 2.4s ease-in-out infinite; }
${BARS.map(
  (b, i) => `
.ec.is-run .ec-b:nth-of-type(${i + 1}) { animation-name: ec-b${i}; }
@keyframes ec-b${i} {
  0%, 80%, 100% { ${at(b.rest)} }
  ${PHRASE[i].map((h, k) => `${(k + 1) * 10}% { ${at(h)} }`).join("\n  ")}
}`,
).join("")}
@media (prefers-reduced-motion: reduce) {
  .ec.is-run .ec-b { animation: none; }
}
`;

export default function EarningsLogo({ active, reduced, size }: GlyphProps) {
  const [running, ref] = useRunToCycleEnd<SVGGElement>(active && !reduced);
  const w = strokeFor(size) * 1.15;
  return (
    <GlyphSvg size={size}>
      <style>{CSS}</style>
      <g ref={ref} className={`ec${running && !reduced ? " is-run" : ""}`}>
        <path d={BUBBLE} />
        {BARS.map((b) => (
          <rect key={b.x} className="ec-b" x={b.x - w / 2} y={MID - b.rest} width={w} height={2 * b.rest} rx={w / 2} fill="currentColor" stroke="none" />
        ))}
      </g>
    </GlyphSvg>
  );
}
