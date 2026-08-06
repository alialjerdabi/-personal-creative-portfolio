"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ScrollStack, { ScrollStackItem } from "@/components/lab/ScrollStack";
import type { LabAsset, LabContent } from "@/data/lab";

const REEL_MS = 420;

/** Every still the site has, in one flat run, deduplicated. */
function everyAsset(content: LabContent): LabAsset[] {
  const seen = new Set<string>();
  const all: LabAsset[] = [];

  const push = (asset?: LabAsset) => {
    if (!asset || seen.has(asset.src)) return;
    seen.add(asset.src);
    all.push(asset);
  };

  content.showcase.frames.forEach((frame) => push(frame.image));
  content.projects.forEach((project) => {
    push(project.cover);
    project.spreads?.forEach((spread) => spread.assets.forEach(push));
  });

  return all;
}

/**
 * The last card in the deck: everything, fast.
 *
 * After four cards that each hold one moment still, this one runs the
 * whole library past at speed — the visual argument that there is more
 * here than the four things just shown. Cycling only runs while the card
 * is on screen, and never under reduced motion, where it settles on a
 * single frame instead.
 */
function GlobalReel({ assets, label }: { assets: LabAsset[]; label: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => setLive(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!live || assets.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % assets.length), REEL_MS);
    return () => clearInterval(timer);
  }, [live, assets.length]);

  return (
    <div ref={rootRef} className="relative h-full w-full overflow-hidden bg-lab-ink-warm">
      {assets.map((asset, position) => (
        <div
          key={asset.src}
          aria-hidden={position !== index}
          className={`absolute inset-0 motion-safe:transition-[opacity,transform] motion-safe:duration-500 motion-safe:ease-out ${
            position === index ? "scale-100 opacity-100" : "scale-[1.06] opacity-0"
          }`}
        >
          <Image
            src={asset.src}
            alt={position === index ? asset.alt : ""}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/70 via-transparent to-black/25 p-6 sm:p-10">
        <p className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-white/80">
          {label}
        </p>
        <p className="font-display text-[clamp(1.75rem,4.5vw,4rem)] font-bold leading-[0.98] tracking-[-0.04em] text-white">
          Everything, all at once.
        </p>
      </div>
    </div>
  );
}

function FrameCard({
  image,
  project,
  caption,
  priority,
}: {
  image: LabAsset;
  project: string;
  caption: string;
  priority: boolean;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-lab-haze">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        preload={priority}
        sizes="100vw"
        className="object-cover"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-baseline gap-x-4 gap-y-1 bg-gradient-to-t from-black/70 to-transparent p-6 sm:p-10">
        <span className="font-display text-[clamp(1.5rem,3.2vw,2.75rem)] font-bold tracking-[-0.035em] text-white">
          {project}
        </span>
        <span className="font-display text-[16px] text-white/75">{caption}</span>
      </div>
    </div>
  );
}

/**
 * The deck.
 *
 * Cards are near-full-bleed and squared off — 12px corners rather than
 * the 40px the source component ships with. At this size a large radius
 * stops reading as a soft edge and starts reading as a widget.
 */
export default function StackShowcase({ content }: { content: LabContent }) {
  const assets = everyAsset(content);

  return (
    <section
      aria-labelledby="lab-stack-heading"
      className="relative bg-lab-air px-3 pb-[18vh] pt-6 sm:px-5"
    >
      <h2 id="lab-stack-heading" className="sr-only">
        {content.showcase.heading}
      </h2>

      <ScrollStack
        className="mx-auto w-full max-w-[1800px]"
        itemDistance={90}
        itemScale={0.035}
        itemStackDistance={20}
        stackPosition="12%"
        baseScale={0.85}
      >
        {content.showcase.frames.map((frame, index) => (
          <ScrollStackItem
            key={frame.image.src}
            className="h-[84svh] overflow-hidden rounded-xl shadow-[0_40px_90px_-50px_rgb(19_23_30/0.6)] ring-1 ring-lab-hairline"
          >
            <FrameCard
              image={frame.image}
              project={frame.project}
              caption={frame.caption}
              priority={index === 0}
            />
          </ScrollStackItem>
        ))}

        <ScrollStackItem className="h-[84svh] overflow-hidden rounded-xl shadow-[0_40px_90px_-50px_rgb(19_23_30/0.6)] ring-1 ring-lab-hairline">
          <GlobalReel assets={assets} label={content.showcase.label} />
        </ScrollStackItem>
      </ScrollStack>
    </section>
  );
}
