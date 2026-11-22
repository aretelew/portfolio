// The <svg> every glyph draws into: sized by the contract, one ink, round caps and joins.
// Read-only for glyph files (they may also write their own <svg> as long as it follows ./types).
import type { ReactNode } from "react";
import { strokeFor } from "./ink";

export default function GlyphSvg({
  size,
  aspect = 1,
  viewBox = "0 0 24 24",
  children,
}: {
  size: number;
  aspect?: number;
  viewBox?: string;
  children: ReactNode;
}) {
  const box = Number(viewBox.split(/\s+/)[3]) || 24;
  return (
    <svg
      width={size * aspect}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeFor(size, box)}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      style={{ display: "block", overflow: "visible" }}
    >
      {children}
    </svg>
  );
}
