// The glyph contract: a small one-ink line drawing that plays while `active`.
//
// - Draw with stroke="currentColor", fill="none" (small solid currentColor shapes are fine), round
//   caps and joins, strokeFor(size) line width. To knock out lines behind a shape, fill it with
//   var(--hl-paper), the page colour.
// - The height is always `size`; a glyph wider than it is tall declares `aspect` (width / height).
// - When `reduced`, show a still pose: no travel, no spin, no loops.

export interface GlyphProps {
  /** true while the owning row or word is hovered, focused, or tapped */
  active: boolean;
  /** prefers-reduced-motion */
  reduced: boolean;
  /** rendered height in px */
  size: number;
}

export interface GlyphMeta {
  /** short human name, e.g. "Speech bubble: hi, cześć" */
  label: string;
  /** width / height, default 1 */
  aspect?: number;
}
