"use client";

// The home page: one narrow column read top to bottom. A headline and intro, then short sections:
// teams, projects, school, hobbies, contact. Team and project rows carry a small line drawing in
// the left gutter that plays while the row is hovered; projects link straight out (new tab).

import type { ReactNode } from "react";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { DrawnWord, Mark, useActive, type Drawing } from "./active";
import { Contact, EMAIL } from "./Contact";
import { fontVars } from "./fonts";
import { ThemeToggle } from "./ThemeToggle";
import Cad, { meta as cadMeta } from "./glyphs/cad";
import Car from "./glyphs/motorsports";
import Polish, { meta as polishMeta } from "./glyphs/polish";
import Quants from "./glyphs/quants";
import CourtinateLogo, { TOP as COURTINATE_TOP } from "./logos/courtinate";
import EarningsLogo, { TOP as EARNINGS_TOP } from "./logos/earnings";
import ILiterateLogo, { TOP as ILITERATE_TOP } from "./logos/iliterate";
import MotorsportsLogo, { TOP as MOTORSPORTS_TOP } from "./logos/motorsports";
import "./home.css";

const TEAMS: { org: string; href: string; role: string; mark: Drawing; text: ReactNode }[] = [
  {
    org: "CWRU Quants",
    href: "https://github.com/cwruquants",
    role: "Project Lead",
    mark: { Component: Quants, top: 0.147 },
    text: "Leading the club’s earnings call research vertical. I build the NLP models and features that look for predictive signals in what executives say.",
  },
  {
    org: "CWRU Motorsports",
    href: "https://cwrumotorsports.com",
    role: "Design Engineer",
    mark: { Component: MotorsportsLogo, top: MOTORSPORTS_TOP },
    text: "Building the team’s website and designing front splined yokes for SR27. Designed gearbox output yokes on SR26.",
  },
];

const PROJECTS: { title: string; href: string; mark: Drawing; summary: string }[] = [
  {
    title: "Courtinate",
    href: "https://courtinate.io",
    mark: { Component: CourtinateLogo, top: COURTINATE_TOP },
    summary: "Where college club tennis teams find, enter, and run tournaments.",
  },
  {
    title: "Earnings Call Research",
    href: "https://github.com/cwruquants/research",
    mark: { Component: EarningsLogo, top: EARNINGS_TOP },
    summary: "How companies talk about risk on earnings calls, and how their stock reacts.",
  },
  {
    title: "cwrumotorsports.com",
    href: "https://cwrumotorsports.com",
    mark: { Component: Car, top: 0.175 },
    summary: "The team’s site, rebuilt from scratch in Next.js, with custom renders of the car.",
  },
  {
    title: "iLiterate",
    href: "https://iliterate.org",
    mark: { Component: ILiterateLogo, top: ILITERATE_TOP },
    summary: "Read real books in a new language; unknown words become flashcards.",
  },
];

function Section({ id, title, className, children }: { id: string; title: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={`hc-sec${className ? ` ${className}` : ""}`} aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} className="hc-sh">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** A team: the whole row plays its mark on hover (or a tap); the name links to the team. */
function Team({ org, href, role, mark, text }: (typeof TEAMS)[number]) {
  const { active, reduced, bind } = useActive();
  return (
    <li className="hc-job" {...bind}>
      <Mark drawing={mark} active={active} reduced={reduced} />
      <div className="hc-job-top">
        <h3 className="hc-org">
          <a className="hc-org-a" href={href} target="_blank" rel="noreferrer">
            {org}
          </a>
        </h3>
        <span className="hc-role">{role}</span>
      </div>
      <p className="hc-job-d">{text}</p>
    </li>
  );
}

/** A project: the whole row is a link out, and plays its mark on hover. */
function Project({ title, href, mark, summary }: (typeof PROJECTS)[number]) {
  const { active, reduced, bind } = useActive();
  return (
    <li>
      <a className="hc-row" href={href} target="_blank" rel="noreferrer" {...bind}>
        <Mark drawing={mark} active={active} reduced={reduced} />
        <span className="hc-row-t">{title}</span>
        <span className="hc-row-s">{summary}</span>
      </a>
    </li>
  );
}

export default function Home() {
  return (
    <div className={`hl ${fontVars}`}>
      <main className="hl-enter hc-wrap">
        <section className="hc-intro" aria-label="Introduction">
          <h1 className="hc-lede">I like building things that make people better at what they do, not replace them.</h1>
          <p className="hc-p">I study computer science, with a minor in math. My work ends up split between software, quant research, and hardware.</p>
          <p className="hc-socials">
            <a className="hc-social" href={`mailto:${EMAIL}`} aria-label="Email" title="Email">
              <FiMail aria-hidden />
            </a>
            <a className="hc-social" href="https://github.com/aretelew" target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub">
              <FiGithub aria-hidden />
            </a>
            <a className="hc-social" href="https://linkedin.com/in/aretelew" target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn">
              <FiLinkedin aria-hidden />
            </a>
            <ThemeToggle className="hc-social hc-theme" />
          </p>
        </section>

        <Section id="experience" title="Teams I’m on.">
          <ol className="hc-jobs">
            {TEAMS.map((t) => (
              <Team key={t.org} {...t} />
            ))}
          </ol>
        </Section>

        <Section id="work" title="Things I’m working on.">
          <ol className="hc-rows">
            {PROJECTS.map((p) => (
              <Project key={p.title} {...p} />
            ))}
          </ol>
        </Section>

        <Section id="education" title="Where I study." className="hc-edu">
          <p className="hc-school">Case Western Reserve University</p>
          <p className="hl-muted">
            Computer Science, minor in Math. <span className="hl-nobr">Class of 2028.</span>
          </p>
          <dl className="hc-dl">
            <dt className="hl-mono">Tools</dt>
            <dd>Python, Java, TypeScript, SQL, React, PyTorch</dd>
            <dt className="hl-mono">Certified</dt>
            <dd>
              <DrawnWord drawing={{ Component: Cad, meta: cadMeta, top: 0 }}>
                SolidWorks CAD Design Associate
              </DrawnWord>
            </dd>
            <dt className="hl-mono">Languages</dt>
            <dd>
              English, and fluent{" "}
              <DrawnWord drawing={{ Component: Polish, meta: polishMeta, top: 0 }} note="Polish: hi becomes cześć">
                Polish
              </DrawnWord>
            </dd>
          </dl>
        </Section>

        <Section id="about" title="Off the clock.">
          <p className="hc-prose">
            Away from a keyboard I play tennis and go climbing. Summers are for wakeboarding, winters for skiing. In between there is photography.
          </p>
        </Section>

        <Section id="contact" title="Say hello.">
          <Contact />
        </Section>
      </main>
      {/* the bottom edge of the screen: content blurs in and out of view as you scroll */}
      <div className="hl-blur" aria-hidden>
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}
