"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import DragRail from "@/components/lab/DragRail";
import type { LabMedia, LabPalette, LabShowreel } from "@/data/lab";

/** Whole class strings, not interpolated fragments, so Tailwind sees them. */
const FIELD: Record<LabPalette, string> = {
  orange: "bg-lab-orange text-black",
  blue: "bg-lab-blue text-white",
  lime: "bg-lab-lime text-black",
  violet: "bg-lab-violet text-white",
  cream: "bg-lab-cream text-black",
  teal: "bg-lab-teal text-black",
  sun: "bg-lab-sun text-black",
  amber: "bg-lab-amber text-black",
};

const EXPECTED = { posts: 6, stories: 5 } as const;

/**
 * Posts and stories interleaved into one rail.
 *
 * Ali's layout, 2026-08-18: post, story, post, story. The two ratios
 * alternate and the row is centred, so the differing heights produce the
 * stagger by themselves rather than through hand-tuned offsets — which
 * means it survives a change in how many of each there are.
 */
function interleave(posts: LabMedia[], stories: LabMedia[]) {
  const cells: { media?: LabMedia; kind: "post" | "story"; index: number }[] = [];
  const postCount = Math.max(EXPECTED.posts, posts.length);
  const storyCount = Math.max(EXPECTED.stories, stories.length);

  for (let i = 0; i < Math.max(postCount, storyCount); i += 1) {
    if (i < postCount) cells.push({ media: posts[i], kind: "post", index: i });
    if (i < storyCount) cells.push({ media: stories[i], kind: "story", index: i });
  }
  return cells;
}

/**
 * The big screen: one 16:9 card that plays the films back to back.
 *
 * Ali's call — one screen rather than three cells. A campaign is watched,
 * not browsed, and three stacked players ask the visitor to pick which
 * one matters. It starts when it is scrolled to and never before: the
 * observer both saves the decode and makes the start feel deliberate.
 *
 * Films advance on `ended`, so they run continuously WITHOUT `loop` —
 * looping one film would trap the reel on the first of three.
 */
function FilmScreen({ films, palette }: { films: LabMedia[]; palette: LabPalette }) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setSeen(entry.isIntersecting),
      { threshold: 0.35 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (seen) {
      video.play().catch(() => {
        /* Autoplay can be refused; the required poster stays. */
      });
    } else {
      video.pause();
    }
  }, [seen, active]);

  const film = films[active];
  const advance = () => setActive((current) => (current + 1) % films.length);

  return (
    <div ref={ref} className="lab-reel__screen">
      {film && film.kind === "video" ? (
        <video
          ref={videoRef}
          key={film.src}
          className="absolute inset-0 h-full w-full object-cover"
          src={film.src}
          poster={film.poster}
          muted
          playsInline
          preload="metadata"
          aria-label={film.alt}
          onEnded={advance}
        />
      ) : film ? (
        <Image src={film.src} alt={film.alt} fill sizes="92vw" className="object-cover" />
      ) : (
        <div className={`flex h-full w-full items-end p-6 sm:p-8 ${FIELD[palette]}`}>
          <span className="lab-reel__slot">Campaign film</span>
        </div>
      )}

      {films.length > 1 && (
        <p aria-hidden="true" className="lab-reel__ticks">
          {films.map((entry, index) => (
            <span key={entry.src} className={index === active ? "is-active" : undefined} />
          ))}
        </p>
      )}
    </div>
  );
}

function Cell({
  media,
  palette,
  label,
}: {
  media?: LabMedia;
  palette: LabPalette;
  label: string;
}) {
  if (!media) {
    return (
      <div className={`lab-reel__cell lab-reel__cell--pending ${FIELD[palette]}`}>
        <span className="lab-reel__slot">{label}</span>
      </div>
    );
  }

  return (
    <div className="lab-reel__cell">
      {media.kind === "video" ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={media.src}
          poster={media.poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={media.alt}
        />
      ) : (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes="(max-width: 640px) 60vw, 22vw"
          className="object-cover"
        />
      )}
    </div>
  );
}

/**
 * The social band: one alternating rail, one screen.
 *
 * Replaces the three-band version (Ali, 2026-08-18). The separate 9:16
 * row was five tall cells in a line and read as a filmstrip of the same
 * thing; interleaving the two ratios into the looping rail makes the
 * change of format part of the rhythm instead of a second section.
 */
export default function SocialShowreel({
  showreel,
  palette,
}: {
  showreel: LabShowreel;
  palette: LabPalette;
}) {
  const cells = interleave(showreel.posts ?? [], showreel.stories ?? []);
  const films = showreel.films ?? [];

  return (
    <div className="space-y-10 sm:space-y-14">
      <section aria-label="Social posts and stories">
        <p className="lab-placard">Posts &amp; stories</p>
        <DragRail className="mt-4" label="Social posts and stories">
          <div className="lab-rail-track">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                aria-hidden={copy === 1 || undefined}
                inert={copy === 1}
                className="lab-reel__group"
              >
                {cells.map((cell) => (
                  <div
                    key={`${cell.kind}-${cell.index}`}
                    className={cell.kind === "post" ? "lab-reel__post" : "lab-reel__story"}
                  >
                    <Cell
                      media={cell.media}
                      palette={palette}
                      label={`${cell.kind === "post" ? "Post" : "Story"} ${String(
                        cell.index + 1
                      ).padStart(2, "0")}`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </DragRail>
      </section>

      <section aria-label="Campaign films">
        <p className="lab-placard">Campaign film</p>
        <div className="mt-4">
          <FilmScreen films={films} palette={palette} />
        </div>
      </section>
    </div>
  );
}
