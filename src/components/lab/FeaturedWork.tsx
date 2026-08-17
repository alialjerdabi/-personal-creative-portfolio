"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import ProjectModal from "@/components/lab/ProjectModal";
import Tilt from "@/components/lab/Tilt";
import MoreCursor from "@/components/lab/MoreCursor";
import type { LabContent, LabPalette, LabProject } from "@/data/lab";

/**
 * Whole class strings, not interpolated fragments, so Tailwind sees them.
 * These carry the card when a project has no cover art — the same field
 * the mosaic and the case-study header use, so a project's colour means
 * the same thing everywhere.
 */
const FIELD: Record<LabPalette, string> = {
  orange: "bg-lab-orange text-black",
  blue: "bg-lab-blue text-white",
  lime: "bg-lab-lime text-black",
  violet: "bg-lab-violet text-white",
  cream: "bg-lab-cream text-black",
  teal: "bg-lab-teal text-black",
  sun: "bg-lab-sun text-black",
};

/** Two cards, per Ali's reference. This is the argument, not the index. */
const MAX_FEATURED = 2;

function FeaturedCard({
  project,
  priority,
  onOpen,
}: {
  project: LabProject;
  priority: boolean;
  onOpen: (element: HTMLButtonElement) => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  /*
   * EVERY CARD OPENS THE POPUP (Ali's call 2026-08-17).
   *
   * From 2026-08-12 a card with a live site left the site directly, on
   * the reasoning that a running website beats a page about one. That
   * reasoning was right and the trade was wrong: it bought the live site
   * at the cost of the summary, the gallery, and any route to the case
   * study — and it made two cards on the same row behave differently for
   * a reason no visitor could see.
   *
   * The popup now carries both, so nothing is lost and the card does one
   * predictable thing.
   */
  /* `feature` where the square card needs a different still from the
     landscape mosaic tile; `cover` everywhere else. */
  const image = project.feature ?? project.cover;
  const hasCover = Boolean(image);

  /*
   * Over a photograph: a scrim and white ink. Over a colour field: the
   * ink that field already carries everywhere else, and no scrim.
   *
   * The reference sets its labels straight onto the photo with no scrim,
   * and I built it that way first — ink chosen per project, dark over
   * the tanker's pale studio floor. It held at 1600 and broke at 390:
   * the narrower card crops the same image differently, the label landed
   * on the truck's wheels, and near-black type on black rubber is
   * unreadable. That is not a tuning problem. Those reference photos
   * were shot with empty space where the label goes; cover art arriving
   * from six different clients will not be, and no per-image ink setting
   * survives a crop that moves with the viewport. The scrim is the only
   * treatment that cannot fail on an image nobody has seen yet.
   */
  const ink = hasCover ? "text-white" : "";
  const soft = hasCover ? "text-white/75" : "opacity-70";

  const shell =
    "group block h-full w-full rounded-[1.6rem] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-ink-warm focus-visible:ring-offset-4";

  const face = (
    <>
      <Tilt amplitude={7}>
        <span
          /*
            Square, matching Ali's reference exactly — its cards measure
            within 3% of 1:1.

            This is why `feature` exists. A square crop of a 1.79 source
            throws away 44% of its width, so the image on this card has
            to be one composed around its centre; the tanker was not, and
            lost both ends. Any cover art arriving for this card should
            be shot or cropped square rather than trusted to survive it.
          */
          className={`relative block aspect-square w-full overflow-hidden rounded-[1.6rem] ${
            hasCover ? "bg-lab-haze" : FIELD[project.palette]
          }`}
        >
          {image && (
            <>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                preload={priority}
                sizes="(max-width: 1024px) 92vw, 46vw"
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
              />
              {/* Gradient, not a bar: it guarantees the label's contrast
                  without laying a block of chrome across the bottom of
                  the photograph. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgb(0_0_0/0.68),transparent)]"
              />
            </>
          )}

          <span
            className={`absolute inset-x-5 bottom-5 flex items-center gap-3.5 sm:inset-x-7 sm:bottom-7 ${ink}`}
          >
            {/*
              The badge slot. Renders ONLY where a real client mark
              exists — an empty rounded square on a card this size reads
              as an image that failed to load. Nothing else about the
              card changes when a logo lands.
            */}
            {project.logo && (
              <span className="relative block h-12 w-12 shrink-0 overflow-hidden rounded-[0.85rem] bg-white/10 sm:h-14 sm:w-14">
                <Image
                  src={project.logo.src}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </span>
            )}

            <span className="flex min-w-0 flex-col gap-0.5">
              <span
                className={`font-display font-bold leading-tight tracking-[-0.025em] ${
                  /* Without a photograph the name IS the card, so it sets
                     larger — a small label alone on a full colour field
                     reads as a card that never finished loading. */
                  hasCover
                    ? "text-[clamp(1.25rem,2.2vw,1.75rem)]"
                    : "text-[clamp(1.75rem,3.2vw,2.75rem)]"
                }`}
              >
                {project.name}
              </span>
              {/* Not "Open the live site ↗" any more — the card opens a
                  popup, and an arrow promising a new tab would be lying
                  about where the click goes. The live site is a button
                  inside, where it can be labelled honestly. */}
              <span className={`font-display text-[15px] ${soft}`}>
                {project.disciplines.join(", ")}
              </span>
            </span>
          </span>
        </span>
      </Tilt>
    </>
  );

  return (
    <button
      ref={buttonRef}
      type="button"
      data-more-target
      onClick={() => buttonRef.current && onOpen(buttonRef.current)}
      className={shell}
    >
      {face}
    </button>
  );
}

/**
 * The homepage's featured work — two large presentation cards.
 *
 * Ali's call (2026-08-10): the two-card composition ships now, with the
 * second card carrying its project's colour field until that cover art
 * exists. The alternative was one card until imagery landed; he wants the
 * composition.
 *
 * Everything else moved to /work, where the mosaic still shows all six.
 * Same tilt, same pointer companion, same popup: a change of scale and
 * selection, not a new interaction to learn.
 */
export default function FeaturedWork({ content }: { content: LabContent }) {
  const [openProject, setOpenProject] = useState<LabProject | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  /* Named in the content layer, in order — see `featuredWork`. A slug
     that matches nothing is dropped rather than rendered as a gap. */
  const featured = content.featuredWork
    .map((slug) => content.projects.find((project) => project.slug === slug))
    .filter((project): project is LabProject => Boolean(project))
    .slice(0, MAX_FEATURED);

  if (featured.length === 0) return null;

  return (
    <section
      id="work"
      aria-labelledby="lab-featured-heading"
      className="scroll-mt-24 bg-lab-haze px-5 py-20 sm:px-8 sm:py-28"
    >
      {/*
        84.5rem: two square cards of 664px plus the 24px gap.

        Sized by arithmetic rather than by eye, through three rounds of
        Ali's direction — 756 full bleed, then 20% down to 604, then 10%
        back up to 664. Still far wider than the site's shared 72rem text
        measure, because this section is two photographs doing the
        selling rather than a column of prose.
      */}
      <div className="mx-auto max-w-[84.5rem]">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <h2
              id="lab-featured-heading"
              className="max-w-xl font-display text-[clamp(1.9rem,4.2vw,3.25rem)] font-bold leading-[1.1] tracking-[-0.035em] text-lab-ink-warm"
            >
              A few things I&rsquo;ve made.
            </h2>
            <Link
              href="/work"
              className="group inline-flex items-center gap-2 font-display text-[15px] font-bold text-lab-ink-warm transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
            >
              See all work
              <span
                aria-hidden="true"
                className="inline-block transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </Reveal>

        <MoreCursor>
          <div className="mt-12 grid items-stretch gap-6 sm:mt-16 lg:grid-cols-2">
            {featured.map((project, index) => (
              <Reveal key={project.slug} delay={index * 90}>
                <FeaturedCard
                  project={project}
                  priority={index === 0}
                  onOpen={(element) => {
                    triggerRef.current = element;
                    setOpenProject(project);
                  }}
                />
              </Reveal>
            ))}
          </div>
        </MoreCursor>
      </div>

      <ProjectModal
        project={openProject}
        content={content}
        onClose={() => {
          setOpenProject(null);
          triggerRef.current?.focus();
        }}
      />
    </section>
  );
}
