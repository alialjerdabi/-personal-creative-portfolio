"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MoreCursor from "@/components/lab/MoreCursor";
import ProjectModal from "@/components/lab/ProjectModal";
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
  onOpen,
}: {
  project: LabProject;
  index: number;
  pendingLabel: string;
  onOpen: (trigger: HTMLButtonElement) => void;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
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
      {/*
        A BUTTON, NOT A LINK (Ali, 2026-08-20).
        
        It opens the popup rather than navigating, because there are two
        destinations — the case study and the live site — and a card that
        silently picked one would be guessing. The popup names both. This
        is the same interaction FeaturedWork and the /work mosaic already
        use, so the page has one idea about what clicking a project does.

        data-more-target is what MoreCursor watches: the pointer swells
        into the "More +" pill over a card and shrinks back between them.
      */}
      <button
        ref={buttonRef}
        type="button"
        className="works__link"
        data-more-target
        onClick={() => buttonRef.current && onOpen(buttonRef.current)}
      >
        <span className="works__frame">
          {art ? (
            <span ref={imageRef} className="works__media">
              {/* q90, not the default 75. Both covers are dark
                  photographs carrying long smooth gradients, which is
                  precisely where JPEG bands — and the file had already
                  taken one lossy pass before Next re-encoded it. */}
              <Image
                src={art.src}
                alt={art.alt}
                fill
                quality={90}
                sizes="(max-width: 1024px) 90vw, 50vw"
                className="object-cover"
              />
            </span>
          ) : (
            <span className={`works__pending works__pending--${project.palette}`}>
              {pendingLabel}
            </span>
          )}

          {/* A gradient rather than a bar: it guarantees the label's
              contrast without laying a block of chrome across the bottom
              of the photograph. */}
          {art && <span aria-hidden="true" className="works__scrim" />}

          <span className="works__meta">
            {/* The badge slot renders only where a real client mark
                exists — an empty rounded square on a card this size reads
                as an image that failed to load. Ali has no logo files
                yet; nothing else about the card changes when one lands. */}
            {project.logo && (
              <span className="works__badge">
                <Image src={project.logo.src} alt="" aria-hidden="true" fill sizes="56px" />
              </span>
            )}
            <span className="works__lines">
              <span className="works__name">{project.name}</span>
              <span className="works__sector">{project.disciplines.join(", ")}</span>
            </span>
          </span>
        </span>
      </button>
    </article>
  );
}

/*
 * The board's own order (Ali, 2026-08-19), not the data's.
 *
 * Qobban first (Ali, 2026-08-20), so it takes the large left cell and
 * Petrolas the smaller one on the right. Nothing else on the site
 * reorders — `content.projects` is untouched, and /work still lists all
 * six in their own order.
 */
const ORDER = ["qobban", "petrolas", "delivery-point", "kids-island", "nextshoot"];

/*
 * ONLY THE WORK THAT HAS A PICTURE (Ali, 2026-08-19).
 *
 * The board carried five cards, three of them a flat colour reading
 * "imagery in production". On a case-study page that is honest; on the
 * homepage, which exists to turn a stranger into an enquiry, three
 * placeholders out of five say the studio is half-built. Two finished
 * cards are a stronger argument than five where three are empty.
 *
 * DERIVED, NOT HARDCODED. This filters on whether art exists rather than
 * naming Petrolas and Qobban, so the board grows back by itself the day
 * a cover lands in `lab.ts` — there is no list to remember to undo. The
 * five-card composition below is still in the stylesheet, waiting.
 */
export default function WorksBoard({ content }: { content: LabContent }) {
  const [openProject, setOpenProject] = useState<LabProject | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const { works } = content.opening;
  const projects = ORDER.map((slug) =>
    content.projects.find((project) => project.slug === slug)
  )
    .filter((project): project is LabProject => Boolean(project))
    .filter((project) => Boolean(project.feature ?? project.cover));

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
        {/* The count drives the composition — see globals.css. */}
        <div className="works__board" data-count={projects.length}>
          {projects.map((project, index) => (
            <WorkCard
              key={project.slug}
              project={project}
              index={index}
              pendingLabel={content.lobby.assetsPendingLabel}
              onOpen={(trigger) => {
                triggerRef.current = trigger;
                setOpenProject(project);
              }}
            />
          ))}
        </div>
      </MoreCursor>

      {/* Focus returns to the card that opened it — see ProjectModal. */}
      <ProjectModal
        project={openProject}
        content={content}
        onClose={() => {
          setOpenProject(null);
          triggerRef.current?.focus();
        }}
      />

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
