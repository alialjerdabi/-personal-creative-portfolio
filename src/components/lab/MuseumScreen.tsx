"use client";

import Image, { getImageProps } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { LabContent, LabMedia } from "@/data/lab";

/*
 * Ali's numbers, kept exactly: 260svh of section, and the pull-back
 * finished by 68% of the travel so the last third is a hold on the
 * completed room.
 *
 * An earlier pass grew the section so three films could cycle across the
 * hold. That is gone — the reel is no longer scroll-driven (Ali,
 * 2026-08-16), so the section does not have to be long enough to contain
 * it and the spec's proportions stand as written.
 */
const SECTION_SVH = 260;
const REVEAL_FRACTION = 0.68;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** Ali's spec: p * p * (3 - 2p). Accelerates in, decelerates out. */
const smoothstep = (p: number) => p * p * (3 - 2 * p);

function HallRender() {
  const shared = {
    alt: "",
    fill: true,
    sizes: "100vw",
    quality: 90,
  } as const;
  const {
    props: { srcSet: wideSrcSet, ...wideProps },
  } = getImageProps({ ...shared, src: "/hall/wide.jpg" });
  const {
    props: { srcSet: tallSrcSet },
  } = getImageProps({ ...shared, src: "/hall/tall.jpg" });

  return (
    <picture>
      <source media="(orientation: portrait)" srcSet={tallSrcSet} />
      <source media="(orientation: landscape)" srcSet={wideSrcSet} />
      <img {...wideProps} alt="" aria-hidden="true" className="object-cover" />
    </picture>
  );
}

function Exhibit({
  media,
  active,
  onFinished,
}: {
  media: LabMedia;
  active: boolean;
  onFinished: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!active) {
      video.pause();
      return;
    }

    /*
     * If autoplay is refused the film never ends, so nothing would ever
     * advance and the reel would stop on its first exhibit forever. The
     * fallback moves on after roughly a film's length instead. It is
     * cleared the moment playback actually starts.
     */
    let fallback = 0;
    video.play().catch(() => {
      fallback = window.setTimeout(onFinished, 12_000);
    });

    return () => window.clearTimeout(fallback);
  }, [active, onFinished]);

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
        /* NOT looped: the reel advances when a film finishes, so `ended`
           has to be allowed to fire. */
        playsInline
        preload="metadata"
        aria-label={media.alt}
        onEnded={onFinished}
      />
    );
  }

  return (
    <Image
      src={media.src}
      alt=""
      aria-hidden="true"
      fill
      sizes="100vw"
      className={shared}
    />
  );
}

/**
 * The museum reveal.
 *
 * The film opens filling the whole viewport — no room, no frame, nothing
 * but the work. Scrolling pulls the camera back: the film shrinks toward
 * its resting box while the hall fades up behind it, and it lands as a
 * screen mounted on the far wall of a room that was there all along.
 * Then everything holds, and the reel plays through in place.
 *
 * THE PIN IS CSS. A tall section with a `sticky` child one viewport high.
 * There is no measured pin position to go stale, which matters here
 * because the images above this section finish decoding after first
 * paint and move everything below them. ScrollTrigger has been tried
 * twice in this codebase and failed for exactly that reason both times.
 *
 * EVERY FRAME IS A LIVE READ. `getBoundingClientRect` each tick, nothing
 * cached, so late decode above cannot desynchronise the sequence. The
 * only per-frame writes are a transform and two custom properties, both
 * composited.
 *
 * EVERY EXHIBIT STAYS MOUNTED and cross-fades in one box, so the
 * captions are real text in source order — and the list beneath the room
 * repeats all of it linearly for anyone who never sees the pin at all.
 */
export default function MuseumScreen({ content }: { content: LabContent }) {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<HTMLDivElement>(null);
  const apertureRef = useRef<HTMLDivElement>(null);
  const { showcase } = content;
  const [active, setActive] = useState(0);

  const count = showcase.frames.length;

  /*
   * The reel runs on its own clock. Ali's call, 2026-08-16: scrolling
   * must not interfere with a film that is playing, so which exhibit is
   * showing is decided by the film ending — never by the scroll position.
   * Scroll drives the room and nothing else.
   */
  const advance = useCallback(() => {
    setActive((index) => (index + 1) % count);
  }, [count]);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const room = roomRef.current;
    const aperture = apertureRef.current;
    if (!root || !track || !room || !aperture || count === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;

      const rect = track.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) return;

      const raw = clamp(-rect.top / travel, 0, 1);

      if (reduced.matches) {
        /* Land on the finished composition and never animate toward it. */
        root.style.setProperty("--room", "1");
        room.style.opacity = "1";
        room.style.transform = "none";
        aperture.style.transform = "none";
        return;
      }

      const progress = Math.min(1, raw / REVEAL_FRACTION);
      const eased = smoothstep(progress);

      const width = aperture.offsetWidth;
      const height = aperture.offsetHeight;
      if (width <= 0 || height <= 0) return;

      /*
       * Start big enough to cover, then come home. The 1.025 is Ali's,
       * and it is not decoration: without a margin the film's edge can
       * expose a hairline of room at the extremes of a scale animation.
       *
       * MEASURED ON THE CONTENT BOX, not the border box. The frame lives
       * on this element, so offsetWidth includes it — and scaling by a
       * factor derived from the border box leaves the film short of the
       * viewport by exactly the frame's width, which showed up as a grey
       * edge around a shot that is supposed to be full bleed. clientWidth
       * is the hole the film actually fills.
       */
      const coverScale =
        Math.max(
          window.innerWidth / aperture.clientWidth,
          window.innerHeight / aperture.clientHeight
        ) * 1.025;
      const scale = coverScale + (1 - coverScale) * eased;

      /* Uniform scale about the centre, so the centre is all that travels. */
      const centreX = aperture.offsetLeft + width / 2;
      const centreY = aperture.offsetTop + height / 2;
      const x = (window.innerWidth / 2 - centreX) * (1 - eased);
      const y = (window.innerHeight / 2 - centreY) * (1 - eased);

      /* The architecture arrives just after the pull-back begins. */
      const roomReveal = clamp((progress - 0.04) / 0.82, 0, 1);

      aperture.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      room.style.opacity = String(roomReveal);
      room.style.transform = `scale(${1.035 - roomReveal * 0.035})`;
      root.style.setProperty("--room", String(roomReveal));
    };

    const request = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
    reduced.addEventListener("change", request);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      reduced.removeEventListener("change", request);
    };
  }, [count]);

  if (count === 0) return null;

  const current = showcase.frames[active];

  return (
    <section
      ref={rootRef}
      data-museum-root
      aria-labelledby="lab-museum-heading"
      className="relative bg-black text-white"
      style={{ "--room": 0 } as CSSProperties}
    >
      {/* The scroll length. The sticky stage releases at this element's
          bottom edge, so the caption list below it must be OUTSIDE. */}
      <div
        ref={trackRef}
        data-museum-track
        className="relative"
        style={{ height: `${SECTION_SVH}svh` }}
      >
        <div className="sticky top-0 h-[100svh] overflow-hidden bg-black">
        <div
          ref={roomRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0"
          style={{ transform: "scale(1.035)", willChange: "transform, opacity" }}
        >
          <HallRender />
        </div>


        <div
          ref={apertureRef}
          data-museum-aperture
          className="hall-aperture museum-screen-aperture z-10 bg-black"
          style={{ transformOrigin: "center" }}
        >
          {showcase.frames.map((frame, index) => (
            <Exhibit
              key={frame.media.src}
              media={frame.media}
              active={index === active}
              onFinished={advance}
            />
          ))}
        </div>

        {/* Chrome arrives with the room. Over a full-bleed film it would be
            furniture on top of the work; against the wall it is a label. */}
        <div
          className="pointer-events-none absolute inset-x-5 top-[6.5rem] z-20 flex items-center justify-between gap-5 sm:inset-x-8"
          style={{ opacity: "var(--room)" }}
        >
          <h2
            id="lab-museum-heading"
            className="font-display text-[11px] font-bold uppercase tracking-[0.16em] text-white/60 [text-shadow:0_1px_12px_rgb(0_0_0/0.9)] sm:text-[13px]"
          >
            {showcase.label}
          </h2>
          <p aria-hidden="true" className="flex items-center gap-1.5">
            {showcase.frames.map((frame, index) => (
              <span
                key={frame.media.src}
                className={`block h-1 rounded-full transition-all duration-500 ${
                  index === active ? "w-7 bg-white" : "w-2.5 bg-white/35"
                }`}
              />
            ))}
          </p>
        </div>

        <div
          className="pointer-events-none absolute bottom-7 left-16 right-5 z-20 sm:bottom-9 sm:left-20 sm:right-8"
          style={{ opacity: "var(--room)" }}
        >
          <p className="font-display text-[clamp(0.875rem,1.6vw,1.25rem)] font-bold tracking-[-0.02em] [text-shadow:0_1px_16px_rgb(0_0_0/0.95)]">
            {current.project}
            <span className="font-normal text-white/65"> — {current.caption}</span>
          </p>
        </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-6 sm:px-8 sm:pb-28 sm:pt-10">
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
