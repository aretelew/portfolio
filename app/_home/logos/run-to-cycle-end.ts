"use client";
import { useEffect, useRef, useState } from "react";

/**
 * For looping marks whose loop starts and ends on the resting pose. Runs while `active`; when it
 * goes false, keeps running until the cycle in progress ends (the next `animationiteration` inside
 * the element), then stops, so the mark settles at rest instead of snapping back mid-gesture.
 */
export function useRunToCycleEnd<T extends Element>(active: boolean) {
  const [running, setRunning] = useState(active);
  const ref = useRef<T>(null);
  if (active && !running) setRunning(true);
  useEffect(() => {
    const el = ref.current;
    if (active || !running || !el) return;
    const stop = () => setRunning(false);
    el.addEventListener("animationiteration", stop);
    return () => el.removeEventListener("animationiteration", stop);
  }, [active, running]);
  return [running, ref] as const;
}
