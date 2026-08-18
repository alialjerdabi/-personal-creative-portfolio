import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import type { LabSite } from "@/data/lab";

/**
 * A website shown as a website.
 *
 * Two of these projects shipped a site that is live right now, and a
 * screenshot dropped into the same bleed frame the photography uses
 * reads as another picture of a thing. Browser chrome and a real URL
 * read as software — and the URL is the part that matters: it is the
 * one claim on this whole site a visitor can check for themselves in a
 * single click.
 *
 * The per-project treatment, in the sense Ali asked for: it appears only
 * where a project actually has a live site, so Qobban and Petrolas get a
 * section the others cannot have, without either page needing its own
 * layout.
 *
 * The phone is optional and sits over the desktop shot rather than
 * beside it — a responsive build is one design at two sizes, and showing
 * them as two separate exhibits says the opposite.
 */
export default function LiveSite({ site }: { site: LabSite }) {
  return (
    <Reveal variant="mask">
      {/*
        THE WHOLE EXHIBIT IS THE LINK (Ali, 2026-08-18).

        A screenshot of a website that is live and one click away should
        behave like the website — people click pictures of sites, and a
        picture that does nothing when clicked reads as a dead end. The
        text link below stays: it is the labelled affordance, and it is
        what a keyboard user meets in the tab order.

        `aria-hidden` and `tabIndex={-1}` on this one so the same
        destination is not announced twice or tabbed to twice. The
        accessible route is the labelled link underneath.
      */}
      <a
        href={site.url}
        target="_blank"
        rel="noreferrer"
        aria-hidden="true"
        tabIndex={-1}
        className="group/site relative block"
      >
        {/* The desktop frame. */}
        <div className="overflow-hidden rounded-[1.1rem] border border-lab-hairline bg-white shadow-[0_24px_70px_-40px_rgb(19_23_30/0.55)] transition-shadow duration-500 group-hover/site:shadow-[0_34px_90px_-40px_rgb(19_23_30/0.7)]">
          {/* Chrome. Three dots and an address bar — enough to read as a
              browser, not so much that it becomes a drawing of one. */}
          <div className="flex items-center gap-3 border-b border-lab-hairline bg-lab-haze px-4 py-3">
            <span aria-hidden="true" className="flex shrink-0 gap-1.5">
              {["bg-lab-orange", "bg-lab-sun", "bg-lab-lime"].map((dot) => (
                <span key={dot} className={`block h-2.5 w-2.5 rounded-full ${dot}`} />
              ))}
            </span>
            <span className="min-w-0 flex-1 truncate rounded-full bg-white px-3 py-1 text-center font-mono text-[11px] text-lab-ink-soft sm:text-[12px]">
              {site.url.replace(/^https?:\/\//, "")}
            </span>
          </div>

          <div className="relative aspect-[16/10] w-full bg-lab-haze">
            <Image
              src={site.desktop.src}
              alt={site.desktop.alt}
              fill
              sizes="(max-width: 1024px) 92vw, 72vw"
              className="object-cover object-top"
            />
          </div>
        </div>

        {/* The phone, overlapping the desktop shot's lower-right corner.
            Hidden below `sm`, where the desktop frame is already the
            width of the screen and a second device on top of it is just
            something covering the work. */}
        {site.mobile && (
          <div className="absolute -bottom-8 right-6 hidden w-[16%] min-w-[8rem] overflow-hidden lab-device-frame rounded-[1rem] border-[5px] shadow-[0_24px_60px_-24px_rgb(19_23_30/0.6)] sm:block lg:right-10">
            <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[0.65rem] bg-lab-haze">
              <Image
                src={site.mobile.src}
                alt={site.mobile.alt}
                fill
                sizes="220px"
                className="object-cover object-top"
              />
            </div>
          </div>
        )}
      </a>

      <p className="mt-12 font-display text-[15px] sm:mt-14">
        <a
          href={site.url}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-2 font-bold text-lab-ink-warm transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
        >
          {site.label}
          <span
            aria-hidden="true"
            className="inline-block transition-transform group-hover:translate-x-1"
          >
            ↗
          </span>
        </a>
      </p>
    </Reveal>
  );
}
