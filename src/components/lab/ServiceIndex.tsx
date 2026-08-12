import Reveal from "@/components/ui/Reveal";
import type { LabContent, LabPalette } from "@/data/lab";

/** Whole class strings, not interpolated fragments, so Tailwind sees them. */
const DOT: Record<LabPalette, string> = {
  orange: "bg-lab-orange",
  blue: "bg-lab-blue",
  lime: "bg-lab-lime",
  violet: "bg-lab-violet",
  cream: "bg-lab-cream",
  teal: "bg-lab-teal",
  sun: "bg-lab-sun",
};

/**
 * Three services, on cards, said plainly.
 *
 * Three and not seven: a small business owner is choosing whether they
 * have a problem worth paying to fix, and a seven-item menu reads as
 * "will do anything" where three reads as "does this, properly". Each
 * leads with the outcome rather than the deliverable for the same
 * reason — the scope list is what they read second.
 */
export default function ServiceIndex({ services }: { services: LabContent["services"] }) {
  return (
    <section
      id="services"
      aria-labelledby="lab-services-heading"
      className="scroll-mt-24 bg-lab-air px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2
            id="lab-services-heading"
            className="max-w-2xl font-display text-[clamp(1.9rem,4.2vw,3.25rem)] font-bold leading-[1.1] tracking-[-0.035em] text-lab-ink-warm"
          >
            Three things, done properly.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:mt-16 lg:grid-cols-3">
          {services.items.map((service, index) => (
            <Reveal key={service.index} delay={index * 80}>
              <article className="flex h-full flex-col rounded-[1.6rem] border border-lab-hairline bg-white/70 p-7 shadow-[0_14px_44px_-28px_rgb(19_23_30/0.45)] sm:p-9">
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={`h-2.5 w-2.5 rounded-full ${DOT[service.palette]}`}
                  />
                  <span className="font-display text-[15px] text-lab-ink-soft">
                    {service.index}
                  </span>
                </span>

                <h3 className="mt-6 font-display text-[clamp(1.5rem,2.4vw,2rem)] font-bold leading-[1.1] tracking-[-0.03em] text-lab-ink-warm">
                  {service.name}
                </h3>

                <p className="mt-3 font-display text-[17px] leading-relaxed text-lab-ink-soft">
                  {service.outcome}
                </p>

                {/*
                  The price, stated. A small business that cannot afford
                  the work disqualifies itself silently rather than
                  asking, so an absent number filters nothing and quietly
                  costs the enquiries that would have converted.

                  "From" is the whole claim — these are floors, not
                  quotes, and the card must never read as one.
                */}
                <p className="mt-4 font-display text-[15px] font-bold text-lab-ink-warm">
                  {service.from}
                </p>

                <ul className="mt-7 space-y-2 border-t border-lab-hairline pt-6">
                  {service.scope.map((item) => (
                    <li
                      key={item}
                      className="font-display text-[15px] leading-relaxed text-lab-ink-soft"
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                {/*
                  Every card ends with a way to act. Read to the bottom of
                  one of these and the visitor has just decided they have
                  the problem it describes — until now that was the moment
                  the page stopped talking.

                  It goes to the enquiry rather than to matching work on
                  purpose: only two of the three disciplines have a
                  routable case study (nothing social has one yet), and a
                  set of cards where the third link is missing reads as
                  broken rather than as honest.
                */}
                <a
                  href="#contact"
                  className="group mt-auto inline-flex items-center gap-2 pt-8 font-display text-[15px] font-bold text-lab-ink-warm transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
                >
                  Start a project
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
