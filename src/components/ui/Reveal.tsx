"use client";

import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  /** Stagger delay in ms, applied only to the entrance transition. */
  delay?: number;
  /** Entrance transition duration in ms — default 400, override for editorial rhythm (e.g. larger elements settling slightly slower). */
  duration?: number;
  /** Adds a slight scale-settle (98% → 100%) alongside the existing rise + fade. Ignored when `mask` is set. */
  scale?: boolean;
  /**
   * Editorial mask reveal (2026-07-25) — for image-scale moments rather
   * than text/UI: the content is fully clipped by an overflow-hidden
   * wrapper and rises up from behind that edge (translateY 100%→0),
   * reading as "revealed," not just faded in place. Requires a second,
   * stable wrapper element (the clip), so the IntersectionObserver
   * target and the transformed element are no longer the same node —
   * everything else about the arm/observe/settle logic is identical.
   */
  mask?: boolean;
  className?: string;
}

/**
 * Quiet entrance reveal: fade + short rise when the element enters the
 * viewport. Server-rendered visible, so without JavaScript or under
 * prefers-reduced-motion nothing is ever hidden — the effect only
 * arms itself for elements still below the fold after hydration.
 */
export default function Reveal({
  children,
  delay = 0,
  duration = 400,
  scale = false,
  mask = false,
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"visible" | "hidden">("visible");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top <= window.innerHeight) return;

    setState("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("visible");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style = {
    transitionDelay: delay ? `${delay}ms` : undefined,
    transitionDuration: `${duration}ms`,
  };

  if (mask) {
    return (
      <div ref={ref} className={`overflow-hidden ${className}`.trim()}>
        <div
          style={style}
          className={`h-full w-full motion-safe:transition-[opacity,transform] motion-safe:ease-out ${
            state === "visible" ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      style={style}
      className={`motion-safe:transition-[opacity,transform] motion-safe:ease-out ${
        state === "visible"
          ? `translate-y-0 opacity-100 ${scale ? "scale-100" : ""}`
          : `translate-y-6 opacity-0 ${scale ? "scale-[0.98]" : ""}`
      } ${className}`.trim()}
    >
      {children}
    </div>
  );
}
