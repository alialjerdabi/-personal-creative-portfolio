"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { LabAsset, LabContent, LabPalette, LabProject } from "@/data/lab";

const FIELD: Record<LabPalette, string> = {
  orange: "bg-lab-orange text-black",
  blue: "bg-lab-blue text-white",
  lime: "bg-lab-lime text-black",
  violet: "bg-lab-violet text-white",
  cream: "bg-lab-cream text-black",
  teal: "bg-lab-teal text-black",
  sun: "bg-lab-sun text-black",
};

const CYCLE_MS = 2200;

/** Every still the project has, in the order it should play. */
function galleryFor(project: LabProject): LabAsset[] {
  const assets = project.spreads?.flatMap((spread) => spread.assets) ?? [];
  const seen = new Set<string>();
  const unique = [project.cover, ...assets].filter((asset): asset is LabAsset => {
    if (!asset || seen.has(asset.src)) return false;
    seen.add(asset.src);
    return true;
  });
  return unique;
}

/**
 * The project popup.
 *
 * Built on the native `<dialog>` element rather than a hand-rolled
 * overlay: focus trapping, Escape to close, the inert backdrop and
 * top-layer stacking are all browser behaviour, and every one of them is
 * a thing hand-rolled modals get wrong. What is left to write is the
 * scroll lock, the cycling gallery, and returning focus to the card that
 * opened it.
 *
 * The gallery advances on its own — the point of the popup is to show
 * more of a project than its cover, without asking for a page load.
 */
export default function ProjectModal({
  project,
  content,
  onClose,
}: {
  project: LabProject | null;
  content: LabContent;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [frame, setFrame] = useState(0);

  const gallery = project ? galleryFor(project) : [];

  /*
   * Reset the gallery during render rather than in an effect — React's
   * documented pattern for state that derives from a prop change, and
   * the same one ui/MediaCycler.tsx already uses in this codebase.
   * Doing it in an effect would render one frame of the previous
   * project's last image before correcting itself.
   */
  const [openedSlug, setOpenedSlug] = useState(project?.slug);
  if (project?.slug !== openedSlug) {
    setOpenedSlug(project?.slug);
    setFrame(0);
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (project) {
      if (!dialog.open) dialog.showModal();
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }

    if (dialog.open) dialog.close();
  }, [project]);

  // Escape and backdrop dismissal are the browser's; this keeps React's
  // idea of "open" in step with whatever the browser just did.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  useEffect(() => {
    if (!project || gallery.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = setInterval(
      () => setFrame((current) => (current + 1) % gallery.length),
      CYCLE_MS
    );
    return () => clearInterval(interval);
  }, [project, gallery.length]);

  return (
    <dialog
      ref={dialogRef}
      /*
       * Only while there is something to label.
       *
       * The dialog is always in the document but its contents are not —
       * they render from `project`, which is null until a card is
       * clicked. A permanent aria-labelledby therefore pointed at an id
       * that did not exist, which is a broken reference on every page
       * that mounts the grid, and leaves the dialog unnamed at the exact
       * moment it opens.
       */
      aria-labelledby={project ? "lab-modal-title" : undefined}
      onClick={(event) => {
        // A click that lands on the dialog element itself is a click on
        // the backdrop; anything inside the panel stops here.
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
      className="m-auto w-[min(92vw,64rem)] rounded-[1.5rem] bg-transparent p-0 backdrop:bg-lab-air/75 backdrop:backdrop-blur-md"
    >
      {project && (
        /*
          Matched to the reference popup: the image is INSET inside the
          panel with white showing on all four sides rather than bleeding
          to the edge, and the text column sits low against it instead of
          being vertically centred. Those two things are what make it read
          as a mounted print rather than a split-screen banner.
        */
        <div className="relative grid gap-6 overflow-hidden rounded-[1.5rem] bg-white p-6 text-lab-ink-warm shadow-[0_50px_120px_-50px_rgb(26_23_19/0.5)] sm:grid-cols-[1fr_0.86fr] sm:gap-10 sm:p-8">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close"
            className="absolute right-6 top-6 z-10 flex h-14 w-14 items-center justify-center rounded-[1rem] border border-lab-hairline bg-white text-lab-ink-warm transition-colors hover:bg-lab-haze focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-ink-warm sm:right-8 sm:top-8"
          >
            <span aria-hidden="true" className="text-lg leading-none">
              ✕
            </span>
          </button>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1rem] bg-lab-haze sm:aspect-square">
            {gallery.length > 0 ? (
              gallery.map((asset, index) => (
                <div
                  key={asset.src}
                  aria-hidden={index !== frame}
                  className={`absolute inset-0 motion-safe:transition-opacity motion-safe:duration-700 ${
                    index === frame ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={asset.src}
                    alt={index === frame ? asset.alt : ""}
                    fill
                    sizes="(max-width: 640px) 92vw, 40vw"
                    className="object-cover"
                  />
                </div>
              ))
            ) : (
              /* No cover art yet. The colour panel again, rather than a
                 borrowed image standing in for work that isn't shown. */
              <div
                className={`flex h-full w-full items-center justify-center p-8 ${FIELD[project.palette]}`}
              >
                <span className="font-display text-[clamp(1.75rem,4vw,3rem)] font-bold leading-none tracking-[-0.04em]">
                  {project.name}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-end gap-4 pb-1 pr-1 sm:pb-4 sm:pr-2">
            <p className="font-display text-[13px] font-bold uppercase tracking-[0.12em] text-lab-ink-soft">
              {project.disciplines.length > 0
                ? project.disciplines.join(" · ")
                : content.lobby.pendingLabel}
            </p>

            <h2
              id="lab-modal-title"
              className="font-display text-[clamp(1.6rem,2.6vw,2.15rem)] font-bold leading-[1.08] tracking-[-0.03em]"
            >
              {project.name}
            </h2>

            <p className="font-display text-[16px] leading-relaxed text-lab-ink-soft">
              {project.summary ??
                `${project.name} is in production. The full case study goes up once the work is ready to show.`}
            </p>

            {/*
              Up to two ways on, and the live site leads where there is
              one (Ali, 2026-08-17).

              The reasoning that used to send the whole CARD offsite still
              holds — a running website is the one claim on this page a
              visitor can check in a single click — but it cost the popup
              entirely, and with it the summary, the gallery and the route
              into the case study. Both now live here: the site is the
              filled button, the case study the quiet one beside it.
            */}
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-lab-ink-warm px-6 py-3 font-display text-[15px] font-bold text-white transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-ink-warm focus-visible:ring-offset-2"
                >
                  View website
                  <span aria-hidden="true">↗</span>
                </a>
              )}

              {project.spreads ? (
                <Link
                  href={`/work/${project.slug}`}
                  className={
                    project.live
                      ? "rounded-full border border-lab-ink-warm/25 px-6 py-3 font-display text-[15px] font-bold text-lab-ink-warm transition-colors hover:border-lab-ink-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-ink-warm focus-visible:ring-offset-2"
                      : "rounded-full bg-lab-ink-warm px-6 py-3 font-display text-[15px] font-bold text-white transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-ink-warm focus-visible:ring-offset-2"
                  }
                >
                  See work
                </Link>
              ) : (
                !project.live && (
                  <a
                    href="#contact"
                    onClick={() => dialogRef.current?.close()}
                    className="rounded-full bg-lab-ink-warm px-6 py-3 font-display text-[15px] font-bold text-white transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-ink-warm focus-visible:ring-offset-2"
                  >
                    Ask me about it
                  </a>
                )
              )}

              {gallery.length > 1 && (
                <span className="flex items-center gap-1.5">
                  {gallery.map((asset, index) => (
                    <span
                      key={asset.src}
                      aria-hidden="true"
                      className={`h-1 rounded-full transition-all duration-500 ${
                        index === frame ? "w-6 bg-lab-ink-warm" : "w-2.5 bg-lab-hairline"
                      }`}
                    />
                  ))}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
