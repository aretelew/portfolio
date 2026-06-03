"use client";

import BlurText from "@/components/BlurText";
import { AnimatePresence, motion } from "motion/react";
import DotBackground from "@/components/DotBackground";
import { Button } from "@/components/ui/button";
// Featured project modals are shelved for now:
// import ProjectModal from "@/components/ProjectModal";
import ThemeToggle from "@/components/ThemeToggle";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  Mail,
  FileText,
  TrendingUp,
  Wrench,
  UserCheck,
  Terminal,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { FaJava, FaGithub } from "react-icons/fa";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiPython,
  SiPytorch,
  SiNodedotjs,
  SiAnsys,
  SiDassaultsystemes,
} from "react-icons/si";
import { SiSiemensNx } from "@/components/SiSiemensNx";


export default function Home() {
  const projectsSectionRef = useRef<HTMLElement>(null);
  const aboutSectionRef = useRef<HTMLDivElement>(null);
  const [showScrollArrow, setShowScrollArrow] = useState(true);
  const [emailCopied, setEmailCopied] = useState(false);
  // Featured project modals are shelved for now:
  // const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  // const [isModalOpen, setIsModalOpen] = useState(false);

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

  const motto = "Engineering technologies for a smarter future.";
  const descriptionLine1 = "software developer, quant researcher, &";
  const descriptionLine2 = "design engineer.";

  const expertiseAreas = [
    {
      title: "Quantitative Analysis & AI",
      description:
        "Developing NLP models and data pipelines to extract actionable market insights.",
      highlights: [
        "Sentiment Analysis & NLP",
        "Predictive Modeling & Feature Eng.",
      ],
      icon: TrendingUp,
    },
    {
      title: "Full-Stack Engineering",
      description:
        "Architecting performant web systems and tools using modern TypeScript ecosystems.",
      highlights: ["React, Next.js, & Vite", "System Optimization & UX"],
      icon: Terminal,
    },
    {
      title: "Mechanical Design",
      description:
        "Designing and manufacturing autonomous systems with CAD and advanced fabrication.",
      highlights: [
        "CAD (SolidWorks, NX) & Manufacturing",
        "Autonomous Navigation Systems",
      ],
      icon: Wrench,
    },
    {
      title: "Technical Leadership",
      description:
        "Leading cross-functional teams to deliver complex engineering and logistical projects.",
      highlights: [
        "Project Management & Strategy",
        "Team Mentorship & Logistics",
      ],
      icon: UserCheck,
    },
  ];

  const techStack = [
    { name: "Python", icon: SiPython },
    { name: "Java", icon: FaJava },
    { name: "React", icon: SiReact },
    { name: "Next.js", icon: SiNextdotjs },
    { name: "TypeScript", icon: SiTypescript },
    { name: "PyTorch", icon: SiPytorch },
    { name: "Node.js", icon: SiNodedotjs },
    { name: "Siemens NX", icon: SiSiemensNx },
    { name: "Ansys", icon: SiAnsys },
    { name: "Solidworks", icon: SiDassaultsystemes },
  ];

  const education = [
    {
      institution: "Case Western Reserve University",
      degree: "BS Computer Science, Minor in Math & Mech. Design",
      period: "2024 - Present",
      logo: "/cwru-seal.avif",
    },
    {
      institution: "Deerfield High School",
      degree: "High School Diploma",
      period: "2020 - 2024",
      logo: "/dhs-logo.png",
    },
  ];

  const projects = [
    {
      title: "Sentiment Analysis Engine",
      description:
        "Engineered a sentiment analysis data ingestion pipeline for 200,000+ earnings call documents. Architected a feature engineering process using TF-IDF and word embeddings to identify predictive market signals.",
      detailedDescription:
        "Built a comprehensive NLP pipeline for CWRU Quants to analyze sentiment patterns in earnings call transcripts. The system processes over 200,000 documents, extracting linguistic features and sentiment indicators that correlate with market movements. Implemented a multi-stage data ingestion pipeline with automated preprocessing, tokenization, and feature extraction. The pipeline generates high-dimensional feature vectors using both traditional TF-IDF approaches and modern word embeddings, enabling sophisticated quantitative analysis of market sentiment.",
      technicalDetails:
        "Architecture: Developed a scalable Python-based ETL pipeline using pandas for data manipulation and scikit-learn for feature engineering. Implemented TF-IDF vectorization with custom preprocessing to handle financial terminology and domain-specific language patterns. Integrated word2vec embeddings trained on financial texts to capture semantic relationships. Built a feature engineering framework that combines lexicon-based sentiment scoring with statistical measures of linguistic patterns. The system includes data validation, error handling, and logging mechanisms for production reliability.",
      images: [
        "https://picsum.photos/1200/675?random=1",
        "https://picsum.photos/1200/675?random=2",
        "https://picsum.photos/1200/675?random=3",
        "https://picsum.photos/1200/675?random=4",
      ],
      tech: ["Python", "NLP", "TF-IDF", "Word Embeddings", "Machine Learning"],
      github: "https://github.com/cwruquants/research",
      featured: true,
    },
    {
      title: "iLiterate",
      description:
        "Language learning platform where users read authentic content in their target language, highlight unknown words for instant translation, and automatically generate spaced-repetition flashcards from what they encounter.",
      detailedDescription:
        "Built as a team of four for CSDS 393. iLiterate replaces isolated vocabulary drills with contextual reading — users import texts, highlight unfamiliar words or phrases, and receive instant translations and definitions without leaving the page. Highlighted words are automatically turned into flashcards using a spaced-repetition algorithm. An LLM-powered content recommendation engine adapts difficulty based on reading history and proficiency level, keeping material challenging but approachable.",
      technicalDetails:
        "Stack: Next.js frontend deployed on Vercel, Supabase for auth and database, Python backend. LLM integration via Gemini for translation, quiz generation, and adaptive content recommendations. Features an EPUB reader with text highlighting, spaced repetition scheduling, reading progress tracking, and AI-generated quizzes. Database schema manages vocabulary, lesson sessions, reading progress, and user skill levels across multiple migrations.",
      images: [],
      tech: ["Next.js", "TypeScript", "Supabase", "Python", "Gemini", "Tailwind CSS"],
      github: "https://github.com/Hrishnugg/CSDS393Project",
      demo: "https://iliterate.org",
      featured: false,
    },
    {
      title: "CWRU Motorsports Website",
      description:
        "Complete redesign of the team website, increasing traffic by 18% with improved performance, maintainability, and user experience.",
      detailedDescription:
        "Led the complete redesign and redevelopment of the CWRU Motorsports team website, modernizing the tech stack and improving both user experience and developer productivity. The redesign focused on showcasing the team's engineering achievements, recruitment efforts, and sponsor relationships. Implemented performance optimizations that resulted in significantly faster load times and improved SEO rankings. The new site features responsive design, smooth animations, and intuitive navigation that increased visitor engagement by 18%. Collaborated with team leadership to define requirements and iterate on design feedback.",
      technicalDetails:
        "Stack: Built with React and TypeScript for type safety and component reusability. Used Vite as the build tool for lightning-fast development experience and optimized production builds. Styled with Tailwind CSS for rapid UI development and consistent design system. Architecture: Implemented component-based architecture with reusable UI elements and shared layouts. Used React Router for client-side routing and smooth page transitions. Optimized images with lazy loading and modern formats (WebP) to reduce bundle size. Implemented code splitting to minimize initial load time. Added SEO optimizations including meta tags, semantic HTML, and sitemap generation. Deployed with CI/CD pipeline for automated testing and deployment.",
      images: [
        "https://picsum.photos/1200/675?random=12",
        "https://picsum.photos/1200/675?random=13",
        "https://picsum.photos/1200/675?random=14",
      ],
      tech: ["TypeScript", "Vite", "React", "Tailwind CSS"],
      github: "https://github.com/aretelew",
      demo: "https://cwrumotorsports.com",
      featured: false,
    },
    {
      title: "Discord Message Summarizer",
      description:
        "Developed a Discord bot utilizing LLMs to summarize messages over specific timeframes, helping users catch up quickly.",
      detailedDescription:
        "Created an intelligent Discord bot for the CWRU Motorsports team that leverages large language models to generate concise summaries of channel conversations. The bot helps team members quickly catch up on discussions they've missed by providing context-aware summaries of messages from the past day, week, or custom timeframes. Designed with a focus on preserving important decisions, action items, and technical discussions while filtering out casual conversation. The bot includes intelligent context windowing to handle Discord's message limits and API rate restrictions.",
      technicalDetails:
        "Implementation: Built using Python with discord.py library for Discord API integration. Integrated OpenAI's GPT models for natural language understanding and summarization. Implemented a message aggregation system that fetches messages within specified timeframes and intelligently chunks them for LLM processing. Deployed on Heroku with automated health checks and error recovery. The bot includes command parsing, user permission validation, and configurable summarization styles (brief, detailed, technical-focused). Added caching mechanisms to avoid redundant API calls and reduce costs.",
      images: [
        "https://picsum.photos/1200/675?random=5",
        "https://picsum.photos/1200/675?random=6",
        "https://picsum.photos/1200/675?random=7",
      ],
      tech: ["Python", "LLMs", "Heroku"],
      github: "https://github.com/cwru-baja/baja-bot",
      featured: true,
    },
    {
      title: "Autonomous FPV Drone",
      description:
        "Custom-built drone with programmed microelectronics and autonomous return-to-home capabilities using Betaflight firmware.",
      detailedDescription:
        "Designed and assembled a custom FPV racing drone from scratch, featuring fully programmed flight controller and autonomous navigation capabilities. Implemented return-to-home functionality using GPS integration and failsafe protocols. The build includes custom-tuned PID controllers for stable flight characteristics, telemetry systems for real-time monitoring, and FPV video transmission for immersive piloting. Focused on balancing performance, reliability, and advanced autonomous features typically found in higher-end commercial drones.",
      technicalDetails:
        "Hardware: Custom frame assembly with carbon fiber components for optimal strength-to-weight ratio. Integrated F4 flight controller running Betaflight firmware with custom configuration. Installed GPS module for position holding and return-to-home functionality. Configured ESCs with BLHeli_32 firmware for precise motor control. Added OSD (On-Screen Display) for flight telemetry overlay. Software: Extensively tuned Betaflight parameters including PID loops, rates, and filters for responsive yet stable flight characteristics. Programmed autonomous modes using Betaflight's GPS rescue feature with custom failsafe configurations. Implemented telemetry protocols for real-time monitoring of battery voltage, GPS coordinates, and system status.",
      images: [
        "https://picsum.photos/1200/675?random=8",
        "https://picsum.photos/1200/675?random=9",
        "https://picsum.photos/1200/675?random=10",
        "https://picsum.photos/1200/675?random=11",
      ],
      tech: ["Betaflight", "Microelectronics"],
      featured: false,
    },
  ];

  return (
    <div className="relative overflow-hidden bg-white font-sans dark:bg-zinc-950">
      {/* Dot background with hover effect */}
      <DotBackground disabledZones={[aboutSectionRef, projectsSectionRef]} />

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
            className={`absolute bottom-8 left-1/2 -translate-x-1/2 motion-safe:animate-bounce transition-opacity duration-500 ${
              showScrollArrow ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Scroll down"
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
              aria-hidden="true"
            >
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </div>
        </section>

        {/* About Section */}
        <section className="w-full max-w-7xl py-20 sm:py-24">
          <div ref={aboutSectionRef} className="w-full space-y-4">
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
                  text="My work sits at the intersection of quantitative research, software development, and mechanical design. I focus on making complex systems work together—whether that's building NLP pipelines to analyze thousands of market documents, developing high-performance web apps, or designing hardware for autonomous systems. I'm driven by the challenge of translating complex technical requirements into tools that actually feel intuitive to the people using them."
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

          {/* Tools Row */}
          <div className="mt-12">
            <h3 className="mb-6 text-lg font-medium text-zinc-900 dark:text-zinc-50">
              Tools
            </h3>
            <div className="flex flex-wrap gap-3">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white/50 px-4 py-3 transition-colors transition-shadow hover:border-zinc-300 hover:bg-white/80 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/80"
                >
                  <tech.icon className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Below Row: Expertise + Education */}
          <div className="mt-12 flex flex-col gap-10">
            {/* Expertise Areas Grid with Icons */}
            <div>
              <h3 className="mb-6 text-lg font-medium text-zinc-900 dark:text-zinc-50">
                Expertise Areas
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {expertiseAreas.map((area, index) => {
                  const Icon = area.icon;
                  return (
                    <div
                      key={area.title}
                      className="group relative rounded-xl border border-zinc-200 bg-white/50 p-5 backdrop-blur-sm transition-colors transition-shadow hover:border-zinc-300 hover:bg-white/80 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/80"
                      style={{
                        opacity: 0,
                        animation: `fadeIn 0.5s ease-out ${0.6 + index * 0.1}s forwards`,
                      }}
                      suppressHydrationWarning
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 transition-transform transition-colors motion-safe:group-hover:scale-110 group-hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:group-hover:border-zinc-600">
                          <Icon className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                        </div>
                        <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                          {area.title}
                        </h4>
                      </div>
                      <p className="mb-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {area.description}
                      </p>
                      <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                        {area.highlights.map((item) => (
                          <div key={item} className="flex gap-2">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-500" />
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
                    className="group relative rounded-xl border border-zinc-200 bg-white/50 p-5 backdrop-blur-sm transition-colors transition-shadow hover:border-zinc-300 hover:bg-white/80 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/80"
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
            {/* Split Button for Email - Open Email Client or Copy */}
            <div className="flex overflow-hidden rounded-lg shadow-lg">
              <Button
                asChild
                className="rounded-none rounded-l-md border-0 bg-zinc-900 px-6 py-3 text-white hover:bg-zinc-800 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-400"
                size="lg"
              >
                <a href="mailto:aretelew@gmail.com">
                  <Mail />
                  Get in Touch
                </a>
              </Button>
              <div className="w-px bg-zinc-700 dark:bg-zinc-500" />
              <Button
                onClick={async () => {
                  const email = "aretelew@gmail.com";
                  try {
                    await navigator.clipboard.writeText(email);
                    setEmailCopied(true);
                    setTimeout(() => setEmailCopied(false), 2000);
                  } catch (err) {
                    console.error("Failed to copy email:", err);
                  }
                }}
                className="rounded-none rounded-r-md border-0 bg-zinc-900 px-4 py-3 text-white hover:bg-zinc-800 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-400"
                size="lg"
                aria-label={emailCopied ? "Copied!" : "Copy email to clipboard"}
                title={emailCopied ? "Copied!" : "Copy email to clipboard"}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {emailCopied ? (
                    <motion.span
                      key="check"
                      initial={{ rotateZ: -180, opacity: 0 }}
                      animate={{ rotateZ: 0, opacity: 1 }}
                      exit={{ rotateZ: 180, opacity: 0 }}
                      transition={{ duration: 0.08 }}
                      style={{ display: "inline-flex" }}
                    >
                      <Check className="size-4" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ rotateZ: -180, opacity: 0 }}
                      animate={{ rotateZ: 0, opacity: 1 }}
                      exit={{ rotateZ: 180, opacity: 0 }}
                      transition={{ duration: 0.08 }}
                      style={{ display: "inline-flex" }}
                    >
                      <Copy className="size-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-white/50 backdrop-blur-sm hover:bg-white/80 hover:shadow-lg dark:bg-zinc-900/50 dark:hover:bg-zinc-900/80"
            >
              <a
                href="/retelewski-resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText />
                View Resume
              </a>
            </Button>
          </div>
        </section>

        {/* Projects Section */}
        <section ref={projectsSectionRef} className="w-full max-w-7xl py-20 sm:py-24">
          <div className="flex flex-col gap-12">
            {/* Section Heading */}
            <h2 className="text-left text-4xl font-medium tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
              <BlurText
                text="Featured Projects"
                animateOn="view"
                revealDirection="word"
                duration={600}
                initialBlur={10}
                staggerDelay={0.05}
              />
            </h2>

            {/* Numbered List */}
            <div className="flex flex-col">
              {projects.map((project, index) => (
                <article
                  key={project.title}
                  className="group grid grid-cols-[5rem_1fr] items-start gap-6 py-8 sm:grid-cols-[6rem_1fr] sm:gap-12"
                >
                  {/* Number */}
                  <span className="text-5xl font-bold leading-none tracking-tight text-zinc-200 dark:text-zinc-800 group-hover:text-zinc-300 dark:group-hover:text-zinc-700 transition-colors select-none">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Title + Description + Tech + Links */}
                  <div className="flex flex-col gap-3 pt-1">
                    <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                      {project.description}
                    </p>
                    {/* Tech pills + links inline */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md bg-zinc-100 px-2 py-1 font-mono text-xs text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-400"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-50 ml-5"
                        >
                          <FaGithub className="size-3.5" />
                          GitHub
                        </a>
                      )}
                      {"demo" in project && project.demo && (
                        <a
                          href={project.demo as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-50 ml-2"
                        >
                          <ExternalLink className="size-3.5" />
                          Visit
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Large Text Footer Effect */}
      <footer className="relative z-10 w-full pt-8">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="relative">
            {/* Links overlaid directly on top of the letters */}
            <div className="absolute top-0 left-0 right-0 z-10 flex flex-wrap items-start justify-between gap-4 pt-2 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/aretelew"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/aretelew/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
                >
                  LinkedIn
                </a>
                <a
                  href="mailto:aretelew@gmail.com"
                  className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
                >
                  Email
                </a>
              </div>

              <div className="flex items-center gap-4">
                <span>© {new Date().getFullYear()} All rights reserved.</span>
                <ThemeToggle />
              </div>
            </div>

            {/* Stable clipping keeps the text intersecting the page bottom on every viewport */}
            <div className="h-[clamp(4.5rem,14.5vw,11.5rem)] overflow-hidden">
              <h2 className="select-none -mt-[0.14em] text-[clamp(5.5rem,23vw,20.5rem)] sm:text-[clamp(8rem,25.6vw,20.5rem)] font-bold leading-none tracking-[-0.06em] sm:tracking-tighter text-zinc-900 dark:text-zinc-50">
                aretelew
              </h2>
            </div>
          </div>
        </div>
      </footer>

      {/*
        Project Modal (shelved for now)
        
        <ProjectModal
          project={selectedProject}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      */}
    </div>
  );
}
