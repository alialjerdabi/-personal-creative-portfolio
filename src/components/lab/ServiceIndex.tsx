"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import type { LabContent, LabPalette } from "@/data/lab";

/** Whole class strings, not interpolated fragments, so Tailwind sees them. */
const FIELD: Record<LabPalette, string> = {
  orange: "bg-lab-orange",
  blue: "bg-lab-blue",
  lime: "bg-lab-lime",
  violet: "bg-lab-violet",
  cream: "bg-lab-cream",
  teal: "bg-lab-teal",
  sun: "bg-lab-sun",
  amber: "bg-lab-amber",
};

/**
 * The services, as rooms in the building.
 *
 * STRUCTURE from symbolstudio.pl/en/services (Ali's reference,
 * 2026-08-16): a standing index on the left, numbered service panels on
 * the right, each pinned a little lower than the last so they stack as
 * you scroll rather than scrolling past one another.
 *
 * LANGUAGE from this site's own museum. The placard — a small tracked
 * label over a hairline rule — is already how the hall captions its
 * exhibits, and the numbering is the same numbering. Borrowing the
 * reference's layout AND its surface is what makes a site read as a
 * collection of other people's pages; the layout is the useful half.
 *
 * Nothing here is a new claim. The outcome, the scope and the price are
 * the copy that was already on the cards.
 */
export default function ServiceIndex({
  services,
}: {
  services: LabContent["services"];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const panels = Array.from(
      root.querySelectorAll<HTMLElement>("[data-service-panel]")
    );
    if (panels.length === 0) return;

    /*
     * How covered each panel is, measured rather than inferred.
     *
     * An IntersectionObserver was tried first and is the wrong tool here:
     * it fires at a threshold, so the card underneath stayed at full
     * contrast until the observer noticed, by which point the arriving
     * card had already cut a line of its text in half. That reads as a
     * layout fault, not as depth.
     *
     * This measures the actual overlap every frame — how far the next
     * panel's top has passed this panel's bottom — and hands it to CSS as
     * `--covered`, so a panel recedes exactly as much as it is buried.
     */
    let frame = 0;

    const update = () => {
      frame = 0;
      const rects = panels.map((panel) => panel.getBoundingClientRect());
      const middle = window.innerHeight / 2;
      let current = 0;

      rects.forEach((rect, index) => {
        const next = rects[index + 1];
        const covered = next
          ? Math.min(1, Math.max(0, (rect.bottom - next.top) / rect.height))
          : 0;
        panels[index].style.setProperty("--covered", covered.toFixed(3));
        if (rect.top <= middle) current = index;
      });

      setActive(current);
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
  }, [services.items.length]);

  return (
    <section
      id="services"
      aria-labelledby="lab-services-heading"
      className="scroll-mt-24 bg-lab-air px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        {/* The placard. Same device the hall uses to caption a screen. */}
        <Reveal>
          <p className="lab-placard">{services.label}</p>
        </Reveal>

        {/*
          Three verbs, in the order they actually happen. Ali's process
          begins with research BEFORE the first call — that is the whole
          differentiator, so it leads.
        */}
        <h2 id="lab-services-heading" className="mt-7 lab-service-statement">
          {["I research.", "I design.", "I build."].map((line, index) => (
            <Reveal key={line} delay={index * 90}>
              <span className="block">{line}</span>
            </Reveal>
          ))}
        </h2>

        <div ref={rootRef} className="mt-14 gap-12 sm:mt-20 lg:flex lg:items-start">
          {/* The standing index. Sticky on desktop, a plain list on a phone
              where there is no room beside the panels for it. */}
          <nav
            aria-label="Services"
            className="hidden lg:block lg:sticky lg:top-32 lg:w-64 lg:shrink-0"
          >
            <p className="lab-placard">Index</p>
            <ul className="mt-5 space-y-1">
              {services.items.map((service, index) => (
                <li key={service.index}>
                  <a
                    href={`#service-${service.index}`}
                    data-active={index === active || undefined}
                    className="lab-service-link"
                  >
                    <span
                      aria-hidden="true"
                      className={`lab-service-link__dot ${FIELD[service.palette]}`}
                    />
                    <span className="lab-service-link__num">{service.index}</span>
                    <span className="lab-service-link__name">{service.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <ol className="flex-1 space-y-6">
            {services.items.map((service, index) => (
              <li
                key={service.index}
                id={`service-${service.index}`}
                data-service-panel
                className="lab-service-panel scroll-mt-32"
                /* Each panel pins a little lower than the one before it,
                   so they gather into a stack instead of sliding past. */
                style={{ top: `calc(7rem + ${index * 1.5}rem)` }}
              >
                <article className="lab-service-card">
                  <span
                    aria-hidden="true"
                    className={`lab-service-card__edge ${FIELD[service.palette]}`}
                  />

                  <header className="flex items-baseline justify-between gap-6">
                    <span className="lab-service-card__num">{service.index}</span>
                    <span className="lab-service-card__price">{service.from}</span>
                  </header>

                  <h3 className="lab-service-card__name">{service.name}</h3>

                  <p className="lab-service-card__outcome">{service.outcome}</p>

                  <p className="lab-placard mt-9 border-t border-lab-hairline pt-6">
                    Scope of work
                  </p>

                  <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                    {service.scope.map((item, scopeIndex) => (
                      <li
                        key={item}
                        className="lab-service-scope"
                        style={{ "--i": scopeIndex } as React.CSSProperties}
                      >
                        <span aria-hidden="true" className="lab-service-scope__tick" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <a href="#contact" className="lab-service-cta group">
                    Start a project
                    <span
                      aria-hidden="true"
                      className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
                    >
                      →
                    </span>
                  </a>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
