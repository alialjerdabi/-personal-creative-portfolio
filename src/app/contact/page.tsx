import type { Metadata } from "next";
import FloatingNav from "@/components/lab/FloatingNav";
import ContactClose from "@/components/lab/ContactClose";
import FaqList from "@/components/lab/FaqList";
import Reveal from "@/components/ui/Reveal";
import { labContent } from "@/data/lab";
import { contactPage } from "@/data/pages";
import { pageMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMetadata({
    path: "/contact",
    title: contactPage.metaTitle,
    description: contactPage.metaDescription,
  }),
  keywords: contactPage.keywords,
};

/**
 * /contact — the page for someone who has already decided to ask.
 *
 * It exists for two reasons beyond having a URL to link. First, "contact
 * designer Bahrain" is a real search with real intent, and the homepage's
 * close is not a page that can rank for it. Second, and mostly: a first
 * enquiry is the moment a small business is most nervous about being sold
 * to, and "get in touch" answers none of what they are actually worried
 * about — what happens next, what it costs, whether they need to know
 * what they want first. Those are the four things on this page.
 *
 * No response-time promise anywhere on it. Ali has never given one, and a
 * number here becomes a commitment the first time an enquiry misses it.
 */
export default function ContactPage() {
  const { contact, identity } = labContent;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        url: `${siteUrl}/contact`,
        name: contactPage.metaTitle,
        description: contactPage.metaDescription,
        mainEntity: {
          "@type": "ProfessionalService",
          "@id": `${siteUrl}/#business`,
          name: identity,
          url: siteUrl,
          email: contact.email,
          telephone: `+${contact.whatsapp}`,
          areaServed: { "@type": "Country", name: "Bahrain" },
          address: {
            "@type": "PostalAddress",
            addressLocality: "Manama",
            addressCountry: "BH",
          },
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: contactPage.faq.map((entry) => ({
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
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <p className="lab-placard">{contactPage.placard}</p>
            </Reveal>
            <Reveal index={1}>
              <h1 className="mt-6 max-w-3xl lab-page-heading">
                {contactPage.heading}
              </h1>
            </Reveal>
            <Reveal index={2}>
              <p className="mt-7 max-w-2xl lab-page-lede">{contactPage.intro}</p>
            </Reveal>
          </div>
        </header>

        <section
          aria-labelledby="next-heading"
          className="bg-lab-haze px-5 py-20 sm:px-8 sm:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <p className="lab-placard">What happens next</p>
            </Reveal>
            <Reveal index={1}>
              <h2 id="next-heading" className="mt-6 max-w-3xl lab-page-heading">
                Four steps, no pitch.
              </h2>
            </Reveal>

            <ol className="mt-12 grid gap-x-10 gap-y-8 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
              {contactPage.next.map((stage, index) => (
                <li key={stage.step} className="border-t border-lab-hairline pt-5">
                  <Reveal index={index}>
                    <p className="lab-step-num">{stage.step}</p>
                    <h3 className="mt-2 lab-step-title">{stage.title}</h3>
                    <p className="mt-2 lab-prose">{stage.body}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          aria-labelledby="contact-faq-heading"
          className="bg-lab-air px-5 py-20 sm:px-8 sm:py-28"
        >
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <p className="lab-placard">Questions</p>
            </Reveal>
            <Reveal index={1}>
              <h2 id="contact-faq-heading" className="mt-6 lab-page-heading">
                Before you write.
              </h2>
            </Reveal>
            <div className="mt-10">
              <FaqList items={contactPage.faq} />
            </div>
          </div>
        </section>

        <ContactClose content={labContent} />
      </main>
    </>
  );
}
