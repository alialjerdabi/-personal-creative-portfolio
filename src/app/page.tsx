import ApertureLoader from "@/components/lab/ApertureLoader";
import HomeComposition from "@/components/lab/HomeComposition";
import { labContent } from "@/data/lab";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/",
  title: "Ali Aljardabi — Brand, Web & Social Design",
  description:
    "Brand identity, websites, and social media design for small and growing businesses.",
});

/**
 * The homepage.
 *
 * Order is a selling order, not a storytelling one — say it, show it,
 * prove it, explain it, then ask. The showcase sits directly under the
 * hero so the work is on screen before any claim about it, and the
 * proof sections (stats, testimonials) sit between the work and the
 * services so the visitor is already convinced by the time they read
 * what is for sale.
 *
 * ClientStrip and Testimonials render nothing when their data is empty,
 * so the page can never be padded with proof that does not exist.
 */
export default function HomePage() {
  const videoSources = labContent.showcase.frames.flatMap(({ media }) =>
    media.kind === "video" ? [media.src] : []
  );
  const posterSources = labContent.showcase.frames.flatMap(({ media }) =>
    media.kind === "video" ? [media.poster] : []
  );
  /*
   * The hall renders, not hero stills. The hero stopped setting work
   * inside its sentence on 2026-08-17 and became the room itself, so the
   * largest above-the-fold image on the site is now wide.jpg — and the
   * loader has to wait for it or it hands over to an empty room.
   *
   * Both orientations, because the loader cannot know which one the
   * browser will pick from the <picture> and the wrong guess means the
   * one that matters is still arriving.
   */
  const roomSources = ["/hall/wide.jpg", "/hall/tall.jpg"];
  const imageSources = [...new Set([...roomSources, ...posterSources])];

  return (
    <>
      <ApertureLoader imageSources={imageSources} videoSources={videoSources} />
      {/* The body lives in HomeComposition, extracted for the mobile A/B
          test and kept after it: a page body worth testing is a page body
          worth naming. */}
      <HomeComposition />
    </>
  );
}
