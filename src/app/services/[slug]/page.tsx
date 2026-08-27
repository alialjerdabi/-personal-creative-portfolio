import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import FloatingNav from "@/components/lab/FloatingNav";
import ContactClose from "@/components/lab/ContactClose";
import FaqList from "@/components/lab/FaqList";
import Reveal from "@/components/ui/Reveal";
import { labContent } from "@/data/lab";
import type { LabPalette } from "@/data/lab";
import { servicesPage } from "@/data/pages";
import Keyed, { ACCENT_INK } from "@/components/lab/Keyed";
import { AREA_SERVED, servicePages, servicePageBySlug } from "@/data/service-pages";
import { pageMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

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

export function generateStaticParams() {
  return servicePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = servicePageBySlug(slug);
  if (!page) return {};

  return {
    ...pageMetadata({
      path: `/services/${page.slug}`,
      title: page.metaTitle,
      description: page.metaDescription,
    }),
    keywords: page.keywords,
  };
}

/**
 * /services/[slug] — one page per service.
 *
 * WHY THESE EXIST. `/services` was aiming at ten queries from one URL,
 * which is a page competing with itself: Google ranks pages rather than
 * sites, and the best answer to "logo design Bahrain" cannot also be the
 * best answer to "UX UI design Bahrain". Each service now gets a page
 * that answers one question, and /services keeps the job it is actually
 * good at — putting the four side by side so someone can choose.
 *
 * NOTHING IS DESIGNED HERE. Every class on this page is one the site
 * already uses; the layout is the /services card opened out to full
 * width. A new visual language for four new pages would be four new
 * things to keep consistent for no gain.
 *
 * THE STRUCTURED DATA IS THE POINT. Each page emits a single `Service`
 * with its own offer and its own `areaServed`, plus a breadcrumb trail
 * and only the FAQs on that page. The old arrangement had one
 * OfferCatalog carrying all four, which tells a search engine that four
 * things exist but not which page answers which question.
 *
 * STILL NO INVENTED CLAIMS. No aggregateRating, no review count, no
 * response time, no turnaround. See the header of data/pages.ts.
 */
export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = servicePageBySlug(slug);
  if (!page) notFound();

  const { services, contact, lobby } = labContent;
  const service = services.items.find((item) => item.index === page.index);
  if (!service) notFound();

  const detail = servicesPage.detail[page.index];
  const monthly = service.from.includes("/month");
  const floor = Number(service.from.replace(/\D/g, ""));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${siteUrl}/services/${page.slug}#service`,
        name: service.name,
        serviceType: service.scope,
        description: page.metaDescription,
        url: `${siteUrl}/services/${page.slug}`,
        areaServed: AREA_SERVED.map((name) => ({ "@type": "Country", name })),
        provider: { "@id": `${siteUrl}/#business` },
        offers: {
          "@type": "Offer",
          url: `${siteUrl}/services/${page.slug}`,
          priceSpecification: monthly
            ? {
                "@type": "UnitPriceSpecification",
                priceCurrency: "BHD",
                minPrice: floor,
                referenceQuantity: {
                  "@type": "QuantitativeValue",
                  value: 1,
                  unitCode: "MON",
                },
              }
            : {
                "@type": "PriceSpecification",
                priceCurrency: "BHD",
                minPrice: floor,
              },
        },
      },
      {
        /* The trail search results render under the title. Without it a
           result for this page shows a bare URL where it could show
           Services › the service's name. */
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: `${siteUrl}/services`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: service.name,
            item: `${siteUrl}/services/${page.slug}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faq.map((entry) => ({
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
            {/* The visible counterpart of the BreadcrumbList above. A
                page reached from search has no back button worth the
                name, so the way up is on the page. */}
            <Reveal>
              <nav aria-label="Breadcrumb" className="lab-placard">
                <Link href="/services" className="underline underline-offset-4">
                  Services
                </Link>
                <span aria-hidden="true"> / </span>
                <span>{service.name}</span>
              </nav>
            </Reveal>

            <Reveal index={1}>
              <h1 className="mt-6 max-w-4xl lab-page-heading">{page.heading}</h1>
            </Reveal>
            <Reveal index={2}>
              <p
                className="mt-7 max-w-2xl lab-page-lede"
                style={{ "--accent": ACCENT_INK[service.palette] } as CSSProperties}
              >
                <Keyed text={page.intro} keyword={page.highlight.intro} />
              </p>
            </Reveal>
            <Reveal index={3}>
              <p
                className="mt-8 flex flex-wrap items-center gap-4"
                style={{ "--accent": ACCENT_INK[service.palette] } as CSSProperties}
              >
                <Link
                  href={`/start?service=${service.index}`}
                  className="lab-service-cta group !mt-0"
                >
                  Start a project
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
                  >
                    →
                  </span>
                </Link>
                <span className="lab-service-card__price">{service.from}</span>
              </p>
            </Reveal>
          </div>
        </header>

        <div className="bg-lab-air px-5 pb-20 sm:px-8 sm:pb-28">
          <div className="mx-auto max-w-6xl">
            <section
              aria-labelledby="argument"
              className="lab-service-card"
              data-featured={service.featured || undefined}
              style={{ "--accent": ACCENT_INK[service.palette] } as CSSProperties}
            >
              <span
                aria-hidden="true"
                className={`lab-service-card__edge ${FIELD[service.palette]}`}
              />
              <h2 id="argument" className="lab-service-card__outcome !mt-0">
                {detail.question}
              </h2>

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
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* THE PROOF. A service page that argues without showing the work
            is a brochure; these link to the case studies that evidence
            this particular service rather than to the work index. */}
        <section
          aria-labelledby="proof-heading"
          className="bg-lab-haze px-5 py-20 sm:px-8 sm:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <p className="lab-placard">The work</p>
            </Reveal>
            <Reveal index={1}>
              <h2 id="proof-heading" className="mt-6 max-w-3xl lab-page-heading">
                {page.proofHeading}
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-8 sm:mt-16 sm:grid-cols-2">
              {page.proof.map((item, index) => {
                return (
                  <Reveal key={`${item.slug}-${item.image.src}`} index={index}>
                    <Link href={`/work/${item.slug}`} className="group block">
                      <span
                        className="relative block w-full overflow-hidden rounded-[1.4rem] bg-lab-air"
                        style={{ aspectRatio: item.ratio ?? "16 / 11" }}
                      >
                        <Image
                          src={item.image.src}
                          alt={item.image.alt}
                          fill
                          sizes="(max-width: 640px) 92vw, 45vw"
                          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                        />
                      </span>
                      <h3 className="mt-5 lab-step-title">{item.name}</h3>
                      <p className="mt-2 lab-prose">{item.note}</p>
                      <p className="mt-3 font-display text-[15px] font-bold text-lab-ink-warm underline underline-offset-4">
                        Read the case study
                      </p>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="process-heading"
          className="bg-lab-air px-5 py-20 sm:px-8 sm:py-28"
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
          className="bg-lab-haze px-5 py-20 sm:px-8 sm:py-28"
        >
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <p className="lab-placard">Questions</p>
            </Reveal>
            <Reveal index={1}>
              <h2 id="faq-heading" className="mt-6 lab-page-heading">
                What people ask about {service.name.toLowerCase()}.
              </h2>
            </Reveal>
            <div className="mt-10">
              <FaqList items={page.faq} />
            </div>
          </div>
        </section>

        {/* The other three, so a page reached from search is not a dead
            end for someone who wants something adjacent. */}
        <section
          aria-labelledby="other-heading"
          className="bg-lab-air px-5 pb-20 sm:px-8 sm:pb-28"
        >
          <div className="mx-auto max-w-6xl">
            <h2 id="other-heading" className="lab-placard">
              The other services
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {servicePages
                .filter((other) => other.slug !== page.slug)
                .map((other) => {
                  const item = services.items.find(
                    (entry) => entry.index === other.index,
                  );
                  if (!item) return null;
                  return (
                    <li key={other.slug}>
                      <Link
                        href={`/services/${other.slug}`}
                        className="lab-service-scope block rounded-[1rem] border border-lab-hairline p-5 transition-colors hover:bg-lab-haze"
                      >
                        <span
                          aria-hidden="true"
                          className={`mb-3 block h-1.5 w-10 rounded-full ${FIELD[item.palette]}`}
                        />
                        <span className="font-display text-[16px] font-bold text-lab-ink-warm">
                          {item.name}
                        </span>
                        <span className="mt-1 block lab-prose">{item.from}</span>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        </section>

        <ContactClose content={{ ...labContent, lobby, contact }} />
      </main>
    </>
  );
}
