"use client";

// The Courtinate mark and its rally animation, ported from the Courtinate app
// (courtinate/src/components/courtinate-icon.tsx + courtinate-loader.tsx and its CSS module).
// Same geometry and keyframes; the only change is that the rally is driven by `active` (the
// row's hover / focus / tap) instead of the mark's own :hover. At rest the rally holds its place
// and while active it plays on from where it stopped. One ink, like the line drawings (no
// Courtinate lime): so the accent still reads as it runs over the outline, the court dims behind
// it while active and the accent and ball stay at full ink. Keep the geometry in sync with the app
// if the logo changes there.

import type { GlyphProps } from "../glyphs/types";

/** Empty space above the drawn top (the outline's stroke edge, y 4 of 80), as a fraction of the box. */
export const TOP = 4 / 80;

const CSS = /* css */ `
.ct-orbit {
  /* pathLength=1 and a dash cycle totaling 1 make both loop endpoints equal. */
  animation: ct-orbit 1.35s linear infinite;
  stroke-dasharray: 0.18 0.82;
  stroke-dashoffset: -1.00418;
}
/* Four orbit turns contain eight straight volleys; each keyframe is a real contact point. */
.ct-ball { animation: ct-ball 5.4s linear infinite; }
.ct-mark:not(.is-on) .ct-orbit, .ct-mark:not(.is-on) .ct-ball { animation-play-state: paused; }
.ct-court { transition: opacity 220ms ease; }
.ct-mark.is-on .ct-court { opacity: 0.55; }
@keyframes ct-orbit { to { stroke-dashoffset: -2.00418; } }
@keyframes ct-ball {
  0%, 100% { cx: 40px; cy: 11.25px; }
  11.126545% { cx: 54px; cy: 68.75px; }
  23.430338% { cx: 24px; cy: 11.25px; }
  38.873455% { cx: 26px; cy: 68.75px; }
  51.569662% { cx: 56px; cy: 11.25px; }
  61.715169% { cx: 48px; cy: 68.75px; }
  74.215169% { cx: 32px; cy: 11.25px; }
  88.088623% { cx: 34px; cy: 68.75px; }
}
@media (prefers-reduced-motion: reduce) {
  .ct-orbit, .ct-ball { display: none; }
}
`;

export default function CourtinateLogo({ active, reduced, size }: GlyphProps) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} aria-hidden className={`ct-mark${active ? " is-on" : ""}`}>
      <style>{CSS}</style>
      <g className="ct-court">
        <rect x="6" y="6" width="68" height="68" rx="10" fill="none" stroke="currentColor" strokeWidth="4" />
        <line x1="16" y1="6" x2="16" y2="74" stroke="currentColor" strokeWidth="2.5" />
        <line x1="64" y1="6" x2="64" y2="74" stroke="currentColor" strokeWidth="2.5" />
        <line x1="16" y1="28" x2="64" y2="28" stroke="currentColor" strokeWidth="2.5" />
        <line x1="16" y1="52" x2="64" y2="52" stroke="currentColor" strokeWidth="2.5" />
        <line x1="40" y1="28" x2="40" y2="52" stroke="currentColor" strokeWidth="2.5" />
        <line x1="8" y1="40" x2="72" y2="40" stroke="currentColor" strokeWidth="7" />
      </g>
      {!reduced && (
        <>
          <rect className="ct-orbit" x="6" y="6" width="68" height="68" rx="10" fill="none" pathLength={1} stroke="currentColor" strokeLinecap="butt" strokeWidth="4" />
          <circle className="ct-ball" cx="40" cy="11.25" r="3.25" fill="currentColor" />
        </>
      )}
    </svg>
  );
}
