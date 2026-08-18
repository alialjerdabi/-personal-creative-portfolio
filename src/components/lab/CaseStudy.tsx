import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import ApertureText from "@/components/lab/ApertureText";
import FloatingNav from "@/components/lab/FloatingNav";
import LiveSite from "@/components/lab/LiveSite";
import SocialShowreel from "@/components/lab/SocialShowreel";
import type { LabAsset, LabContent, LabPalette, LabProject, LabSpread } from "@/data/lab";

/**
 * The project's own colour, carried from the card the visitor clicked.
 * Whole class strings, not interpolated fragments, so Tailwind sees them.
 *
 * Used as a FIELD rather than as text: blue and violet measure under 3:1
 * against a dark ground, so they can carry a block but must never be the
 * ink on one.
 */
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

/*
 * The spread title, where it is NOT cut out of imagery.
 *
 * Solid titles inherited the page ink, which made the loudest element on
 * every case study the same colour on all of them. The project already
 * owns a colour; this was the one place it was not being spent.
 */
const TITLE: Record<LabPalette, string> = {
  orange: "text-lab-orange",
  blue: "text-lab-blue",
  lime: "text-lab-lime",
  violet: "text-lab-violet",
  cream: "text-lab-cream",
  teal: "text-lab-teal",
  sun: "text-lab-sun",
  amber: "text-lab-amber",
};

/**
 * A designed artefact — a poster, a guidelines page — presented as an
 * object rather than bled to the edge. These assets carry their own
 * typography; running them full width puts two type systems in a fight
 * the page always loses.
 */
function Plate({ asset, sizes }: { asset: LabAsset; sizes: string }) {
  return (
    <div className="rounded-[1.4rem] border border-lab-hairline bg-white/70 p-3 shadow-[0_14px_44px_-30px_rgb(19_23_30/0.5)] sm:p-4">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[1rem]">
        <Image src={asset.src} alt={asset.alt} fill sizes={sizes} className="object-cover" />
      </div>
    </div>
  );
}

/** Photographic material, run wide. */
function Bleed({ asset, ratio, sizes }: { asset: LabAsset; ratio: string; sizes: string }) {
  return (
    <div className={`relative w-full overflow-hidden rounded-[1.4rem] ${ratio}`}>
      <Image src={asset.src} alt={asset.alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}

/**
 * A spread whose story is written but whose files have not arrived.
 *
 * Carries the project's own colour and says plainly what is missing. A
 * designed, labelled panel reads as a page still being finished; an empty
 * div or a broken image icon reads as a page that is broken — and a
 * borrowed image would attribute another client's work to this one.
 */
function PendingAssets({ palette, label }: { palette: LabPalette; label: string }) {
  return (
    <Reveal mask duration={600}>
      <div
        className={`flex aspect-[16/9] w-full items-end rounded-[1.4rem] p-7 sm:p-10 lg:aspect-[2/1] ${FIELD[palette]}`}
      >
        <p className="font-display text-[15px] font-bold uppercase tracking-[0.12em] opacity-80">
          {label}
        </p>
      </div>
    </Reveal>
  );
}

function SpreadAssets({
  spread,
  palette,
  pendingLabel,
}: {
  spread: LabSpread;
  palette: LabPalette;
  pendingLabel: string;
}) {
  if (spread.assets.length === 0) {
    return <PendingAssets palette={palette} label={pendingLabel} />;
  }

  const [first, second, third] = spread.assets;

  if (spread.layout === "plates") {
    // Equal widths, unequal tops. The stagger is what keeps three
    // posters from reading as a card grid.
    const offsets = ["sm:mt-0", "sm:mt-16", "sm:mt-8"];
    return (
      <div className="grid gap-6 sm:grid-cols-3 sm:gap-8">
        {spread.assets.map((asset, index) => (
          <Reveal key={asset.src} mask delay={index * 90} duration={550} className={offsets[index]}>
            <Plate asset={asset} sizes="(max-width: 640px) 90vw, 30vw" />
          </Reveal>
        ))}
      </div>
    );
  }

  if (spread.layout === "bleeds") {
    return (
      <div>
        {/*
          16:9 at every width (Ali, 2026-08-18), not 21:9 on desktop.

          The 21:9 letterbox was chosen for photographs, where cropping
          the top and bottom costs nothing. It is wrong for a DESIGNED
          artefact: Qobban's logo-construction board is a 16:9 composition
          with content at both edges, and the wider crop cut the whole
          "logo construction" row off the bottom.
        */}
        <Reveal mask duration={600}>
          <Bleed asset={first} ratio="aspect-[16/9]" sizes="92vw" />
        </Reveal>
        <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-12 lg:gap-8">
          <Reveal mask delay={80} duration={550} className="lg:col-span-7">
            <Bleed asset={second} ratio="aspect-[4/3]" sizes="(max-width: 1024px) 90vw, 55vw" />
          </Reveal>
          <Reveal mask delay={170} duration={550} className="lg:col-span-5 lg:mt-14">
            <Bleed asset={third} ratio="aspect-[4/3]" sizes="(max-width: 1024px) 90vw, 38vw" />
          </Reveal>
        </div>
      </div>
    );
  }

  // "bleed-plate" — the photograph carries the spread, the artefact sits
  // against it as evidence, pulled up into the photograph's lower margin.
  return (
    <div>
      <Reveal mask duration={600}>
        <Bleed asset={first} ratio="aspect-[16/9] lg:aspect-[2/1]" sizes="92vw" />
      </Reveal>
      <Reveal
        mask
        delay={120}
        duration={550}
        className="mt-6 w-full sm:w-2/3 lg:-mt-24 lg:ml-auto lg:w-[28%]"
      >
        <Plate asset={second} sizes="(max-width: 640px) 90vw, 28vw" />
      </Reveal>
    </div>
  );
}

function Spread({
  spread,
  palette,
  pendingLabel,
}: {
  spread: LabSpread;
  palette: LabPalette;
  pendingLabel: string;
}) {
  return (
    <article className="mt-24 first:mt-0 sm:mt-36">
      <Reveal>
        <p className="font-display text-[15px] text-lab-ink-soft">{spread.label}</p>
      </Reveal>

      <Reveal mask duration={600} className="mt-4">
        {/*
          15vw: the spread title is the loudest element on the page and
          has to hold that job on a phone too. Measured against the
          longest title ("CAMPAIGN", which sets 5.12x its own font size)
          it fills 83-90% of the column from 320px up and cannot wrap.

          The CEILING is the part that matters, and 15rem was wrong.
          The column is capped by max-w-6xl (72rem) less the 2rem gutters
          — 1088px, and it stops growing at a ~1216px viewport while 15vw
          keeps going. At 1600 that put CAMPAIGN at 1229px inside 1088px
          and POSITION at 1119px: both lost their last letter, on the
          widest and most common desktop width, while reading perfectly
          at 390 and 1024. 12.5rem holds the longest permitted title at
          94% of the column, so the cap is set by the container rather
          than by the viewport. scripts/shots.mjs now fails on any text
          wider than its own box, which is what would have caught this.
        */}
        <h2
          className={`text-[clamp(3rem,15vw,12.5rem)] font-semibold uppercase leading-[0.86] tracking-[-0.05em] ${
            spread.aperture ? "" : TITLE[palette]
          }`}
        >
          {/* Cut out of this spread's own imagery where it exists; solid
              ink where it does not yet. */}
          {spread.aperture ? (
            <ApertureText aperture={spread.aperture}>{spread.title}</ApertureText>
          ) : (
            spread.title
          )}
        </h2>
      </Reveal>

      {/* Left, with the title above it (Ali, 2026-08-18). Ranged right it
          sat alone across a wide empty column and read as a caption that
          had drifted off the page. */}
      <div className="mt-7 flex border-t border-lab-hairline pt-5">
        <p className="max-w-md font-display text-[17px] leading-relaxed text-lab-ink-soft">
          {spread.note}
        </p>
      </div>

      {/* The live site, where there is one, above this spread's stills:
          the thing itself first, the pictures of it second. */}
      {spread.site && (
        <div className="mt-10 sm:mt-14">
          <LiveSite site={spread.site} />
        </div>
      )}

      {/*
        A spread with a live site and no stills is FINISHED, not pending.
        The site is the evidence — running, checkable, one click away —
        so a panel underneath it reading "imagery in production" would be
        apologising for something that is already there.

        Everywhere else an empty `assets` still renders the pending panel,
        which is the honest state for a spread whose files have not
        arrived.
      */}
      {/* A showreel spread lays itself out — three ratios that no asset
          grid can hold together. */}
      {spread.showreel ? (
        <div className="mt-10 sm:mt-14">
          <SocialShowreel showreel={spread.showreel} palette={palette} />
        </div>
      ) : (
        (spread.assets.length > 0 || !spread.site) && (
          <div className="mt-10 sm:mt-14">
            <SpreadAssets spread={spread} palette={palette} pendingLabel={pendingLabel} />
          </div>
        )
      )}
    </article>
  );
}

/**
 * This project's own client quote, set against its own colour.
 *
 * The quotes already existed, but only on the homepage rail — so the
 * proof for Delivery Point sat three sections above a page that never
 * mentioned it, and someone who arrived at the case study from a link
 * read the whole argument with none of the evidence. A testimonial is
 * worth most beside the work it describes.
 *
 * Renders nothing when the project has no quote. Four of six do.
 */
function ClientQuote({
  testimonial,
  palette,
}: {
  testimonial: LabContent["testimonials"][number];
  palette: LabPalette;
}) {
  return (
    <Reveal>
      <figure className={`rounded-[2rem] px-7 py-12 sm:px-14 sm:py-16 ${FIELD[palette]}`}>
        <blockquote className="max-w-3xl font-display text-[clamp(1.25rem,2.4vw,1.85rem)] font-medium leading-[1.35] tracking-[-0.02em]">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
        {testimonial.caveat && (
          <p className="mt-5 max-w-2xl font-display text-[14px] leading-relaxed opacity-70">
            {testimonial.caveat}
          </p>
        )}
        <figcaption className="mt-8 font-display text-[15px]">
          <span className="font-bold">{testimonial.name}</span>
          <span className="opacity-70"> — {testimonial.role}</span>
        </figcaption>
      </figure>
    </Reveal>
  );
}

/**
 * The ask, at the bottom of the story.
 *
 * A reader who has just finished a case study is the warmest traffic this
 * site will ever have, and until now the page handed them "← All work"
 * and a link to a different project — every case study ended by sending
 * the most convinced visitor somewhere other than the enquiry.
 *
 * Deliberately the same words as the homepage close rather than new ones:
 * this is the same offer, and inventing a second version of it would mean
 * writing a second promise.
 */
function CaseStudyClose({ contact }: { contact: LabContent["contact"] }) {
  return (
    <Reveal>
      <section
        aria-labelledby="case-study-close"
        className="lab-ink-panel rounded-[2rem] px-7 py-12 text-white sm:px-14 sm:py-16"
      >
        <h2
          id="case-study-close"
          className="max-w-2xl font-display text-[clamp(1.6rem,3.4vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.035em]"
        >
          {contact.heading}
        </h2>
        <p className="mt-4 max-w-xl font-display text-[16px] leading-relaxed text-white/70">
          {contact.body}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={`https://wa.me/${contact.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="lab-ink-panel__cta rounded-full px-7 py-3.5 font-display text-[15px] font-bold transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-lab-ink-warm"
          >
            WhatsApp
          </a>
          <a
            href={`mailto:${contact.email}`}
            className="rounded-full border border-white/30 px-7 py-3.5 font-display text-[15px] font-bold text-white transition-colors hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-lab-ink-warm"
          >
            {contact.email}
          </a>
        </div>
      </section>
    </Reveal>
  );
}

interface CaseStudyProps {
  content: LabContent;
  project: LabProject;
  /** The project to hand the visitor next, if there is a built one. */
  next?: LabProject;
}

/**
 * The case study — where all the substance lives in this direction.
 *
 * The homepage says very little on purpose, which only works if the page
 * behind each card is generous: full metadata, a short titled section per
 * discipline, and the assets at scale. Each spread is composed for the
 * material it holds rather than poured into a shared grid, with the
 * discipline cut out of that spread's own imagery as its title.
 */
export default function CaseStudy({ content, project, next }: CaseStudyProps) {
  const testimonial = content.testimonials.find(
    (entry) => entry.project === project.slug
  );

  return (
    <main id="main" className="min-h-screen bg-lab-air text-lab-ink-warm">
      <FloatingNav content={content} />

      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        {/*
          The case study opens on the project's own colour — the same
          field as the card that was clicked to get here. The handoff is
          what makes colour read as identity rather than decoration.
        */}
        <div className={`rounded-[2rem] px-7 py-14 sm:px-12 sm:py-20 ${FIELD[project.palette]}`}>
          <h1 className="font-display text-[clamp(2.5rem,9vw,7rem)] font-bold leading-[0.95] tracking-[-0.04em]">
            {project.name}
          </h1>

          <div className="mt-10 grid gap-8 border-t border-current/25 pt-8 sm:mt-14 lg:grid-cols-12 lg:gap-10">
            <dl className="space-y-2.5 font-display text-[15px] lg:col-span-4">
              {/*
                Omitted while unknown rather than printed as "—".

                Five of six projects have no year yet, and a metadata
                table whose first row is a dash reads as a page that
                failed to load its own data — on the header, above the
                fold, before anything else has had a chance to speak. The
                row returns by itself the moment a real year lands in the
                content layer. A plausible-looking date is still an
                invented one, and these are real companies.
              */}
              {project.year && project.year !== "—" && (
                <div className="flex gap-4">
                  <dt className="w-20 shrink-0 opacity-60">Year</dt>
                  <dd>{project.year}</dd>
                </div>
              )}
              {project.sector && (
                <div className="flex gap-4">
                  <dt className="w-20 shrink-0 opacity-60">Sector</dt>
                  <dd>{project.sector}</dd>
                </div>
              )}
              {project.disciplines.length > 0 && (
                <div className="flex gap-4">
                  <dt className="w-20 shrink-0 opacity-60">Role</dt>
                  <dd>{project.disciplines.join(", ")}</dd>
                </div>
              )}
            </dl>

            {project.summary && (
              <p className="max-w-2xl font-display text-[clamp(1.125rem,1.9vw,1.5rem)] leading-relaxed lg:col-span-7 lg:col-start-6">
                {project.summary}
              </p>
            )}
          </div>
        </div>

        <div className="mt-20 sm:mt-28">
          {project.spreads?.map((spread) => (
            <Spread
              key={spread.id}
              spread={spread}
              palette={project.palette}
              pendingLabel={content.lobby.assetsPendingLabel}
            />
          ))}
        </div>

        {/* Spaced by the wrapper, so the close sits correctly whether or
            not this project has a quote to run above it. */}
        <div className="mt-24 space-y-8 sm:mt-36 sm:space-y-10">
          {testimonial && (
            <ClientQuote testimonial={testimonial} palette={project.palette} />
          )}
          <CaseStudyClose contact={content.contact} />
        </div>

        <Reveal>
          <div className="mt-16 flex flex-col gap-6 border-t border-lab-hairline pt-8 sm:mt-20 sm:flex-row sm:items-baseline sm:justify-between">
            <Link
              href="/#work"
              className="font-display text-[15px] text-lab-ink-soft transition-colors hover:text-lab-ink-warm focus-visible:text-lab-ink-warm focus-visible:outline-none"
            >
              ← All work
            </Link>

            {next && (
              <Link
                href={`/work/${next.slug}`}
                className="group text-right font-display text-2xl font-medium tracking-[-0.03em] transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none sm:text-3xl"
              >
                <span className="block text-[15px] font-normal text-lab-ink-soft">
                  Next project
                </span>
                <span className="mt-1.5 inline-flex items-baseline gap-3">
                  {next.name}
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
            )}
          </div>
        </Reveal>
      </div>
    </main>
  );
}
