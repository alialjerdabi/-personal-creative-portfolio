"use client";

import { useRef } from "react";

/**
 * Pointer-tracked 3D tilt, applied to whatever it wraps.
 *
 * Adapted from React Bits' TiltedCard rather than installed: that version
 * pulls in `motion` for four spring values, and the whole effect is a
 * transform on pointermove plus a CSS transition on leave. The brief's
 * rule is that a component reference is an idea to adapt, not a task to
 * complete, and a ~50KB animation runtime for one hover state is not a
 * trade this page should make.
 *
 * The transform is written to CSS custom properties rather than to
 * `style.transform` directly, so the element keeps its own transform
 * declaration and the tilt composes with it instead of overwriting it.
 *
 * Pointer-only by design:
 * - `(hover: hover)` gates it, so touch devices never get a tilt stuck
 *   mid-rotation from a tap.
 * - `prefers-reduced-motion` removes it entirely.
 * Both live in CSS, not JS, so there is no listener to tear down and no
 * hydration branch.
 */
export default function Tilt({
  children,
  amplitude = 7,
  className = "",
}: {
  children: React.ReactNode;
  /** Maximum rotation in degrees at the far edge of the element. */
  amplitude?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);

  function handleMove(event: React.PointerEvent<HTMLSpanElement>) {
    const element = ref.current;
    if (!element) return;

    // Coalesce to one write per frame: pointermove fires far more often
    // than the compositor can use, and each write invalidates layout.
    cancelAnimationFrame(frame.current);
    const { clientX, clientY } = event;

    frame.current = requestAnimationFrame(() => {
      const rect = element.getBoundingClientRect();
      const offsetX = clientX - rect.left - rect.width / 2;
      const offsetY = clientY - rect.top - rect.height / 2;

      element.style.setProperty(
        "--tilt-x",
        `${(offsetY / (rect.height / 2)) * -amplitude}deg`
      );
      element.style.setProperty(
        "--tilt-y",
        `${(offsetX / (rect.width / 2)) * amplitude}deg`
      );
    });
  }

  function reset() {
    const element = ref.current;
    if (!element) return;
    cancelAnimationFrame(frame.current);
    element.style.setProperty("--tilt-x", "0deg");
    element.style.setProperty("--tilt-y", "0deg");
  }

  return (
    /*
      A span, not a div: the primary caller wraps the image panel INSIDE
      the project card's <button>, whose content model is phrasing content
      only. `block` restores the layout behaviour a div would have had.
    */
    <span
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className={`lab-tilt block ${className}`.trim()}
    >
      {children}
    </span>
  );
}
