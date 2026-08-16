"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

/* Pixels per second. Matches the CSS marquee this replaced — that one
   crossed one copy of the track (3800px) in 64s, so the rail keeps the
   pace it already had rather than acquiring a new one. */
const DRIFT_PX_PER_SECOND = 59;

/**
 * The testimonial rail: drifts on its own, and can be grabbed and thrown.
 *
 * WHY THIS IS A COMPONENT AND NOT A CSS ANIMATION ANY MORE.
 *
 * The rail used to move by animating `transform` on the track, with the
 * scroller set to `overflow-x: hidden` whenever motion was welcome. Drag
 * moves `scrollLeft`. On a hidden overflow there is no scroll position to
 * move, so a drag handler bolted onto that arrangement does nothing at
 * all and reads as a dead pointer — and the two mechanisms cannot both
 * own the same pixels anyway.
 *
 * So the loop is driven by `scrollLeft` instead. The track is still the
 * doubled one, so wrapping the scroll position at the halfway mark keeps
 * the seam invisible, and now there is exactly one thing moving the rail
 * whether it is the drift, a drag, a trackpad, or a screen reader moving
 * focus into a panel. Touch scrolling comes free and native.
 *
 * The pauses survive the change: hover and focus-within both stop the
 * drift, because a marquee nobody can stop is unreadable, and because a
 * keyboard user would otherwise be tabbing into a moving target.
 */
export default function DragRail({
  children,
  className = "",
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;
    let last = 0;
    let paused = false;
    let dragging = false;
    let pointerId: number | null = null;
    let startX = 0;
    let startScroll = 0;

    /*
     * The drift is accumulated as a float and only then written.
     *
     * `scrollLeft += 0.42` does nothing at all: the setter snaps to the
     * device pixel grid, so a sub-pixel increment is discarded on every
     * frame and the rail sits perfectly still. At 26px/s each frame is
     * worth 0.42px, which is exactly the case that vanishes. Keeping the
     * real position here and writing the accumulated total is what makes
     * a slow drift possible at all.
     */
    let position = 0;

    /* The track is two identical copies. One copy's width is the loop. */
    const half = () => rail.scrollWidth / 2;

    const wrap = () => {
      const loop = half();
      if (loop <= 0) return;
      if (position >= loop) position -= loop;
      else if (position < 0) position += loop;
    };

    const tick = (now: number) => {
      const elapsed = last ? Math.min(now - last, 100) : 0;
      last = now;

      /* Anything else that moved the rail — trackpad, touch, a focused
         panel scrolling into view — wins, and the drift picks up there. */
      if (Math.abs(rail.scrollLeft - position) > 1.5) position = rail.scrollLeft;

      if (!paused && !dragging && !reduced.matches) {
        position += (DRIFT_PX_PER_SECOND * elapsed) / 1000;
        wrap();
        rail.scrollLeft = position;
      }

      frame = requestAnimationFrame(tick);
    };

    const pause = () => {
      paused = true;
    };
    const resume = () => {
      paused = false;
    };

    /*
     * Mouse only. Touch already scrolls this natively with momentum, and a
     * hand-rolled touch scroller always feels worse than the platform's.
     */
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch" || event.button !== 0) return;
      dragging = true;
      pointerId = event.pointerId;
      startX = event.clientX;
      startScroll = rail.scrollLeft;
      rail.setPointerCapture(event.pointerId);
      rail.dataset.dragging = "true";
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== pointerId) return;
      const delta = event.clientX - startX;
      position = startScroll - delta;
      wrap();
      rail.scrollLeft = position;
    };

    const endDrag = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== pointerId) return;
      dragging = false;
      pointerId = null;
      delete rail.dataset.dragging;
      if (rail.hasPointerCapture(event.pointerId)) {
        rail.releasePointerCapture(event.pointerId);
      }
    };

    /*
     * No click-vs-drag threshold here: the panels contain no links or
     * buttons, so there is nothing a finished drag could fire by mistake.
     * `user-select: none` while dragging covers the real nuisance, which
     * is sweeping a selection across five quotes. Add the threshold when
     * a panel first gains something clickable, not before.
     */
    frame = requestAnimationFrame(tick);
    rail.addEventListener("pointerenter", pause);
    rail.addEventListener("pointerleave", resume);
    rail.addEventListener("focusin", pause);
    rail.addEventListener("focusout", resume);
    rail.addEventListener("pointerdown", onPointerDown);
    rail.addEventListener("pointermove", onPointerMove);
    rail.addEventListener("pointerup", endDrag);
    rail.addEventListener("pointercancel", endDrag);

    return () => {
      cancelAnimationFrame(frame);
      rail.removeEventListener("pointerenter", pause);
      rail.removeEventListener("pointerleave", resume);
      rail.removeEventListener("focusin", pause);
      rail.removeEventListener("focusout", resume);
      rail.removeEventListener("pointerdown", onPointerDown);
      rail.removeEventListener("pointermove", onPointerMove);
      rail.removeEventListener("pointerup", endDrag);
      rail.removeEventListener("pointercancel", endDrag);
    };
  }, []);

  return (
    <div
      ref={railRef}
      className={`lab-rail ${className}`}
      role="group"
      aria-label={label}
      tabIndex={0}
    >
      {children}
    </div>
  );
}
