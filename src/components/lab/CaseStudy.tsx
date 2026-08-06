import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import ApertureText from "@/components/lab/ApertureText";
import FloatingNav from "@/components/lab/FloatingNav";
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
        <Reveal mask duration={600}>
          <Bleed asset={first} ratio="aspect-[16/9] lg:aspect-[21/9]" sizes="92vw" />
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
        */}
        <h2 className="text-[clamp(3rem,15vw,15rem)] font-semibold uppercase leading-[0.86] tracking-[-0.05em]">
          {/* Cut out of this spread's own imagery where it exists; solid
              ink where it does not yet. */}
          {spread.aperture ? (
            <ApertureText aperture={spread.aperture}>{spread.title}</ApertureText>
          ) : (
            spread.title
          )}
        </h2>
      </Reveal>

      <div className="mt-7 flex border-t border-lab-hairline pt-5 sm:justify-end">
        <p className="max-w-md font-display text-[17px] leading-relaxed text-lab-ink-soft">
          {spread.note}
        </p>
      </div>

      <div className="mt-10 sm:mt-14">
        <SpreadAssets spread={spread} palette={palette} pendingLabel={pendingLabel} />
      </div>
    </article>
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
              <div className="flex gap-4">
                <dt className="w-20 shrink-0 opacity-60">Year</dt>
                <dd>{project.year}</dd>
              </div>
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

        <Reveal>
          <div className="mt-24 flex flex-col gap-6 border-t border-lab-hairline pt-8 sm:mt-36 sm:flex-row sm:items-baseline sm:justify-between">
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
