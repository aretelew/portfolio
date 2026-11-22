"use client";

// The glyph motion engine: one continuous clock per glyph, paused and resumed like a film.
//
// While a glyph is hovered its clock `t` (seconds) runs; every moving part is a smooth periodic
// function of `t`, so the motion loops with no seam. Hovering off doesn't stop or rewind it: the
// clock's *speed* eases down to zero and the drawing comes to rest wherever it is, and hovering
// again eases the speed back up from exactly there. You can start and stop at any moment, any
// number of times, and nothing jumps: the pose is a function of `t`, `t` is continuous, and its
// speed changes smoothly.
//
// The speed is a critically damped spring toward 1 (hovered) or 0 (not): it starts with zero
// acceleration, never overshoots and settles without a tail, so it reads as a film easing to a
// stop and back, not a jolt. `amp` is that speed, 0..1. Glyphs use it only for things that should
// vanish while paused (loose particles like dust or spray, construction lines), never to move a
// part back toward a rest pose, which would read as rewinding. A glyph's drawing at t = 0 is its
// original, resting drawing, so the page loads looking still and composed.
//
// Only a glyph whose speed is not zero runs a frame loop.

import { useEffect, useRef, useState } from "react";

export interface Loop {
  /** seconds of motion so far: advances at `amp` speed, holds while paused */
  t: number;
  /** playback speed, 0 paused .. 1 full speed (eased by a critically damped spring) */
  amp: number;
}

const smooth = (x: number) => x * x * (3 - 2 * x);

/**
 * `startSec` and `stopSec`: roughly how long the speed takes to reach full speed on hover and to
 * come to a stop on leave. Defaults suit most glyphs; keep them close so the whole set feels like
 * one system.
 */
export function useLoop(active: boolean, reduced: boolean, startSec = 0.35, stopSec = 0.6): Loop {
  const [state, setState] = useState<Loop>({ t: 0, amp: 0 });
  /** t, speed, and the speed's own rate of change (the spring's velocity) */
  const cur = useRef({ t: 0, v: 0, dv: 0 });
  /**
   * The previous frame's timestamp, kept across hover changes. Re-reading the clock when the effect
   * re-runs on a hover edge measured the first frame against a time that was usually *later* than
   * that frame's own timestamp, so the clock skipped a frame or two at every start and stop: a tiny
   * hitch exactly where the motion should be smoothest. null while the glyph is at rest.
   */
  const last = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) {
      cur.current = { t: 0, v: 0, dv: 0 };
      const id = requestAnimationFrame(() => setState({ t: 0, amp: active ? 1 : 0 }));
      return () => cancelAnimationFrame(id);
    }
    let raf = 0;
    const target = active ? 1 : 0;
    // critically damped: about 98% of the way there after ~5.8 / w seconds
    const w = 5.8 / (active ? startSec : stopSec);
    const tick = (now: number) => {
      // small fixed substeps keep the spring smooth even if a frame is late
      let left = last.current === null ? 0 : Math.min(0.1, Math.max(0, (now - last.current) / 1000));
      last.current = now;
      const c = cur.current;
      while (left > 0) {
        const dt = Math.min(1 / 240, left);
        left -= dt;
        c.dv += (w * w * (target - c.v) - 2 * w * c.dv) * dt;
        c.v += c.dv * dt;
        if (c.v < 0) {
          c.v = 0;
          c.dv = Math.max(0, c.dv);
        }
        c.t += c.v * dt;
      }
      const settled = Math.abs(target - c.v) < 0.0015 && Math.abs(c.dv) < 0.01;
      if (settled) {
        c.v = target;
        c.dv = 0;
      }
      setState({ t: c.t, amp: c.v });
      // Only a stopped glyph may end its frame loop. A hovered one settles at full speed and must
      // keep ticking, or the clock (and the drawing) would freeze once the start-up eased in.
      if (settled && target === 0) last.current = null;
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduced, startSec, stopSec]);

  return state;
}

export const TAU = Math.PI * 2;
export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const frac = (x: number) => x - Math.floor(x);
/** smoothstep between edges */
export const ss = (a: number, b: number, x: number) => smooth(clamp((x - a) / (b - a)));
/** a stable pseudo-random number in 0..1 for an integer */
export const hash = (n: number) => frac(Math.sin(n * 127.1 + 311.7) * 43758.5453);
export const f2 = (n: number) => n.toFixed(2);

/**
 * A 0..1 "in motion" envelope for a moving glyph: 0 at t = 0 (the page-load drawing), easing to 1
 * over the first `sec` seconds of motion and staying there. Use it to bring in parts that should
 * not be in the resting drawing (a road, a trend line) as the glyph first starts; it depends only
 * on `t`, so it pauses and resumes with everything else.
 */
export const warm = (t: number, sec = 0.4) => ss(0, sec, t);

/** A particle stream: `n` particles, each looping its own 0..1 life at `rate` lives per second. */
export function stream(t: number, n: number, rate: number) {
  return Array.from({ length: n }, (_, i) => {
    const life = t * rate + i / n;
    return { i, u: frac(life), gen: Math.floor(life), h: hash(i * 13 + Math.floor(life) * 7) };
  });
}
