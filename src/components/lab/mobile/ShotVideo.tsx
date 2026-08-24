"use client";

import { useEffect, useRef } from "react";

/**
 * A thumbnail that moves.
 *
 * The marketing card sells campaign film, so a still of a film is a
 * weaker argument than the film. Two of them, at roughly 160px wide.
 *
 * MUTED, LOOPING, NO CONTROLS. There is nothing to control at this size,
 * and a play button on a 160px tile is chrome nobody can hit. The poster
 * carries the first frame so the tile is never empty while it buffers.
 *
 * REDUCED MOTION IS HONOURED IN JS, not CSS — a stylesheet cannot stop a
 * video from playing. It pauses on the poster frame, which is still the
 * work, just not moving.
 */
export default function ShotVideo({
  src,
  poster,
  alt,
}: {
  src: string;
  poster: string;
  alt: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.pause();
    video.removeAttribute("autoplay");
  }, []);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={alt}
    />
  );
}
