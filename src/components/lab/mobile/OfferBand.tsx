import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ACCENT_INK } from "@/components/lab/Keyed";
import ShotVideo from "@/components/lab/mobile/ShotVideo";
import type { LabContent, LabPalette } from "@/data/lab";

/**
 * VARIANT A — the offer, shown rather than described.
 *
 * HYPOTHESIS: the fold converts badly because it never says what is for
 * sale. Measured on the live mobile homepage, everything above it is
 * identity — the name, two brand lines, a button, a role, two social
 * links. A stranger learns Ali exists and is a designer in Manama.
 *
 * PROMOTED (Ali, 2026-08-24) — variant A won the mobile test and this is
 * now the homepage's fold, not a test route. Its content moved to
 * `services.items[].fold` in lab.ts, so the work shown here is edited the
 * same way as everything else on the site.
 *
 * THIRD CUT (Ali, 2026-08-23). The first listed services and floors,
 * which anchored on price before any work had been seen. The second
 * replaced the floors with scope lines, which was honest but read as a
 * wall of text on a phone. This one proves the claim with the work
 * itself, because on a small screen an image is read before a sentence.
 *
 * TWO SHOTS, NOT THREE, AND NEVER CROPPED. Two finished projects means
 * two honest examples per service; a third would have to repeat one of
 * them. Each pair shares one native ratio and the tile is set to it, so
 * nothing is trimmed to fit — 4:3 for the applied identity, 16:10 for
 * the two sites, 4:5 for the two campaign films.
 *
 * NO PRICES. A number with no scope attached anchors in both directions:
 * a buyer used to studio rates revises Ali downward, a buyer with a small
 * budget leaves before seeing a single piece. The floors live on
 * /services and /start, where there is room to put them in context.
 *
 * THE COLOUR IS THE SERVICE'S OWN — orange, blue and lime, the same three
 * the services index already uses, so the card is recognisably part of
 * the system rather than a new thing to learn.
 *
 * MOBILE ONLY, and it renders nothing for a service with no `fold`. The
 * desktop hero is not the problem this solves.
 */

const ACCENT: Record<LabPalette, string> = {
  orange: "var(--lab-orange)",
  blue: "var(--lab-blue)",
  lime: "var(--lab-lime)",
  violet: "var(--lab-violet)",
  cream: "var(--lab-cream)",
  teal: "var(--lab-teal)",
  sun: "var(--lab-sun)",
  amber: "var(--lab-amber)",
};

/** Splits the outcome so one word can carry the service's colour. */
function Outcome({ text, keyword }: { text: string; keyword: string }) {
  const at = text.indexOf(keyword);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className="offer__key">{keyword}</span>
      {text.slice(at + keyword.length)}
    </>
  );
}

export default function OfferBand({ content }: { content: LabContent }) {
  return (
    <div className="offer">
      <p className="offer__line">
        Branding, websites and marketing for small businesses in Bahrain —
        researched, designed and built by one person.
      </p>

      <ul className="offer__list">
        {/* A service with no `fold` has nothing to show here, so it does
            not appear. That is how the bundle stays on /services and
            /start while the opening screen keeps one card per service
            type. Previously this mapped every service and rendered the
            ones without art as a bare title, which is the opposite of
            what this band is for. */}
        {content.services.items
          .filter((service) => service.fold)
          .map((service) => {
            const show = service.fold;
            return (
              <li key={service.index}>
                <Link
                  href={`/start?service=${service.index}`}
                  className="offer__pack"
                  data-featured={service.featured || undefined}
                  style={
                    {
                      "--accent": ACCENT[service.palette],
                    /* The field colour paints the edge; the solved value
                       sets the keyword. Lime as text measured 1.13:1 on
                       this ground — unreadable since the fold shipped. */
                    "--accent-ink": ACCENT_INK[service.palette],
                      "--shot": show?.shotRatio ?? "4 / 3",
                    } as CSSProperties
                  }
                >
                  <span className="offer__head">
                    <span className="offer__name">{service.name}</span>
                    <span aria-hidden="true" className="offer__arrow">
                      →
                    </span>
                  </span>

                  <span className="offer__outcome">
                    {show ? (
                      <Outcome text={service.outcome} keyword={show.keyword} />
                    ) : (
                      service.outcome
                    )}
                  </span>

                  {/* The proof, at thumbnail size. On a phone an image is
                    read before a sentence, so the scope is shown rather
                    than listed. */}
                  {show && (
                    <span className="offer__shots">
                      {show.shots.map((shot) => (
                        <span key={shot.src} className="offer__shot">
                          {shot.poster ? (
                            <ShotVideo
                              src={shot.src}
                              poster={shot.poster}
                              alt={shot.alt}
                            />
                          ) : (
                            <Image
                              src={shot.src}
                              alt={shot.alt}
                              fill
                              sizes="170px"
                              className="object-cover"
                            />
                          )}
                        </span>
                      ))}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
