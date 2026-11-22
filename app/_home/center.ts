"use client";

// On touch screens there is no hover, and the rows are links that open a new tab, so a drawing plays
// instead while its row crosses the middle of the screen as you scroll. One IntersectionObserver
// watches every row; its root is shrunk to a thin band at the vertical centre of the viewport.

import { useSyncExternalStore } from "react";

const NO_HOVER = "(hover: none)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(NO_HOVER);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** True on screens that can't hover (phones, tablets); false while rendering on the server. */
export function useNoHover(): boolean {
  return useSyncExternalStore(subscribe, () => window.matchMedia(NO_HOVER).matches, () => false);
}

type Listener = (inCenter: boolean) => void;
const listeners = new Map<Element, Listener>();
let observer: IntersectionObserver | undefined;

/** The band is the middle 1% of the viewport: a row is "in the centre" while it crosses that line. */
function band() {
  return (observer ??= new IntersectionObserver(
    (entries) => {
      for (const e of entries) listeners.get(e.target)?.(e.isIntersecting);
    },
    { rootMargin: "-49.5% 0px -49.5% 0px" },
  ));
}

/** Calls `listener` whenever `el` enters or leaves the centre band; returns the cleanup. */
export function watchCenter(el: Element, listener: Listener) {
  listeners.set(el, listener);
  band().observe(el);
  return () => {
    listeners.delete(el);
    observer?.unobserve(el);
  };
}
