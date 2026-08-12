"use client";

import { useState } from "react";
import type { LabContent } from "@/data/lab";

/**
 * How working together goes — a stepper you press through.
 *
 * ADAPTED, NOT INSTALLED. The idea is React Bits' <Stepper />; none of
 * its code is here. That component depends on `motion/react`, and this
 * project's runtime dependencies are gsap, next, react and react-dom —
 * the hover tilt and the "More +" cursor were both adapted the same way
 * rather than pulling motion in for one section.
 *
 * Two things the reference does that this deliberately does not:
 *
 * 1. NOTHING UNMOUNTS. The reference swaps panels through
 *    AnimatePresence, so three of four exist nowhere in the document at
 *    any moment. Here every step is rendered every time and hidden with
 *    opacity, `inert` and `aria-hidden`, so the copy is in the HTML for
 *    search engines and reachable in order for assistive technology.
 *
 * 2. NO HEIGHT ANIMATION. The reference measures each panel and springs
 *    the container to match. Stacking all panels in one grid cell gets
 *    the same result for free: the container is already as tall as its
 *    tallest step, so nothing jumps and nothing needs measuring.
 *
 * THE COST, STATED: pressing is a toll gate. A visitor who does not
 * press sees one step of four, and most visitors do not press. That is
 * why this ends on the enquiry rather than on a full stop — the step
 * someone is actually being asked to take is the one behind the last
 * button.
 */
export default function ProcessStepper({
  process,
  contact,
  heading,
  headingId,
}: {
  process: LabContent["studio"]["process"];
  contact: LabContent["contact"];
  heading: string;
  /** Unique per instance — this renders on two pages. */
  headingId: string;
}) {
  const total = process.length;
  /* 1-based, matching the printed step numbers. `total + 1` is the ask. */
  const [step, setStep] = useState(1);
  const done = step > total;

  return (
    <section
      id="process"
      aria-labelledby={headingId}
      className="scroll-mt-24 bg-lab-air px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id={headingId}
          className="max-w-2xl font-display text-[clamp(1.9rem,4.2vw,3.25rem)] font-bold leading-[1.1] tracking-[-0.035em] text-lab-ink-warm"
        >
          {heading}
        </h2>

        {/* The rail. Indicators are real buttons, so the whole thing is
            operable from the keyboard and a visitor can jump rather than
            being marched. */}
        <ol className="mt-10 flex items-center gap-2 sm:mt-14 sm:gap-3">
          {process.map((item, index) => {
            const number = index + 1;
            const reached = step > index;
            return (
              <li
                key={item.step}
                className="flex flex-1 items-center gap-2 last:flex-none sm:gap-3"
              >
                <button
                  type="button"
                  onClick={() => setStep(number)}
                  aria-current={step === number ? "step" : undefined}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-[13px] font-bold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-ink-warm focus-visible:ring-offset-2 sm:h-10 sm:w-10 ${
                    reached
                      ? "bg-accent text-white"
                      : "bg-lab-haze text-lab-ink-soft ring-1 ring-lab-hairline hover:ring-lab-ink-soft"
                  }`}
                >
                  <span aria-hidden="true">{item.step}</span>
                  <span className="sr-only">
                    Step {item.step}: {item.title}
                  </span>
                </button>

                {index < total - 1 && (
                  <span
                    aria-hidden="true"
                    className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-lab-hairline"
                  >
                    <span
                      className="absolute inset-y-0 left-0 block bg-accent motion-safe:transition-[width] motion-safe:duration-500 motion-safe:ease-out"
                      style={{ width: step > number ? "100%" : "0%" }}
                    />
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        {/*
          All panels occupy the same grid cell, so the box is as tall as
          the tallest step and switching never moves the page. Inactive
          panels keep their place in the document and lose only their
          visibility.
        */}
        <div className="mt-10 grid sm:mt-14">
          {process.map((item, index) => {
            const active = step === index + 1;
            return (
              <div
                key={item.step}
                className={`col-start-1 row-start-1 motion-safe:transition-all motion-safe:duration-400 ${
                  active
                    ? "opacity-100 motion-safe:translate-y-0"
                    : "pointer-events-none opacity-0 motion-safe:translate-y-2"
                }`}
                aria-hidden={!active}
                /* Must be a real boolean — `inert=""` evaluates to false
                   and would leave every hidden panel focusable. */
                inert={!active}
              >
                <p className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-accent">
                  {item.step}
                </p>
                <h3 className="mt-5 max-w-2xl font-display text-[clamp(1.6rem,3.4vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.035em] text-lab-ink-warm">
                  {item.title}
                </h3>
                <p className="mt-5 max-w-2xl font-display text-[clamp(1.05rem,1.6vw,1.25rem)] leading-relaxed text-lab-ink-soft">
                  {item.body}
                </p>
              </div>
            );
          })}

          {/*
            The ask, in the same cell as the steps — pressing Continue on
            the last one lands here. A stepper that explains four steps
            and then stops has walked someone to the edge of the decision
            and left them standing there.
          */}
          <div
            className={`col-start-1 row-start-1 motion-safe:transition-all motion-safe:duration-400 ${
              done
                ? "opacity-100 motion-safe:translate-y-0"
                : "pointer-events-none opacity-0 motion-safe:translate-y-2"
            }`}
            aria-hidden={!done}
            inert={!done}
          >
            <p className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-accent">
              Step 01, really
            </p>
            <h3 className="mt-5 max-w-2xl font-display text-[clamp(1.6rem,3.4vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.035em] text-lab-ink-warm">
              {contact.heading}
            </h3>
            <p className="mt-5 max-w-2xl font-display text-[clamp(1.05rem,1.6vw,1.25rem)] leading-relaxed text-lab-ink-soft">
              {contact.body}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-lab-ink-warm px-7 py-3.5 font-display text-[15px] font-bold text-white transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-ink-warm focus-visible:ring-offset-2"
              >
                WhatsApp
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="rounded-full border border-lab-hairline px-7 py-3.5 font-display text-[15px] font-bold text-lab-ink-warm transition-colors hover:border-lab-ink-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-ink-warm focus-visible:ring-offset-2"
              >
                {contact.email}
              </a>
            </div>
          </div>
        </div>

        {/* Footer. Back only exists once there is somewhere to go back
            to, so step 01 shows a single button and does not open with a
            disabled control. */}
        <div className="mt-12 flex items-center justify-between border-t border-lab-hairline pt-7 sm:mt-16">
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(1, current - 1))}
            className={`font-display text-[15px] font-bold text-lab-ink-soft transition-colors hover:text-lab-ink-warm focus-visible:text-lab-ink-warm focus-visible:outline-none ${
              step === 1 ? "invisible" : ""
            }`}
          >
            ← Back
          </button>

          {done ? (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="font-display text-[15px] font-bold text-lab-ink-soft transition-colors hover:text-lab-ink-warm focus-visible:text-lab-ink-warm focus-visible:outline-none"
            >
              Read it again
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep((current) => current + 1)}
              className="group inline-flex items-center gap-2 rounded-full bg-lab-ink-warm px-7 py-3.5 font-display text-[15px] font-bold text-white transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-ink-warm focus-visible:ring-offset-2"
            >
              {step === total ? "Start a project" : "Continue"}
              <span
                aria-hidden="true"
                className="inline-block transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
