// Drawing helpers shared by the glyphs.

/**
 * Stroke width in viewBox units for a glyph drawn at `size` px: a slim ~1.05px inline, ~1.25px at
 * 48px and a fine 1.35px from about 60px up. `box` is the viewBox height (24 for most glyphs).
 */
export function strokeFor(size: number, box = 24): number {
  const px = Math.min(1.35, 0.9 + size * 0.0075);
  return (px * box) / size;
}

/** Small deterministic PRNG so stipple is the same drawing on every visit. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** `n` stipple dots inside a rectangle, denser toward `bias` ("bottom" | "none"). */
export function stipple(seed: number, n: number, x: number, y: number, w: number, h: number, bias: "bottom" | "none" = "none") {
  const r = rng(seed);
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < n * 6 && out.length < n; i++) {
    const u = r();
    const v = r();
    if (bias === "bottom" && r() > v) continue;
    out.push({ x: x + u * w, y: y + v * h });
  }
  return out;
}
