"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { LabContent } from "@/data/lab";

gsap.registerPlugin(ScrollTrigger);

/**
 * Honest counts, counted up as they arrive.
 *
 * Renders nothing when `stats` is empty, which is its state until Ali
 * supplies real figures — a stats band exists to be believed, so an
 * unfilled one must be absent rather than plausible.
 *
 * The count-up reads the digits out of the supplied string and animates
 * only those, so "30+", "1M+" and "6 years" all work without the data
 * having to be split into number and suffix fields.
 */
export default function StatsBand({ stats }: { stats: LabContent["stats"] }) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (stats.length === 0) return;

    const context = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-stat-value]").forEach((element) => {
          const full = element.dataset.value ?? "";
          const match = full.match(/\d+(?:\.\d+)?/);
          if (!match) return;

          const target = parseFloat(match[0]);
          const decimals = (match[0].split(".")[1] ?? "").length;
          const counter = { value: 0 };

          gsap.to(counter, {
            value: target,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 85%", once: true },
            onUpdate: () => {
              element.textContent = full.replace(
                match[0],
                counter.value.toFixed(decimals)
              );
            },
          });
        });
      });
    }, rootRef);

    return () => context.revert();
  }, [stats.length]);

  if (stats.length === 0) return null;

  return (
    <section
      ref={rootRef}
      aria-label="By the numbers"
      className="bg-lab-air px-5 pb-20 sm:px-8 sm:pb-28"
    >
      <div className="mx-auto grid max-w-6xl gap-5 rounded-[2rem] border border-lab-hairline bg-white/70 p-8 sm:grid-cols-3 sm:p-12">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p
              data-stat-value
              data-value={stat.value}
              className="font-display text-[clamp(2.25rem,5vw,3.75rem)] font-extrabold leading-none tracking-[-0.04em] text-lab-ink-warm"
            >
              {stat.value}
            </p>
            <p className="mt-3 font-display text-[15px] text-lab-ink-soft">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
