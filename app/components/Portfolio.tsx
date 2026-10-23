"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Icon, { Asterisk } from "./Icon";
import MotionStudy from "./MotionStudy";
import CreativePlayground from "./CreativePlayground";
import { contact, filters, materials, projects } from "../lib/content";
import type { Project, ProjectFilter, SculptureMaterial } from "../lib/content";

const SpatialScene = dynamic(() => import("./SpatialScene"), {
  ssr: false,
  loading: () => (
    <div className="spatial-canvas" aria-hidden="true">
      <div className="sculpture-fallback material-jade">
        <i />
        <i />
        <i />
      </div>
    </div>
  ),
});
const navItems = [
  { id: "home", label: "Home", icon: "home" },
  { id: "work", label: "Work", icon: "grid" },
  { id: "about", label: "About", icon: "person" },
  { id: "play", label: "Play", icon: "spark" },
] as const;

function ProjectArtwork({ project }: { project: Project }) {
  return (
    <div className="project-artwork">
      <div className="project-browser" aria-hidden="true">
        <span className="browser-dots"><i /><i /><i /></span>
        <span className="project-domain">{new URL(project.site).hostname}</span>
        <Icon name="upRight" />
      </div>
      <Image
        className="project-screenshot"
        src={project.preview}
        alt={project.name + " homepage screenshot"}
        width={1348}
        height={926}
        sizes="(max-width: 600px) calc(100vw - 48px), (max-width: 820px) calc((100vw - 68px) / 2), 560px"
        loading="lazy"
      />
      <div className="art-glare" aria-hidden="true" />
    </div>
  );
}

export default function Portfolio() {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const [motion, setMotion] = useState(false);
  const [preferencesReady, setPreferencesReady] = useState(false);
  const [material, setMaterial] = useState<SculptureMaterial>("Jade");
  const [filter, setFilter] = useState<ProjectFilter>("All work");
  const [activeSection, setActiveSection] = useState("home");
  const [copied, setCopied] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const contactHref = contact.email
    ? "mailto:" + contact.email
    : contact.github;
  const contactValue = contact.email || contact.github;
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visibleProjects = projects.filter(
    (project) => filter === "All work" || project.category === filter,
  );

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    function readPreference() {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem("joel-motion-v1");
      } catch {
        /* Storage is optional. */
      }
      setMotion(
        stored === "off" ? false : stored === "on" ? true : !preference.matches,
      );
      setPreferencesReady(true);
    }
    readPreference();
    preference.addEventListener("change", readPreference);
    return () => {
      preference.removeEventListener("change", readPreference);
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  useEffect(() => {
    const container = root.current;
    if (!container || !preferencesReady) return;
    const revealNodes =
      container.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!motion || !("IntersectionObserver" in window)) {
      revealNodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    container.classList.add("effects-ready");
    revealNodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [motion, filter, preferencesReady]);

  useEffect(() => {
    const container = root.current;
    if (!container) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const value = scrollable > 0 ? window.scrollY / scrollable : 0;
      if (progress.current)
        progress.current.style.transform = "scaleX(" + value + ")";
      const sections = navItems
        .map((item) => document.getElementById(item.id))
        .filter((node) => node !== null);
      const active = sections.reduce(
        (result, section) =>
          section.getBoundingClientRect().top <= window.innerHeight * 0.4
            ? section.id
            : result,
        "home",
      );
      setActiveSection((previous) => (previous === active ? previous : active));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const container = root.current;
    if (
      !container ||
      !motion ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    )
      return;
    const cleanups: (() => void)[] = [];
    container.querySelectorAll<HTMLElement>("[data-tilt]").forEach((node) => {
      const move = (event: PointerEvent) => {
        const rect = node.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        node.style.setProperty("--rx", (0.5 - y) * 5 + "deg");
        node.style.setProperty("--ry", (x - 0.5) * 7 + "deg");
        node.style.setProperty("--px", x * 100 + "%");
        node.style.setProperty("--py", y * 100 + "%");
      };
      const leave = () => {
        node.style.setProperty("--rx", "0deg");
        node.style.setProperty("--ry", "0deg");
      };
      node.addEventListener("pointermove", move, { passive: true });
      node.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        node.removeEventListener("pointermove", move);
        node.removeEventListener("pointerleave", leave);
        leave();
      });
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [motion, filter]);

  function toggleMotion() {
    const next = !motion;
    setMotion(next);
    try {
      localStorage.setItem("joel-motion-v1", next ? "on" : "off");
    } catch {
      /* Keep working without storage. */
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contactValue);
      setCopied(true);
      setCopyMessage(
        contact.email ? "Email address copied." : "Profile link copied.",
      );
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => {
        setCopied(false);
        setCopyMessage("");
      }, 2500);
    } catch {
      setCopyMessage("Copy isn’t available here. " + contactValue);
    }
  }

  return (
    <div
      ref={root}
      className="portfolio"
      data-motion={motion ? "on" : "off"}
      data-material={material.toLowerCase()}
    >
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div ref={progress} className="scroll-progress" aria-hidden="true" />
      <header className="site-header page-width">
        <a className="wordmark" href="#home" aria-label="Joel Soyemi, home">
          <span className="brand-mark">
            <Asterisk />
          </span>
          <span>
            Joel Soyemi<span className="wordmark-sub">FRONTEND DEVELOPER</span>
          </span>
        </a>
        <span className="header-location">
          <span className="live-dot" />
          LAGOS, NIGERIA <span className="location-line" /> OPEN TO PART-TIME
          WORK
        </span>
        <a className="header-contact" href={contactHref}>
          Let’s talk{" "}
          <span>
            <Icon name="upRight" />
          </span>
        </a>
      </header>

      <main id="main">
        <section
          id="home"
          className="hero page-width"
          aria-labelledby="hero-title"
        >
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span className="short-line" /> A DEVELOPER WITH A DIFFERENT
              PERSPECTIVE
            </div>
            <h1 id="hero-title">
              <span>Code with</span>
              <span>logic. Design</span>
              <span>
                with <em>feeling.</em>
                <span className="heading-star">
                  <Asterisk />
                </span>
              </span>
            </h1>
            <p>
              I’m Joel, a frontend developer in Lagos.
              <br className="desktop-break" /> I build thoughtful digital
              experiences
              <br className="desktop-break" /> with a little depth and a lot of
              detail.
            </p>
            <div className="hero-actions">
              <a className="button button-dark" href="#work">
                Explore my work <Icon name="down" />
              </a>
              <a className="text-link" href="#about">
                A little about me <Icon name="upRight" />
              </a>
            </div>
            <div className="hero-note">
              <span className="note-line" />
              <span>
                GOOD ON THE SURFACE.
                <br />
                <b>THOUGHTFUL UNDERNEATH.</b>
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-orbit orbit-outer" aria-hidden="true" />
            <div className="visual-orbit orbit-inner" aria-hidden="true" />
            <div className="visual-grid" aria-hidden="true" />
            <span className="visual-cross cross-top" aria-hidden="true">
              +
            </span>
            <span className="visual-cross cross-bottom" aria-hidden="true">
              +
            </span>
            <span className="scene-index">A STUDY IN PERSPECTIVE — 001</span>
            <div className="sculpture-wrap">
              <SpatialScene motion={motion} material={material} />
            </div>
            <div className="floating-note glass">
              <span className="note-icon">
                <Asterisk />
              </span>
              <div>
                A little unexpected.<span>That’s where it starts.</span>
              </div>
              <span className="note-dot" />
            </div>
            <div
              className="material-switcher glass"
              role="group"
              aria-label="Sculpture material"
            >
              {materials.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setMaterial(name)}
                  aria-pressed={material === name}
                >
                  <span className={"material-dot dot-" + name.toLowerCase()} />
                  {name}
                </button>
              ))}
            </div>
            <span className="scene-hint">
              <span className="drag-icon" aria-hidden="true">
                ↔
              </span>{" "}
              {motion
                ? "Drag to see it differently"
                : "Use arrow keys to explore"}
            </span>
          </div>
          <div className="hero-bottom">
            <a href="#work">
              <span className="scroll-circle">
                <Icon name="down" />
              </span>{" "}
              SCROLL TO DISCOVER
            </a>
            <span>
              CRAFT, CURIOSITY & A LITTLE CODE.
              <span className="tiny-star">✳</span>
            </span>
          </div>
        </section>

        <div
          className="skills-strip"
          aria-label="React, Next.js, TypeScript, responsive interfaces, and creative development"
        >
          <div className="skills-track">
            {[0, 1].map((copy) => (
              <div className="skills-set" key={copy} aria-hidden="true">
                {[
                  "REACT",
                  "NEXT.JS",
                  "TYPESCRIPT",
                  "RESPONSIVE INTERFACES",
                  "CREATIVE DEVELOPMENT",
                ].map((skill) => (
                  <span key={skill}>
                    {skill}
                    <Asterisk />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <section
          id="work"
          className="work-section page-width"
          aria-labelledby="work-title"
        >
          <div className="section-intro" data-reveal>
            <div>
              <span className="eyebrow">
                <span className="section-number">01 /</span> SELECTED WORK
              </span>
              <h2 id="work-title">
                Good ideas.
                <br />
                <em>Real projects.</em>
              </h2>
            </div>
            <p>
              Different problems. Different perspectives.
              <br />A few things I’ve been building.
            </p>
          </div>
          <div
            className="project-filters"
            role="group"
            aria-label="Filter projects"
          >
            {filters.map((name) => (
              <button
                key={name}
                type="button"
                aria-pressed={filter === name}
                onClick={() => setFilter(name)}
              >
                {name}
                <span>
                  {name === "All work"
                    ? projects.length
                    : projects.filter((project) => project.category === name)
                        .length}
                </span>
              </button>
            ))}
            <span className="work-count" aria-live="polite">
              {visibleProjects.length} PROJECT
              {visibleProjects.length === 1 ? "" : "S"}
            </span>
          </div>
          <div className="project-grid">
            {visibleProjects.map((project, index) => (
              <article
                className={"project-card project-" + project.id}
                key={project.id}
                data-reveal
                data-tilt
                style={
                  {
                    "--reveal-delay": Math.min(index, 1) * 90 + "ms",
                  } as CSSProperties
                }
              >
                <a
                  className="project-image-link"
                  href={project.site}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={
                    "Visit " + project.name +
                    (project.privatePreview ? " private preview, access code required" : " website") +
                    ", opens in a new tab"
                  }
                >
                  <ProjectArtwork project={project} />
                  <span className="project-view">
                    <Icon name="upRight" />
                  </span>
                </a>
                <div className="project-details">
                  <div className="project-caption">
                    <div>
                      <span className="project-type">
                        {project.category.toUpperCase()} / {project.number}
                      </span>
                      <h3>
                        <a href={project.site} target="_blank" rel="noreferrer">
                          {project.name}
                          <span className="sr-only">
                            {" "}
                            website, opens in a new tab
                          </span>
                        </a>
                      </h3>
                    </div>
                    <a
                      className="project-source"
                      href={project.source}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={
                        "View " +
                        project.name +
                        " source on GitHub, opens in a new tab"
                      }
                    >
                      <Icon name="github" />
                    </a>
                  </div>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <div className="project-actions">
                    <a className="project-live" href={project.site} target="_blank" rel="noreferrer">
                      {project.privatePreview ? "View preview" : "Visit site"}
                      <Icon name="upRight" />
                      <span className="sr-only"> for {project.name}, opens in a new tab</span>
                    </a>
                    {project.privatePreview && <span className="project-access">Private preview · access code required</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>
          <a
            className="github-link"
            href={contact.github + "?tab=repositories"}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="github" /> There’s more on GitHub{" "}
            <Icon name="upRight" />
            <span className="sr-only">, opens in a new tab</span>
          </a>
        </section>

        <section
          id="about"
          className="about-section"
          aria-labelledby="about-title"
        >
          <div className="about-inner page-width">
            <div className="about-heading" data-reveal>
              <span className="eyebrow">
                <span className="section-number">02 /</span> THE PERSON BEHIND
                THE PIXELS
              </span>
              <h2 id="about-title">
                Built with
                <br />
                curiosity.
                <br />
                <em>
                  Finished
                  <br />
                  with care.
                </em>
              </h2>
              <Asterisk className="about-asterisk" />
            </div>
            <div className="about-copy" data-reveal>
              <span className="about-greeting">
                Hello, I’m Joel.<span>✳</span>
              </span>
              <p>
                I’m a Computer Science student at Olabisi Onabanjo University,
                building my way through the web one thoughtful project at a
                time.
              </p>
              <p>
                My focus is frontend development: clear interfaces, responsive
                layouts, and the small details that make a website feel right. I
                enjoy the space where technical thinking meets a good visual
                idea.
              </p>
              <div className="about-details">
                <div>
                  <span>BASED IN</span>
                  <strong>Lagos, Nigeria</strong>
                </div>
                <div>
                  <span>CURRENTLY OPEN TO</span>
                  <strong>Part-time & freelance work</strong>
                </div>
                <div>
                  <span>MY EVERYDAY TOOLKIT</span>
                  <strong>React · Next.js · TypeScript · CSS · Git</strong>
                </div>
              </div>
              <a className="about-link" href={contactHref}>
                Let’s make something together <Icon name="upRight" />
              </a>
            </div>
          </div>
        </section>

        <section
          id="play"
          className="play-section page-width"
          aria-labelledby="play-title"
        >
          <div className="play-copy" data-reveal>
            <span className="eyebrow">
              <span className="section-number">03 /</span> A LITTLE PLAY GOES A
              LONG WAY
            </span>
            <h2 id="play-title">
              A serious
              <br />
              <em>case for play.</em>
            </h2>
            <p>
              Bend a word. Scatter a small universe. Throw something around.
              A few ideas that made it out of my sketchbook.
            </p>
            <p>
              Touch, type, drag, and see what happens. This part of the portfolio
              is yours to mess with.
            </p>
          </div>
          <CreativePlayground motion={motion} />
          <div className="micro-lab-copy" data-reveal>
            <span className="eyebrow">AND THEN THERE ARE THE SMALL DETAILS.</span>
            <h3>A little pull.<br /><em>A new perspective.</em></h3>
            <p>Three small studies in how an interface responds to you. Because the little things count, too.</p>
            <div className="play-line" aria-hidden="true">
              <svg viewBox="0 0 260 75">
                <path d="M4 40C38 3 59 73 91 39S147 3 176 37s51 29 68-4m-15 1 15-1 3 16" />
              </svg>
              <span>YOUR TURN</span>
            </div>
          </div>
          <MotionStudy motion={motion} />
        </section>

        <section
          id="contact"
          className="contact-section page-width"
          aria-labelledby="contact-title"
          data-reveal
        >
          <div className="contact-top">
            <span className="eyebrow">
              <span className="section-number">04 /</span> SOMETHING IN MIND?
            </span>
            <span className="availability">
              <span className="live-dot" /> OPEN TO CONVERSATIONS
            </span>
          </div>
          <h2 id="contact-title">
            Let’s build
            <br />
            something <em>good.</em>
            <Asterisk />
          </h2>
          <div className="contact-bottom">
            <a className="contact-email" href={contactHref}>
              {contact.email || "Find me on GitHub"}
              <Icon name="upRight" />
            </a>
            <button type="button" className="copy-button" onClick={copyEmail}>
              <Icon name={copied ? "check" : "copy"} />
              {copied ? "Copied!" : contact.email ? "Copy email" : "Copy link"}
            </button>
            <span className="contact-note">
              GOOD THINGS START
              <br />
              WITH A SIMPLE HELLO.
            </span>
          </div>
          <p className="copy-status" role="status">
            {copyMessage}
          </p>
        </section>
      </main>
      <footer className="site-footer page-width">
        <a className="footer-logo" href="#home">
          JOEL SOYEMI<span>© 2026</span>
        </a>
        <span>MADE WITH INTENTION. AND A LITTLE CURIOSITY.</span>
        <div>
          <a href={contact.github} target="_blank" rel="noreferrer">
            GitHub <Icon name="upRight" />
            <span className="sr-only">, opens in a new tab</span>
          </a>
          <a href={contact.pinterest} target="_blank" rel="noreferrer">
            Pinterest <Icon name="upRight" />
            <span className="sr-only">, opens in a new tab</span>
          </a>
        </div>
      </footer>

      <nav className="glass dock" aria-label="Main navigation">
        <div className="dock-links">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={"#" + item.id}
              className={activeSection === item.id ? "dock-active" : ""}
              aria-current={activeSection === item.id ? "location" : undefined}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </a>
          ))}
        </div>
        <span className="dock-divider" />
        <a className="dock-contact" href="#contact" aria-label="Contact Joel">
          <Icon name="mail" />
        </a>
      </nav>
      <button
        type="button"
        className="motion-toggle glass"
        onClick={toggleMotion}
        aria-pressed={motion}
        aria-label={motion ? "Pause animated motion" : "Enable animated motion"}
      >
        <Icon name={motion ? "pause" : "play"} />
        <span>Motion {motion ? "on" : "off"}</span>
      </button>
    </div>
  );
}
