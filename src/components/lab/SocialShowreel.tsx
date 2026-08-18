"use client";

import { useEffect, useRef } from "react";
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

/*
 * How many of each the band expects.
 *
 * These are the counts Ali specified, and they are also what the layout
 * is COMPOSED for — six posts is what makes the rail read as continuous,
 * five stories is what fills the row without a gap, three films is what
 * the bento is drawn around. They double as the placeholder count while
 * the assets are still coming, so the layout can be judged before a
 * single file exists.
 */
const EXPECTED = { posts: 6, stories: 5, films: 3 } as const;

/**
 * A video that only plays while it is on screen.
 *
 * Three autoplaying films plus a rail of posts on a page this long is a
 * lot of simultaneous decoding; a phone gets hot and the scroll gets
 * sticky. The observer is the same approach the museum uses, and for the
 * same reason.
 */
function Film({ media }: { media: Extract<LabMedia, { kind: "video" }> }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            /* Autoplay can be refused; the poster stays. */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      src={media.src}
      poster={media.poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={media.alt}
    />
  );
}

/**
 * One cell. Real media where it exists, a labelled field where it does
 * not — never a borrowed image, and never an empty box that reads as a
 * failed load.
 */
function Cell({
  media,
  palette,
  index,
  label,
}: {
  media?: LabMedia;
  palette: LabPalette;
  index: number;
  label: string;
}) {
  if (!media) {
    return (
      <div className={`lab-reel__cell lab-reel__cell--pending ${FIELD[palette]}`}>
        <span className="lab-reel__slot">
          {label} {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    );
  }

  return (
    <div className="lab-reel__cell">
      {media.kind === "video" ? (
        <Film media={media} />
      ) : (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes="(max-width: 640px) 70vw, 30vw"
          className="object-cover"
        />
      )}
    </div>
  );
}

function Band({
  media,
  count,
  palette,
  label,
  ratio,
}: {
  media: LabMedia[];
  count: number;
  palette: LabPalette;
  label: string;
  ratio: string;
}) {
  return Array.from({ length: Math.max(count, media.length) }, (_, index) => (
    <div key={media[index]?.src ?? `${label}-${index}`} className={ratio}>
      <Cell media={media[index]} palette={palette} index={index} label={label} />
    </div>
  ));
}

/**
 * The social band: posts, stories and films, each at its own ratio.
 *
 * Ali's brief, 2026-08-18 — six posts looping continuously, up to five
 * stories, three films — arranged as a bento rather than a uniform grid
 * so the three formats read as three different things rather than as one
 * gallery with inconsistent crops.
 *
 * THE POSTS RAIL REUSES DragRail. It already does the continuous loop,
 * the hover pause and the drag, driven by scrollLeft over a doubled
 * track — the same mechanism the testimonials use. Writing a second
 * infinite rail would be two implementations of one behaviour, and the
 * second one would be the one that drifts.
 *
 * Empty arrays render the expected number of labelled slots, so the
 * composition can be judged before the files arrive.
 */
export default function SocialShowreel({
  showreel,
  palette,
}: {
  showreel: LabShowreel;
  palette: LabPalette;
}) {
  const posts = showreel.posts ?? [];
  const stories = showreel.stories ?? [];
  const films = showreel.films ?? [];

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* POSTS — 4:5, looping. Doubled track: the second copy is the
          seam-free wrap, hidden from assistive technology so each post
          is met once. */}
      <section aria-label="Social posts">
        <p className="lab-placard">Posts · 4:5</p>
        <DragRail className="mt-4" label="Social posts">
          <div className="lab-rail-track">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                aria-hidden={copy === 1 || undefined}
                inert={copy === 1}
                className="flex shrink-0 gap-4 pl-4"
              >
                <Band
                  media={posts}
                  count={EXPECTED.posts}
                  palette={palette}
                  label="Post"
                  ratio="lab-reel__post"
                />
              </div>
            ))}
          </div>
        </DragRail>
      </section>

      {/* STORIES — 9:16. A row on desktop, a swipeable strip on a phone,
          where five 9:16 cells side by side would each be a sliver. */}
      <section aria-label="Stories">
        <p className="lab-placard">Stories · 9:16</p>
        <div className="lab-reel__stories mt-4">
          <Band
            media={stories}
            count={EXPECTED.stories}
            palette={palette}
            label="Story"
            ratio="lab-reel__story"
          />
        </div>
      </section>

      {/* FILMS — 16:9, bento. One wide, two beneath: three equal cells
          would read as a grid, and the point of the bento is that the
          first film is the one being shown. */}
      <section aria-label="Campaign films">
        <p className="lab-placard">Films · 16:9</p>
        <div className="lab-reel__films mt-4">
          <Band
            media={films}
            count={EXPECTED.films}
            palette={palette}
            label="Film"
            ratio="lab-reel__film"
          />
        </div>
      </section>
    </div>
  );
}
