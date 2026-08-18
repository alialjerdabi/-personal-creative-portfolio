import Reveal from "@/components/ui/Reveal";
import type { LabContent } from "@/data/lab";

/**
 * The convert stage's argument, in three statements.
 *
 * Deliberately NOT another row of cards. It sits between the services
 * index and the point-of-view notes, both of which are card grids, and a
 * third identical grid would read as more of the same rather than as the
 * turn in the pitch. Ruled rows instead: numbered, editorial, one
 * statement per line, nothing boxed. It is the closest this page comes to
 * simply making a claim, so it is set like a claim.
 */
export default function PromiseSection({
  promise,
}: {
  promise: LabContent["promise"];
}) {
  return (
    <section
      aria-labelledby="lab-promise-heading"
      className="bg-lab-haze px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
            <h2
              id="lab-promise-heading"
              className="max-w-xl font-display text-[clamp(1.9rem,4.2vw,3.25rem)] font-bold leading-[1.1] tracking-[-0.035em] text-lab-ink-warm"
            >
              {promise.heading}
            </h2>
            <p className="font-display text-[15px] text-lab-ink-soft">{promise.label}</p>
          </div>
        </Reveal>

        {/*
          An ordered list, because these are counted and their order is the
          argument — recognised, then convincing, then contacted. The
          numbers are rendered from the markup rather than typed into the
          content, so the copy stays free of presentation.
        */}
        <ol className="mt-12 sm:mt-16">
          {promise.items.map((item, index) => (
            /*
              Reveal sits INSIDE the li, not around it. It renders a plain
              wrapper div, and a div between <ol> and <li> is invalid — it
              would also make every row the only child of its own wrapper,
              so `last:border-b` would fire on all three instead of closing
              the set once at the bottom.
            */
            <li
              key={item.outcome}
              className="border-t border-lab-hairline last:border-b"
            >
              <Reveal
                index={index}
                className="grid grid-cols-1 gap-x-10 gap-y-3 py-8 sm:grid-cols-[4rem_1fr] sm:py-10 lg:grid-cols-[5rem_minmax(0,1.1fr)_minmax(0,1fr)] lg:items-baseline"
              >
                <span
                  aria-hidden="true"
                  className="font-display text-[15px] font-bold tabular-nums text-lab-orange"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3 className="font-display text-[clamp(1.4rem,2.6vw,2.1rem)] font-bold leading-[1.12] tracking-[-0.03em] text-lab-ink-warm">
                  {item.outcome}
                </h3>

                {/*
                  Starts in the last column from lg, but under the heading
                  below that — at tablet width a third column squeezes the
                  statement into two words a line.
                */}
                <p className="font-display text-[16px] leading-relaxed text-lab-ink-soft sm:col-start-2 lg:col-start-3">
                  {item.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
