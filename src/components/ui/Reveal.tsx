"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Past this many siblings the stagger stops growing. Six * 60ms is
 * already 360ms between the first and last card; letting it run means
 * the end of a long grid arrives after the reader has scrolled past it.
 */
const MAX_STAGGER_STEPS = 6;
const STAGGER_MS = 60;

type Variant = "text" | "block" | "morph" | "mask";

interface RevealProps {
  children: React.ReactNode;
  /**
   * Which entrance. See docs/motion.md.
   *
   * text  — lines, labels, paragraphs. 12px.
   * block — cards, panels, list items. 28px.
   * morph — things genuinely changing size. Scale 0.94 to 1.
   * mask  — media, clipped and travelling its own height.
   */
  variant?: Variant;
  /**
   * Position among siblings. Multiplied by the stagger step and capped,
   * so callers pass an index rather than hand-computing milliseconds —
   * which is how the old delays drifted out of step with each other.
   */
  index?: number;
  /** Escape hatch in ms, for the rare sequence an index cannot express. */
  delay?: number;
  className?: string;
}

/**
 * The entrance primitive.
 *
 * ENTERS ONCE AND STOPS. Both reference sites do the same thing: a
 * sweep of symbolstudio after its animations fire shows nothing moving.
 * Nothing here animates out on the way past.
 *
 * SERVER-RENDERS VISIBLE. It arms itself after hydration and only for
 * elements still below the fold, so without JavaScript — or under
 * reduced motion — the page is complete and nothing is hidden behind an
 * animation that never runs.
 *
 * The timing values are tokens in globals.css, not props. A component
 * that can pass any duration will eventually pass forty different ones.
 */
export default function Reveal({
  children,
  variant = "text",
  index = 0,
  delay,
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"visible" | "hidden">("visible");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    /* Already on screen at hydration: it has been seen, so animating it
       now would be movement the reader did not cause. */
    if (el.getBoundingClientRect().top <= window.innerHeight) return;

    setState("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState("visible");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const ms = delay ?? Math.min(index, MAX_STAGGER_STEPS) * STAGGER_MS;
  const style = ms ? { transitionDelay: `${ms}ms` } : undefined;

  if (variant === "mask") {
    return (
      <div ref={ref} className={`lab-reveal-clip ${className}`.trim()}>
        <div
          data-variant="mask"
          data-state={state}
          style={style}
          className="lab-reveal h-full w-full"
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      data-variant={variant}
      data-state={state}
      style={style}
      className={`lab-reveal ${className}`.trim()}
    >
      {children}
    </div>
  );
}
