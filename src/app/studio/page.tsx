import type { Metadata } from "next";
import FloatingNav from "@/components/lab/FloatingNav";
import LanyardStage from "@/components/lab/LanyardStage";
import ProcessStepper from "@/components/lab/ProcessStepper";
import Reveal from "@/components/ui/Reveal";
import { labContent } from "@/data/lab";

export const metadata: Metadata = {
  title: "Studio — Ali Aljardabi",
  description:
    "Brand, web and social media design for small and growing businesses. Designed and built by one person, end to end, from Manama, Bahrain.",
};

/**
 * The about page.
 *
 * The site's whole pitch is "designed and built by one person, end to end"
 * and until now it never showed the person. This page is that argument:
 * a studio card and three paragraphs about who actually answers the
 * email.
 *
 * Everything on the card is also real text below it, and stays that way
 * whatever the card becomes — the 3D version of it is parked (see
 * docs/parked/Lanyard.tsx), and a name painted into a texture is
 * invisible to search engines and to assistive technology regardless.
 */
export default function StudioPage() {
  const { studio } = labContent;

  return (
    <main id="main" className="min-h-screen bg-lab-air text-lab-ink-warm">
      <FloatingNav content={labContent} />

      <div className="mx-auto max-w-6xl px-5 pb-24 pt-28 sm:px-8 sm:pb-32 sm:pt-36">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="font-display text-[15px] text-lab-ink-soft">{studio.eyebrow}</p>
            </Reveal>
            <Reveal delay={70}>
              <h1 className="mt-5 font-display text-[clamp(2.1rem,5.4vw,4.25rem)] font-bold leading-[1.04] tracking-[-0.04em]">
                {studio.heading}
              </h1>
            </Reveal>

            <div className="mt-9 space-y-5">
              {studio.bio.map((paragraph, index) => (
                <Reveal key={paragraph} delay={140 + index * 70}>
                  <p className="max-w-xl font-display text-[clamp(1.05rem,1.5vw,1.25rem)] leading-relaxed text-lab-ink-soft">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>

            {/*
              Highlights, where a Name / Role / Based in table used to
              sit. That table printed the card beside it word for word —
              three rows restating three lines the visitor had already
              read, which is why it read as filler rather than as detail.

              The card still carries name, role and location as real DOM
              text, so nothing here was the only place those facts lived.
            */}
            <Reveal delay={300}>
              <dl className="mt-10 grid gap-6 border-t border-lab-hairline pt-7 sm:grid-cols-3">
                {studio.highlights.map((item) => (
                  <div key={item.label}>
                    <dt className="font-display text-[clamp(1.35rem,2.2vw,1.9rem)] font-bold leading-none tracking-[-0.03em] text-lab-ink-warm">
                      {item.value}
                    </dt>
                    <dd className="mt-2 font-display text-[14px] leading-snug text-lab-ink-soft">
                      {item.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <LanyardStage identity={studio.badge} />
          </div>
        </div>

      </div>

      {/*
        The four-card row that used to sit here is gone. It laid the
        process out as four equal boxes read left to right, which is a
        grid, not a sequence — and it ended in a button rather than in
        the ask. The stepper says the same four things in order, and
        finishes on the enquiry.

        Rendered outside the page's own container because it manages its
        own measure and its own sticky rail.
      */}
      <ProcessStepper
        process={studio.process}
        contact={labContent.contact}
        heading="How working together goes."
        headingId="studio-process"
      />
    </main>
  );
}
