import type { Metadata } from "next";
import FloatingNav from "@/components/lab/FloatingNav";
import LanyardStage from "@/components/lab/LanyardStage";
import ContactClose from "@/components/lab/ContactClose";
import FaqList from "@/components/lab/FaqList";
import Reveal from "@/components/ui/Reveal";
import { labContent } from "@/data/lab";
import { aboutPage } from "@/data/pages";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: aboutPage.metaTitle,
  description: aboutPage.metaDescription,
  keywords: aboutPage.keywords,
  alternates: { canonical: "/about" },
  openGraph: {
    title: aboutPage.metaTitle,
    description: aboutPage.metaDescription,
    url: `${siteUrl}/about`,
    type: "profile",
  },
};

/** The four story sections, in the order a stranger needs them. */
const CHAPTERS = [
  { key: "origin", tone: "air" },
  { key: "approach", tone: "haze" },
  { key: "agency", tone: "ink" },
  { key: "line", tone: "air" },
] as const;

/**
 * /about — formerly /studio.
 *
 * The site's whole pitch is "designed and built by one person, end to
 * end", and the page making that argument was three paragraphs and a
 * card. This is the argument in full: where the work came from, how he
 * thinks, WHEN NOT TO HIRE HIM, and what he refuses to do.
 *
 * The third of those is the reason this page can convert at all. A solo
 * designer naming the case against himself is worth more than any
 * superlative, and it turns away the wrong enquiries before they reach
 * the inbox. It gets the dark ground, because it is the beat that has to
 * land — the same light/dark rhythm the museum already uses.
 *
 * Everything here came from Ali on 2026-08-14. Two things are held back
 * on his instruction: the family business is never named, and there is
 * no years-of-experience figure anywhere, because the one he gave and the
 * anchor he gave disagree by a year (see the note in data/pages.ts).
 */
export default function AboutPage() {
  const { studio, contact, identity } = labContent;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        url: `${siteUrl}/about`,
        name: aboutPage.metaTitle,
        description: aboutPage.metaDescription,
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: identity,
        jobTitle: studio.badge.role,
        description: studio.bio[0],
        url: `${siteUrl}/about`,
        image: `${siteUrl}${studio.badge.photo}`,
        email: contact.email,
        telephone: `+${contact.whatsapp}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Manama",
          addressCountry: "BH",
        },
        sameAs: [`https://instagram.com/${contact.instagram}`],
        knowsAbout: [
          "Brand strategy",
          "Visual identity",
          "Website design",
          "UX and UI design",
          "Marketing and advertising creative",
        ],
        worksFor: { "@id": `${siteUrl}/#business` },
      },
      {
        "@type": "FAQPage",
        mainEntity: aboutPage.faq.map((entry) => ({
          "@type": "Question",
          name: entry.q,
          acceptedAnswer: { "@type": "Answer", text: entry.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main">
        <FloatingNav content={labContent} />

        <header className="bg-lab-air px-5 pb-16 pt-32 sm:px-8 sm:pb-24 sm:pt-40">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="lab-placard">{aboutPage.placard}</p>
              </Reveal>
              <Reveal delay={70}>
                <h1 className="mt-6 lab-page-heading">{studio.heading}</h1>
              </Reveal>

              <div className="mt-8 space-y-5">
                {studio.bio.map((paragraph, index) => (
                  <Reveal key={paragraph} delay={140 + index * 70}>
                    <p className="max-w-xl lab-page-lede">{paragraph}</p>
                  </Reveal>
                ))}
              </div>

              {/* Facts, each one checkable against this site. There is no
                  years figure here and that is deliberate — it is the one
                  number a page like this usually leads with, and the one
                  Ali has not settled. */}
              <Reveal delay={320}>
                <dl className="mt-11 grid gap-6 border-t border-lab-hairline pt-7 sm:grid-cols-3">
                  {studio.highlights.map((item) => (
                    <div key={item.label}>
                      <dt className="lab-stat">{item.value}</dt>
                      <dd className="mt-2 lab-prose">{item.label}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <LanyardStage identity={studio.badge} />
            </div>
          </div>
        </header>

        {CHAPTERS.map(({ key, tone }) => {
          const chapter = aboutPage[key];
          const ground =
            tone === "ink"
              ? "bg-lab-ink-warm text-white"
              : tone === "haze"
                ? "bg-lab-haze"
                : "bg-lab-air";

          return (
            <section
              key={key}
              aria-labelledby={`about-${key}`}
              className={`${ground} px-5 py-20 sm:px-8 sm:py-28`}
            >
              <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
                <div>
                  <Reveal>
                    <p
                      className={
                        tone === "ink"
                          ? "lab-placard lab-placard--inverted"
                          : "lab-placard"
                      }
                    >
                      {chapter.placard}
                    </p>
                  </Reveal>
                  <Reveal delay={70}>
                    <h2
                      id={`about-${key}`}
                      className={`mt-5 lab-page-heading ${
                        tone === "ink" ? "lab-page-heading--inverted" : ""
                      }`}
                    >
                      {chapter.heading}
                    </h2>
                  </Reveal>
                </div>

                <div className="space-y-5 lg:pt-2">
                  {chapter.body.map((paragraph, index) => (
                    <Reveal key={paragraph} delay={index * 70}>
                      <p
                        className={`max-w-2xl lab-prose ${
                          tone === "ink" ? "lab-prose--inverted" : ""
                        }`}
                      >
                        {paragraph}
                      </p>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        <section
          aria-labelledby="about-faq-heading"
          className="bg-lab-haze px-5 py-20 sm:px-8 sm:py-28"
        >
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <p className="lab-placard">Questions</p>
            </Reveal>
            <Reveal delay={70}>
              <h2 id="about-faq-heading" className="mt-6 lab-page-heading">
                Straight answers.
              </h2>
            </Reveal>
            <div className="mt-10">
              <FaqList items={aboutPage.faq} />
            </div>
          </div>
        </section>

        <ContactClose content={labContent} />
      </main>
    </>
  );
}
