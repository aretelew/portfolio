"use client";

import { useEffect, useState, useRef, RefObject } from "react";
import { cn } from "@/lib/utils";

interface DotBackgroundProps {
  disabledZones?: RefObject<HTMLElement | null>[];
}

const EMPTY_DISABLED_ZONES: RefObject<HTMLElement | null>[] = [];

interface DisabledZoneRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export default function DotBackground({
  disabledZones = EMPTY_DISABLED_ZONES,
}: DotBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [disabledZoneRects, setDisabledZoneRects] = useState<DisabledZoneRect[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isInDisabledZone = (clientX: number, clientY: number) =>
      disabledZones.some((ref) => {
        if (!ref.current) return false;
        const rect = ref.current.getBoundingClientRect();
        return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
      });

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
      setMousePosition({
        x: event.clientX + window.scrollX,
        y: event.clientY + window.scrollY,
      });
      setVisible(!isInDisabledZone(event.clientX, event.clientY));
    };

    const handleScroll = () => {
      setMousePosition({
        x: mouseRef.current.x + window.scrollX,
        y: mouseRef.current.y + window.scrollY,
      });
      setVisible(!isInDisabledZone(mouseRef.current.x, mouseRef.current.y));
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [disabledZones]);

  useEffect(() => {
    const updateDisabledZoneRects = () => {
      const background = backgroundRef.current;
      if (!background) return;

      const backgroundRect = background.getBoundingClientRect();

      setDisabledZoneRects(
        disabledZones.flatMap((ref) => {
          if (!ref.current) return [];

          const rect = ref.current.getBoundingClientRect();
          return [
            {
              left: rect.left - backgroundRect.left,
              top: rect.top - backgroundRect.top,
              width: rect.width,
              height: rect.height,
            },
          ];
        }),
      );
    };

    const resizeObserver = new ResizeObserver(updateDisabledZoneRects);
    const animationFrame = requestAnimationFrame(updateDisabledZoneRects);

    const observedElements: Element[] = [];
    if (backgroundRef.current) observedElements.push(backgroundRef.current);
    for (const ref of disabledZones) {
      if (ref.current) observedElements.push(ref.current);
    }
    observedElements.forEach((element) => resizeObserver.observe(element));
    window.addEventListener("resize", updateDisabledZoneRects);

    return () => {
      cancelAnimationFrame(animationFrame);
      observedElements.forEach((element) => resizeObserver.unobserve(element));
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateDisabledZoneRects);
    };
  }, [disabledZones]);

  return (
    <div ref={backgroundRef} className="pointer-events-none absolute inset-0">
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

      {/* Keep the brighter hover dots outside text-heavy sections. */}
      {disabledZoneRects.map((rect) => (
        <div
          key={`${rect.left}-${rect.top}-${rect.width}-${rect.height}`}
          className="absolute bg-size-[20px_20px] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)]"
          style={{
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
            backgroundPosition: `${-rect.left}px ${-rect.top}px`,
          }}
        />
      ))}

      {/* Vignette Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-white mask-[radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
    </div>
  );
}
