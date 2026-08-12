import Image from "next/image";
import Link from "next/link";
import type { LabContent } from "@/data/lab";
import MobileMenu from "./MobileMenu";

/**
 * A nav that floats as an object on the page rather than sitting as a
 * bar welded to the top edge. It is the first thing that signals this
 * page is friendly: rounded, inset from every edge, casting a soft
 * shadow onto the wash behind it.
 *
 * Sticky rather than fixed, so it travels with the page without
 * overlaying content at the end of the document.
 */
export default function FloatingNav({ content }: { content: LabContent }) {
  return (
    /*
      Fixed, not sticky, and rendered at page level rather than inside the
      hero. A sticky element only sticks within its own containing block,
      so living inside the hero section meant it released the moment that
      section ended — the nav vanished for the rest of the page.
    */
    <div data-hero-chrome className="fixed inset-x-0 top-3 z-40 px-3 sm:top-5 sm:px-5">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-[1.35rem] border border-white/70 bg-lab-card/75 py-2.5 pl-5 pr-2.5 shadow-[0_10px_40px_-16px_rgb(19_23_30/0.30)] backdrop-blur-xl sm:py-3 sm:pl-7 sm:pr-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-visible:outline-none"
          aria-label={`${content.identity} — home`}
        >
          {/*
            Ali's mark, supplied 2026-08-10. Replaces the rising-sun
            placeholder that was drawn in code while no real logo
            existed.

            It is a raster, so it cannot take `currentColor` — the file
            is flat black, which is the ink this nav already uses. IT IS
            STILL WORTH GETTING AS AN SVG: at 40px the PNG is fine, but
            an SVG would stay crisp anywhere, recolour for a dark ground,
            and let the favicon and share card carry the same mark
            instead of the placeholder they still use.
          */}
          <Image
            src="/brand/mark.png"
            alt=""
            aria-hidden="true"
            width={277}
            height={160}
            priority
            className="h-5 w-auto sm:h-6"
          />
          <span className="font-display text-[15px] font-bold tracking-[-0.01em] text-lab-ink-warm">
            {content.identity}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {content.navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-display text-[15px] text-lab-ink-soft transition-colors hover:text-lab-ink-warm focus-visible:text-lab-ink-warm focus-visible:outline-none"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/*
          Below md the CTA gives its place to the burger — at 390px the bar
          cannot carry both without crowding. The CTA is the last thing in
          the overlay instead.
        */}
        <a
          href={content.navCta.href}
          className="hidden rounded-full bg-lab-ink-warm px-5 py-2.5 font-display text-[14px] font-bold text-white transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-ink-warm focus-visible:ring-offset-2 md:block sm:px-6"
        >
          {content.navCta.label}
        </a>

        <MobileMenu content={content} />
      </header>
    </div>
  );
}
