"use client";

import { useEffect, useRef } from "react";

export function ScrollStackItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`scroll-stack-card ${className}`.trim()}>{children}</div>;
}

interface ScrollStackProps {
  children: React.ReactNode;
  className?: string;
  /** Gap between cards before they begin stacking, in px. */
  itemDistance?: number;
  /** How much smaller each card behind the front one sits. */
  itemScale?: number;
  /** Vertical offset between cards once stacked, in px. */
  itemStackDistance?: number;
  /** Where in the viewport the stack forms, as a percentage of its height. */
  stackPosition?: string;
  /** Scale of the card at the back of the stack. */
  baseScale?: number;
  /** Degrees of rotation added per card. 0 keeps the deck square. */
  rotationAmount?: number;
  /** Blur applied per card of depth. 0 keeps everything sharp. */
  blurAmount?: number;
}

/**
 * A deck of cards that stacks as the page scrolls: each card rises, pins,
 * and shrinks back as the next one lands on top of it.
 *
 * This keeps React Bits' ScrollStack API and its stacking maths, with two
 * deliberate departures.
 *
 * FIRST, NO LENIS. The original's only dependency is a smooth-scroll
 * library that takes over scrolling for the whole document. Everything
 * already animating on this page reads native scroll, so adopting Lenis
 * here would silently desync all of it — and this project's own notes
 * record Lenis as an untried experiment rather than a decision. Native
 * scroll, rAF-throttled.
 *
 * SECOND, PINNING IS `position: sticky`. The original computes a
 * translateY per card per frame to hold it in place. The browser does
 * exactly that natively, for free, correctly through resizes and zoom,
 * and without a scroll listener. What is left for JavaScript is the one
 * thing CSS cannot express: scaling each card by how many cards have
 * landed on top of it.
 *
 * The result is the same effect with no dependency, no nested scroll
 * container, and no scroll hijacking.
 */
export default function ScrollStack({
  children,
  className = "",
  itemDistance = 100,
  itemScale = 0.035,
  itemStackDistance = 22,
  stackPosition = "14%",
  baseScale = 0.86,
  rotationAmount = 0,
  blurAmount = 0,
}: ScrollStackProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>(".scroll-stack-card"));
    if (cards.length === 0) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    const layout = () => {
      const top = (parseFloat(stackPosition) / 100) * window.innerHeight;
      cards.forEach((card, index) => {
        card.style.position = "sticky";
        card.style.top = `${top + index * itemStackDistance}px`;
        card.style.transformOrigin = "top center";
        card.style.willChange = "transform";
        if (index < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
      });
    };

    const clear = () => {
      cards.forEach((card) => {
        card.style.transform = "";
        card.style.filter = "";
      });
    };

    let frame = 0;

    const update = () => {
      frame = 0;
      const anchor = (parseFloat(stackPosition) / 100) * window.innerHeight;

      // How many cards have already landed decides how far back this one
      // sits — depth in the deck, not distance scrolled.
      let landed = 0;
      cards.forEach((card) => {
        if (card.getBoundingClientRect().top <= anchor + 1) landed += 1;
      });

      cards.forEach((card, index) => {
        const depth = Math.max(0, landed - index - 1);
        const target = Math.max(baseScale, 1 - depth * itemScale);

        // Blend across the last card's approach so the shrink is
        // continuous rather than stepping as each card crosses.
        const next = cards[index + 1];
        let progress = 0;
        if (next) {
          const distance = next.getBoundingClientRect().top - anchor;
          progress = 1 - Math.min(1, Math.max(0, distance / window.innerHeight));
        }

        const scale = depth > 0 ? target : 1 - progress * itemScale;
        const rotation = rotationAmount ? -depth * rotationAmount : 0;
        const blur = blurAmount ? depth * blurAmount : 0;

        card.style.transform = `scale(${scale.toFixed(4)})${
          rotation ? ` rotate(${rotation}deg)` : ""
        }`;
        card.style.filter = blur ? `blur(${blur}px)` : "";
      });
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    const apply = () => {
      if (still.matches) {
        clear();
        cards.forEach((card) => {
          card.style.position = "";
          card.style.top = "";
        });
        return;
      }
      layout();
      update();
    };

    apply();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", apply);
    still.addEventListener("change", apply);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", apply);
      still.removeEventListener("change", apply);
      clear();
    };
  }, [itemDistance, itemScale, itemStackDistance, stackPosition, baseScale, rotationAmount, blurAmount]);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
