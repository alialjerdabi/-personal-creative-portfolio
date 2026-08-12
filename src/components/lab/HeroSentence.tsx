"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import type { HeroToken, LabAsset } from "@/data/lab";

/**
 * Resting transform per position in a cluster. Uneven on purpose: equal
 * spacing and matching angles are what make a row of images look placed
 * by a script rather than by a hand.
 */
const REST = ["rotate(-2.4deg)", "rotate(1.6deg)", "rotate(-1deg)", "rotate(2.2deg)"];

/**
 * A cluster of work stills set inline, at the scale of the words either
 * side of them. Sized in `em` so they stay locked to the type as it
 * scales — the effect collapses the moment the images stop being the same
 * height as the letters beside them.
 *
 * Behaviour is React Bits' BounceCards, adapted from a fixed-size
 * absolute container to inline content: the cards spring up from nothing
 * on a stagger, and hovering one flattens its rotation while pushing its
 * siblings aside. The push is in `em` rather than the component's fixed
 * 160px, because these cards are a fraction of the headline and a
 * pixel offset that works at 137px would throw them off the line at 42px.
 *
 * gsap was already a dependency, so this costs nothing new.
 */
function ChipCluster({ images }: { images: LabAsset[] }) {
  const rootRef = useRef<HTMLSpanElement>(null);

  const cards = () =>
    rootRef.current ? Array.from(rootRef.current.querySelectorAll<HTMLElement>("[data-hero-chip]")) : [];

  const push = (hovered: number) => {
    cards().forEach((card, index) => {
      gsap.killTweensOf(card);
      if (index === hovered) {
        gsap.to(card, { rotate: 0, scale: 1.08, duration: 0.4, ease: "back.out(1.4)", overwrite: "auto" });
        return;
      }
      const offset = index < hovered ? -0.3 : 0.3;
      gsap.to(card, {
        x: `${offset}em`,
        duration: 0.4,
        delay: Math.abs(hovered - index) * 0.05,
        ease: "back.out(1.4)",
        overwrite: "auto",
      });
    });
  };

  const reset = () => {
    cards().forEach((card, index) => {
      gsap.killTweensOf(card);
      gsap.to(card, {
        x: 0,
        scale: 1,
        rotate: parseFloat(REST[index % REST.length].replace(/[^-\d.]/g, "")),
        duration: 0.4,
        ease: "back.out(1.4)",
        overwrite: "auto",
      });
    });
  };

  return (
    <span
      ref={rootRef}
      className="inline-flex translate-y-[0.06em] gap-[0.06em] align-[-0.16em]"
      onMouseLeave={reset}
    >
      {images.map((image, index) => (
        <span
          key={image.src}
          data-hero-chip
          onMouseEnter={() => push(index)}
          /*
            The stills are the only proof of craft above the fold, and at
            1.02em they rendered ~90px on a 1600px screen — decoration
            rather than work.

            The ceiling is set by the line, not by taste: the cluster has
            to stay on the row "I make businesses" occupies, or the
            three-line composition becomes four. Measured at 1600, where
            the inset leaves 1552px and the type sets at 150px, the
            cluster wraps between 1.12em and 1.16em — but 1.12em then
            overflowed the h1's own box by 2px, which the overflow audit
            in scripts/shots.mjs caught. 1.08em is the real ceiling, and
            it is only a 6% gain.

            MAKING THESE MATERIALLY LARGER IS A COMPOSITION DECISION, not
            a tuning one — it means accepting the cluster on a row of its
            own. Ali's call, not a thing to change quietly.
          */
          className="relative inline-block h-[0.91em] w-[1.08em] origin-bottom overflow-hidden rounded-[0.15em] bg-lab-haze shadow-[0_4px_18px_rgb(26_23_19/0.18)] ring-1 ring-white/70"
          style={{ transform: REST[index % REST.length] }}
        >
          <Image src={image.src} alt="" aria-hidden="true" fill sizes="200px" className="object-cover" />
        </span>
      ))}
    </span>
  );
}

/**
 * The drawn arrow — a loose gesture with a loop in it, not a geometric
 * arc. The viewBox is 200x80 against a 1.1em x 0.44em box, matching
 * aspect ratios exactly: mismatched ones let `preserveAspectRatio`
 * letterbox the drawing and the arrowhead fell outside the visible area,
 * which is why the arrow rendered as a curve going nowhere. The clean curve it replaces was the most machine-made mark on the
 * page: an arrow drawn by hand doubles back on itself and does not have a
 * constant radius, and that irregularity is the entire point of having a
 * drawn element at all.
 */
function DrawnArrow() {
  return (
    <span
      data-hero-arrow-slot
      className="inline-block h-[0.44em] w-[1.1em] align-[0.02em] text-accent"
    >
      {/*
        `pathLength="1"` normalises each path so the draw-on is expressed
        as dasharray/dashoffset of 1 regardless of the real geometry — no
        measuring in JS, and the head stays in step with its stroke.
      */}
      <svg viewBox="0 0 200 80" fill="none" className="h-full w-full">
        <path
          data-hero-arrow
          pathLength="1"
          d="M6 56C28 22 66 12 100 26c13 6 15 23 1 27-11 3-17-10-7-17 12-9 39-11 60-2 12 5 22 12 30 20"
          stroke="currentColor"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          data-hero-arrow
          pathLength="1"
          d="M170 36L192 55L166 66"
          stroke="currentColor"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/**
 * The headline, spoken rather than declared.
 *
 * The sentence runs as continuous inline content — words, image clusters,
 * the arrow and hand-placed breaks all in one flow — so it reads like
 * speech rather than a stack of rows.
 *
 * Every element is emitted as a numbered `[data-hero-unit]` in reading
 * order, which is what lets the entrance animate as one left-to-right
 * pass rather than several unrelated effects firing at once (see
 * HeroScreen.tsx). The index lives in the markup because only this
 * component knows the true order once text is split into words.
 *
 * Non-text units are aria-hidden and chips carry empty alt, so assistive
 * technology reads one clean sentence.
 */
export default function HeroSentence({
  tokens,
  className = "",
}: {
  tokens: HeroToken[];
  className?: string;
}) {
  let unit = 0;

  return (
    <span className={className}>
      {tokens.map((token, tokenIndex) => {
        if (token.kind === "break") {
          // Ignored below `lg`, where the measure is too narrow for the
          // desktop composition and natural wrapping is the better shape.
          return <br key={tokenIndex} className="hidden lg:block" />;
        }

        if (token.kind === "text") {
          return token.value.split(" ").map((word) => (
            <span key={`${tokenIndex}-${word}-${unit}`}>
              <span data-hero-unit="word" data-unit-index={unit++} className="inline-block">
                {word}
              </span>{" "}
            </span>
          ));
        }

        if (token.kind === "arrow") {
          return (
            <span key={tokenIndex} aria-hidden="true">
              {/*
                Hidden below `lg`, with the hand-placed breaks.

                An arrow is a pointing gesture, and it only reads as one
                while the thing it points at is still to its right on the
                same line. Above `lg` the breaks hold the composition and
                it aims straight at "easy to remember". Below `lg` the
                breaks switch off, the sentence rewraps, and the arrow
                ends up at the end of a line pointing into the margin —
                the same class of defect as the arrowhead that used to
                fall outside its own viewBox, and just as invisible to
                everything except looking at it on a phone.
              */}
              <span
                data-hero-unit="arrow"
                data-unit-index={unit++}
                className="hidden lg:inline-block"
              >
                <DrawnArrow />
              </span>{" "}
            </span>
          );
        }

        return (
          <span key={tokenIndex} aria-hidden="true">
            {/*
              Its own row below `lg`, inline from `lg` up.

              Inline on a phone the cluster sets with whatever word the
              wrap happens to leave beside it — and once the arrow was
              hidden at this width the freed space pulled "easy" up onto
              the cluster's line and stranded "to" alone on the next one,
              which the type rules here forbid outright. As a block it
              takes a line of its own, the sentence breaks on whole
              phrases again, and the only proof of craft on a phone's
              first screen gets a full row instead of a gap between two
              words.
            */}
            <span
              data-hero-unit="chips"
              data-unit-index={unit++}
              className="block lg:inline-block"
            >
              <ChipCluster images={token.images} />
            </span>{" "}
          </span>
        );
      })}
    </span>
  );
}
