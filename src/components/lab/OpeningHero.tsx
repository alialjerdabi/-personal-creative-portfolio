"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import OfferBand from "@/components/lab/mobile/OfferBand";
import type { LabContent } from "@/data/lab";

/**
 * The opening screen — one viewport, the name as a graphic.
 *
 * A VISUAL TEST (Ali, 2026-08-19), adapted from noth.in rather than
 * copied from it. The words are Ali's own — carrying another studio's
 * headline copy would be the one part of this that is genuinely theirs
 * rather than a convention.
 *
 * IT DOES NOT REPLACE HeroScreen. That file is untouched and still
 * exports the threshold hero; this is a second component the homepage
 * can be pointed at, so reverting is one import.
 *
 * THE WORDMARK IS NOW ARTWORK, NOT TYPE (Ali, 2026-08-20). It was set
 * live in Space Grotesk and stretched to fill the screen, which meant
 * measuring the glyphs on every resize, solving for a vertical scale,
 * and accepting a mechanically distorted face because the family stops
 * at 700. Ali's own drawn wordmark replaces all of it: a fixed ratio
 * needs no measurement, so the fit is one CSS aspect-ratio and every
 * line of the old fitting routine is gone.
 *
 * It is painted as a MASK rather than an <img>, so the letterforms take
 * `currentColor` and follow the theme. The file ships filled with
 * currentColor too, for anyone who loads it directly.
 *
 * NO POINTER EFFECT. The debris that scattered over the letters is
 * removed at Ali's request — the drawn wordmark carries the screen on
 * its own and did not need decorating.
 */
export default function OpeningHero({
  content,
  /* Variant A only. On a phone the abstract lede gives way to the offer
     in plain words; desktop keeps the lede, which has room for both. */
  offer = false,
}: {
  content: LabContent;
  offer?: boolean;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);
  const { opening, contact } = content;

  /*
   * The scroll scrub: a slight swell and a fade as the screen leaves.
   *
   * One rAF, one transform, one opacity. It reads `scrollY` and writes
   * to the element; it never reads layout, so it cannot fight the
   * sections below it.
   */
  useEffect(() => {
    const root = rootRef.current;
    const word = wordRef.current;
    if (!root || !word) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const paint = () => {
      frame = 0;
      const height = root.offsetHeight || 1;
      const progress = Math.min(1, Math.max(0, window.scrollY / height));

      word.style.transform = `scale(${(1 + progress * 0.085).toFixed(4)})`;
      word.style.opacity = (1 - progress * 0.42).toFixed(3);
      /* The fade Ali asked to keep, resolving against the showreel. */
      root.style.setProperty("--exit", progress.toFixed(3));
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
    <section ref={rootRef} className="opening" aria-label="Introduction">
      <div className="opening__intro" data-offer={offer || undefined}>
        <p className="opening__lede">
          {opening.lede.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
        {offer && <OfferBand content={content} />}
        {/* The hero CTA carries the same label as the nav, so it has
            to reach the same place. */}
        <Link href="/start" className="opening__cta">
          <span>{opening.cta}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* The name is the page's h1 — it is the largest thing on it and it
          is what the page is about. The mark is decoration to a reader;
          the text is what they are given. */}
      <h1 ref={wordRef} className="opening__word">
        <span className="sr-only">{content.identity}</span>
        <span aria-hidden="true" className="opening__mark" />
      </h1>

      <div className="opening__foot">
        <p className="opening__role">{opening.role}</p>
        <p className="opening__links">
          <a href={`https://instagram.com/${contact.instagram}`} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <span className="opening__badge">EN</span>
        </p>
      </div>
    </section>
  );
}
