"use client";

import BlurText from "@/components/BlurText";
import DotBackground from "@/components/DotBackground";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [showScrollArrow, setShowScrollArrow] = useState(true);

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
        "Building practical AI systems with focus on real-world impact",
    },
    {
      title: "Cognitive Science",
      description: "Understanding human cognition to inform better technology",
    },
    {
      title: "Human-Centered Design",
      description: "Creating interfaces that feel natural and intuitive",
    },
    {
      title: "Research & Development",
      description: "Bridging academic insights with practical applications",
    },
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

        {/* About Section */}
        <section className="w-full max-w-4xl py-20 sm:py-24">
          <div className="flex flex-col gap-12">
            {/* Section Heading */}
            <h2 className="text-center text-2xl font-medium tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
              <BlurText
                text="About"
                animateOn="view"
                revealDirection="word"
                duration={600}
                initialBlur={10}
                staggerDelay={0.05}
              />
            </h2>

            {/* Introduction */}
            <p className="text-center text-base leading-relaxed text-zinc-700 sm:text-lg dark:text-zinc-300">
              <BlurText
                text={aboutIntro}
                animateOn="view"
                revealDirection="word"
                duration={600}
                initialBlur={8}
                staggerDelay={0.02}
                delay={200}
              />
            </p>

            {/* Education */}
            <div className="flex flex-col gap-6 sm:gap-8">
              {education.map((edu, index) => (
                <div
                  key={edu.institution}
                  className="flex items-center gap-6 rounded-lg border border-zinc-200 bg-white/50 p-6 backdrop-blur-sm transition-all hover:border-zinc-300 hover:bg-white/80 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/80"
                >
                  {/* Logo */}
                  <div className="shrink-0">
                    <div className="h-16 w-16 overflow-hidden rounded-lg bg-white dark:bg-white">
                      <Image
                        src={edu.logo}
                        alt={`${edu.institution} logo`}
                        width={64}
                        height={64}
                        className="h-full w-full object-contain p-2"
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-1">
                    <h3 className="font-medium tracking-tight text-zinc-900 dark:text-zinc-50">
                      <BlurText
                        text={edu.institution}
                        animateOn="view"
                        revealDirection="word"
                        duration={500}
                        initialBlur={8}
                        staggerDelay={0.03}
                        delay={400 + index * 150}
                      />
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
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
                    <p className="font-mono text-xs text-zinc-500 dark:text-zinc-500">
                      <BlurText
                        text={edu.period}
                        animateOn="view"
                        revealDirection="word"
                        duration={500}
                        initialBlur={6}
                        staggerDelay={0.02}
                        delay={550 + index * 150}
                      />
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Expertise Areas - simplified without cards */}
            <div className="flex flex-wrap justify-center gap-3">
              {expertiseAreas.map((area, index) => (
                <span
                  key={area.title}
                  className="rounded-full border border-zinc-200 bg-white/50 px-4 py-2 font-mono text-sm text-zinc-700 backdrop-blur-sm transition-all hover:border-zinc-300 hover:bg-white/80 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/80"
                >
                  <BlurText
                    text={area.title}
                    animateOn="view"
                    revealDirection="word"
                    duration={500}
                    initialBlur={6}
                    staggerDelay={0.02}
                    delay={700 + index * 100}
                  />
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="w-full max-w-6xl py-20 sm:py-24">
          <div className="flex flex-col gap-12">
            {/* Section Heading */}
            <h2 className="text-center text-2xl font-medium tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
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
              className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              aria-label="GitHub"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              aria-label="Twitter"
            >
              Twitter
            </a>
            <a
              href="mailto:your.email@example.com"
              className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              aria-label="Email"
            >
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
