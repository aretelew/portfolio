"use client";

import BlurText from "@/components/BlurText";
import DotBackground from "@/components/DotBackground";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Brain, Users, Lightbulb, GraduationCap, Mail, FileText, ArrowDown } from "lucide-react";
import { SiReact, SiNextdotjs, SiTypescript, SiPython, SiPytorch, SiTensorflow, SiNodedotjs, SiGithub, SiLinkedin, SiX } from "react-icons/si";

export default function Home() {
  const [showScrollArrow, setShowScrollArrow] = useState(true);
  const [asciiArt, setAsciiArt] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollArrow(false);
      } else {
        setShowScrollArrow(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/ascii-portrait.txt")
      .then((res) => res.text())
      .then((text) => setAsciiArt(text))
      .catch((err) => console.error("Failed to load ASCII art:", err));
  }, []);

  const motto = "Building technologies to augment human intelligence.";
  const descriptionLine1 =
    "applied AI engineer, cognitive science researcher, &";
  const descriptionLine2 = "human‑centered technologist.";

  const aboutIntro =
    "I'm passionate about creating AI systems that enhance rather than replace human capabilities. My work sits at the intersection of machine learning, cognitive science, and user experience—exploring how technology can amplify our natural intelligence while remaining deeply human-centered.";

  const expertiseAreas = [
    {
      title: "Applied AI & ML",
      description:
        "Building practical AI systems that deliver measurable real-world value.",
      highlights: [
        "Model prototyping, evaluation, and deployment",
        "Human-in-the-loop workflows and feedback loops",
      ],
      icon: Brain,
    },
    {
      title: "Cognitive Science",
      description:
        "Understanding cognition to design systems that feel intuitive and adaptive.",
      highlights: [
        "Attention, memory, and decision-making research",
        "Behavioral insights applied to product design",
      ],
      icon: GraduationCap,
    },
    {
      title: "Human-Centered Design",
      description:
        "Designing interfaces that balance clarity, trust, and usability.",
      highlights: [
        "Interaction design for complex AI workflows",
        "Accessibility and inclusive design practices",
      ],
      icon: Users,
    },
    {
      title: "Research & Development",
      description:
        "Bridging academic insights with pragmatic engineering decisions.",
      highlights: [
        "Rapid experiments and validation cycles",
        "Translating research into deployable systems",
      ],
      icon: Lightbulb,
    },
  ];

  const techStack = [
    { name: "React", icon: SiReact },
    { name: "Next.js", icon: SiNextdotjs },
    { name: "TypeScript", icon: SiTypescript },
    { name: "Python", icon: SiPython },
    { name: "PyTorch", icon: SiPytorch },
    { name: "TensorFlow", icon: SiTensorflow },
    { name: "Node.js", icon: SiNodedotjs },
  ];

  const education = [
    {
      institution: "Case Western Reserve University",
      degree: "Bachelor of Science in Computer Science",
      period: "2024 - Present",
      logo: "/cwru-seal.avif", // Add your college logo path
    },
    {
      institution: "Deerfield High School",
      degree: "High School Diploma",
      period: "2020 - 2024",
      logo: "/dhs-logo.png", // Add your high school logo path
    },
  ];

  const projects = [
    {
      title: "Neural Interface Framework",
      description:
        "An open-source framework for building intuitive brain-computer interfaces using EEG signals. Implements real-time signal processing and ML models for gesture recognition.",
      tech: ["Python", "TensorFlow", "React", "WebSockets"],
      github: "https://github.com",
      demo: "https://demo.com",
      featured: true,
    },
    {
      title: "Cognitive Load Monitor",
      description:
        "Real-time cognitive load assessment tool using eye-tracking and behavioral data to optimize learning experiences.",
      tech: ["TypeScript", "Next.js", "Python", "FastAPI"],
      github: "https://github.com",
      featured: false,
    },
    {
      title: "Adaptive UI Engine",
      description:
        "Machine learning system that adapts user interfaces based on individual interaction patterns and accessibility needs.",
      tech: ["React", "Node.js", "PostgreSQL", "scikit-learn"],
      github: "https://github.com",
      demo: "https://demo.com",
      featured: false,
    },
    {
      title: "Research Paper Explorer",
      description:
        "AI-powered tool for navigating academic literature with semantic search and interactive knowledge graphs.",
      tech: ["Python", "OpenAI", "D3.js", "Neo4j"],
      github: "https://github.com",
      featured: true,
    },
  ];

  return (
    <div className="relative overflow-hidden bg-white font-sans dark:bg-zinc-950">
      {/* Dot background with hover effect */}
      <DotBackground />

      {/* Content */}
      <main className="relative z-10 flex w-full flex-col items-center px-6">
        {/* Hero Section */}
        <section className="relative flex min-h-screen w-full flex-col items-center justify-center gap-4 text-center">
          <h1 className="max-w-2xl text-balance text-3xl font-medium italic tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            <BlurText
              text={motto}
              animateOn="view"
              revealDirection="word"
              duration={750}
              initialBlur={10}
              staggerDelay={0.05}
            />
          </h1>
          <p className="max-w-2xl text-balance text-sm font-mono tracking-tight text-zinc-700 sm:text-base dark:text-zinc-300">
            <BlurText
              text={descriptionLine1}
              animateOn="view"
              revealDirection="word"
              duration={500}
              initialBlur={8}
              staggerDelay={0.04}
              delay={300}
            />
            <br />
            <BlurText
              text={descriptionLine2}
              animateOn="view"
              revealDirection="word"
              duration={500}
              initialBlur={8}
              staggerDelay={0.04}
              delay={400}
            />
          </p>

          {/* Scroll Down Arrow */}
          <div
            className={`absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce transition-opacity duration-500 ${
              showScrollArrow ? "opacity-100" : "opacity-0"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-zinc-500 dark:text-zinc-400"
            >
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </div>
        </section>

        {/* About Section - Redesigned with Asymmetric Layout */}
        <section className="w-full max-w-7xl py-20 sm:py-24">
          {/* Top Row: ASCII Art + About Text */}
          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[auto_1fr] lg:gap-15">
            {/* Left Column - ASCII Art */}
            <div className="flex flex-col gap-8">
              <div className="relative">
                <div className="relative aspect-square w-full max-w-xs mx-auto lg:mx-0">
                  <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-950 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="relative flex h-full w-full items-center justify-center p-1">
                      <pre className="font-mono text-[0.08rem] leading-[0.08rem] text-zinc-300 whitespace-pre scale-100 origin-center">
                        {asciiArt || "Loading..."}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - About Text */}
            <div className="flex flex-col gap-6">
              <div className="space-y-4">
                <h2 className="text-4xl font-medium tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
                  <BlurText
                    text="About"
                    animateOn="view"
                    revealDirection="word"
                    duration={600}
                    initialBlur={10}
                    staggerDelay={0.05}
                  />
                </h2>
                <div className="space-y-3">
                  <p className="text-lg leading-relaxed text-zinc-700 sm:text-xl dark:text-zinc-300">
                    <BlurText
                      text="I'm passionate about creating AI systems that enhance rather than replace human capabilities."
                      animateOn="view"
                      revealDirection="word"
                      duration={600}
                      initialBlur={8}
                      staggerDelay={0.02}
                      delay={200}
                    />
                  </p>
                  <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                    <BlurText
                      text="My work sits at the intersection of machine learning, cognitive science, and user experience—exploring how technology can amplify our natural intelligence while remaining deeply human-centered."
                      animateOn="view"
                      revealDirection="word"
                      duration={600}
                      initialBlur={6}
                      staggerDelay={0.02}
                      delay={400}
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Below Row: Expertise + Education */}
          <div className="mt-12 flex flex-col gap-10">
            {/* Expertise Areas Grid with Icons */}
            <div>
              <h3 className="mb-6 text-lg font-medium text-zinc-900 dark:text-zinc-50">
                Expertise Areas
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {expertiseAreas.map((area, index) => {
                  const Icon = area.icon;
                  return (
                    <div
                      key={area.title}
                      className="group relative rounded-xl border border-zinc-200 bg-white/50 p-4 backdrop-blur-sm transition-all hover:border-zinc-300 hover:bg-white/80 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/80"
                      style={{
                        opacity: 0,
                        animation: `fadeIn 0.5s ease-out ${0.6 + index * 0.1}s forwards`,
                      }}
                    >
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 transition-transform group-hover:scale-110">
                        <Icon className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                      </div>
                      <h4 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                        {area.title}
                      </h4>
                      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {area.description}
                      </p>
                      <div className="mt-3 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                        {area.highlights.map((item) => (
                          <div key={item} className="flex gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className="mb-5 text-lg font-medium text-zinc-900 dark:text-zinc-50">
                Education
              </h3>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {education.map((edu, index) => (
                  <div
                    key={edu.institution}
                    className="group relative rounded-xl border border-zinc-200 bg-white/60 p-5 shadow-sm transition-all hover:border-zinc-300 hover:bg-white/80 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/80"
                  >
                    <div className="flex items-start gap-4">
                      <div className="shrink-0">
                        <div className="h-14 w-14 overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-white">
                          <Image
                            src={edu.logo}
                            alt={`${edu.institution} logo`}
                            width={56}
                            height={56}
                            className="h-full w-full object-contain p-2"
                          />
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col gap-2">
                        <div className="flex items-center justify-between gap-3">
                          <span className="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1 font-mono text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                            <BlurText
                              text={edu.period}
                              animateOn="view"
                              revealDirection="word"
                              duration={400}
                              initialBlur={4}
                              staggerDelay={0.02}
                              delay={300 + index * 150}
                            />
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                          <BlurText
                            text={edu.institution}
                            animateOn="view"
                            revealDirection="word"
                            duration={500}
                            initialBlur={8}
                            staggerDelay={0.03}
                            delay={400 + index * 150}
                          />
                        </h4>
                        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                          <BlurText
                            text={edu.degree}
                            animateOn="view"
                            revealDirection="word"
                            duration={500}
                            initialBlur={6}
                            staggerDelay={0.02}
                            delay={500 + index * 150}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={() => {
                const footer = document.querySelector("footer");
                footer?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:bg-zinc-50 dark:text-zinc-900"
            >
              <Mail className="h-4 w-4 transition-transform group-hover:rotate-12" />
              Get in Touch
            </button>
            
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white/50 px-6 py-3 font-medium text-zinc-900 backdrop-blur-sm transition-all hover:border-zinc-300 hover:bg-white/80 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/80"
            >
              <FileText className="h-4 w-4" />
              View Resume
            </a>
          </div>
        </section>

        {/* Projects Section */}
        <section className="w-full max-w-7xl py-20 sm:py-24">
          <div className="flex flex-col gap-12">
            {/* Section Heading */}
            <h2 className="text-center text-4xl font-medium tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
              <BlurText
                text="Featured Projects"
                animateOn="view"
                revealDirection="word"
                duration={600}
                initialBlur={10}
                staggerDelay={0.05}
              />
            </h2>

            {/* Bento Grid */}
            <div className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <div
                  key={project.title}
                  className={`group relative flex flex-col justify-between rounded-lg border border-zinc-200 bg-white/50 p-6 backdrop-blur-sm transition-all hover:border-zinc-300 hover:bg-white/80 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/80 ${
                    project.featured ? "md:col-span-2 lg:col-span-2" : ""
                  }`}
                >
                  {/* Project Info */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="mb-3 text-lg font-medium tracking-tight text-zinc-900 dark:text-zinc-50">
                        <BlurText
                          text={project.title}
                          animateOn="view"
                          revealDirection="word"
                          duration={500}
                          initialBlur={8}
                          staggerDelay={0.03}
                          delay={300 + index * 100}
                        />
                      </h3>
                      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                        <BlurText
                          text={project.description}
                          animateOn="view"
                          revealDirection="word"
                          duration={500}
                          initialBlur={6}
                          staggerDelay={0.01}
                          delay={400 + index * 100}
                        />
                      </p>
                    </div>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, techIndex) => (
                        <span
                          key={tech}
                          className="rounded-md bg-zinc-100 px-2 py-1 font-mono text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                          style={{
                            opacity: 0,
                            animation: `fadeIn 0.5s ease-out ${0.6 + index * 0.1 + techIndex * 0.05}s forwards`,
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="mt-6 flex gap-4">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-sm text-zinc-600 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:decoration-zinc-700 dark:hover:text-zinc-50"
                      >
                        GitHub →
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-sm text-zinc-600 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:decoration-zinc-700 dark:hover:text-zinc-50"
                      >
                        Live Demo →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-12 sm:flex-row sm:justify-between">
          {/* Copyright */}
          <div className="text-center text-sm text-zinc-600 dark:text-zinc-400 sm:text-left">
            © {new Date().getFullYear()} All rights reserved.
          </div>

          {/* Social Links */}
          <div className="flex gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              aria-label="GitHub"
            >
              <SiGithub className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              aria-label="LinkedIn"
            >
              <SiLinkedin className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              aria-label="Twitter"
            >
              <SiX className="h-5 w-5" />
            </a>
            <a
              href="mailto:your.email@example.com"
              className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
