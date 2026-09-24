import Link from "next/link";
import FloatingNav from "@/components/lab/FloatingNav";
import Reveal from "@/components/ui/Reveal";
import { labContent } from "@/data/lab";
import type { BrandGuide } from "@/data/brands/types";
import { bestInk } from "@/lib/contrast";
import BrandMark from "./BrandMark";
import CopyButton from "./CopyButton";
import EasingDemo from "./EasingDemo";
import GuideNav from "./GuideNav";
import Swatch from "./Swatch";
import TokenExport from "./TokenExport";
import TypeTester from "./TypeTester";

const SECTIONS = [
  { id: "introduction", label: "Introduction" },
  { id: "logo", label: "Logo" },
  { id: "colour", label: "Colour" },
  { id: "typography", label: "Typography" },
  { id: "motion", label: "Motion" },
  { id: "voice", label: "Voice" },
  { id: "applications", label: "Applications" },
  { id: "assets", label: "Assets" },
];

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * The guide, as a page to scroll.
 *
 * Built for the person who has to USE a brand rather than admire it: every
 * value copies on click, the type can be typed into, the motion runs, and
 * the whole system leaves as CSS or token JSON at the bottom. A PDF can
 * do none of that, which is the entire case for a guide being a URL.
 *
 * The same `BrandGuide` renders as a deck at /present — this page links
 * to it from the cover, so the meeting and the reference are one link.
 */
export default function BrandGuideView({ brand }: { brand: BrandGuide }) {
  const { intro, logo, colour, type, motion, voice, applications, assets } = brand;
  /* Read core colours by token, so the logo grounds and the proportion
     bar follow the brand file rather than repeating its hex values. */
  const hexOf = (token: string, fallback: string) =>
    colour.core.find((c) => c.token === token)?.hex ?? fallback;
  const accent = hexOf("--accent", "#ff5a1f");
  const sections = SECTIONS.filter((s) => {
    if (s.id === "applications") return applications.items.length > 0;
    if (s.id === "assets") return assets.length > 0;
    return true;
  });

  return (
    <main id="main" className="bg-lab-air">
      <FloatingNav content={labContent} />

      {/* ── Cover ─────────────────────────────────────────────── */}
      <header className="px-5 pb-14 pt-32 sm:px-8 sm:pb-20 sm:pt-40">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="lab-placard">Brand guidelines · Revised {formatDate(brand.revised)}</p>
          </Reveal>
          <Reveal index={1}>
            <BrandMark
              src={logo.lockup.src}
              width={logo.lockup.width}
              height={logo.lockup.height}
              label={brand.name}
              className="mt-8 w-full max-w-3xl text-lab-ink-warm"
            />
          </Reveal>
          <Reveal index={2}>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-lab-hairline pt-6">
              <p className="lab-page-lede max-w-xl">{brand.descriptor}</p>
              <div className="flex flex-wrap gap-2">
                <Link href={`/brand/${brand.slug}/present`} className="brand-pill brand-pill--solid brand-pill--lg">
                  Present
                  <span aria-hidden="true">→</span>
                </Link>
                <a href="#assets" className="brand-pill brand-pill--lg">
                  Get the files
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-28 sm:px-8 lg:grid-cols-12">
        <aside className="sticky top-[5.25rem] z-10 min-w-0 -mx-5 bg-lab-air/90 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8 lg:top-28 lg:col-span-3 lg:mx-0 lg:self-start lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
          <GuideNav sections={sections} />
        </aside>

        <div className="grid min-w-0 gap-24 sm:gap-32 lg:col-span-9">
          {/* ── Introduction ─────────────────────────────────── */}
          <Section id="introduction" index={1} title="Introduction">
            <Reveal>
              {/* Smaller floor than the site's page heading: this column is
                  narrower than a full page, and at 390px the default size
                  leaves the last word of the statement alone on a line. */}
              <p className="lab-page-heading" style={{ fontSize: "clamp(1.6rem, 5.9vw, 4.4rem)" }}>
                {intro.statement.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </Reveal>
            <Reveal index={1}>
              <p className="lab-page-lede mt-8 max-w-2xl">{intro.summary}</p>
            </Reveal>
            <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-lab-hairline bg-lab-hairline sm:grid-cols-2">
              {intro.principles.map((p, i) => (
                <li key={p.title} className="bg-lab-card p-6">
                  <Reveal variant="block" index={i}>
                    <p className="font-mono text-[12px] text-lab-ink-soft">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-3 font-display text-[19px] font-bold tracking-[-0.02em] text-lab-ink-warm">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-lab-ink-soft">{p.body}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </Section>

          {/* ── Logo ─────────────────────────────────────────── */}
          <Section id="logo" index={2} title="Logo">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                /* Fixed values, not the theme tokens: "on paper" has to stay
                   paper when the page itself goes dark. */
                { ground: hexOf("--lab-card", "#fcfbf9"), ink: hexOf("--lab-ink-warm", "#1a1713"), label: "On paper" },
                { ground: hexOf("--lab-ink-warm", "#1a1713"), ink: "#ffffff", label: "On ink" },
                { ground: accent, ink: bestInk(accent), label: "On accent" },
              ].map((g, i) => (
                <Reveal key={g.label} variant="block" index={i}>
                  <figure>
                    <div
                      className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-lab-hairline"
                      style={{ background: g.ground, color: g.ink }}
                    >
                      <BrandMark
                        src={logo.mark.src}
                        width={logo.mark.width}
                        height={logo.mark.height}
                        label={`${brand.name} mark, ${g.label.toLowerCase()}`}
                        className="w-[42%]"
                      />
                    </div>
                    <figcaption className="mt-2 text-[13px] text-lab-ink-soft">{g.label}</figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>

            <Reveal variant="block">
              <div className="mt-4 rounded-2xl border border-lab-hairline bg-lab-card p-6 sm:p-10">
                <div className="flex items-center gap-3 sm:gap-4">
                  <BrandMark
                    src={logo.mark.src}
                    width={logo.mark.width}
                    height={logo.mark.height}
                    label=""
                    className="h-6 text-lab-ink-warm sm:h-9"
                  />
                  <span className="font-display text-[20px] font-bold tracking-[-0.01em] text-lab-ink-warm sm:text-[30px]">
                    {brand.name}
                  </span>
                </div>
                <p className="mt-4 text-[13px] text-lab-ink-soft">
                  Mark and name, as the navigation sets them.
                </p>
              </div>
            </Reveal>

            <Rules items={logo.rules} />
          </Section>

          {/* ── Colour ───────────────────────────────────────── */}
          <Section id="colour" index={3} title="Colour" lede={colour.rule}>
            <h3 className="brand-subhead">Core</h3>
            <div className="mt-4 grid gap-3 min-[480px]:grid-cols-2 md:grid-cols-3">
              {colour.core.map((c, i) => (
                <Reveal key={c.name} variant="block" index={i} className="h-full">
                  <Swatch colour={c} />
                </Reveal>
              ))}
            </div>

            <h3 className="brand-subhead mt-14">Project palette</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-lab-ink-soft">
              Field values are for colour laid down as a surface. As text on the page
              ground, use the solved ink beside each one — the fields fail as type.
            </p>
            <div className="mt-4 grid gap-3 min-[480px]:grid-cols-2 md:grid-cols-3">
              {colour.palette.map((c, i) => (
                <Reveal key={c.name} variant="block" index={i} className="h-full">
                  <Swatch colour={c} />
                </Reveal>
              ))}
            </div>

            {/* The proportion bar. Its widths are intent, not measured
                coverage, and the caption says so. */}
            <Reveal variant="block">
              <div className="mt-10">
                <div className="flex h-16 overflow-hidden rounded-2xl border border-lab-hairline" aria-hidden="true">
                  <span className="flex-[60]" style={{ background: hexOf("--lab-air", "#f1efe9") }} />
                  <span className="flex-[16]" style={{ background: hexOf("--lab-card", "#fcfbf9") }} />
                  <span className="flex-[14]" style={{ background: hexOf("--lab-ink-warm", "#1a1713") }} />
                  <span className="flex-[4]" style={{ background: accent }} />
                  {colour.palette.map((c) => (
                    <span key={c.name} className="flex-[1]" style={{ background: c.hex }} />
                  ))}
                </div>
                <p className="mt-2 text-[13px] text-lab-ink-soft">
                  A guide to balance, not a measurement: mostly paper and ink, the accent as a signal, project colour only where a project is.
                </p>
              </div>
            </Reveal>
          </Section>

          {/* ── Typography ───────────────────────────────────── */}
          <Section id="typography" index={4} title="Typography" lede={type.note}>
            <div className="grid gap-4">
              {type.families.map((face, i) => (
                <Reveal key={face.name} variant="block" index={i}>
                  <TypeTester face={face} />
                </Reveal>
              ))}
            </div>

            <h3 className="brand-subhead mt-14">Scale</h3>
            <ul className="mt-4 divide-y divide-lab-hairline border-y border-lab-hairline">
              {type.scale.map((s) => (
                <li key={s.name} className="grid gap-3 py-6 md:grid-cols-[11rem_1fr] md:gap-8">
                  <Reveal>
                    <p className="font-display text-[15px] font-bold text-lab-ink-warm">{s.name}</p>
                    <CopyButton value={s.spec} className="brand-copy--inline mt-1 text-left font-mono text-[12px] text-lab-ink-soft">
                      {s.spec}
                    </CopyButton>
                  </Reveal>
                  <Reveal index={1}>
                    <p className="text-lab-ink-warm" style={s.style}>
                      {s.sample}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </Section>

          {/* ── Motion ───────────────────────────────────────── */}
          <Section id="motion" index={5} title="Motion" lede={motion.note}>
            <Reveal variant="block">
              <div className="rounded-2xl border border-lab-hairline bg-lab-card p-5 text-lab-ink-warm sm:p-8">
                <EasingDemo easing={motion.easing} against={motion.against} durations={motion.durations} />
                <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-lab-ink-soft">
                  {motion.easing.why}
                </p>
              </div>
            </Reveal>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {motion.durations.map((d, i) => (
                <Reveal key={d.token} variant="block" index={i}>
                  <CopyButton
                    value={`var(${d.token})`}
                    className="relative flex h-full w-full flex-col items-start rounded-2xl border border-lab-hairline bg-lab-card p-5 text-left"
                  >
                    <span className="font-display text-[32px] font-bold tracking-[-0.03em] text-lab-ink-warm">
                      {d.ms}
                      <span className="text-[16px] text-lab-ink-soft">ms</span>
                    </span>
                    <span className="mt-1 font-mono text-[12px] text-lab-ink-soft">{d.token}</span>
                    <span className="mt-3 text-[14px] leading-snug text-lab-ink-soft">{d.use}</span>
                  </CopyButton>
                </Reveal>
              ))}
            </div>

            <Rules items={motion.rules} />
          </Section>

          {/* ── Voice ────────────────────────────────────────── */}
          <Section id="voice" index={6} title="Voice" lede={voice.summary}>
            <div className="grid gap-4">
              {voice.rules.map((rule, i) => (
                <Reveal key={rule.title} variant="block" index={i}>
                  <article className="rounded-2xl border border-lab-hairline bg-lab-card p-5 sm:p-7">
                    <h3 className="font-display text-[19px] font-bold tracking-[-0.02em] text-lab-ink-warm">
                      {rule.title}
                    </h3>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <p className="brand-say brand-say--do">
                        <span className="brand-say__tag">Say</span>
                        {rule.do}
                      </p>
                      <p className="brand-say brand-say--dont">
                        <span className="brand-say__tag">Not</span>
                        {rule.dont}
                      </p>
                    </div>
                    <p className="mt-4 text-[14px] leading-relaxed text-lab-ink-soft">{rule.why}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </Section>

          {/* ── Applications ─────────────────────────────────── */}
          {applications.items.length > 0 && (
            <Section id="applications" index={7} title="Applications" lede={applications.note}>
              <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {applications.items.map((item, i) => {
                  const ink = bestInk(item.colour);
                  const body = (
                    <>
                      <span className="font-mono text-[11px] uppercase tracking-[0.1em] opacity-70">
                        {item.kind}
                      </span>
                      <span className="font-display text-[20px] font-bold leading-tight tracking-[-0.02em]">
                        {item.name}
                      </span>
                      <span className="font-mono text-[12px] uppercase opacity-70">
                        {item.colour}
                        {item.href ? " · Case study →" : ""}
                      </span>
                    </>
                  );
                  const cls = "flex aspect-[4/3] flex-col justify-between rounded-2xl p-5";
                  return (
                    <li key={item.name}>
                      <Reveal variant="block" index={i}>
                        {item.href ? (
                          <Link href={item.href} className={`${cls} brand-lift`} style={{ background: item.colour, color: ink }}>
                            {body}
                          </Link>
                        ) : (
                          <div className={cls} style={{ background: item.colour, color: ink }}>
                            {body}
                          </div>
                        )}
                      </Reveal>
                    </li>
                  );
                })}
              </ul>
            </Section>
          )}

          {/* ── Assets ───────────────────────────────────────── */}
          {assets.length > 0 && (
            <Section id="assets" index={sections.length} title="Assets">
              <ul className="divide-y divide-lab-hairline border-b border-lab-hairline">
                {assets.map((asset) => (
                  <li key={asset.file} className="flex flex-wrap items-center justify-between gap-4 py-5">
                    <div>
                      <p className="font-display text-[17px] font-bold text-lab-ink-warm">{asset.label}</p>
                      <p className="font-mono text-[12px] text-lab-ink-soft">{asset.format}</p>
                    </div>
                    <a href={asset.file} download className="brand-pill">
                      Download
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-2xl border border-lab-hairline bg-lab-card p-5 sm:p-7">
                <h3 className="font-display text-[19px] font-bold tracking-[-0.02em] text-lab-ink-warm">
                  Tokens
                </h3>
                <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-lab-ink-soft">
                  Every colour, the easing and the durations on this page, as CSS custom
                  properties or as design-token JSON for Figma and build tools.
                </p>
                <div className="mt-5">
                  <TokenExport brand={brand} />
                </div>
              </div>
            </Section>
          )}
        </div>
      </div>
    </main>
  );
}

function Section({
  id,
  index,
  title,
  lede,
  children,
}: {
  id: string;
  index: number;
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-32">
      <Reveal>
        <div className="flex items-baseline gap-4 border-b border-lab-hairline pb-4">
          <span className="font-mono text-[13px] text-lab-ink-soft">
            {String(index).padStart(2, "0")}
          </span>
          <h2 id={`${id}-title`} className="font-display text-[28px] font-bold uppercase tracking-[-0.03em] text-lab-ink-warm sm:text-[36px]">
            {title}
          </h2>
        </div>
      </Reveal>
      {lede && (
        <Reveal index={1}>
          <p className="lab-page-lede mt-6 max-w-2xl">{lede}</p>
        </Reveal>
      )}
      <div className="mt-10">{children}</div>
    </section>
  );
}

function Rules({ items }: { items: { title: string; body: string }[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
      {items.map((rule, i) => (
        <li key={rule.title} className="border-t-2 border-[var(--accent)] pt-4">
          <Reveal index={i}>
            <h3 className="font-display text-[16px] font-bold text-lab-ink-warm">{rule.title}</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-lab-ink-soft">{rule.body}</p>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
