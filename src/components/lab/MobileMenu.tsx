"use client";

import { useEffect, useRef, useState } from "react";
import type { LabContent } from "@/data/lab";

/**
 * The phone's only route to Work, Services, Studio and Contact.
 *
 * Built on a native <dialog> opened with showModal(), which gives us the
 * focus trap, the Escape key and the inert background for free — three
 * things a hand-rolled overlay gets subtly wrong. The only thing the
 * platform does not hand us is the body scroll lock.
 */
export default function MobileMenu({ content }: { content: LabContent }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.close();
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-full text-lab-ink-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-ink-warm md:hidden"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path
            d="M4 8h16M4 16h16"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        /* Escape fires `cancel`; the backdrop-click path fires `close`. */
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        className="h-full max-h-none w-full max-w-none bg-lab-air text-lab-ink-warm backdrop:bg-transparent open:flex open:flex-col"
      >
        <div className="flex items-center justify-between px-6 pt-6">
          <span className="font-display text-[15px] font-bold tracking-[-0.01em]">
            {content.identity}
          </span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-ink-warm"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <nav
          aria-label="Primary"
          className="flex flex-1 flex-col justify-center gap-2 px-6 pb-16"
        >
          {content.navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              /* Each line rises a beat after the one above it. */
              style={{ animationDelay: `${60 + index * 55}ms` }}
              className="lab-menu-item font-display text-[2.5rem] font-bold leading-[1.15] tracking-[-0.02em] focus-visible:outline-none focus-visible:text-lab-orange"
            >
              {link.label}
            </a>
          ))}

          <a
            href={content.navCta.href}
            onClick={() => setOpen(false)}
            style={{ animationDelay: `${60 + content.navLinks.length * 55}ms` }}
            className="lab-menu-item mt-8 self-start rounded-full bg-lab-ink-warm px-7 py-3.5 font-display text-[15px] font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-ink-warm focus-visible:ring-offset-2"
          >
            {content.navCta.label}
          </a>
        </nav>
      </dialog>
    </>
  );
}
