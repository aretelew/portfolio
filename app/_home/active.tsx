"use client";

// What makes a drawing play: a mouse resting on its row or word, keyboard focus, or a tap. And
// the two ways a drawing is set on the page: a mark in a row's gutter, or after a word in a line.

import { useCallback, useEffect, useId, useRef, useState, type ComponentType, type CSSProperties, type FocusEvent, type PointerEvent, type ReactNode } from "react";
import type { GlyphMeta, GlyphProps } from "./glyphs/types";
import { useNoHover, watchCenter } from "./center";
import { usePrefersReducedMotion } from "./reduced-motion";

/** How long a tap keeps a drawing playing on touch screens. */
const PULSE_MS = 1600;
/** A mouse has to rest this long before a drawing plays, so sweeping across the page doesn't set them all off. */
const INTENT_MS = 70;

/**
 * Active while hovered by a mouse (after the intent delay), while keyboard-focused, or for
 * PULSE_MS after a tap (a second tap ends it). On screens that can't hover it is also active while
 * the element crosses the middle of the screen. Spread `bind` on the element that owns the hover.
 */
export function useActive() {
  const reduced = usePrefersReducedMotion();
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [centered, setCentered] = useState(false);
  const noHover = useNoHover();
  const intent = useRef<number | undefined>(undefined);
  const pulseTimer = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      window.clearTimeout(intent.current);
      window.clearTimeout(pulseTimer.current);
    },
    [],
  );

  const hoverTo = (on: boolean) => {
    window.clearTimeout(intent.current);
    if (on) intent.current = window.setTimeout(() => setHover(true), INTENT_MS);
    else setHover(false);
  };

  const pulsing = useRef(false);
  const tap = () => {
    window.clearTimeout(pulseTimer.current);
    pulsing.current = !pulsing.current;
    setPulse(pulsing.current);
    if (pulsing.current)
      pulseTimer.current = window.setTimeout(() => {
        pulsing.current = false;
        setPulse(false);
      }, PULSE_MS);
  };

  /** Enter or Space on a focused word plays the drawing again. */
  const replay = useCallback(() => {
    setFocus(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setFocus(true)));
  }, []);

  /** Watches the element for the centre of the screen, only where there is no hover. */
  const ref = useCallback(
    (el: HTMLElement | null) => {
      if (!el || !noHover) return;
      const stop = watchCenter(el, setCentered);
      return () => {
        stop();
        setCentered(false);
      };
    },
    [noHover],
  );

  const bind = {
    ref,
    onPointerEnter: (e: PointerEvent) => e.pointerType !== "touch" && hoverTo(true),
    onPointerLeave: (e: PointerEvent) => e.pointerType !== "touch" && hoverTo(false),
    onPointerDown: (e: PointerEvent) => e.pointerType === "touch" && tap(),
    onFocus: (e: FocusEvent) => (e.target as Element).matches(":focus-visible") && setFocus(true),
    onBlur: () => setFocus(false),
  };

  return { active: hover || focus || pulse || centered, reduced, bind, replay };
}

/** A drawing component plus where its drawn top starts, for lining marks up with a title's capitals. */
export interface Drawing {
  Component: ComponentType<GlyphProps>;
  meta?: GlyphMeta;
  /** empty space above the drawn top, as a fraction of the box */
  top: number;
}

/** The drawing's box, coloured by the page: muted at rest, ink while playing. */
function Frame({ drawing, active, reduced, size, className, style }: { drawing: Drawing; active: boolean; reduced: boolean; size: number; className?: string; style?: CSSProperties }) {
  const { Component, meta } = drawing;
  return (
    <span className={`hl-g${active ? " is-on" : ""}${className ? ` ${className}` : ""}`} aria-hidden style={{ width: size * (meta?.aspect ?? 1), height: size, ...style }}>
      <Component active={active} reduced={reduced} size={size} />
    </span>
  );
}

/** Gutter marks: bigger than the inline drawings, since they head a row rather than sit in a line. */
const MARK = 32;

/**
 * A row's gutter mark, its drawn top level with the top of the title's capitals. The slot sits on
 * the title's baseline (grid baseline alignment) and the box is raised so its top lands 1cap above
 * that baseline, plus the drawing's own empty space.
 */
export function Mark({ drawing, active, reduced }: { drawing: Drawing; active: boolean; reduced: boolean }) {
  const style = { width: MARK, verticalAlign: `calc(1cap + ${(drawing.top * MARK).toFixed(2)}px - ${MARK}px)` };
  return (
    <span className="hc-job-g">
      <Frame drawing={drawing} active={active} reduced={reduced} size={MARK} style={style} />
    </span>
  );
}

/**
 * A word in running text with its drawing after it. A real tab stop, announced as a "hobby", with
 * a description only when it says more than the word.
 */
export function DrawnWord({ drawing, note, children }: { drawing: Drawing; note?: string; children: ReactNode }) {
  const { active, reduced, bind, replay } = useActive();
  const noteId = useId();
  const size = 20;
  return (
    <>
      <button type="button" className={`hl-hobby${active ? " is-on" : ""}`} aria-roledescription="hobby" aria-describedby={note ? noteId : undefined} {...bind} onClick={(e) => e.detail === 0 && replay()}>
        <span className="hl-hw">{children}</span>
        <Frame drawing={drawing} active={active} reduced={reduced} size={size} className="hl-g-after" style={{ verticalAlign: -size / 6 }} />
      </button>
      {note ? (
        <span id={noteId} hidden>
          {note}
        </span>
      ) : null}
    </>
  );
}
