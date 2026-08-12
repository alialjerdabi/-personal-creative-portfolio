import type { Metadata } from "next";
import FloatingNav from "@/components/lab/FloatingNav";
import ProjectMosaic from "@/components/lab/ProjectMosaic";
import ContactClose from "@/components/lab/ContactClose";
import Reveal from "@/components/ui/Reveal";
import { labContent } from "@/data/lab";

export const metadata: Metadata = {
  title: "Work — Ali Aljardabi",
  description:
    "Selected branding, website and social media design projects for small and growing businesses in Bahrain and the Gulf.",
};

/**
 * The work index.
 *
 * The homepage now shows only the projects with finished imagery, at
 * full size, because a card that cannot be seen properly sells nothing —
 * so everything else needs a home, and this is it. Same mosaic, same
 * popup, same tilt: this page is the menu, and the homepage is the
 * argument.
 *
 * Ends on the contact close rather than a bare footer. Someone who has
 * just read six projects is at the same point in the funnel as someone
 * who has finished a case study, and that is not a moment to hand them
 * a nav bar.
 */
export default function WorkPage() {
  return (
    <main id="main" className="min-h-screen bg-lab-air text-lab-ink-warm">
      <FloatingNav content={labContent} />

      {/* pb matters: the mosaic below sits on a different ground, and
          without it the colour change lands hard against the last line
          of this paragraph rather than in a margin. */}
      <div className="mx-auto max-w-6xl px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-36">
        <Reveal>
          <p className="font-display text-[15px] text-lab-ink-soft">Work</p>
        </Reveal>
        <Reveal delay={70}>
          <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.1rem,5.4vw,4.25rem)] font-bold leading-[1.04] tracking-[-0.04em]">
            Every project, and what it changed.
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-7 max-w-xl font-display text-[clamp(1.05rem,1.5vw,1.25rem)] leading-relaxed text-lab-ink-soft">
            Six businesses, six sectors. Open any one to see what the problem
            was before it was a design problem.
          </p>
        </Reveal>
      </div>

      <ProjectMosaic content={labContent} heading="Select a project." />

      <ContactClose content={labContent} />
    </main>
  );
}
