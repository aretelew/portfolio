"use client";

// "Say hello.": the email large with a copy button beside it, then GitHub, LinkedIn and the resume
// as icons.

import { AnimatePresence, m, type Transition } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { FiCheck, FiCopy, FiFileText, FiGithub, FiLinkedin } from "react-icons/fi";
import { usePrefersReducedMotion } from "./reduced-motion";

export const EMAIL = "aretelew@gmail.com";

const LINKS = [
  { label: "GitHub", href: "https://github.com/aretelew", Icon: FiGithub },
  { label: "LinkedIn", href: "https://linkedin.com/in/aretelew", Icon: FiLinkedin },
  { label: "Resume", href: "/resume", Icon: FiFileText },
];

/** For when the async clipboard is refused (no permission, an insecure origin): the old selection copy. */
function copyFallback(text: string) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;";
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {}
  ta.remove();
  return ok;
}

/** Copies the email; `copied` is true for a moment afterwards. */
function useCopy() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      if (!copyFallback(EMAIL)) return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1600);
  };
  return [copied, copy] as const;
}

// The standard Motion icon swap: the outgoing icon scales down, fades and blurs as the new one
// comes in the same way, both in one grid cell (AnimatePresence keeps the old one for its exit).
const OUT = { opacity: 0, scale: 0.25, filter: "blur(4px)" };
const IN = { opacity: 1, scale: 1, filter: "blur(0px)" };
const SWAP: Transition = { type: "spring", duration: 0.18, bounce: 0 };

function CopyButton() {
  const [copied, copy] = useCopy();
  const reduced = usePrefersReducedMotion();
  return (
    <button type="button" className={`hc-ct-copy${copied ? " is-copied" : ""}`} onClick={copy} aria-label="Copy email address" title={copied ? "Copied" : "Copy email"}>
      <span className="hc-cpi" aria-hidden>
        <AnimatePresence initial={false}>
          <m.span key={copied ? "check" : "copy"} className="hc-cpi-i" initial={OUT} animate={IN} exit={OUT} transition={reduced ? { duration: 0 } : SWAP}>
            {copied ? <FiCheck /> : <FiCopy />}
          </m.span>
        </AnimatePresence>
      </span>
      <span className="hc-sr" aria-live="polite">
        {copied ? "Email address copied" : ""}
      </span>
    </button>
  );
}

export function Contact() {
  return (
    <div className="hc-ct">
      <p className="hc-ct-big">
        <a className="hc-ct-mail" href={`mailto:${EMAIL}`}>
          {EMAIL}
        </a>
        <CopyButton />
      </p>
      <p className="hc-ct-small">
        {LINKS.map(({ label, href, Icon }) => (
          <a key={label} className="hc-ct-li" href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}>
            <Icon aria-hidden />
          </a>
        ))}
      </p>
    </div>
  );
}
