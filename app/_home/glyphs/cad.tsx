"use client";
// CAD: a shaded L-bracket with a hole through its foot and one through its upright, turning on the
// spot like a part spun in the viewport. The part is a real solid (./solid): every frame its faces
// are recomputed from the turning angle, the ones facing away are dropped, the rest are painted
// back to front, and their tone follows a light fixed to the camera. The angle is a function of
// the clock alone, so on leave the part eases to a stop wherever it is and turns on from there.
import GlyphSvg from "./Svg";
import { strokeFor } from "./ink";
import type { GlyphMeta, GlyphProps } from "./types";
import { useLoop } from "./loop";
import { DEG, Solid, makeCam, prism } from "./solid";

export const meta: GlyphMeta = { label: "CAD part" };

/** The bracket: an L profile (foot along x, upright at the left) extruded through z, with a hole
 *  down through the foot and one across the upright. */
const BRACKET = prism(
  [
    [-1, 0],
    [1, 0],
    [1, 0.42],
    [-0.5, 0.42],
    [-0.5, 1.3],
    [-1, 1.3],
  ],
  0.72,
  [
    { at: [0.28, 0.42, 0], n: [0, 1, 0], r: 0.27 },
    { at: [-0.5, 0.88, 0], n: [1, 0, 0], r: 0.2 },
    { at: [-1, 0.88, 0], n: [-1, 0, 0], r: 0.2 },
  ],
);

const TURN = 4.2; // seconds per full turn

export default function Cad({ active, reduced, size }: GlyphProps) {
  const { t } = useLoop(active, reduced);
  // reduced motion: a still a little way round
  const turns = reduced ? (active ? 0.18 : 0) : t / TURN;
  const cam = makeCam({ theta: -38 * DEG - turns * 360 * DEG, elev: 27 * DEG, s: 7.6, cx: 12, cy: 16.2 });
  return (
    <GlyphSvg size={size}>
      <Solid faces={BRACKET} cam={cam} edge={strokeFor(size)} />
    </GlyphSvg>
  );
}
