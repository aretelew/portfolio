"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** Whether the visitor asked for reduced motion, read now (browser only). */
export function prefersReducedMotion(): boolean {
  return window.matchMedia(QUERY).matches;
}

/** The same, as state that follows the setting (false while rendering on the server). */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, prefersReducedMotion, () => false);
}
