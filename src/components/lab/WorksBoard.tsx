"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import MoreCursor from "@/components/lab/MoreCursor";
import type { LabContent, LabProject } from "@/data/lab";

/**
 * WORKS — black ground, five projects placed rather than gridded.
 *
 * REPLACES FeaturedWork on the homepage (Ali, 2026-08-19). FeaturedWork
 * itself is untouched and still exported; the homepage simply points at
 * this instead, so reverting is one import.
 *
 * THE COMPOSITION IS DELIBERATELY UNEQUAL — but it is a grid underneath.
 * Five cards at five column spans and five vertical offsets above 1024px,
 * normal flow below it. An equal grid would say these are
 * interchangeable; they are not, and the largest one is the one with the
 * most to show. The placement lives in the stylesheet: see the note there
 * on why percentages of a fixed-height board were the wrong tool.
 *
 * THE HOVER IS THE SITE'S OWN. MoreCursor already existed for the work
 * grid — a dot that follows the pointer and swells into "More +" over a
 * card. The first pass drew a static "Explore" badge inside the frame
 * instead, which sat on top of the pending label on every project
 * without cover art. Reusing the component fixes the collision and stops
 * the page having two different ideas about what hovering a project
 * looks like.
 *
 * PLACEHOLDERS, NOT BORROWED IMAGERY. Three of the five have no cover
 * art. They render the project's own colour and say so. Filling them
 * with another client's photograph would attribute the wrong work to the
 * wrong business — the rule the whole site runs on.
 */

/** Each card arrives from a different edge. Uniform reveals read as a list. */
const CUTS = [
  "inset(100% 0 0 0)",
  "inset(0 0 100% 0)",
  "inset(100% 0 0 0)",
  "inset(100% 100% 0 0)",
  "inset(100% 0 0 100%)",
] as const;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

function WorkCard({
  project,
  index,
  pendingLabel,
}: {
  project: LabProject;
  index: number;
  pendingLabel: string;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const art = project.feature ?? project.cover;

  /* Reveal once. Leaving the viewport must not take it away again —
     see docs/motion.md. */
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      card.dataset.shown = "true";
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        card.dataset.shown = "true";
        observer.disconnect();
      },
      { threshold: 0.18 }
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  /* Internal parallax: the frame holds still, the picture inside it
     drifts. The image is taller than its box so there is something to
     drift into. */
  useEffect(() => {
    const card = cardRef.current;
    const media = imageRef.current;
    if (!card || !media) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const paint = () => {
      frame = 0;
      const rect = card.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
      const start = window.innerHeight * 0.96;
      const end = window.innerHeight * 0.28;
      const raw = clamp((start - rect.top) / (start - end));
      const progress = raw * raw * (3 - 2 * raw);
      media.style.transform = `translate3d(0, ${((0.5 - progress) * 54).toFixed(
        1
      )}px, 0) scale(${(1.06 - progress * 0.02).toFixed(4)})`;
    };
    const request = () => {
      if (frame) return;
      frame = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, []);

  return (
    <article
      ref={cardRef}
      className="works__card"
      data-cut={index}
      /* Only the reveal direction is inline now — the placement moved to
         the stylesheet when the board became a grid. */
      style={{ "--cut": CUTS[index] } as React.CSSProperties}
    >
      {/* data-more-target is what MoreCursor watches for — the pointer
          swells into the "More +" pill over a card and shrinks back to a
          dot between them. */}
      <Link href={`/work/${project.slug}`} className="works__link" data-more-target>
        <span className="works__frame">
          {art ? (
            <span ref={imageRef} className="works__media">
              <Image
                src={art.src}
                alt={art.alt}
                fill
                sizes="(max-width: 1024px) 88vw, 46vw"
                className="object-cover"
              />
            </span>
          ) : (
            <span className={`works__pending works__pending--${project.palette}`}>
              {pendingLabel}
            </span>
          )}
        </span>

        <span className="works__meta">
          <span className="works__name">{project.name}</span>
          <span className="works__sector">{project.sector}</span>
          <span className="works__arrow" aria-hidden="true">
            ↗
          </span>
        </span>
      </Link>
    </article>
  );
}

/*
 * The board's own order (Ali, 2026-08-19), not the data's.
 *
 * Qobban and Kids Island swap: the wide centre cell is the biggest thing
 * on the section and Qobban is the one of the two with finished
 * landscape art, so it gets the space and Kids Island takes the smaller
 * portrait until its imagery exists. Nothing else on the site reorders —
 * `content.projects` is untouched.
 */
const ORDER = ["petrolas", "delivery-point", "qobban", "kids-island", "nextshoot"];

export default function WorksBoard({ content }: { content: LabContent }) {
  const { works } = content.opening;
  const projects = ORDER.map((slug) =>
    content.projects.find((project) => project.slug === slug)
  ).filter((project): project is LabProject => Boolean(project));

  return (
    <section className="works" id="work" aria-labelledby="works-heading">
      <header className="works__head">
        <h2 id="works-heading" className="works__title">
          {works.title}
        </h2>
        <p className="works__statement">
          {works.statement.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
      </header>

      <MoreCursor>
        <div className="works__board">
          {projects.map((project, index) => (
            <WorkCard
              key={project.slug}
              project={project}
              index={index}
              pendingLabel={content.lobby.assetsPendingLabel}
            />
          ))}
        </div>
      </MoreCursor>

      <footer className="works__foot">
        <Link href="/work" className="works__all">
          View all
        </Link>
        <span className="works__count">
          ( {String(content.projects.length).padStart(2, "0")} )
        </span>
        <span className="works__mark">{works.mark}</span>
      </footer>
    </section>
  );
}
