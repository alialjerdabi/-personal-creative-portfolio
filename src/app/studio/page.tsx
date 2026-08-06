import type { Metadata } from "next";
import Link from "next/link";
import FloatingNav from "@/components/lab/FloatingNav";
import LanyardStage from "@/components/lab/LanyardStage";
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
 * a badge you can pick up and swing, and three paragraphs about who
 * actually answers the email.
 *
 * Everything printed on the badge is repeated as real text below it. A
 * name painted onto a 3D texture is invisible to search engines and to
 * assistive technology, so the card is the delight and never the only
 * place the facts live.
 *
 * Antigravity is deliberately NOT mounted here: two full-page WebGL
 * contexts on one screen is a cost with no benefit, and the badge should
 * be the only thing on this page asking to be touched.
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

            {/* The badge's own information, in text, for everyone. */}
            <Reveal delay={360}>
              <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-lab-hairline pt-7 font-display text-[15px]">
                <div>
                  <dt className="text-lab-ink-soft">Name</dt>
                  <dd className="mt-1 font-bold">{studio.badge.name}</dd>
                </div>
                <div>
                  <dt className="text-lab-ink-soft">Role</dt>
                  <dd className="mt-1 font-bold">{studio.badge.role}</dd>
                </div>
                <div>
                  <dt className="text-lab-ink-soft">Based in</dt>
                  <dd className="mt-1 font-bold">{studio.badge.location}</dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <LanyardStage identity={studio.badge} hint={studio.hint} />
          </div>
        </div>

        <section aria-labelledby="studio-process" className="mt-24 sm:mt-32">
          <Reveal>
            <h2
              id="studio-process"
              className="font-display text-[clamp(1.7rem,3.6vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.035em]"
            >
              How working together goes.
            </h2>
          </Reveal>

          <ol className="mt-10 grid gap-5 sm:mt-14 lg:grid-cols-4">
            {studio.process.map((step, index) => (
              <Reveal key={step.step} delay={index * 80}>
                <li className="flex h-full flex-col rounded-[1.4rem] border border-lab-hairline bg-lab-card/70 p-7">
                  <span className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-accent">
                    {step.step}
                  </span>
                  <h3 className="mt-5 font-display text-[1.35rem] font-bold leading-tight tracking-[-0.025em]">
                    {step.title}
                  </h3>
                  <p className="mt-3 font-display text-[16px] leading-relaxed text-lab-ink-soft">
                    {step.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={340}>
            <Link
              href={studio.cta.href}
              className="mt-12 inline-block rounded-full bg-lab-ink-warm px-7 py-3.5 font-display text-[15px] font-bold text-white transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-ink-warm focus-visible:ring-offset-2 sm:mt-16"
            >
              {studio.cta.label}
            </Link>
          </Reveal>
        </section>
      </div>
    </main>
  );
}
