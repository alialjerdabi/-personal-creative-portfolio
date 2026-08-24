import Image from "next/image";
import Link from "next/link";
import type { LabContent } from "@/data/lab";

/**
 * VARIANT B — proof to the top.
 *
 * HYPOTHESIS: the page asks for trust long before it earns any. Measured
 * on the live mobile homepage, the first piece of work is 3.05 screens
 * down and the first client saying anything is 8.35 screens down, on a
 * page that runs 15.6 screens. Most phone visitors never reach either.
 *
 * This lifts the two finished projects and one client's own words to the
 * second screen, immediately after the hero, then offers the brief. The
 * argument order becomes: here is the work, here is a client, here is how
 * to start — instead of asking on screen one and proving on screen eight.
 *
 * THE QUOTE IS THE CLIENT'S, with their caveat attached where they gave
 * one. Nothing here is rewritten to sound stronger than what was said.
 *
 * MOBILE ONLY. Desktop already shows work within one screen of the fold.
 */
export default function ProofStrip({ content }: { content: LabContent }) {
  /* Only projects with finished cover art — a placeholder tile in a
     section whose whole job is proof would argue the opposite. */
  const shown = content.projects
    .filter((project) => project.feature ?? project.cover)
    .slice(0, 2);

  const voice = content.testimonials.find((entry) =>
    shown.some((project) => project.slug === entry.project)
  );

  if (shown.length === 0) return null;

  return (
    <section className="proof" aria-label="Recent work">
      <p className="proof__placard">Recent work</p>

      <div className="proof__cards">
        {shown.map((project) => {
          const art = project.feature ?? project.cover;
          return (
            <Link key={project.slug} href={`/work/${project.slug}`} className="proof__card">
              <span className="proof__frame">
                {art && (
                  <Image
                    src={art.src}
                    alt={art.alt}
                    fill
                    quality={90}
                    sizes="45vw"
                    className="object-cover"
                  />
                )}
              </span>
              <span className="proof__name">{project.name}</span>
              <span className="proof__sector">{project.sector}</span>
            </Link>
          );
        })}
      </div>

      {voice && (
        <figure className="proof__quote">
          <blockquote>&ldquo;{voice.quote}&rdquo;</blockquote>
          <figcaption>
            <span className="proof__who">{voice.name}</span> — {voice.role}
          </figcaption>
          {voice.caveat && <p className="proof__caveat">{voice.caveat}</p>}
        </figure>
      )}

      <Link href="/start" className="proof__cta">
        Start a project
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
