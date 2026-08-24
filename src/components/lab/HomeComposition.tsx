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
import ProofStrip from "@/components/lab/mobile/ProofStrip";
import StickyActions from "@/components/lab/mobile/StickyActions";
import { labContent } from "@/data/lab";

export type Variant = "a" | "b" | "c";

/**
 * The homepage body, shared by `/` and by the mobile A/B routes.
 *
 * Extracted so a variant can be tested without a second copy of the
 * composition drifting away from the first. `/` renders this with no
 * variant and is byte-for-byte what it was; `/ab/a`, `/ab/b` and `/ab/c`
 * render it with one mobile change each.
 *
 * EVERY VARIANT IS ADDITIVE AND MOBILE-ONLY. None of them removes a
 * section, reorders the desktop page, or touches the museum hall. A test
 * that changes several things at once cannot tell you which one moved
 * the number.
 */
export default function HomeComposition({ variant }: { variant?: Variant }) {
  return (
    <main id="main" data-variant={variant}>
      <FloatingNav content={labContent} />
      <OpeningHero content={labContent} offer={variant === "a"} />

      {/* B lifts the work and one client's words to the second screen,
          where the live page puts them at 3.05 and 8.35 screens. */}
      {variant === "b" && <ProofStrip content={labContent} />}

      <ShowreelPanel content={labContent} />
      <WorksBoard content={labContent} />
      <MuseumScreen content={labContent} />
      <ClientStrip content={labContent} />
      <Testimonials content={labContent} />
      <ServiceIndex services={labContent.services} />
      <PromiseSection promise={labContent.promise} />
      <NotesSection notes={labContent.notes} />
      <ContactClose content={labContent} />

      {/* C carries the offer down the page. Rendered last so it sits over
          everything without needing a z-index argument. */}
      {variant === "c" && <StickyActions content={labContent} />}
    </main>
  );
}
