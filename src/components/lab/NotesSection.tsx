import Reveal from "@/components/ui/Reveal";
import type { LabContent } from "@/data/lab";

/**
 * Point of view, not a blog index.
 *
 * No dates and no links: an article list whose entries lead nowhere is
 * worse than no article list, and back-dating unwritten posts to look
 * established is the same lie as an invented testimonial. These are
 * short stated positions — they do the credibility job on their own, and
 * each one can become a real piece later without the section changing.
 */
export default function NotesSection({ notes }: { notes: LabContent["notes"] }) {
  return (
    <section
      aria-labelledby="lab-notes-heading"
      className="bg-lab-air px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
            <h2
              id="lab-notes-heading"
              className="max-w-xl font-display text-[clamp(1.9rem,4.2vw,3.25rem)] font-bold leading-[1.1] tracking-[-0.035em] text-lab-ink-warm"
            >
              {notes.heading}
            </h2>
            <p className="font-display text-[15px] text-lab-ink-soft">{notes.label}</p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:mt-16 lg:grid-cols-3">
          {notes.items.map((note, index) => (
            <Reveal key={note.title} index={index}>
              <article className="flex h-full flex-col rounded-[1.6rem] border border-lab-hairline bg-white/70 p-7 shadow-[0_14px_44px_-30px_rgb(19_23_30/0.45)] sm:p-9">
                <p className="font-display text-[13px] font-bold uppercase tracking-[0.12em] text-lab-ink-soft">
                  {note.tag}
                </p>
                <h3 className="mt-5 font-display text-[clamp(1.25rem,2vw,1.6rem)] font-bold leading-[1.15] tracking-[-0.025em] text-lab-ink-warm">
                  {note.title}
                </h3>
                <p className="mt-4 font-display text-[16px] leading-relaxed text-lab-ink-soft">
                  {note.dek}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
