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
import { labContent } from "@/data/lab";

/**
 * The homepage body.
 *
 * Extracted for the mobile A/B test (2026-08-22) so a variant could
 * render exactly this page with one change rather than a second copy
 * that drifts. Variant A won and became the fold itself, so the routes
 * and the two losing variants are gone — this stays because a page body
 * worth testing is a page body worth naming.
 */
export default function HomeComposition() {
  return (
    <main id="main">
      <FloatingNav content={labContent} />
      <OpeningHero content={labContent} />
      <ShowreelPanel content={labContent} />
      <WorksBoard content={labContent} />
      <MuseumScreen content={labContent} />
      <ClientStrip content={labContent} />
      <Testimonials content={labContent} />
      <ServiceIndex services={labContent.services} />
      <PromiseSection promise={labContent.promise} />
      <NotesSection notes={labContent.notes} />
      <ContactClose content={labContent} />
    </main>
  );
}
