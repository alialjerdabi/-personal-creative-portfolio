import type { Metadata } from "next";
import HeroScreen from "@/components/lab/HeroScreen";
import MuseumScreen from "@/components/lab/MuseumScreen";
import FloatingNav from "@/components/lab/FloatingNav";
import ClientStrip from "@/components/lab/ClientStrip";
import FeaturedWork from "@/components/lab/FeaturedWork";
import ServiceIndex from "@/components/lab/ServiceIndex";
import Testimonials from "@/components/lab/Testimonials";
import PromiseSection from "@/components/lab/PromiseSection";
import NotesSection from "@/components/lab/NotesSection";
import ContactClose from "@/components/lab/ContactClose";
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
  return (
    <main id="main">
      <FloatingNav content={labContent} />
      <HeroScreen content={labContent} />
      <MuseumScreen content={labContent} />
      {/* Only the work with finished imagery, at full size. The complete
          index lives on /work — see FeaturedWork for why. */}
      <FeaturedWork content={labContent} />
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
  );
}
