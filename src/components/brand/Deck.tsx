"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { BrandGuide } from "@/data/brands/types";
import { bestInk } from "@/lib/contrast";
import BrandMark from "./BrandMark";
import EasingDemo from "./EasingDemo";

/*
 * THE CANVAS IS 1600×900 AND IS SCALED, NOT REFLOWED.
 *
 * A deck is a composition, not a page: a slide that reflows on a narrow
 * window stops being the slide that was designed. So every slide is laid
 * out in pixels on a fixed 16:9 canvas and the whole canvas is scaled to
 * fit — the same thing Keynote does. The scale is written straight to a
 * CSS variable by a ResizeObserver rather than kept in React state, so a
 * window drag never re-renders twelve slides.
 *
 * Printing drops the scale and gives each slide its own 1600×900 page,
 * so "Save as PDF" from the browser is the export.
 */
const W = 1600;
const H = 900;

const NAV_EVENT = "brand-deck-nav";

/* The current slide lives in the URL hash (#1, #2 …), so a link can open
   the deck on a given slide and a reload keeps your place. Read through
   useSyncExternalStore because the hash is state React does not own. */
function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener(NAV_EVENT, onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener(NAV_EVENT, onChange);
  };
}
const readHash = () => Math.max(0, (parseInt(window.location.hash.slice(1), 10) || 1) - 1);

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

type Slide = { id: string; title: string; ground: string; ink: string; body: (active: boolean) => React.ReactNode };

export default function Deck({ brand, guideUrl }: { brand: BrandGuide; guideUrl: string }) {
  const slides = buildSlides(brand, guideUrl);
  const count = slides.length;
  const raw = useSyncExternalStore(subscribe, readHash, () => 0);
  const index = Math.min(raw, count - 1);

  const rootRef = useRef<HTMLDivElement>(null);
  const [chrome, setChrome] = useState(true);
  const idle = useRef<number | undefined>(undefined);

  const go = useCallback(
    (next: number) => {
      const target = Math.max(0, Math.min(count - 1, next));
      /* replaceState, not a new history entry per slide: Back should
         leave the deck, not rewind it one slide at a time. */
      history.replaceState(null, "", `#${target + 1}`);
      window.dispatchEvent(new Event(NAV_EVENT));
    },
    [count]
  );

  /* Scale the canvas to the viewport. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const fit = () => {
      const scale = Math.min(root.clientWidth / W, root.clientHeight / H);
      root.style.setProperty("--deck-scale", String(scale));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  /* Keys. The current slide is re-read from the URL on every press, so
     the handler never closes over a stale index. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement;
      if (target.closest("input, textarea, select")) return;
      const at = Math.min(readHash(), count - 1);
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
          event.preventDefault();
          go(at + 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          event.preventDefault();
          go(at - 1);
          break;
        case "Home":
          go(0);
          break;
        case "End":
          go(count - 1);
          break;
        case "f":
        case "F":
          toggleFullscreen(rootRef.current);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, go]);

  /* Controls get out of the way while presenting, and return on any
     movement. */
  const wake = () => {
    setChrome(true);
    window.clearTimeout(idle.current);
    idle.current = window.setTimeout(() => setChrome(false), 2600);
  };
  useEffect(() => {
    idle.current = window.setTimeout(() => setChrome(false), 2600);
    return () => window.clearTimeout(idle.current);
  }, []);

  /* Swipe on touch; a click on either half steps on a pointer. */
  const down = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (event: React.PointerEvent) => {
    down.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event: React.PointerEvent) => {
    const start = down.current;
    down.current = null;
    if (!start) return;
    if ((event.target as HTMLElement).closest("a, button, input, textarea")) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      go(index + (dx < 0 ? 1 : -1));
    } else if (Math.abs(dx) < 6 && Math.abs(dy) < 6 && event.pointerType === "mouse") {
      go(index + (event.clientX > window.innerWidth / 2 ? 1 : -1));
    }
  };

  return (
    <div
      ref={rootRef}
      data-deck
      data-chrome={chrome || undefined}
      onPointerMove={wake}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      className="brand-deck"
      role="region"
      aria-roledescription="slide deck"
      aria-label={`${brand.name} brand guidelines`}
    >
      <div className="brand-deck__stage">
        {slides.map((slide, i) => {
          const active = i === index;
          return (
            <section
              key={slide.id}
              className="brand-deck__slide"
              data-active={active || undefined}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${slide.title}`}
              aria-hidden={!active}
              inert={!active}
              style={{ background: slide.ground, color: slide.ink }}
            >
              {slide.body(active)}
              <footer className="brand-deck__folio" style={{ color: slide.ink }}>
                <span>{brand.name}</span>
                <span>{slide.title}</span>
                <span>
                  {String(i + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                </span>
              </footer>
            </section>
          );
        })}
      </div>

      <div className="brand-deck__progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${(index + 1) / count})` }} />
      </div>

      <nav className="brand-deck__controls" aria-label="Deck controls">
        <Link href={`/brand/${brand.slug}`} className="brand-deck__btn">
          Guide
        </Link>
        <button type="button" className="brand-deck__btn" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous slide">
          ←
        </button>
        <span className="brand-deck__count" aria-live="polite">
          {index + 1} / {count}
        </span>
        <button type="button" className="brand-deck__btn" onClick={() => go(index + 1)} disabled={index === count - 1} aria-label="Next slide">
          →
        </button>
        <button type="button" className="brand-deck__btn" onClick={() => toggleFullscreen(rootRef.current)} aria-label="Toggle full screen (F)">
          ⤢
        </button>
        <button type="button" className="brand-deck__btn" onClick={() => window.print()} aria-label="Save as PDF">
          PDF
        </button>
      </nav>
    </div>
  );
}

function toggleFullscreen(el: HTMLElement | null) {
  if (!el) return;
  if (document.fullscreenElement) void document.exitFullscreen();
  else void el.requestFullscreen?.().catch(() => {});
}

/* ─────────────────────────────────────────────────────────────── */

function Placard({ children, ink }: { children: React.ReactNode; ink?: string }) {
  return (
    <p className="text-[18px] font-bold uppercase tracking-[0.16em]" style={{ color: ink, opacity: 0.6 }}>
      {children}
    </p>
  );
}

function SlideTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[84px] font-bold uppercase leading-[0.95] tracking-[-0.045em]">{children}</h2>;
}

function buildSlides(brand: BrandGuide, guideUrl: string): Slide[] {
  const { intro, logo, colour, type, motion, voice, applications } = brand;
  const hexOf = (token: string, fallback: string) => colour.core.find((c) => c.token === token)?.hex ?? fallback;
  const paper = hexOf("--lab-air", "#f1efe9");
  const card = hexOf("--lab-card", "#fcfbf9");
  const ink = hexOf("--lab-ink-warm", "#1a1713");
  const soft = hexOf("--lab-ink-soft", "#6b6459");
  const accent = hexOf("--accent", "#ff5a1f");

  const slides: Slide[] = [
    {
      id: "cover",
      title: "Cover",
      ground: ink,
      ink: "#ffffff",
      body: () => (
        <div className="flex h-full flex-col justify-between p-[96px]">
          <div className="flex items-center justify-between">
            <BrandMark src={logo.mark.src} width={logo.mark.width} height={logo.mark.height} label="" className="h-[56px]" />
            <Placard>Brand guidelines · {formatDate(brand.revised)}</Placard>
          </div>
          <div>
            <BrandMark src={logo.lockup.src} width={logo.lockup.width} height={logo.lockup.height} label={brand.name} className="w-[1100px]" />
            <p className="mt-[48px] text-[30px] text-white/70">{brand.descriptor}</p>
          </div>
        </div>
      ),
    },
    {
      id: "statement",
      title: "Introduction",
      ground: paper,
      ink,
      body: () => (
        <div className="flex h-full flex-col justify-center p-[96px]">
          <Placard>Introduction</Placard>
          <p className="mt-[40px] text-[132px] font-bold uppercase leading-[0.98] tracking-[-0.05em]">
            {intro.statement.map((line, i) => (
              <span key={line} className="block" style={i === intro.statement.length - 1 ? { color: accent } : undefined}>
                {line}
              </span>
            ))}
          </p>
          <p className="mt-[48px] max-w-[1100px] text-[28px] leading-[1.45]" style={{ color: soft }}>
            {intro.summary}
          </p>
        </div>
      ),
    },
  ];

  if (intro.principles.length > 0) {
    slides.push({
      id: "principles",
      title: "Principles",
      ground: card,
      ink,
      body: () => (
        <div className="flex h-full flex-col p-[96px]">
          <SlideTitle>Principles</SlideTitle>
          <ol className="mt-auto grid grid-cols-2 gap-x-[80px] gap-y-[56px]">
            {intro.principles.map((p, i) => (
              <li key={p.title} className="border-t-[3px] pt-[24px]" style={{ borderColor: accent }}>
                <p className="font-mono text-[20px]" style={{ color: soft }}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-[12px] text-[40px] font-bold leading-[1.1] tracking-[-0.03em]">{p.title}</h3>
                <p className="mt-[12px] text-[22px] leading-[1.45]" style={{ color: soft }}>
                  {p.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      ),
    });
  }

  slides.push({
    id: "logo",
    title: "Logo",
    ground: paper,
    ink,
    body: () => (
      <div className="grid h-full grid-cols-[1fr_520px] gap-[64px] p-[96px]">
        <div className="flex flex-col">
          <SlideTitle>Logo</SlideTitle>
          <div className="mt-auto flex items-center gap-[40px]">
            <BrandMark src={logo.mark.src} width={logo.mark.width} height={logo.mark.height} label="" className="h-[180px]" />
            <span className="text-[88px] font-bold tracking-[-0.03em]">{brand.name}</span>
          </div>
          <ul className="mt-[64px] grid grid-cols-3 gap-[32px]">
            {logo.rules.map((r) => (
              <li key={r.title}>
                <h3 className="text-[22px] font-bold">{r.title}</h3>
                <p className="mt-[8px] text-[18px] leading-[1.45]" style={{ color: soft }}>
                  {r.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-rows-3 gap-[20px]">
          {[
            { g: card, i: ink },
            { g: ink, i: "#ffffff" },
            { g: accent, i: bestInk(accent) },
          ].map((pair) => (
            <div key={pair.g} className="flex items-center justify-center rounded-[28px]" style={{ background: pair.g, color: pair.i, boxShadow: `inset 0 0 0 1px ${ink}1a` }}>
              <BrandMark src={logo.mark.src} width={logo.mark.width} height={logo.mark.height} label="" className="h-[110px]" />
            </div>
          ))}
        </div>
      </div>
    ),
  });

  slides.push({
    id: "colour-core",
    title: "Colour",
    ground: card,
    ink,
    body: () => (
      <div className="flex h-full flex-col p-[96px] pb-[120px]">
        <div className="flex items-end justify-between gap-[64px]">
          <SlideTitle>Colour</SlideTitle>
          <p className="max-w-[640px] text-[22px] leading-[1.45]" style={{ color: soft }}>
            {colour.rule}
          </p>
        </div>
        <div className="mt-[56px] flex flex-1 gap-[16px]">
          {colour.core.map((c) => {
            const on = bestInk(c.hex, ink);
            return (
              <div key={c.name} className="flex flex-1 flex-col justify-between rounded-[24px] p-[28px]" style={{ background: c.hex, color: on, boxShadow: `inset 0 0 0 1px ${ink}1a` }}>
                <span className="text-[30px] font-bold tracking-[-0.02em]">{c.name}</span>
                <span className="font-mono text-[18px] leading-[1.6] uppercase">
                  {c.hex}
                  <br />
                  <span className="normal-case opacity-70">{c.token}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    ),
  });

  if (colour.palette.length > 0) {
    slides.push({
      id: "colour-palette",
      title: "Project palette",
      ground: ink,
      ink: "#ffffff",
      body: () => (
        <div className="flex h-full flex-col p-[96px] pb-[120px]">
          <div className="flex items-end justify-between gap-[64px]">
            <SlideTitle>
              One project,
              <br />
              one colour
            </SlideTitle>
          </div>
          <div className="mt-[56px] flex flex-1 gap-[12px]">
            {colour.palette.map((c) => {
              const on = bestInk(c.hex, ink);
              return (
                <div key={c.name} className="flex flex-1 flex-col justify-between rounded-[24px] p-[24px]" style={{ background: c.hex, color: on }}>
                  <span className="text-[28px] font-bold tracking-[-0.02em]">{c.name}</span>
                  <span className="text-[18px] leading-[1.35]">
                    {c.owners?.map((o) => (
                      <span key={o} className="block">
                        {o}
                      </span>
                    ))}
                    <span className="mt-[12px] block font-mono uppercase opacity-70">{c.hex}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ),
    });
  }

  if (type.families.length > 0) {
    const [primary, ...others] = type.families;
    slides.push({
      id: "type",
      title: "Typography",
      ground: paper,
      ink,
      body: () => (
        <div className="grid h-full grid-cols-[1fr_1fr] gap-[80px] p-[96px]">
          <div className="flex flex-col">
            <SlideTitle>Type</SlideTitle>
            <p className="mt-auto text-[360px] font-bold leading-[0.8] tracking-[-0.06em]" style={{ fontFamily: `var(${primary.cssVar})` }}>
              Aa
            </p>
            <p className="mt-[32px] text-[40px] font-bold tracking-[-0.02em]">{primary.name}</p>
            <p className="text-[22px]" style={{ color: soft }}>
              {primary.role}
            </p>
          </div>
          <div className="flex flex-col justify-end gap-[20px]">
            {primary.weights.map((w) => (
              <div key={w} className="flex items-baseline justify-between border-b pb-[14px]" style={{ borderColor: `${ink}22` }}>
                <span className="text-[52px] leading-none tracking-[-0.03em]" style={{ fontWeight: w }}>
                  {primary.sample.split(".")[0]}
                </span>
                <span className="font-mono text-[18px]" style={{ color: soft }}>
                  {w}
                </span>
              </div>
            ))}
            {others.map((f) => (
              <div key={f.name} className="mt-[24px]">
                <p className="text-[30px]" style={{ fontFamily: `var(${f.cssVar})` }}>
                  {f.sample}
                </p>
                <p className="mt-[6px] text-[18px]" style={{ color: soft }}>
                  {f.name} — {f.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      ),
    });
  }

  if (type.scale.length > 0) {
    slides.push({
      id: "type-scale",
      title: "Type scale",
      ground: card,
      ink,
      body: () => (
        <div className="flex h-full flex-col p-[96px]">
          <div className="flex items-end justify-between gap-[64px]">
            <SlideTitle>Scale</SlideTitle>
            <p className="text-[22px]" style={{ color: soft }}>
              Shown at actual size on a 1600px screen.
            </p>
          </div>
          <div className="my-auto grid gap-[56px]">
          {type.scale.map((s) => (
            <div key={s.name} className="grid grid-cols-[320px_1fr] items-baseline gap-[48px]">
              <div>
                <p className="text-[24px] font-bold">{s.name}</p>
                <p className="mt-[6px] font-mono text-[15px] leading-[1.5]" style={{ color: soft }}>
                  {s.spec}
                </p>
              </div>
              {/* Rendered at the style's desktop maximum: clamp() would
                  read the canvas's unscaled viewport, not the slide. */}
              <p style={{ ...s.style, fontSize: maxOfClamp(s.style.fontSize) }}>{s.sample}</p>
            </div>
          ))}
          </div>
        </div>
      ),
    });
  }

  slides.push({
    id: "motion",
    title: "Motion",
    ground: ink,
    ink: "#ffffff",
    body: (active) => (
      <div className="flex h-full flex-col p-[96px]">
        <div className="flex items-end justify-between gap-[64px]">
          <SlideTitle>Motion</SlideTitle>
          <p className="max-w-[620px] text-[22px] leading-[1.45] text-white/70">{motion.easing.why}</p>
        </div>
        <div className="mt-auto origin-bottom-left scale-[1.6] pr-[37.5%]">
          {/* Remounted on arrival so it runs once each time the slide is shown. */}
          <EasingDemo
            key={active ? "on" : "off"}
            easing={motion.easing}
            against={motion.against}
            durations={motion.durations}
            runKey={active ? 1 : 0}
            tone="dark"
          />
        </div>
      </div>
    ),
  });

  if (voice.rules.length > 0) {
    slides.push({
      id: "voice",
      title: "Voice",
      ground: paper,
      ink,
      body: () => (
        <div className="flex h-full flex-col p-[96px]">
          <div className="flex items-end justify-between gap-[64px]">
            <SlideTitle>Voice</SlideTitle>
            <p className="text-[30px] font-bold tracking-[-0.02em]" style={{ color: accent }}>
              {voice.summary}
            </p>
          </div>
          <div className="mt-auto grid grid-cols-2 gap-[24px]">
            {voice.rules.map((r) => (
              <div key={r.title} className="rounded-[24px] p-[32px]" style={{ background: card }}>
                <h3 className="text-[26px] font-bold tracking-[-0.02em]">{r.title}</h3>
                <p className="mt-[16px] text-[24px] leading-[1.35]">
                  <span className="mr-[12px] font-mono text-[15px] uppercase" style={{ color: accent }}>
                    Say
                  </span>
                  {r.do}
                </p>
                <p className="mt-[8px] text-[22px] leading-[1.35] line-through decoration-[2px]" style={{ color: soft }}>
                  {r.dont}
                </p>
              </div>
            ))}
          </div>
        </div>
      ),
    });
  }

  if (applications.items.length > 0) {
    slides.push({
      id: "applications",
      title: "Applications",
      ground: card,
      ink,
      body: () => (
        <div className="flex h-full flex-col p-[96px] pb-[120px]">
          <SlideTitle>In use</SlideTitle>
          <div className="mt-auto grid grid-cols-3 gap-[20px]">
            {applications.items.map((item) => (
              <div key={item.name} className="flex h-[250px] flex-col justify-between rounded-[24px] p-[28px]" style={{ background: item.colour, color: bestInk(item.colour, ink) }}>
                <span className="font-mono text-[15px] uppercase tracking-[0.1em] opacity-70">{item.kind}</span>
                <span className="text-[40px] font-bold leading-[1.05] tracking-[-0.03em]">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    });
  }

  slides.push({
    id: "close",
    title: "Close",
    ground: accent,
    ink: bestInk(accent, ink),
    body: () => (
      <div className="flex h-full flex-col justify-between p-[96px]">
        <BrandMark src={logo.mark.src} width={logo.mark.width} height={logo.mark.height} label="" className="h-[120px] self-start" />
        <div>
          <p className="text-[132px] font-bold uppercase leading-[0.95] tracking-[-0.05em]">{brand.name}</p>
          <p className="mt-[32px] text-[28px] opacity-80">The full guide, with every value to copy — {guideUrl.replace(/^https?:\/\//, "")}</p>
        </div>
      </div>
    ),
  });

  return slides;
}

/** `clamp(a, b, c)` → `c`. Anything else passes through. */
function maxOfClamp(size: React.CSSProperties["fontSize"]) {
  if (typeof size !== "string") return size;
  const match = size.match(/^clamp\(.*,\s*([^,]+)\)$/);
  return match ? match[1].trim() : size;
}
