import Reveal from "@/components/ui/Reveal";
import type { LabContent } from "@/data/lab";

/**
 * The close. One address, set large, because on a portfolio the email
 * IS the conversion — a contact form only adds a step to the single
 * action the whole page exists to produce.
 *
 * Contact and footer are one composed block rather than two stacked
 * sections, so the page ends once.
 */
export default function ContactClose({ content }: { content: LabContent }) {
  const { contact, identity, lobby, navLinks } = content;

  return (
    <section
      id="contact"
      aria-labelledby="lab-contact-heading"
      className="scroll-mt-24 bg-lab-haze px-5 pb-10 pt-20 sm:px-8 sm:pb-12 sm:pt-28"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="rounded-[2rem] bg-lab-ink-warm px-7 py-14 text-white sm:px-14 sm:py-20">
            <p className="flex items-center gap-2.5 font-display text-[15px] text-white/60">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-lab-lime"
              />
              {lobby.availability}
            </p>

            <h2
              id="lab-contact-heading"
              className="mt-7 max-w-2xl font-display text-[clamp(1.9rem,4.6vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.035em]"
            >
              {contact.heading}
            </h2>

            <p className="mt-5 max-w-xl font-display text-[17px] leading-relaxed text-white/70">
              {contact.body}
            </p>

            <a
              href={`mailto:${contact.email}`}
              className="mt-10 inline-block font-display text-[clamp(1.25rem,3.4vw,2.5rem)] font-bold tracking-[-0.03em] text-white underline decoration-white/25 decoration-1 underline-offset-[0.2em] transition-colors hover:decoration-accent focus-visible:outline-none focus-visible:decoration-accent"
            >
              {contact.email}
            </a>
          </div>
        </Reveal>

        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-[15px] text-lab-ink-soft">
            {identity} — {lobby.location}
          </p>
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-display text-[15px] text-lab-ink-soft transition-colors hover:text-lab-ink-warm focus-visible:text-lab-ink-warm focus-visible:outline-none"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
