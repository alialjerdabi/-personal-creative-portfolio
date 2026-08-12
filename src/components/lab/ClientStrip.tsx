import Reveal from "@/components/ui/Reveal";
import type { LabContent } from "@/data/lab";

/**
 * The client roster, said plainly.
 *
 * REPLACES THE STATS BAND (Ali's call, 2026-08-10). That band counted
 * "6 brands built / 6 sectors / 1 designer" — two of those are the same
 * fact stated twice, and the third restated the headline. It measured
 * things nobody buying design cares about, in a shape that promised the
 * kind of numbers this business does not yet have.
 *
 * Names do the job that band was failing at. Six real businesses across
 * six real sectors is the strongest proof on this page that does not
 * need a single image file — which matters, because the homepage now
 * shows only the two projects that have one.
 *
 * Sector under each name rather than a bare list: "Qobban" means nothing
 * to a stranger, "Qobban — Fabrication & metalwork" means he has worked
 * outside their industry and inside someone's.
 */
export default function ClientStrip({ content }: { content: LabContent }) {
  const { projects } = content;
  if (projects.length === 0) return null;

  return (
    <section
      aria-labelledby="lab-clients-heading"
      className="bg-lab-air px-5 pb-20 sm:px-8 sm:pb-28"
    >
      {/*
        84.5rem, the same measure as the featured cards above.

        The card version sat on the site's 72rem text measure with 48px
        of its own padding inside, so the client names started 48px
        further in than every other line on the page and lined up with
        nothing. Two wide sections in a row now agree on one edge, and
        the roster reads as part of the work rather than as a panel
        floating over it.
      */}
      <div className="mx-auto max-w-[84.5rem]">
        <Reveal>
          <h2
            id="lab-clients-heading"
            className="font-display text-[15px] text-lab-ink-soft"
          >
            Businesses I&rsquo;ve built brands for
          </h2>
        </Reveal>

        {/*
          A rule per column rather than a box around all six. The border
          now measures the column it belongs to and stops there, so
          nothing runs into the sector line beneath it — and the six
          names read as a set of entries instead of contents inside a
          container.
        */}
        <ul className="mt-8 grid gap-x-10 gap-y-9 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            /* Reveal inside the <li>, never wrapping it — wrapping puts a
               div between <ul> and <li> and makes every child a
               last-child. */
            <li key={project.slug} className="border-t border-lab-hairline pt-5">
              <Reveal delay={(index % 3) * 70}>
                <p className="font-display text-[clamp(1.15rem,1.9vw,1.45rem)] font-bold leading-tight tracking-[-0.025em] text-lab-ink-warm">
                  {project.name}
                </p>
                {project.sector && (
                  <p className="mt-1.5 font-display text-[14px] text-lab-ink-soft">
                    {project.sector}
                  </p>
                )}
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
