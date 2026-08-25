"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import ProjectModal from "@/components/lab/ProjectModal";
import Tilt from "@/components/lab/Tilt";
import MoreCursor from "@/components/lab/MoreCursor";
import type { LabContent, LabPalette, LabProject } from "@/data/lab";

/**
 * Softened for the light register: the palette survives as a card fill
 * rather than a full-bleed field. Whole class strings, not interpolated
 * fragments, so Tailwind can see them.
 */
const FIELD: Record<LabPalette, string> = {
  orange: "bg-lab-orange text-black",
  blue: "bg-lab-blue text-white",
  lime: "bg-lab-lime text-black",
  violet: "bg-lab-violet text-white",
  cream: "bg-lab-cream text-black",
  teal: "bg-lab-teal text-black",
  sun: "bg-lab-sun text-black",
  amber: "bg-lab-amber text-black",
};

function ProjectCard({
  project,
  wide,
  priority,
  onOpen,
}: {
  project: LabProject;
  wide: boolean;
  priority: boolean;
  onOpen: (element: HTMLButtonElement) => void;
}) {
  /* The same still the homepage board shows (Ali, 2026-08-25). Both
     pages list the same projects, so picking different art for each made
     one project look like two. `feature` is the shot chosen to represent
     the project; `cover` is the fallback for anything without one. */
  const art = project.feature ?? project.cover;
  const hasCover = Boolean(art);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={buttonRef}
      type="button"
      /* Marks the region the pointer companion swells over. The whole
         card, not just the image, so the pill does not collapse when the
         pointer crosses onto the project's own name. */
      data-more-target
      onClick={() => buttonRef.current && onOpen(buttonRef.current)}
      className="group block w-full rounded-[1.6rem] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-ink-warm focus-visible:ring-offset-4"
    >
      {/* Only the panel tilts. Tilting the name and metadata underneath it
          would rotate the card's own label out of the reading plane. */}
      <Tilt amplitude={7}>
        <span
          className={`relative block w-full overflow-hidden rounded-[1.6rem] ${
            wide ? "aspect-[16/11]" : "aspect-[16/12]"
          } ${hasCover ? "bg-lab-haze" : FIELD[project.palette]}`}
        >
          {art ? (
            <Image
              src={art.src}
              alt={art.alt}
              fill
              preload={priority}
              sizes="(max-width: 1024px) 92vw, 55vw"
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
            />
          ) : (
            /*
             * A real engagement whose cover art does not exist yet — never
             * a borrowed image, which would misrepresent one client's work
             * as another's. A filled colour panel reads as a decision; an
             * outlined grey box reads as a hole in the portfolio.
             */
            <span
              aria-hidden="true"
              className="flex h-full w-full items-center justify-center p-8"
            >
              <span className="font-display text-[clamp(1.75rem,4vw,3.5rem)] font-bold leading-none tracking-[-0.04em]">
                {project.name}
              </span>
            </span>
          )}
        </span>
      </Tilt>

      {/*
        The metadata line says what the work WAS, never what the page is
        missing.

        It used to print "Cover in production" on every project without
        cover art — five of six, so the phrase appeared five times in one
        scroll and the grid read as an unfinished portfolio rather than a
        body of work. The pending state is already carried by the colour
        panel above; saying it again in words turns a design decision into
        an apology.

        Every project has real disciplines and a real sector, so there is
        always something true and useful to print. The year is filtered
        rather than joined blindly: five of six are still "—", and
        "Branding · —" reads as a bug.
      */}
      <span className="mt-4 flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1">
        <span className="font-display text-xl font-bold tracking-[-0.02em] text-lab-ink-warm sm:text-2xl">
          {project.name}
        </span>
        <span className="font-display text-[15px] text-lab-ink-soft">
          {[project.disciplines.join(", "), project.sector, project.year]
            .filter((part) => part && part !== "—")
            .join(" · ")}
        </span>
      </span>
    </button>
  );
}

/**
 * Selected work.
 *
 * Alternating 7/5 spans rather than a uniform grid: every row is
 * lopsided, and the lopsidedness flips each time, so the section reads
 * as composed instead of poured. The rule holds for any number of
 * projects without a spans table — the widths come from the index.
 *
 * Cards open a popup rather than navigating: a visitor deciding whether
 * a project is worth their time should not have to spend a page load to
 * find out. The card that opened it gets focus back on close, which is
 * the part of a dialog that is invisible when right and disorienting
 * when missing.
 */
export default function ProjectMosaic({
  content,
  heading = "A few things I’ve made.",
}: {
  content: LabContent;
  /**
   * Overridden on /work, where this grid is the whole page rather than a
   * section of one and "A few things" undersells an index of everything.
   */
  heading?: string;
}) {
  const [openProject, setOpenProject] = useState<LabProject | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <section
      id="work"
      aria-labelledby="lab-work-heading"
      className="scroll-mt-24 bg-lab-haze px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <h2
              id="lab-work-heading"
              className="max-w-xl font-display text-[clamp(1.9rem,4.2vw,3.25rem)] font-bold leading-[1.1] tracking-[-0.035em] text-lab-ink-warm"
            >
              {heading}
            </h2>
            <p className="font-display text-[15px] text-lab-ink-soft">
              {String(content.projects.length).padStart(2, "0")}{" "}
              {content.lobby.counterLabel}
            </p>
          </div>
        </Reveal>

        <MoreCursor>
          <div className="mt-12 grid gap-x-6 gap-y-12 sm:mt-16 lg:grid-cols-12">
            {content.projects.map((project, index) => {
              // Lopsided rows that flip: 7/5, then 5/7, then 7/5…
              const wide = index % 4 === 0 || index % 4 === 3;
              return (
                <Reveal
                  key={project.slug}
                  delay={(index % 2) * 90}
                  className={wide ? "lg:col-span-7" : "lg:col-span-5"}
                >
                  <ProjectCard
                    project={project}
                    wide={wide}
                    priority={index === 0}
                    onOpen={(element) => {
                      triggerRef.current = element;
                      setOpenProject(project);
                    }}
                  />
                </Reveal>
              );
            })}
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
