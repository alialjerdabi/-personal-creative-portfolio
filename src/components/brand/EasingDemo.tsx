"use client";

import { useState } from "react";
import type { BrandDuration } from "@/data/brands/types";

type Bezier = [number, number, number, number];

const css = (b: Bezier) => `cubic-bezier(${b.join(", ")})`;

/** The curve as an SVG path in a 100×100 box, y pointing up. */
function curvePath([x1, y1, x2, y2]: Bezier) {
  return `M0,100 C${x1 * 100},${100 - y1 * 100} ${x2 * 100},${100 - y2 * 100} 100,0`;
}

/**
 * The easing, drawn and then run.
 *
 * A curve on its own is a diagram; the argument for this one only lands
 * when it moves beside the thing it was chosen against. Both dots run
 * the same distance in the same time, so the only difference a viewer
 * can see is the easing.
 *
 * `runKey` lets a parent start a run — the deck does it when the slide
 * arrives. Changing the key remounts the dots, which restarts a CSS
 * animation without reading layout or touching state in an effect.
 *
 * ONE-SHOT, NOT A LOOP. The motion rules say things enter once and stay,
 * and a demo of those rules that looped forever would contradict them.
 */
export default function EasingDemo({
  easing,
  against,
  durations,
  runKey = 0,
  tone = "page",
}: {
  easing: { token: string; bezier: Bezier };
  against: { name: string; bezier: Bezier };
  durations: BrandDuration[];
  runKey?: number;
  tone?: "page" | "dark";
}) {
  const [duration, setDuration] = useState(
    durations.find((d) => d.token === "--dur-slow")?.ms ?? durations[0]?.ms ?? 800
  );
  const [runs, setRuns] = useState(0);
  const dark = tone === "dark";

  const lanes = [
    { label: easing.token, bezier: easing.bezier, strong: true },
    { label: against.name, bezier: against.bezier, strong: false },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,15rem)_1fr] md:items-center">
      <svg
        viewBox="-6 -6 112 112"
        className="w-full max-w-40 overflow-visible sm:max-w-60"
        role="img"
        aria-label={`${easing.token}, ${css(easing.bezier)}, drawn against ${against.name}`}
      >
        <rect
          x="0"
          y="0"
          width="100"
          height="100"
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.14}
        />
        <path
          d={curvePath(against.bezier)}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeWidth={1.5}
          strokeDasharray="3 3"
        />
        <path
          d={curvePath(easing.bezier)}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      </svg>

      <div className="grid gap-5">
        {lanes.map((lane) => (
          <div key={lane.label}>
            <div
              className={`mb-2 flex justify-between font-mono text-[12px] ${
                dark ? "text-white/60" : "text-lab-ink-soft"
              }`}
            >
              <span>{lane.label}</span>
              <span className="hidden sm:inline">{css(lane.bezier)}</span>
            </div>
            <div
              className={`relative h-8 rounded-full ${dark ? "bg-white/10" : "bg-lab-haze"}`}
            >
              {/* The runner spans the track minus one dot, so translating
                  it by 100% of its own width lands the dot flush with the
                  far end at any track width. */}
              <div className="absolute inset-y-1 left-1 right-7">
                <div
                  key={`${runKey}-${runs}`}
                  className="brand-runner h-full"
                  data-armed={runKey + runs > 0 || undefined}
                  style={{
                    animationDuration: `${duration}ms`,
                    animationTimingFunction: css(lane.bezier),
                  }}
                >
                  <span
                    className="block aspect-square h-full rounded-full"
                    style={{
                      backgroundColor: lane.strong
                        ? "var(--accent)"
                        : dark
                          ? "rgb(255 255 255 / 0.5)"
                          : "var(--lab-ink-soft)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setRuns((n) => n + 1)}
            className={`brand-pill ${dark ? "brand-pill--dark" : ""} brand-pill--solid`}
          >
            Run
          </button>
          {durations.map((d) => (
            <button
              key={d.token}
              type="button"
              aria-pressed={duration === d.ms}
              onClick={() => {
                setDuration(d.ms);
                setRuns((n) => n + 1);
              }}
              className={`brand-pill ${dark ? "brand-pill--dark" : ""}`}
            >
              {d.ms}ms
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
