"use client";

import { useEffect, useRef } from "react";
import HallRender from "@/components/lab/HallRender";
import type { CSSProperties } from "react";
import type { LabContent } from "@/data/lab";

/**
 * The threshold: the hall, before the lights go down.
 *
 * REPLACES the spoken-sentence hero (Ali's call, 2026-08-17). That one
 * ran three of upsunday.co's devices at once — the giant lowercase
 * sentence, stills set inside the sentence, and a hand-drawn arrow — and
 * no amount of rewriting the words could change whose composition it
 * was. The device WAS the design.
 *
 * It was also the last section still speaking the old borrowed language.
 * Everything below it had become the museum: placards, uppercase
 * statements, numbered exhibits, a lit edge. The first screen was warm
 * rounded lowercase, and then you fell into a dark concrete room.
 *
 * So the hero is now the same room the museum is, at an earlier moment.
 * You arrive facing it with the screen still dark; scrolling dims the
 * room to black and MuseumScreen opens on the film at full bleed, the
 * way a cinema goes dark before a picture starts. The page ends where it
 * began — the same room, with the screen on.
 *
 * NO SCROLL-TRIGGERED ENTRANCE. The copy animates on a CSS delay instead,
 * because the loader may have just handed over and a JS entrance that
 * runs while the overlay is still up plays to nobody.
 */
export default function HeroScreen({ content }: { content: LabContent }) {
  const rootRef = useRef<HTMLElement>(null);
  const { hero, lobby, descriptor } = content;

  /*
   * The dip to black. Leaving the hero fades the room out, so the cut to
   * the museum's full-bleed film reads as the lights going down rather
   * than as one section abruptly becoming another.
   */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const height = root.offsetHeight;
      if (height <= 0) return;
      const progress = Math.min(1, Math.max(0, window.scrollY / height));
      root.style.setProperty("--exit", progress.toFixed(3));
    };
    const request = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      data-hero
      aria-labelledby="lab-hero-heading"
      className="lab-threshold"
      style={{ "--exit": 0 } as CSSProperties}
    >
      {/* The room. `priority` because it is the largest thing above the
          fold and the loader has already fetched it. */}
      <div aria-hidden="true" className="lab-threshold__room">
        <HallRender priority />
      </div>

      {/* Type sits on concrete, so it gets its own ground rather than
          relying on the render happening to be dark where the words are. */}
      <div aria-hidden="true" className="lab-threshold__scrim" />

      <div className="lab-threshold__body">
        <p className="lab-placard lab-placard--inverted lab-threshold__eyebrow">
          {descriptor}
        </p>

        <h1 id="lab-hero-heading" className="lab-threshold__statement">
          {hero.statement.map((line, index) => (
            <span
              key={line}
              className="lab-threshold__line"
              style={{ "--i": index } as CSSProperties}
            >
              {line}
            </span>
          ))}
        </h1>

        <p className="lab-threshold__sub">{hero.sub}</p>

        <div className="lab-threshold__actions">
          <a href={hero.cta.href} className="lab-threshold__cta">
            {hero.cta.label}
          </a>
          <a href={hero.secondary.href} className="lab-threshold__ghost">
            {hero.secondary.label}
          </a>
        </div>

        <p className="lab-threshold__status">
          <span aria-hidden="true" className="lab-threshold__dot" />
          {lobby.availability}
          <span aria-hidden="true" className="lab-threshold__sep">
            ·
          </span>
          {lobby.location}
        </p>
      </div>

      <p aria-hidden="true" className="lab-threshold__cue">
        {lobby.scrollLabel}
      </p>

      {/* The lights going down. */}
      <div aria-hidden="true" className="lab-threshold__fade" />
    </section>
  );
}
