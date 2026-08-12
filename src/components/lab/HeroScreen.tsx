"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import HeroSentence from "@/components/lab/HeroSentence";
import { HERO_ENTRANCE_DELAY_S, HERO_UNIT_STEP_S } from "@/components/lab/timing";
import type { LabContent } from "@/data/lab";

gsap.registerPlugin(ScrollTrigger);

/**
 * The opening: a pale wash, a floating nav, and one sentence said in the
 * first person with the work set into it.
 *
 * THE ENTRANCE IS ONE IDEA: the sentence arrives the way it would be
 * spoken — left to right, in reading order, one unit at a time. Words
 * rise, and when the line reaches a slot where work belongs, the stills
 * drop into it at that exact moment; when it reaches the gesture, the
 * arrow draws itself. Nothing animates out of sequence, because every
 * element's timing is a function of its position in the sentence rather
 * than of which effect it happens to use.
 *
 * The previous version fired five separate tweens on hand-tuned offsets
 * after a two-second wait left over from a deleted loading screen, which
 * is exactly why it read as random.
 *
 * Everything renders visible from the server. The entrance masks itself
 * in a pre-paint layout effect and only when motion is allowed, so no-JS
 * and reduced-motion visitors get the finished composition immediately.
 */
export default function HeroScreen({ content }: { content: LabContent }) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        /*
         * A page opened into a background tab gets no entrance at all.
         * GSAP runs on requestAnimationFrame, which does not fire while a
         * tab is hidden — so hiding the sentence first and animating it
         * back would leave a blank hero until the tab is focused. Skipping
         * the entrance is strictly better than that: the visitor arrives
         * to the finished composition.
         */
        if (document.visibilityState === "hidden") return;

        const units = gsap.utils.toArray<HTMLElement>("[data-hero-unit]");

        /*
         * Looked up through the document, not as a selector string.
         *
         * `gsap.context(fn, rootRef)` scopes every selector string to the
         * hero section — and the nav is rendered at page level (it has to
         * be: it is fixed, and sticky inside the hero released it for the
         * rest of the page). So "[data-hero-chrome]" matched nothing, and
         * the nav's entrance had been silently dead, announcing itself
         * only as a "GSAP target not found" warning in the console.
         */
        const chrome = document.querySelector<HTMLElement>("[data-hero-chrome]");

        if (chrome) gsap.set(chrome, { opacity: 0, y: -14 });
        gsap.set(units, { opacity: 0, yPercent: 42 });
        gsap.set("[data-hero-chip]", { scale: 0.4, opacity: 0 });
        gsap.set("[data-hero-arrow]", { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set("[data-hero-tail]", { opacity: 0, y: 18 });

        const timeline = gsap.timeline({
          delay: HERO_ENTRANCE_DELAY_S,
          defaults: { ease: "power3.out" },
        });

        if (chrome) timeline.to(chrome, { opacity: 1, y: 0, duration: 0.55 }, 0);

        units.forEach((element) => {
          // Position in the sentence — not position in the code — is what
          // decides when a unit moves.
          const at = 0.12 + Number(element.dataset.unitIndex ?? 0) * HERO_UNIT_STEP_S;
          const kind = element.dataset.heroUnit;

          timeline.to(element, { opacity: 1, yPercent: 0, duration: 0.62 }, at);

          if (kind === "chips") {
            timeline.to(
              element.querySelectorAll("[data-hero-chip]"),
              {
                opacity: 1,
                scale: 1,
                duration: 0.55,
                stagger: 0.05,
                ease: "back.out(1.7)",
              },
              at
            );
          }

        });

        const settled = 0.12 + units.length * HERO_UNIT_STEP_S;

        /*
         * The arrow draws LAST, after the sentence has finished arriving
         * and a beat of silence has passed.
         *
         * Its slot opens with the rest of the line — the gap is reserved
         * in reading order — but the stroke stays undrawn until there is
         * nothing else moving. An arrow is a pointing gesture, so it only
         * reads as one when it is the only thing in motion; drawn in the
         * middle of the sequence (which is where it was) it was buried
         * under the seven words still landing behind it, and looked like
         * it appeared from nowhere.
         *
         * It then leans once toward what it points at, and stays there.
         */
        timeline
          .to(
            "[data-hero-arrow]",
            { strokeDashoffset: 0, duration: 0.62, stagger: 0.16, ease: "power2.inOut" },
            settled + 0.22
          )
          .to(
            "[data-hero-arrow-slot]",
            { x: 9, duration: 0.5, ease: "power2.out" },
            settled + 0.95
          );

        timeline.to(
          "[data-hero-tail]",
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
          settled + 0.35
        );

        /*
         * The handoff into the deck below: the last cluster of stills in
         * the sentence swells and dissolves as the hero leaves, so the
         * card the visitor saw inside the line becomes the card that
         * arrives. Driven by scroll, and applied to the chip rather than
         * to the deck — a transform on the deck's ancestor would make it
         * the containing block for its sticky cards and break the stack.
         */
        const clusters = gsap.utils.toArray<HTMLElement>('[data-hero-unit="chips"]');
        const last = clusters[clusters.length - 1];
        if (last) {
          /*
           * `fromTo` with `immediateRender: false`, not `to`.
           *
           * A plain `to` records its start values the moment it renders,
           * which for a scrubbed trigger is when it is created — and at
           * that point the entrance has just set every unit to opacity 0.
           * So the tween became "from invisible to invisible": nothing
           * happened scrolling down, and scrolling back up restored it to
           * invisible, leaving a hole in the sentence. Stating the start
           * explicitly and deferring the first render fixes both.
           */
          gsap.fromTo(
            last,
            { scale: 1, opacity: 1 },
            {
              scale: 3.4,
              opacity: 0,
              ease: "none",
              immediateRender: false,
              scrollTrigger: {
                trigger: rootRef.current,
                start: "bottom 92%",
                end: "bottom 38%",
                scrub: 0.4,
              },
            }
          );
        }
      });
    }, rootRef);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-labelledby="lab-hero-heading"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-lab-air text-lab-ink-warm"
    >
      {/*
        The wash. Two soft fields rather than a single linear gradient, so
        the light has a source and a direction instead of reading as a
        flat ramp — the difference between a page that feels lit and one
        that feels tinted.
      */}
      <span
        aria-hidden="true"
        /* Literals cooled with the tokens on 2026-08-06 — see globals.css. */
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_12%_-12%,var(--lab-sky)_0%,transparent_62%),radial-gradient(90%_70%_at_100%_4%,#f5f2ec_0%,transparent_58%),linear-gradient(180deg,#f5f3ee_0%,var(--lab-air)_48%,var(--lab-haze)_100%)]"
      />

      {/*
        The statement is the page.
        - 9.2vw on a 1760px measure, centred. Sized so the statement, the
          supporting line and the buttons all fit inside the inset with
          the nav cleared — the type is as large as a consistent margin
          allows, rather than as large as the viewport allows.
        - It starts below the nav rather than under it; the
          tail is pushed to the bottom edge with `mt-auto`. Centring left
          a third of the viewport empty above AND below, which is what
          made a large headline read as a small one on a big page.
        - No `text-balance`: balancing evens lines by shortening all of
          them and held the statement to 68% of the viewport. The breaks
          are hand-placed in the content instead.
        - Centred, per Ali's direction. Left-aligned the ragged right edge
          left a visible gap on wide screens that read as dead margin
          rather than as rag; centring balances it against both gutters.
      */}
      {/*
        One inset, equal on every side.

        The nav is FIXED, so it is out of flow and does not push anything
        down — at 3vh of top padding the first line of the statement was
        rendering underneath it and getting clipped. The top padding has
        to clear the nav's own offset plus its height, and then match the
        gutter used left, right and bottom so the whole block sits in a
        consistent margin.
      */}
      <div className="flex flex-1 flex-col px-6 pb-6 pt-[6.5rem] sm:px-10 sm:pb-10 sm:pt-[7.5rem]">
        <h1
          id="lab-hero-heading"
          /*
            Two scales, because the two viewports have opposite problems.
            Below sm the old floor did nothing — at 390px, 10vw resolves to
            39px, so every phone rendered at the 2.4rem minimum and left
            ~48% of the fold empty; the fix for that dead space is bigger
            type, not more padding. From sm up the constraint reverses: the
            line has to stay inside the inset with the tail row still on
            screen, and pushing past ~10vw wrapped "from." onto a line of
            its own.
          */
          className="mx-auto w-full max-w-[1760px] text-center font-display text-[clamp(3.6rem,17vw,5.4rem)] font-bold leading-[0.98] tracking-[-0.048em] sm:text-[clamp(2.4rem,9.4vw,11rem)]"
        >
          <HeroSentence tokens={content.hero.tokens} />
        </h1>

        {/*
          The fold's only credibility marker, and it sits in the hole.
          Between the statement and the tail row there was ~300px of
          nothing at 1600x900 — enough emptiness that the headline read
          smaller than it is, and the whole first screen was claim with
          no evidence: no location, no availability, nothing a stranger
          could weigh.

          Both facts are already in the content layer and already true.
          Availability in particular was buried in the last section of
          the page, which is the one place a scarcity signal cannot do
          any work.

          Part of the tail group so it arrives with the supporting line
          rather than competing with the sentence for attention.
        */}
        <p
          data-hero-tail
          className="mx-auto mt-9 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-display text-[15px] text-lab-ink-soft"
        >
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-lab-lime" />
            {content.lobby.availability}
          </span>
          <span aria-hidden="true" className="opacity-40">
            ·
          </span>
          <span>{content.lobby.location}</span>
        </p>

        {/*
          `justify-between`, not `justify-center`. Centring the pair left
          the supporting line hard against the left edge and the buttons
          adrift in the middle, with a visible hole on the right — the row
          read as two things that had failed to line up rather than as one
          row. Pushed to opposite ends they bracket the sentence above and
          the inset stays even on all four sides.
        */}
        <div className="mx-auto mt-auto flex w-full max-w-[1760px] flex-col items-center justify-center gap-5 pt-8 text-center sm:flex-row sm:items-end sm:justify-between sm:gap-10 sm:pt-9 sm:text-left">
          <p
            data-hero-tail
            /* 30rem, not max-w-sm: the positioning rewrite lengthened this
               line, and at 24rem it broke over three lines leaving "end."
               alone on the last one. */
            className="max-w-[30rem] font-display text-[clamp(0.95rem,1.15vw,1.1rem)] leading-relaxed text-lab-ink-soft"
          >
            {content.hero.sub}
          </p>

          <div data-hero-tail className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={content.hero.cta.href}
              className="rounded-full bg-lab-ink-warm px-7 py-3.5 font-display text-[15px] font-bold text-white transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-ink-warm focus-visible:ring-offset-2"
            >
              {content.hero.cta.label}
            </a>
            <a
              href={content.hero.secondary.href}
              className="group flex items-center gap-2 rounded-full border border-lab-hairline bg-white/60 px-7 py-3.5 font-display text-[15px] font-bold text-lab-ink-warm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-ink-warm focus-visible:ring-offset-2"
            >
              {content.hero.secondary.label}
              <span
                aria-hidden="true"
                className="inline-block transition-transform group-hover:translate-y-0.5"
              >
                ↓
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
