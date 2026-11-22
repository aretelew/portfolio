"use client";

// Dark or light. The button keeps no state: the `dark` class on <html> is the theme (see theme.ts),
// CSS shows the sun in dark and the moon in light, and a click flips the class and saves it.
//
// Switching uses the View Transitions API: the browser snapshots the page before and after, and
// the new theme is revealed as a circle growing out of the button until it covers the screen.
// Without the API, or with reduced motion, the theme just switches.

import type { MouseEvent } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { prefersReducedMotion } from "./reduced-motion";
import { THEME_KEY } from "./theme";

const WIPE_MS = 350;

const isDark = () => document.documentElement.classList.contains("dark");

/** Tells assistive tech whether dark is on: "Dark mode, toggle button, pressed". */
const syncPressed = (button: HTMLButtonElement | null) => button?.setAttribute("aria-pressed", String(isDark()));

function flip(button: HTMLButtonElement) {
  const dark = document.documentElement.classList.toggle("dark");
  try {
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  } catch {}
  syncPressed(button);
}

function toggle(e: MouseEvent<HTMLButtonElement>) {
  const button = e.currentTarget;
  if (!document.startViewTransition || prefersReducedMotion()) return flip(button);

  const r = button.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  // far enough to reach the farthest corner of the screen
  const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  document.startViewTransition(() => flip(button)).ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
      { duration: WIPE_MS, easing: "cubic-bezier(0.4, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" },
    );
  });
}

export function ThemeToggle({ className }: { className?: string }) {
  return (
    <button type="button" ref={syncPressed} className={className} onClick={toggle} aria-label="Dark mode" title="Toggle dark mode">
      <FiSun className="hc-theme-sun" aria-hidden />
      <FiMoon className="hc-theme-moon" aria-hidden />
    </button>
  );
}
