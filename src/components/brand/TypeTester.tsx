"use client";

import { useState } from "react";
import type { BrandTypeface } from "@/data/brands/types";

/**
 * A specimen the reader can type into.
 *
 * The sample is a real <textarea> rather than a contentEditable div: it
 * keeps undo, paste-as-plain-text and mobile keyboards behaving, and it
 * needs no sanitising. The weight control only offers weights the family
 * actually has, so it cannot show a faux-bold that the site never uses.
 */
export default function TypeTester({ face }: { face: BrandTypeface }) {
  const [text, setText] = useState(face.sample);
  const [weight, setWeight] = useState(face.weights.includes(700) ? 700 : face.weights.at(-1)!);
  const [size, setSize] = useState(56);
  const id = `tester-${face.cssVar.replace(/[^a-z]/gi, "")}`;

  return (
    <div className="rounded-2xl border border-lab-hairline bg-lab-card p-5 sm:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <div>
          <h3 className="font-display text-[22px] font-bold tracking-[-0.02em] text-lab-ink-warm">
            {face.name}
          </h3>
          <p className="text-[13px] text-lab-ink-soft">
            {face.role} · {face.source}
          </p>
        </div>
        <p className="font-mono text-[12px] text-lab-ink-soft">var({face.cssVar})</p>
      </div>

      <label htmlFor={id} className="sr-only">
        Type to try {face.name}
      </label>
      <textarea
        id={id}
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={2}
        spellCheck={false}
        className="mt-6 block w-full resize-none bg-transparent text-lab-ink-warm outline-none placeholder:text-lab-ink-soft focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-lab-card"
        placeholder="Type something"
        style={{
          fontFamily: `var(${face.cssVar})`,
          fontWeight: weight,
          fontSize: `clamp(1.75rem, ${size / 16}rem, 12vw)`,
          lineHeight: 1.05,
          letterSpacing: size > 40 ? "-0.03em" : "-0.01em",
        }}
      />

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-lab-hairline pt-5">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Weight">
          {face.weights.map((w) => (
            <button
              key={w}
              type="button"
              aria-pressed={weight === w}
              onClick={() => setWeight(w)}
              className="brand-pill"
              style={{ fontFamily: `var(${face.cssVar})`, fontWeight: w }}
            >
              {w}
            </button>
          ))}
        </div>
        <label className="flex flex-1 items-center gap-3 font-mono text-[12px] text-lab-ink-soft sm:max-w-64">
          Size
          <input
            type="range"
            min={20}
            max={120}
            value={size}
            onChange={(event) => setSize(Number(event.target.value))}
            className="flex-1 accent-[var(--accent)]"
          />
          <span className="w-10 text-right text-lab-ink-warm">{size}px</span>
        </label>
      </div>
    </div>
  );
}
