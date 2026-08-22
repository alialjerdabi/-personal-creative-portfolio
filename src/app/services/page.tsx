import type { Metadata } from "next";
import FloatingNav from "@/components/lab/FloatingNav";
import ContactClose from "@/components/lab/ContactClose";
import FaqList from "@/components/lab/FaqList";
import Reveal from "@/components/ui/Reveal";
import { labContent } from "@/data/lab";
import { servicesPage } from "@/data/pages";
import { siteUrl } from "@/lib/site";
import type { LabPalette } from "@/data/lab";

const FIELD: Record<LabPalette, string> = {
  orange: "bg-lab-orange",
  blue: "bg-lab-blue",
  lime: "bg-lab-lime",
  violet: "bg-lab-violet",
  cream: "bg-lab-cream",
  teal: "bg-lab-teal",
  sun: "bg-lab-sun",
  amber: "bg-lab-amber",
};

export const metadata: Metadata = {
  title: servicesPage.metaTitle,
  description: servicesPage.metaDescription,
  keywords: servicesPage.keywords,
  alternates: { canonical: "/services" },
  openGraph: {
    title: servicesPage.metaTitle,
    description: servicesPage.metaDescription,
    url: `${siteUrl}/services`,
    type: "website",
  },
};

/**
 * /services — the page that has to be findable.
 *
 * The homepage sells; this explains. Someone searching "branding Bahrain"
 * or asking an assistant what a brand identity costs in Manama arrives
 * with a question rather than with curiosity, and the page answers it in
 * text rather than making them infer it from three cards.
 *
 * STRUCTURED DATA IS DELIBERATELY MODEST. It declares what Ali offers,
 * where he is, and the questions this page answers — and nothing else.
 * No aggregateRating and no review count: inventing either is both a lie
 * and a documented way to get structured data penalised. The `offers`
 * carry the real starting prices in BHD, marked as the floors they are.
 */
export default function ServicesPage() {
  const { services, contact, lobby, identity } = labContent;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${siteUrl}/#business`,
        name: identity,
        description: servicesPage.metaDescription,
        url: siteUrl,
        areaServed: { "@type": "Country", name: "Bahrain" },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Manama",
          addressCountry: "BH",
        },
        email: contact.email,
        telephone: `+${contact.whatsapp}`,
        priceRange: "From BHD 100",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Design services",
          itemListElement: services.items.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.name,
              description: service.outcome,
              serviceType: service.scope,
              areaServed: "Bahrain",
            },
            /* The number is a floor, and priceSpecification is the only
               honest way to say so in schema. A bare `price` reads to a
               parser as the price. */
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: "BHD",
              minPrice: service.from.replace(/\D/g, ""),
            },
          })),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: servicesPage.faq.map((entry) => ({
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
              <p className="lab-placard">{servicesPage.placard}</p>
            </Reveal>
            <Reveal index={1}>
              <h1 className="mt-6 max-w-4xl lab-page-heading">
                {servicesPage.heading}
              </h1>
            </Reveal>
            <Reveal index={2}>
              <p className="mt-7 max-w-2xl lab-page-lede">{servicesPage.intro}</p>
            </Reveal>
            <Reveal index={3}>
              <p className="mt-9 flex flex-wrap gap-2.5">
                {services.items.map((service) => (
                  <a
                    key={service.index}
                    href={`#${service.index}`}
                    className="lab-chip"
                  >
                    <span
                      aria-hidden="true"
                      className={`lab-chip__dot ${FIELD[service.palette]}`}
                    />
                    {service.name}
                  </a>
                ))}
              </p>
            </Reveal>
          </div>
        </header>

        <div className="bg-lab-air px-5 pb-20 sm:px-8 sm:pb-28">
          <div className="mx-auto max-w-6xl space-y-6">
            {services.items.map((service) => {
              const detail = servicesPage.detail[service.index];
              return (
                <section
                  key={service.index}
                  id={service.index}
                  aria-labelledby={`svc-${service.index}`}
                  className="lab-service-card scroll-mt-28"
                >
                  <span
                    aria-hidden="true"
                    className={`lab-service-card__edge ${FIELD[service.palette]}`}
                  />

                  <header className="flex items-baseline justify-between gap-6">
                    <span className="lab-service-card__num">{service.index}</span>
                    <span className="lab-service-card__price">{service.from}</span>
                  </header>

                  <h2 id={`svc-${service.index}`} className="lab-service-card__name">
                    {service.name}
                  </h2>
                  <p className="lab-service-card__outcome">{detail.lede}</p>

                  <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
                    <div className="space-y-4">
                      {detail.body.map((paragraph) => (
                        <p key={paragraph} className="lab-prose">
                          {paragraph}
                        </p>
                      ))}
                      <p className="lab-prose">
                        <strong className="font-bold text-lab-ink-warm">
                          Who it is for:{" "}
                        </strong>
                        {detail.forWho}
                      </p>
                    </div>

                    <div>
                      <p className="lab-placard border-t border-lab-hairline pt-5">
                        Scope of work
                      </p>
                      <ul className="mt-4 space-y-2.5">
                        {service.scope.map((item) => (
                          <li key={item} className="lab-service-scope">
                            <span
                              aria-hidden="true"
                              className="lab-service-scope__tick"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <a href="#contact" className="lab-service-cta group">
                        Start a project
                        <span
                          aria-hidden="true"
                          className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
                        >
                          →
                        </span>
                      </a>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        <section
          aria-labelledby="process-heading"
          className="bg-lab-haze px-5 py-20 sm:px-8 sm:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <p className="lab-placard">How it runs</p>
            </Reveal>
            <Reveal index={1}>
              <h2 id="process-heading" className="mt-6 max-w-3xl lab-page-heading">
                Research first. Always.
              </h2>
            </Reveal>

            <ol className="mt-12 grid gap-x-10 gap-y-8 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
              {servicesPage.process.map((stage, index) => (
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
          aria-labelledby="faq-heading"
          className="bg-lab-air px-5 py-20 sm:px-8 sm:py-28"
        >
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <p className="lab-placard">Questions</p>
            </Reveal>
            <Reveal index={1}>
              <h2 id="faq-heading" className="mt-6 lab-page-heading">
                What people ask before they call.
              </h2>
            </Reveal>
            <div className="mt-10">
              <FaqList items={servicesPage.faq} />
            </div>
          </div>
        </section>

        <ContactClose content={{ ...labContent, lobby, contact }} />
      </main>
    </>
  );
}
