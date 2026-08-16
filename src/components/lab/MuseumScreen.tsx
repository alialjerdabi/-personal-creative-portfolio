"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { LabContent, LabMedia } from "@/data/lab";

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
      <img
        {...wideProps}
        alt=""
        aria-hidden="true"
        className="object-cover"
      />
    </picture>
  );
}

/**
 * One screen, in a dark room, pinned while the page scrolls past it.
 *
 * The pin stays in CSS. The section is tall and its sticky child is one
 * viewport high, so late image decoding above this section cannot invalidate a
 * cached JavaScript pin position. Exhibit selection likewise stays on the
 * IntersectionObserver markers below the room. Every exhibit remains mounted
 * and cross-fades in one grid cell; the visible caption list after the room is
 * the same content in a linear, non-pinned form.
 */
function Exhibit({ media, active }: { media: LabMedia; active: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (active) {
      video.play().catch(() => {
        // Autoplay can be refused; the required poster remains visible.
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
      sizes="100vw"
      className={shared}
    />
  );
}

export default function MuseumScreen({ content }: { content: LabContent }) {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const apertureRef = useRef<HTMLDivElement>(null);
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
      { rootMargin: "-50% 0px -50% 0px" }
    );

    markers.forEach((marker) => observer.observe(marker));
    return () => observer.disconnect();
  }, [showcase.frames.length]);

  /**
   * The dolly is a FLIP-style transform over the render's measured screen.
   * Its resting box is the same responsive aperture used by the loader. A
   * uniform scale then grows that box until it covers the viewport, while the
   * centre translates to the viewport centre. Uniform scale matters on the
   * portrait hall: it preserves the film instead of stretching a 1.37:1
   * screen into a tall phone.
   *
   * The room fade and text fade are CSS responses to --push. The only
   * per-frame layout reads are the aperture's untransformed offset geometry;
   * the only per-frame element write is a composited transform.
   */
  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const aperture = apertureRef.current;
    if (!root || !track || !aperture) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    let animationFrame = 0;
    const update = () => {
      animationFrame = 0;

      const trackRect = track.getBoundingClientRect();
      const travel = trackRect.height - window.innerHeight;
      if (travel <= 0) return;

      const rawProgress = Math.min(1, Math.max(0, -trackRect.top / travel));
      const progress = rawProgress * rawProgress * (3 - 2 * rawProgress);
      const apertureWidth = aperture.offsetWidth;
      const apertureHeight = aperture.offsetHeight;
      if (apertureWidth <= 0 || apertureHeight <= 0) return;

      const apertureCentreX = aperture.offsetLeft + apertureWidth / 2;
      const apertureCentreY = aperture.offsetTop + apertureHeight / 2;
      const translateX = (window.innerWidth / 2 - apertureCentreX) * progress;
      const translateY = (window.innerHeight / 2 - apertureCentreY) * progress;
      const coverScale = Math.max(
        window.innerWidth / apertureWidth,
        window.innerHeight / apertureHeight
      );
      const scale = 1 + (coverScale - 1) * progress;

      root.style.setProperty("--push", String(progress));
      aperture.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
    };

    const requestUpdate = () => {
      if (animationFrame) return;
      animationFrame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  if (showcase.frames.length === 0) return null;

  const current = showcase.frames[active];

  return (
    <section
      ref={rootRef}
      data-museum-root
      aria-labelledby="lab-museum-heading"
      className="relative bg-black text-white"
      style={{ "--push": 0 } as CSSProperties}
    >
      <div ref={trackRef} data-museum-track className="relative">
        <div className="sticky top-0 h-[100svh] overflow-hidden bg-black">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ opacity: "calc(1 - (var(--push) * 1.25))" }}
          >
            <HallRender />
          </div>

          <div
            ref={apertureRef}
            data-museum-aperture
            className="museum-screen-aperture z-10 bg-black"
            style={{
              transform: "translate3d(0, 0, 0) scale(1)",
              transformOrigin: "center",
            }}
          >
            {showcase.frames.map((frame, index) => (
              <Exhibit
                key={frame.media.src}
                media={frame.media}
                active={index === active}
              />
            ))}
          </div>

          <div
            className="pointer-events-none absolute inset-x-5 top-[6.5rem] z-20 flex items-center justify-between gap-5 sm:inset-x-8"
            style={{ opacity: "calc(1 - (var(--push) * 4))" }}
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
            style={{ opacity: "calc(1 - (var(--push) * 4))" }}
          >
            <p className="font-display text-[clamp(0.875rem,1.6vw,1.25rem)] font-bold tracking-[-0.02em] [text-shadow:0_1px_16px_rgb(0_0_0/0.95)]">
              {current.project}
              <span className="font-normal text-white/65"> — {current.caption}</span>
            </p>
          </div>
        </div>

        <div aria-hidden="true">
          {showcase.frames.map((frame) => (
            <div key={frame.media.src} data-museum-marker className="h-[62svh]" />
          ))}
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
