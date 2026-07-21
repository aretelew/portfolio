"use client";

import { useEffect, useState, useRef, useSyncExternalStore } from "react";
import { HTMLMotionProps } from "motion/react";
import * as m from "motion/react-m";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

const styles = {
  wrapper: {
    display: "inline-block",
    whiteSpace: "pre-wrap",
  },
  srOnly: {
    position: "absolute" as const,
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0,0,0,0)",
    border: 0,
  },
};

interface BlurTextProps extends HTMLMotionProps<"span"> {
  text: string;
  duration?: number;
  delay?: number;
  initialBlur?: number;
  animateOn?: "view" | "hover" | "both";
  revealDirection?: "all" | "sequential" | "word";
  className?: string;
  parentClassName?: string;
  staggerDelay?: number;
}

export default function BlurText({
  text,
  duration = 1000,
  delay = 0,
  initialBlur = 10,
  animateOn = "view",
  revealDirection = "all",
  className = "",
  parentClassName = "",
  staggerDelay = 0.1,
  ...props
}: BlurTextProps) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (animateOn !== "view" && animateOn !== "both") return;

    let activationTimer: ReturnType<typeof setTimeout> | undefined;
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          activationTimer = setTimeout(() => {
            setIsActive(true);
            setHasAnimated(true);
          }, delay);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );
    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (activationTimer) clearTimeout(activationTimer);
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [animateOn, hasAnimated, delay]);

  const hoverProps =
    animateOn === "hover" || animateOn === "both"
      ? {
          onMouseEnter: () => {
            setTimeout(() => setIsActive(true), delay);
          },
          onMouseLeave: () => setIsActive(false),
        }
      : {};

  // All at once animation
  if (revealDirection === "all") {
    return (
      <m.span
        className={`${parentClassName} ${className}`}
        ref={containerRef}
        style={styles.wrapper}
        {...hoverProps}
        {...props}
      >
        <span style={styles.srOnly}>{text}</span>

        <m.span
          aria-hidden="true"
          initial={prefersReducedMotion ? { filter: "blur(0px)", opacity: 1 } : { filter: `blur(${initialBlur}px)`, opacity: 0 }}
          animate={
            prefersReducedMotion || isActive
              ? { filter: "blur(0px)", opacity: 1 }
              : { filter: `blur(${initialBlur}px)`, opacity: 0 }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: duration / 1000, ease: "easeOut" }
          }
        >
          {text}
        </m.span>
      </m.span>
    );
  }

  // Word-by-word animation
  if (revealDirection === "word") {
    const words = text.split(" ");

    return (
      <m.span
        className={parentClassName}
        ref={containerRef}
        style={styles.wrapper}
        {...hoverProps}
        {...props}
      >
        <span style={styles.srOnly}>{text}</span>

        <span aria-hidden="true">
          {words.map((word, index) => (
            <m.span
              key={index}
              className={className}
              initial={prefersReducedMotion ? { filter: "blur(0px)", opacity: 1 } : { filter: `blur(${initialBlur}px)`, opacity: 0 }}
              animate={
                prefersReducedMotion || isActive
                  ? { filter: "blur(0px)", opacity: 1 }
                  : { filter: `blur(${initialBlur}px)`, opacity: 0 }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : {
                      duration: duration / 1000,
                      ease: "easeOut",
                      delay: isActive ? index * staggerDelay : 0,
                    }
              }
              style={{ display: "inline-block", marginRight: "0.25em" }}
            >
              {word}
            </m.span>
          ))}
        </span>
      </m.span>
    );
  }

  // Sequential character-by-character animation
  return (
    <m.span
      className={parentClassName}
      ref={containerRef}
      style={styles.wrapper}
      {...hoverProps}
      {...props}
    >
      <span style={styles.srOnly}>{text}</span>

      <span aria-hidden="true">
        {text.split("").map((char, index) => (
          <m.span
            key={index}
            className={className}
            initial={prefersReducedMotion ? { filter: "blur(0px)", opacity: 1 } : { filter: `blur(${initialBlur}px)`, opacity: 0 }}
            animate={
              prefersReducedMotion || isActive
                ? { filter: "blur(0px)", opacity: 1 }
                : { filter: `blur(${initialBlur}px)`, opacity: 0 }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    duration: duration / 1000,
                    ease: "easeOut",
                    delay: isActive ? index * 0.03 : 0,
                  }
            }
            style={{ display: "inline-block" }}
          >
            {char === " " ? "\u00A0" : char}
          </m.span>
        ))}
      </span>
    </m.span>
  );
}
