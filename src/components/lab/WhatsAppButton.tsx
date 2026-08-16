"use client";

import { useEffect, useState } from "react";

/**
 * The persistent WhatsApp button. Bottom right, every page (Ali, 2026-08-16).
 *
 * WhatsApp is the channel small businesses in Bahrain actually reply on,
 * and until now reaching it meant scrolling to the foot of the page. This
 * is the enquiry made available from anywhere, at any scroll position.
 *
 * It is a real anchor, not a scripted click: it works without JavaScript,
 * it can be opened in a new tab, and it is reachable by keyboard. The
 * only thing the script does is hold it back for a moment so it does not
 * fly in over an unfinished page, and expand it once.
 *
 * `rel="noreferrer"` because wa.me is a redirector and there is no reason
 * to hand it the referrer.
 */
export default function WhatsAppButton({ number }: { number: string }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    /*
     * A beat after paint. Arriving with the page makes it part of the
     * furniture and it stops being noticed; arriving just after, it
     * reads as an offer.
     */
    const timer = window.setTimeout(() => setShown(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noreferrer"
      data-shown={shown || undefined}
      className="wa-fab"
      aria-label="Message me on WhatsApp"
    >
      <span aria-hidden="true" className="wa-fab__ring" />
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="wa-fab__mark"
      >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.8-.79.97-.14.16-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
      </svg>
      <span className="wa-fab__label">Message me</span>
    </a>
  );
}
