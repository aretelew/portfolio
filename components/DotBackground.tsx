"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

export default function DotBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
      setMousePosition({
        x: event.clientX + window.scrollX,
        y: event.clientY + window.scrollY,
      });
      setVisible(true);
    };

    const handleScroll = () => {
      setMousePosition({
        x: mouseRef.current.x + window.scrollX,
        y: mouseRef.current.y + window.scrollY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Base Pattern - Visible everywhere but subtle */}
      <div className="absolute inset-0 bg-size-[20px_20px] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)]" />

      {/* Hover Pattern - Brighter/Clearer, revealed by mask */}
      <div
        className={cn(
          "absolute inset-0 bg-size-[20px_20px] bg-[radial-gradient(#a1a1aa_1px,transparent_1px)] dark:bg-[radial-gradient(#a1a1aa_1px,transparent_1px)] transition-opacity duration-300",
          visible ? "opacity-100" : "opacity-0",
        )}
        style={{
          maskImage: `radial-gradient(250px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
          WebkitMaskImage: `radial-gradient(250px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
        }}
      />

      {/* Vignette Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-white mask-[radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
    </>
  );
}
