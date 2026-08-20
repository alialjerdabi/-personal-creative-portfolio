"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { LabContent } from "@/data/lab";

/**
 * The opening screen — one viewport, off-white, the name as a graphic.
 *
 * A VISUAL TEST (Ali, 2026-08-19), adapted from noth.in rather than
 * copied from it. The devices taken are structural: a wordmark sized to
 * fill the screen, a clip-path entrance, a scroll-scrubbed zoom, and
 * pointer debris over the letters. The words are Ali's own — carrying
 * another studio's headline copy would be the one part of this that is
 * genuinely theirs rather than a convention.
 *
 * IT DOES NOT REPLACE HeroScreen. That file is untouched and still
 * exports the threshold hero; this is a second component the homepage
 * can be pointed at, so reverting is one import.
 *
 * THE WORDMARK IS MEASURED, NOT GUESSED. The reference hardcodes 12vw
 * with scaleY(4), which only fills the screen for its own name at its
 * own width. Twelve characters of Space Grotesk at 12vw underfills 1920
 * by about 380px, and any change to the name breaks it again. So the
 * type is fitted: measure the word once, solve for the size that fills
 * the line, then solve for the vertical scale that gives it the same
 * proportion of the viewport the reference occupies (~60%).
 *
 * SPACE GROTESK STOPS AT 700. The reference asks for 900. That weight
 * does not exist in this family and the family was chosen deliberately,
 * so the wordmark runs at 700 and takes its weight from the vertical
 * stretch instead. See layout.tsx.
 */

/** The proportion of the FREE BAND the stretched wordmark fills. */
const FILL_HEIGHT = 0.96;
/** Line-height the wordmark is set at, before the vertical stretch. */
const LEADING = 0.72;
/** Pointer travel before another fragment is spawned. */
const FRAGMENT_STEP = 34;

/** Irregular shapes — torn paper rather than a circular flashlight. */
const SHARDS = [
  "polygon(0% 18%, 62% 0%, 100% 44%, 74% 100%, 12% 82%)",
  "polygon(14% 0%, 100% 22%, 82% 86%, 0% 100%)",
  "polygon(0% 0%, 100% 12%, 88% 100%, 26% 74%)",
  "polygon(8% 10%, 92% 0%, 100% 68%, 40% 100%, 0% 56%)",
];

export default function OpeningHero({ content }: { content: LabContent }) {
  const rootRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const debrisRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const footRef = useRef<HTMLDivElement>(null);
  const { opening, contact } = content;

  /*
   * Fit, then scrub — one rAF for both.
   *
   * The fit has to run before the entrance is visible and again on every
   * resize, because both the size and the stretch are functions of the
   * viewport. The scrub reads scrollY and writes a transform; it never
   * reads layout, so the two never fight.
   */
  useEffect(() => {
    const root = rootRef.current;
    const word = wordRef.current;
    if (!root || !word) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let baseX = 1;
    let baseY = 1;

    const fit = () => {
      /*
       * MEASURE THE TEXT, NOT THE BOX.
       *
       * `word.scrollWidth` reads the element, and the element is a block
       * at calc(100% - 2rem). Twelve characters at 100px are narrower
       * than that box, so nothing overflows and scrollWidth returns the
       * box width — which made the fit solve for 1.0 and leave the type
       * at 100px inside a hugely stretched container. The inner span is
       * inline, so its rect is the glyphs and their tracking.
       */
      const text = textRef.current;
      if (!text) return;
      word.style.fontSize = "100px";
      word.style.transform = "none";
      const measured = text.getBoundingClientRect().width;
      if (!measured) return;

      const available = root.clientWidth - 32;
      const size = (available / measured) * 100;
      word.style.fontSize = `${size}px`;

      /*
       * THE BAND, NOT THE VIEWPORT.
       *
       * Filling a fixed 60% of the screen height and centring it on 50%
       * put the letters straight through the CTA — the reference's
       * numbers are for the reference's header, and this one carries an
       * extra pill the reference does not have. So the wordmark is given
       * the space that is actually free: from the bottom of the intro to
       * the top of the footer, centred in that.
       */
      const introBottom = introRef.current?.getBoundingClientRect().bottom ?? 0;
      const footTop = footRef.current?.getBoundingClientRect().top ?? window.innerHeight;
      const bandTop = introBottom + 24;
      const bandBottom = footTop - 24;
      const band = Math.max(120, bandBottom - bandTop);

      word.style.top = `${bandTop + band / 2}px`;

      /* Horizontal: a hair of compression so the fit never rounds over
         the edge. Vertical: as much of the band as the letters can take. */
      baseX = 0.98;
      baseY = (band * FILL_HEIGHT) / (size * LEADING);
    };

    const paint = () => {
      frame = 0;
      const height = root.offsetHeight || 1;
      const progress = Math.min(1, Math.max(0, window.scrollY / height));
      const zoom = reduced.matches ? 1 : 1 + progress * 0.085;

      word.style.transform = `translate(-50%, -50%) scaleX(${(baseX * zoom).toFixed(
        4
      )}) scaleY(${(baseY * zoom).toFixed(4)})`;
      /* The fade Ali asked to keep, now resolving against the showreel
         rather than against the hall's cut to black. */
      root.style.setProperty("--exit", progress.toFixed(3));
      word.style.setProperty("--word-fade", (1 - progress * 0.42).toFixed(3));
    };

    const request = () => {
      if (frame) return;
      frame = requestAnimationFrame(paint);
    };

    const remeasure = () => {
      fit();
      paint();
    };

    remeasure();
    /* Fonts land after first paint, and a fit measured against the
       fallback face is wrong by exactly the width difference. */
    document.fonts?.ready.then(remeasure).catch(() => {});

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", remeasure);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", remeasure);
    };
  }, []);

  /*
   * Pointer debris.
   *
   * Fine pointers only, and decorative — the layer never takes a click.
   * Fragments are spawned on distance travelled rather than on every
   * move event, so speed changes the density instead of the frame cost,
   * and each one removes itself when its own animation finishes.
   */
  useEffect(() => {
    const word = wordRef.current;
    const debris = debrisRef.current;
    if (!word || !debris) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lastX = 0;
    let lastY = 0;
    let travelled = FRAGMENT_STEP;

    const onMove = (event: PointerEvent) => {
      const box = word.getBoundingClientRect();
      const inside =
        event.clientX >= box.left &&
        event.clientX <= box.right &&
        event.clientY >= box.top &&
        event.clientY <= box.bottom;
      if (!inside) {
        lastX = event.clientX;
        lastY = event.clientY;
        return;
      }

      travelled += Math.hypot(event.clientX - lastX, event.clientY - lastY);
      lastX = event.clientX;
      lastY = event.clientY;
      if (travelled < FRAGMENT_STEP) return;
      travelled = 0;

      const size = 10 + Math.random() * 26;
      const shard = document.createElement("span");
      shard.className = "opening-shard";
      shard.style.width = `${size}px`;
      shard.style.height = `${size * (0.6 + Math.random() * 0.8)}px`;
      shard.style.left = `${event.clientX}px`;
      shard.style.top = `${event.clientY}px`;
      shard.style.clipPath = SHARDS[(Math.random() * SHARDS.length) | 0];
      shard.style.setProperty("--spin", `${-24 + Math.random() * 48}deg`);
      debris.append(shard);

      const drift = 6 + Math.random() * 10;
      const animation = shard.animate(
        [
          { opacity: 0, transform: "translate(-50%, -50%) rotate(var(--spin)) scale(0.86)" },
          { opacity: 1, offset: 0.18 },
          {
            opacity: 0,
            transform: `translate(-50%, calc(-50% - ${drift}px)) rotate(var(--spin)) scale(1)`,
          },
        ],
        { duration: 900 + Math.random() * 300, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }
      );
      animation.onfinish = () => shard.remove();
      animation.oncancel = () => shard.remove();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      debris.replaceChildren();
    };
  }, []);

  return (
    <section ref={rootRef} className="opening" aria-label="Introduction">
      <div ref={introRef} className="opening__intro">
        <p className="opening__lede">
          {opening.lede.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
        <Link href="/contact" className="opening__cta">
          <span>{opening.cta}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* The name is the page's h1 — it is the largest thing on it and it
          is what the page is about. */}
      <h1 ref={wordRef} className="opening__word">
        <span ref={textRef}>{opening.wordmark}</span>
      </h1>

      <div ref={debrisRef} className="opening__debris" aria-hidden="true" />

      <div ref={footRef} className="opening__foot">
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
