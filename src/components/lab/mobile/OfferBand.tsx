import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
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
 * MOBILE ONLY. The desktop hero is not the problem.
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

/*
 * Two pieces of real work per service, the ratio their tile takes, and
 * the word in the outcome line that carries the promise.
 *
 * Test scaffolding, so it lives here rather than in the content layer —
 * if this variant wins, it moves to `lab.ts` with the rest of the
 * content. Every file is already published elsewhere on the site; none
 * of it is borrowed from one client to illustrate another's service.
 */
const SHOWS: Record<
  string,
  {
    keyword: string;
    ratio: string;
    /* `poster` marks a shot as film. Cropped to the tile's ratio at
       encode time, so nothing is trimmed when it plays. */
    shots: { src: string; alt: string; poster?: string }[];
  }
> = {
  "01": {
    keyword: "credible",
    /* Both 1.333 — the tile is 4:3 and neither image loses a pixel. */
    ratio: "4 / 3",
    shots: [
      { src: "/work/qobban/brand-signage.jpg", alt: "The Qobban projecting sign on a building" },
      { src: "/work/petrolas/system-pump.jpg", alt: "A Petrolas fuel pump carrying the identity" },
    ],
  },
  "02": {
    keyword: "enquiries",
    /* Both 1.600 — browser-shaped, and exact. */
    ratio: "16 / 10",
    shots: [
      { src: "/work/qobban/site-landing-dark-v3.jpg", alt: "The Qobban store landing page" },
      { src: "/work/petrolas/site-partnership.jpg", alt: "The Petrolas partnership page" },
    ],
  },
  "03": {
    keyword: "think of",
    /*
     * FILM, NOT STILLS (Ali, 2026-08-23). This card sells campaign film,
     * and a frozen frame of a film argues for it less well than the film
     * does. Both were shot 9:16 and are cropped to 4:5 in the encode —
     * centre, because both are centre-weighted — so the tile never has
     * to trim them at runtime.
     */
    ratio: "4 / 5",
    shots: [
      {
        src: "/reel/marketing-retail.mp4",
        poster: "/reel/marketing-retail.jpg",
        alt: "A fragrance campaign film — the retail interior and its shelves",
      },
      {
        src: "/reel/marketing-product.mp4",
        poster: "/reel/marketing-product.jpg",
        alt: "A fragrance campaign film — the bottle and its atomiser in close-up",
      },
    ],
  },
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
        {content.services.items.map((service) => {
          const show = SHOWS[service.index];
          return (
            <li key={service.index}>
              <Link
                href={`/start?service=${service.index}`}
                className="offer__pack"
                style={
                  {
                    "--accent": ACCENT[service.palette],
                    "--shot": show?.ratio ?? "4 / 3",
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
                          <ShotVideo src={shot.src} poster={shot.poster} alt={shot.alt} />
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
