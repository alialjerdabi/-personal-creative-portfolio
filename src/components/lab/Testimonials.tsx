import Image from "next/image";
import DragRail from "@/components/lab/DragRail";
import Reveal from "@/components/ui/Reveal";
import type { LabAsset, LabContent, LabPalette, LabProject } from "@/data/lab";

/** Whole class strings so Tailwind can see them. */
const FIELD: Record<LabPalette, string> = {
  orange: "bg-lab-orange text-black",
  blue: "bg-lab-blue text-white",
  lime: "bg-lab-lime text-black",
  violet: "bg-lab-violet text-white",
  cream: "bg-lab-cream text-black",
  teal: "bg-lab-teal text-black",
  sun: "bg-lab-sun text-black",
  amber: "bg-lab-amber text-black",
};

const ACCENT: Record<LabPalette, string> = {
  orange: "text-lab-orange",
  blue: "text-lab-blue",
  lime: "text-lab-ink-warm",
  violet: "text-lab-violet",
  cream: "text-lab-ink-warm",
  teal: "text-lab-teal",
  sun: "text-lab-ink-warm",
  amber: "text-lab-ink-warm",
};

/**
 * Up to three stills for the panel's right-hand strip.
 *
 * Only ever this project's own assets. Four of the five clients have no
 * cover art yet, so their tiles fall back to the field colour — the same
 * treatment the work grid already uses for a pending cover. Borrowing a
 * different client's imagery to fill the strip would attribute one
 * business's work to another.
 */
function tilesFor(project: LabProject | undefined): LabAsset[] {
  if (!project) return [];
  const fromSpreads = (project.spreads ?? []).flatMap((spread) => spread.assets);
  return [...(project.cover ? [project.cover] : []), ...fromSpreads].slice(0, 3);
}

/**
 * Renders the quote with its emphasised spans weighted.
 *
 * Splits on the exact substrings in `emphasis`, so every character of the
 * original is still printed — the quote is never shortened or reworded,
 * only weighted, which is what lets the card be scanned without the
 * attribution becoming a paraphrase.
 */
function Emphasised({
  quote,
  emphasis,
  accent,
}: {
  quote: string;
  emphasis: string[];
  accent: string;
}) {
  const present = emphasis.filter((phrase) => quote.includes(phrase));
  if (present.length === 0) return <>{quote}</>;

  const pattern = new RegExp(
    `(${present.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`
  );

  return (
    <>
      {quote.split(pattern).map((part, index) =>
        present.includes(part) ? (
          <strong key={index} className={`font-bold ${accent}`}>
            {part}
          </strong>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

function Panel({
  testimonial,
  project,
}: {
  testimonial: LabContent["testimonials"][number];
  project: LabProject | undefined;
}) {
  const palette = project?.palette ?? "orange";
  const tiles = tilesFor(project);

  return (
    <figure className="flex h-full w-[min(86vw,44rem)] shrink-0 flex-col gap-7 rounded-[1.75rem] border border-lab-hairline bg-white/75 p-7 shadow-[0_14px_44px_-30px_rgb(19_23_30/0.45)] sm:w-[46rem] sm:flex-row sm:items-stretch sm:gap-8 sm:p-9">
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="font-display text-[13px] font-bold uppercase tracking-[0.12em] text-lab-ink-soft">
          {project?.name ?? testimonial.role}
          {project?.sector ? ` · ${project.sector}` : ""}
        </p>

        <blockquote className="mt-5 font-display text-[clamp(1rem,1.35vw,1.15rem)] leading-relaxed text-lab-ink-soft">
          &ldquo;
          <Emphasised
            quote={testimonial.quote}
            emphasis={testimonial.emphasis}
            accent={ACCENT[palette]}
          />
          &rdquo;
        </blockquote>

        {/* Set quietly and directly under the quote, not in a footnote:
            a caveat that has to be hunted for is not a caveat. */}
        {testimonial.caveat && (
          <p className="mt-4 font-display text-[13px] leading-relaxed text-lab-ink-soft/80">
            {testimonial.caveat}
          </p>
        )}

        <figcaption className="mt-auto pt-6 font-display text-[14px]">
          <span className="font-bold text-lab-ink-warm">{testimonial.name}</span>
          <span className="text-lab-ink-soft"> — {testimonial.role}</span>
        </figcaption>
      </div>

      {/*
        The strip. Three tiles at desktop, a single row that scrolls out of
        the way on a phone — the panel's job on a small screen is the
        quote, not the pictures.
      */}
      {tiles.length > 0 ? (
        <div
          aria-hidden="true"
          className="grid shrink-0 grid-cols-3 gap-2 sm:w-[9.5rem] sm:grid-cols-1 sm:gap-2.5"
        >
          {tiles.map((tile) => (
            <div
              key={tile.src}
              className="relative aspect-[4/3] overflow-hidden rounded-[0.9rem] bg-lab-haze"
            >
              <Image src={tile.src} alt="" fill sizes="160px" className="object-cover" />
            </div>
          ))}
        </div>
      ) : (
        /*
          No cover art for this client yet. One labelled field, not three
          empty ones — a stack of blank colour blocks reads as images that
          failed to load, while a single named panel reads as the same
          deliberate pending state the work grid already uses.
        */
        <div
          aria-hidden="true"
          className={`flex shrink-0 items-end rounded-[0.9rem] p-4 sm:w-[9.5rem] ${FIELD[palette]}`}
        >
          <span className="font-display text-[1.1rem] font-bold leading-[1.1] tracking-[-0.02em]">
            {project?.name}
          </span>
        </div>
      )}
    </figure>
  );
}

/**
 * Client quotes, as a continuous right-to-left rail.
 *
 * Renders nothing when `testimonials` is empty — a testimonial's only job
 * is to be believed, so an unfilled one must be absent rather than
 * plausible.
 *
 * The rail is a doubled track translated by -50%, which is why the loop
 * has no seam: at the end of the animation the second copy sits exactly
 * where the first began. The duplicate is `aria-hidden` and its panels are
 * inert, so assistive technology and keyboard users meet each quote once.
 *
 * It pauses on hover and on focus-within — a marquee that cannot be
 * stopped is unreadable for anyone who reads slowly — and under
 * `prefers-reduced-motion` the animation is dropped entirely, leaving a
 * normal horizontal scroller.
 */
export default function Testimonials({ content }: { content: LabContent }) {
  const { testimonials, projects } = content;
  if (testimonials.length === 0) return null;

  const byslug = new Map(projects.map((project) => [project.slug, project]));

  return (
    <section
      aria-labelledby="lab-testimonials-heading"
      className="overflow-hidden bg-lab-haze py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <h2
            id="lab-testimonials-heading"
            className="max-w-xl font-display text-[clamp(1.9rem,4.2vw,3.25rem)] font-bold leading-[1.1] tracking-[-0.035em] text-lab-ink-warm"
          >
            What it&rsquo;s like to work with me.
          </h2>
        </Reveal>
      </div>

      <DragRail className="mt-12 sm:mt-16" label="Client quotes">
        <div className="lab-rail-track">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1 || undefined}
              /* `inert` must be a real boolean. Passing the empty string
                 makes React treat it as FALSE, which left the duplicate
                 copy fully focusable — five ghost quotes in the tab order
                 that a screen reader had already been told to ignore. */
              inert={copy === 1}
              className="flex shrink-0 gap-5 pl-5 sm:gap-6 sm:pl-6"
            >
              {testimonials.map((testimonial) => (
                <Panel
                  key={testimonial.name + copy}
                  testimonial={testimonial}
                  project={byslug.get(testimonial.project)}
                />
              ))}
            </div>
          ))}
        </div>
      </DragRail>
    </section>
  );
}
