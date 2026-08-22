import type { Metadata } from "next";
import FloatingNav from "@/components/lab/FloatingNav";
import BriefForm from "@/components/lab/BriefForm";
import Reveal from "@/components/ui/Reveal";
import { labContent } from "@/data/lab";

export const metadata: Metadata = {
  title: "Start a project — Ali Aljardabi",
  description:
    "Tell me what you need, when you need it and what the budget is, and I will reply with what is actually possible. Branding, websites and marketing design in Manama, Bahrain.",
  alternates: { canonical: "/start" },
  /* Not a page anyone should reach from search — it is the end of a
     journey that begins on /services. Indexing it would put the form
     ahead of the argument for it. */
  robots: { index: false, follow: true },
};

/**
 * /start — the brief.
 *
 * Every CTA on the site now lands here, and the ones on /services arrive
 * with `?service=01` so the first question is already answered. A visitor
 * who clicked "Branding" should not be asked what they clicked.
 *
 * The page is deliberately short of decoration. It is the one screen on
 * the site with a job that is not persuasion — the persuasion already
 * happened — so what matters is that it is quick, that the questions are
 * obviously worth answering, and that nothing here asks for something Ali
 * does not need.
 */
export default async function StartPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  const { services } = labContent;
  const chosen = services.items.find((item) => item.index === service);

  return (
    <main id="main">
      <FloatingNav content={labContent} />

      <section className="bg-lab-air px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="lab-placard">Start a project</p>
            </Reveal>
            <Reveal index={1}>
              <h1 className="mt-6 lab-page-heading">
                {chosen ? `${chosen.name}, then.` : "Tell me what you need."}
              </h1>
            </Reveal>
            <Reveal index={2}>
              <p className="mt-7 max-w-md lab-page-lede">
                Six questions, about two minutes. I read every one myself, and
                the answers decide what I can actually propose — so the reply
                you get is a real one rather than a request for more
                information.
              </p>
            </Reveal>

            {/* The floors, restated where the budget question is asked.
                They are Ali's own and live in the services data; nothing
                on this page invents a figure. */}
            <Reveal index={3}>
              <dl className="mt-10 grid gap-4 border-t border-lab-hairline pt-6">
                {services.items.map((item) => (
                  <div key={item.index} className="flex items-baseline justify-between gap-6">
                    <dt className="font-display text-[15px] font-bold text-lab-ink-warm">
                      {item.name}
                    </dt>
                    <dd className="font-display text-[14px] text-lab-ink-soft">{item.from}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal index={2}>
            <BriefForm
              content={labContent}
              initialService={service}
              formKey={process.env.NEXT_PUBLIC_WEB3FORMS_KEY}
            />
          </Reveal>
        </div>
      </section>

      <footer className="bg-lab-air px-5 pb-16 sm:px-8">
        <p className="mx-auto max-w-6xl border-t border-lab-hairline pt-6 lab-prose">
          Would rather just talk?{" "}
          <a
            href={`https://wa.me/${labContent.contact.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-lab-ink-warm underline"
          >
            WhatsApp
          </a>{" "}
          or{" "}
          <a
            href={`mailto:${labContent.contact.email}`}
            className="font-bold text-lab-ink-warm underline"
          >
            {labContent.contact.email}
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
