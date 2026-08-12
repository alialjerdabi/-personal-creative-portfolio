"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { LabContent, LabMedia } from "@/data/lab";

/**
 * One screen, in a dark room, pinned while the page scrolls past it.
 *
 * Replaces the stacked-card showcase (Ali's call, 2026-08-12). The idea
 * is a museum: you walk up to a screen, and the screen plays the work.
 *
 * HOW THE PIN WORKS — CSS, not JavaScript. The section is tall; a
 * `sticky` child holds the room at full height while the page scrolls
 * through that height. There are no scroll listeners, nothing to
 * recalculate on resize, and nothing that can desynchronise from the
 * layout, because the layout IS the mechanism. GSAP's ScrollTrigger pin
 * would do the same thing with a lot more moving parts.
 *
 * Which exhibit is showing comes from an IntersectionObserver over
 * invisible markers spaced down the scroll length — the same approach as
 * the case-study reveals, and the reason is the same one that made the
 * stepper's first version fail: ScrollTrigger measures positions at
 * creation, and the images above this section finish decoding after
 * that, moving every position it recorded.
 *
 * EVERY EXHIBIT IS IN THE DOM ALWAYS. They stack in one grid cell and
 * cross-fade. Nothing unmounts, so the captions are real text a search
 * engine and a screen reader can read in order, and the visible list
 * beneath the room is the same content stated plainly for anyone who
 * cannot use a pinned scroll experience at all.
 */
function Exhibit({ media, active }: { media: LabMedia; active: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  /*
   * Only the exhibit on screen is allowed to decode.
   *
   * Autoplaying every clip at once is how a phone gets hot and a scroll
   * gets sticky — four simultaneous video decodes for three that nobody
   * can see. Pausing the inactive ones costs one effect.
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active) {
      video.play().catch(() => {
        /* Autoplay refused — the poster stays, which is the point of
           requiring one. Nothing to recover from. */
      });
    } else {
      video.pause();
    }
  }, [active]);

  const shared = `absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
    active ? "opacity-100" : "opacity-0"
  }`;

  if (media.kind === "video") {
    return (
      <video
        ref={videoRef}
        className={shared}
        src={media.src}
        poster={media.poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={media.alt}
      />
    );
  }

  return (
    <Image
      src={media.src}
      alt=""
      aria-hidden="true"
      fill
      sizes="(max-width: 1024px) 92vw, 74vw"
      className={shared}
    />
  );
}

export default function MuseumScreen({ content }: { content: LabContent }) {
  const rootRef = useRef<HTMLElement>(null);
  const { showcase } = content;
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const markers = Array.from(
      root.querySelectorAll<HTMLElement>("[data-museum-marker]")
    );
    if (markers.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = markers.indexOf(entry.target as HTMLElement);
          if (index >= 0) setActive(index);
        }
      },
      /* A thin band across the middle of the viewport: the exhibit
         changes when its marker reaches the centre of the screen, which
         is where the screen itself is. */
      { rootMargin: "-50% 0px -50% 0px" }
    );

    markers.forEach((m) => observer.observe(m));
    return () => observer.disconnect();
  }, [showcase.frames.length]);

  if (showcase.frames.length === 0) return null;

  const current = showcase.frames[active];

  return (
    <section
      ref={rootRef}
      aria-labelledby="lab-museum-heading"
      className="relative bg-lab-ink-warm text-white"
    >
      {/* The room. Sticky, so it holds while the markers below travel. */}
      {/* pt clears the floating nav, which is fixed and contributes
          nothing to flow — at an even py-16 the "Selected work" label sat
          directly underneath it and was never visible. */}
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden px-5 pb-14 pt-[7rem] sm:px-8">
        {/*
          THE HALL, drawn in CSS.

          Ali's reference (noth.in) is a rendered concrete room: side
          walls running away in perspective, light bars on the ceiling,
          and a polished floor throwing the screen back at you. None of
          that needs a 3D asset or an image — it is four gradients and a
          skew, which costs nothing to load and cannot fail to decode.

          It is all decoration, so it is aria-hidden and sits behind
          everything: if a reader never sees the room, they lose nothing
          but the room.
        */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0">
          {/* Side walls. Skewed so their inner edges converge toward the
              screen and the eye reads depth rather than two dark bars. */}
          <span className="absolute inset-y-0 -left-[6%] w-[34%] origin-left skew-y-[7deg] bg-[linear-gradient(to_right,rgb(255_255_255/0.10),rgb(255_255_255/0.015))]" />
          <span className="absolute inset-y-0 -right-[6%] w-[34%] origin-right -skew-y-[7deg] bg-[linear-gradient(to_left,rgb(255_255_255/0.10),rgb(255_255_255/0.015))]" />

          {/* Ceiling light bars — the detail that makes the reference
              read as a gallery rather than a dark page. Placed below the
              floating nav, not at the true top of the room: at 4% they
              were rendering underneath it and were never once visible. */}
          <span className="absolute left-1/2 top-[13%] h-[3px] w-[46%] -translate-x-1/2 rounded-full bg-white/55 blur-[1px]" />
          <span className="absolute left-1/2 top-[17.5%] h-[3px] w-[32%] -translate-x-1/2 rounded-full bg-white/30 blur-[1px]" />

          {/* The floor, and the pool of light the screen throws onto it. */}
          <span className="absolute inset-x-0 bottom-0 h-[26%] bg-[linear-gradient(to_top,rgb(255_255_255/0.09),transparent)]" />
          <span className="absolute inset-x-0 bottom-0 h-[22%] bg-[radial-gradient(60%_100%_at_50%_0%,rgb(255_255_255/0.12)_0%,transparent_70%)]" />
        </span>

        <div className="relative mx-auto flex w-full max-w-6xl flex-col">
          <h2
            id="lab-museum-heading"
            className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-white/45"
          >
            {showcase.label}
          </h2>

          {/*
            The screen, sized by the ROOM's height rather than by the
            column's width.

            At a plain `w-full aspect-[16/10]` the screen was 720px tall
            inside a 900px viewport, and once the label, the caption and
            the nav clearance were added the block overflowed the room —
            which, with overflow-hidden, silently ate the "Selected work"
            label off the top. Driving it from height and capping the
            width means it fills a short laptop and a tall monitor
            equally, and never pushes anything out of the room.
          */}
          <div className="relative mx-auto mt-5 aspect-[16/10] h-[58svh] max-h-full w-auto max-w-full overflow-hidden rounded-[1.1rem] bg-black shadow-[0_60px_140px_-50px_rgb(0_0_0/0.9)] ring-1 ring-white/12 sm:mt-6">
            {showcase.frames.map((frame, index) => (
              <Exhibit
                key={frame.media.src}
                media={frame.media}
                active={index === active}
              />
            ))}
          </div>

          {/* The label beside the work, the way a gallery captions a wall. */}
          <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 sm:mt-6">
            <p className="font-display text-[clamp(1rem,1.6vw,1.25rem)] font-bold tracking-[-0.02em]">
              {current.project}
              <span className="font-normal text-white/55"> — {current.caption}</span>
            </p>

            <p
              aria-hidden="true"
              className="flex items-center gap-1.5"
            >
              {showcase.frames.map((frame, index) => (
                <span
                  key={frame.media.src}
                  className={`block h-1 rounded-full transition-all duration-500 ${
                    index === active ? "w-7 bg-white" : "w-2.5 bg-white/25"
                  }`}
                />
              ))}
            </p>
          </div>
        </div>
      </div>

      {/*
        The scroll length. One viewport-tall marker per exhibit, invisible
        and inert — they exist only to be intersected, and they are what
        gives the pinned room something to hold against.
      */}
      <div aria-hidden="true">
        {showcase.frames.map((frame) => (
          <div key={frame.media.src} data-museum-marker className="h-[80svh]" />
        ))}
      </div>

      {/*
        The same content, in order, as text.
        A pinned scroll section is invisible to anything that does not
        scroll — a search engine, a screen reader moving by headings, a
        visitor who has turned motion off. This list is not a fallback
        bolted on; it is where the captions actually live.
      */}
      <div className="relative mx-auto max-w-6xl px-5 pb-20 sm:px-8 sm:pb-28">
        <h3 className="font-display text-[clamp(1.9rem,4.2vw,3.25rem)] font-bold leading-[1.1] tracking-[-0.035em]">
          {showcase.heading}
        </h3>
        <ul className="mt-8 grid gap-x-10 gap-y-6 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
          {showcase.frames.map((frame) => (
            <li key={frame.media.src} className="border-t border-white/15 pt-5">
              <p className="font-display text-[15px] font-bold">{frame.project}</p>
              <p className="mt-1 font-display text-[14px] leading-snug text-white/55">
                {frame.caption}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
