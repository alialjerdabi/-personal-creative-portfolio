"use client";

import { useLayoutEffect, useRef, useState } from "react";

const SESSION_KEY = "ali-aperture-seen";

/*
 * This script runs while the server HTML is being parsed. It prevents a
 * one-frame flash of the loader on a hard refresh later in the same tab;
 * the layout effect below performs the same check for client navigation.
 */
const SESSION_BOOTSTRAP = `try{if(sessionStorage.getItem("${SESSION_KEY}")==="1")document.documentElement.setAttribute("data-aperture-seen","true")}catch(e){}`;

/* A visitor must never be held behind an asset that has stalled forever. */
const HARD_TIMEOUT_MS = 12_000;

async function decodeImage(src: string) {
  const image = new window.Image();
  image.decoding = "async";
  image.src = src;

  if (!image.complete) {
    await new Promise<void>((resolve, reject) => {
      image.addEventListener("load", () => resolve(), { once: true });
      image.addEventListener("error", () => reject(new Error(`Could not load ${src}`)), {
        once: true,
      });
    });
  }

  await image.decode();
}

async function decodeVideoFrame(src: string) {
  const video = document.createElement("video");
  video.muted = true;
  video.preload = "auto";
  video.playsInline = true;
  video.src = src;

  await new Promise<void>((resolve, reject) => {
    video.addEventListener("loadeddata", () => resolve(), { once: true });
    video.addEventListener("error", () => reject(new Error(`Could not decode ${src}`)), {
      once: true,
    });
    video.load();
  });

  video.removeAttribute("src");
  video.load();
}

async function preloadVideo(src: string, report: (progress: number) => void) {
  const response = await fetch(src, { cache: "force-cache" });
  if (!response.ok) throw new Error(`Could not load ${src}`);

  const total = Number(response.headers.get("content-length"));
  if (!response.body || !Number.isFinite(total) || total <= 0) {
    await response.arrayBuffer();
    report(0.9);
  } else {
    const reader = response.body.getReader();
    let received = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      /* The last tenth belongs to decoding a usable first frame. */
      report(Math.min(0.9, (received / total) * 0.9));
    }
  }

  await decodeVideoFrame(src);
  report(1);
}

interface ApertureLoaderProps {
  imageSources: string[];
  videoSources: string[];
}

/**
 * Begins at the hall screen's measured aperture and expands into the hero
 * ground once the homepage media is ready. It is an overlay sibling of the
 * page, never a gate around it, so the homepage remains in the server HTML.
 */
export default function ApertureLoader({
  imageSources,
  videoSources,
}: ApertureLoaderProps) {
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const apertureRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const aperture = apertureRef.current;
    const counter = counterRef.current;
    if (!overlay || !aperture || !counter) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = document.documentElement.dataset.apertureSeen === "true";
    try {
      seen ||= sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      /* Storage can be unavailable in hardened browsing modes. */
    }

    if (seen || reducedMotion) {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* The in-document attribute still prevents a repeat this visit. */
      }
      document.documentElement.dataset.apertureSeen = "true";
      queueMicrotask(() => setVisible(false));
      return;
    }

    /* JS owns the release now; cancel the short no-JS CSS failsafe. */
    overlay.style.animation = "none";

    const sources = [...videoSources, ...imageSources];
    const contributions = sources.map(() => 0);
    let disposed = false;
    let releasing = false;

    const report = (index: number, value: number) => {
      contributions[index] = Math.max(contributions[index], Math.min(1, value));
      const progress =
        contributions.length === 0
          ? 1
          : contributions.reduce((sum, item) => sum + item, 0) / contributions.length;
      counter.textContent = `${String(Math.floor(progress * 100)).padStart(2, "0")}%`;
    };

    const remember = () => {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* Once-per-document remains available when storage is blocked. */
      }
      document.documentElement.dataset.apertureSeen = "true";
    };

    const release = async () => {
      if (disposed || releasing) return;
      releasing = true;
      window.clearTimeout(timeout);

      const counterExit = counter.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 160,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)",
        fill: "forwards",
      });
      await counterExit.finished.catch(() => undefined);
      if (disposed) return;

      const rect = aperture.getBoundingClientRect();
      const transform = `translate(${-rect.left}px, ${-rect.top}px) scale(${window.innerWidth / rect.width}, ${window.innerHeight / rect.height})`;
      const expansion = aperture.animate([{ transform: "none" }, { transform }], {
        duration: 900,
        easing: "cubic-bezier(0.77, 0, 0.175, 1)",
        fill: "forwards",
      });

      await expansion.finished.catch(() => undefined);
      if (disposed) return;
      remember();
      setVisible(false);
    };

    const timeout = window.setTimeout(() => {
      void release();
    }, HARD_TIMEOUT_MS);

    /* Avoid issuing the manifest twice during React's dev-only effect check. */
    queueMicrotask(() => {
      if (disposed) return;

      const videoTasks = videoSources.map((src, index) =>
        preloadVideo(src, (progress) => report(index, progress)).finally(() => report(index, 1))
      );
      const imageTasks = imageSources.map((src, imageIndex) => {
        const index = videoSources.length + imageIndex;
        return decodeImage(src).finally(() => report(index, 1));
      });

      void Promise.allSettled([...videoTasks, ...imageTasks]).then(() => release());
    });

    return () => {
      disposed = true;
      window.clearTimeout(timeout);
    };
  }, [imageSources, videoSources]);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SESSION_BOOTSTRAP }} />
      {visible ? (
        <div ref={overlayRef} id="aperture-loader" aria-hidden="true" inert={true}>
          <div ref={apertureRef} className="hall-aperture aperture-loader__window">
            <span ref={counterRef} className="aperture-loader__counter">
              00%
            </span>
          </div>
        </div>
      ) : null}
    </>
  );
}
