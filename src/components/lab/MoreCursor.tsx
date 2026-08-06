"use client";

import { useRef, useState } from "react";

/**
 * A pointer companion for the work grid: a small dot that follows the
 * cursor and swells into a "More +" pill over a project card.
 *
 * Adapted from the motion-primitives Cursor rather than installed. That
 * version brings `motion/react` for the spring and `lucide-react` for one
 * plus glyph; here the follow is a transform written to CSS custom
 * properties, the spring is a 110ms ease on that transform, and the plus
 * is six lines of SVG. No new dependencies for an ornament.
 *
 * It exists only where it can work: `(hover: hover) and (pointer: fine)`,
 * and only when motion is welcome. That gating lives in CSS, so the
 * native cursor is hidden in exactly the same conditions the replacement
 * appears — the failure mode this avoids is a touch or reduced-motion
 * visitor getting `cursor: none` and no cursor at all.
 *
 * Purely decorative: aria-hidden, never focusable, no pointer events. The
 * cards underneath are real buttons and keep every affordance they had.
 */
export default function MoreCursor({
  children,
  label = "More",
}: {
  children: React.ReactNode;
  label?: string;
}) {
  const dotRef = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);
  const [inside, setInside] = useState(false);
  const [overCard, setOverCard] = useState(false);

  function handleMove(event: React.PointerEvent<HTMLDivElement>) {
    const dot = dotRef.current;
    if (!dot) return;

    const { clientX, clientY } = event;
    const isOverCard = Boolean(
      (event.target as HTMLElement).closest("[data-more-target]")
    );

    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      dot.style.setProperty("--cursor-x", `${clientX}px`);
      dot.style.setProperty("--cursor-y", `${clientY}px`);
    });

    setOverCard(isOverCard);
  }

  return (
    <div
      onPointerMove={handleMove}
      onPointerEnter={() => setInside(true)}
      onPointerLeave={() => {
        cancelAnimationFrame(frame.current);
        setInside(false);
        setOverCard(false);
      }}
      className="lab-cursor-field"
    >
      {children}

      <span
        ref={dotRef}
        aria-hidden="true"
        data-visible={inside || undefined}
        data-expanded={overCard || undefined}
        className="lab-cursor"
      >
        <span className="lab-cursor-label">
          {label}
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
            <path
              d="M8 3.5v9M3.5 8h9"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </span>
    </div>
  );
}
