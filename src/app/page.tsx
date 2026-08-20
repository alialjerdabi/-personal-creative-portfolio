import type { Metadata } from "next";
import OpeningHero from "@/components/lab/OpeningHero";
import ShowreelPanel from "@/components/lab/ShowreelPanel";
import MuseumScreen from "@/components/lab/MuseumScreen";
import FloatingNav from "@/components/lab/FloatingNav";
import ClientStrip from "@/components/lab/ClientStrip";
import WorksBoard from "@/components/lab/WorksBoard";
import ServiceIndex from "@/components/lab/ServiceIndex";
import Testimonials from "@/components/lab/Testimonials";
import PromiseSection from "@/components/lab/PromiseSection";
import NotesSection from "@/components/lab/NotesSection";
import ContactClose from "@/components/lab/ContactClose";
import ApertureLoader from "@/components/lab/ApertureLoader";
import { labContent } from "@/data/lab";

export const metadata: Metadata = {
  title: "Ali Aljardabi — Brand, Web & Social Design",
  description:
    "Brand identity, websites, and social media design for small and growing businesses.",
};

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
      <main id="main">
        <FloatingNav content={labContent} />
        {/* THE OPENING — a visual test, 2026-08-19. HeroScreen and
            FeaturedWork are untouched on disk; the homepage just points
            somewhere else, so this reverts by swapping four lines. */}
        <OpeningHero content={labContent} />
        <ShowreelPanel content={labContent} />
        <WorksBoard content={labContent} />
        <MuseumScreen content={labContent} />
        {/* Was StatsBand. Names beat counts — see ClientStrip. */}
        <ClientStrip content={labContent} />
        <Testimonials content={labContent} />
        <ServiceIndex services={labContent.services} />
        {/* What is for sale, then what the visitor ends up with. The promise
            only lands once the services have said what the work actually is. */}
        <PromiseSection promise={labContent.promise} />
        <NotesSection notes={labContent.notes} />
        <ContactClose content={labContent} />
      </main>
    </>
  );
}
