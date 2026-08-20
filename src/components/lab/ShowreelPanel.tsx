"use client";

import { useEffect, useRef } from "react";
import type { LabContent } from "@/data/lab";

/**
 * The showreel — a full-bleed film that reorganises itself into an
 * editorial frame as the page moves.
 *
 * THE PANEL TRANSFORMS, THE LAYOUT DOES NOT. Scale and translate only,
 * so nothing below reflows and no frame costs a layout pass. The origin
 * is the top right, which is what makes the move read as the image
 * settling into the page's right column rather than shrinking on the
 * spot.
 *
 * THE SUPPORTING COPY IS PLACED, NOT FLOWED. A transformed element keeps
 * its original box, so anything in normal flow beneath the panel would
 * sit under a full-viewport block that is no longer there to see. The
 * copy is positioned into the space the panel vacates, on the left,
 * where the shrunken frame never reaches.
 */

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export default function ShowreelPanel({ content }: { content: LabContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { showreel } = content.opening;

  useEffect(() => {
    const section = sectionRef.current;
    const panel = panelRef.current;
    if (!section || !panel) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      /* The composition, arrived at. No scrub, no parallax — the frame
         simply is where the scroll would have put it. */
      panel.style.transform = "translate3d(0, 67vh, 0) scale(0.334)";
      return;
    }

    let frame = 0;
    const paint = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const start = window.innerHeight * 0.25;
      const distance = window.innerHeight * 0.47;
      const raw = clamp((-rect.top - start) / distance);
      /* Smoothstep: the ends of the move have to be soft or the panel
         appears to snap into and out of the scrub. */
      const progress = raw * raw * (3 - 2 * raw);

      const scale = 1 - progress * 0.666;
      const shift = window.innerHeight * 0.67 * progress;
      panel.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
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

  /* Plays only while it is on screen. A muted autoplaying video that is
     nowhere near the viewport is decode nobody asked for. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            /* Refused; the poster stays. */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="reel" aria-label="Showreel">
      <h2 className="reel__statement">
        {showreel.statement.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h2>

      <div ref={panelRef} className="reel__panel">
        <video
          ref={videoRef}
          className="reel__video"
          src={showreel.film.src}
          poster={showreel.film.poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={showreel.film.alt}
        />
      </div>

      <div className="reel__note">
        <p className="reel__label">{showreel.label}</p>
        <p className="reel__copy">{showreel.body}</p>
      </div>
    </section>
  );
}
