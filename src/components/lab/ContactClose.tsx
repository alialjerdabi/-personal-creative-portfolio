import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/lab/ContactForm";
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

  /*
   * Read at build time, not from a prop: this is a server component, and
   * inlining the key here keeps ContactForm's only input explicit. A
   * missing key renders no form at all rather than one that fails
   * silently — see ContactForm for why that is the safer default.
   */
  const formKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

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

            {/*
              WhatsApp, given equal billing rather than tucked in a
              footer. Email was the only channel here, and a `mailto:` on
              a desktop without a configured mail client is a dead click
              — on the one action the entire page exists to produce.

              `rel="noreferrer"` with the new tab: wa.me is a redirector,
              and there is no reason to hand it the referrer.
            */}
            <p className="mt-8">
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 font-display text-[15px] font-bold text-lab-ink-warm transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-lab-ink-warm"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-[1.15em] w-[1.15em]"
                >
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.8-.79.97-.14.16-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
                </svg>
                WhatsApp
              </a>
            </p>

            {formKey && <ContactForm accessKey={formKey} />}
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
            {/* Not in navLinks: those are page sections, and this leaves
                the site. */}
            <a
              href={`https://instagram.com/${contact.instagram}`}
              target="_blank"
              rel="noreferrer"
              className="font-display text-[15px] text-lab-ink-soft transition-colors hover:text-lab-ink-warm focus-visible:text-lab-ink-warm focus-visible:outline-none"
            >
              Instagram
            </a>
          </nav>
        </div>
      </div>
    </section>
  );
}
