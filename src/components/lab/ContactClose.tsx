import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/lab/ContactForm";
import type { LabContent } from "@/data/lab";

const WhatsAppMark = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="lab-channel__mark">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.8-.79.97-.14.16-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
  </svg>
);

/**
 * The close — the way out of the building.
 *
 * Rebuilt 2026-08-16 in the same language as the services above it: the
 * placard, the numbering, and a lit edge on each panel. Three channels
 * given equal weight and equal size, because which one a small business
 * in Bahrain replies on is not something this page gets to decide — and
 * a `mailto:` on a desktop with no mail client configured is a dead
 * click on the one action the whole site exists to produce.
 *
 * `rel="noreferrer"` on both outbound links: wa.me is a redirector, and
 * there is no reason to hand either of them the referrer.
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

  const channels = [
    {
      index: "01",
      label: "WhatsApp",
      value: `+${contact.whatsapp}`,
      href: `https://wa.me/${contact.whatsapp}`,
      external: true,
      mark: <WhatsAppMark />,
      note: "Fastest reply",
    },
    {
      index: "02",
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
      external: false,
      mark: null,
      note: "For briefs and documents",
    },
    {
      index: "03",
      label: "Instagram",
      value: `@${contact.instagram}`,
      href: `https://instagram.com/${contact.instagram}`,
      external: true,
      mark: null,
      note: "The work, as it ships",
    },
  ];

  return (
    <section
      id="contact"
      aria-labelledby="lab-contact-heading"
      className="scroll-mt-24 bg-lab-haze px-5 pb-10 pt-20 sm:px-8 sm:pb-12 sm:pt-28"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="lab-close">
            <p className="lab-placard lab-placard--inverted flex items-center gap-2.5">
              <span aria-hidden="true" className="lab-close__pulse" />
              {lobby.availability}
            </p>

            <h2 id="lab-contact-heading" className="lab-close__heading">
              {contact.heading}
            </h2>

            <p className="lab-close__body">{contact.body}</p>

            <ul className="lab-channels">
              {channels.map((channel) => (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    {...(channel.external
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                    className="lab-channel"
                  >
                    <span aria-hidden="true" className="lab-channel__edge" />
                    <span className="lab-channel__head">
                      <span className="lab-channel__num">{channel.index}</span>
                      {channel.mark}
                    </span>
                    <span className="lab-channel__label">{channel.label}</span>
                    <span className="lab-channel__value">{channel.value}</span>
                    <span className="lab-channel__note">{channel.note}</span>
                    <span aria-hidden="true" className="lab-channel__arrow">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>

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
                className="lab-footer-link"
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
