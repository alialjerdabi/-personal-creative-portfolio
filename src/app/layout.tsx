import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteUrl } from "@/lib/site";
import WhatsAppButton from "@/components/lab/WhatsAppButton";
import { labContent } from "@/data/lab";
import "./globals.css";

/*
 * ONE FAMILY, EVERYTHING (Ali's call, 2026-08-17).
 *
 * Geist for display and for text, with Geist Mono alongside it. Replaces
 * Nunito + Schibsted Grotesk, whose rounded terminals were chosen for a
 * warm, approachable register the site no longer has — beside concrete
 * they read soft where the page needs to read authoritative.
 *
 * A serif pairing was tried first and dropped in a day. Instrument Serif
 * had one weight and nothing to give when asked for bolder; Fraunces
 * fixed the weight but bought a second family and a second set of
 * tracking rules for six lines of copy. One grotesque at 900 does the
 * same job with no pairing decisions left to make, and the weight range
 * is what carries the hierarchy instead.
 */
const geist = Geist({
  variable: "--font-text",
  subsets: ["latin"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const TITLE = "Ali Aljardabi — Brand, Web & Social Design";
const DESCRIPTION =
  "Brand identity, websites, and social media design for small and growing businesses. Designed and built by one person, end to end, from Manama, Bahrain.";

/*
 * `metadataBase` is what makes the share card work at all: Open Graph
 * requires absolute URLs, and without it Next emits a relative og:image
 * that every scraper silently ignores.
 *
 * The image itself is `opengraph-image.png` beside this file, picked up
 * by file convention — Next adds og:image and twitter:image from it, so
 * neither is declared here. Regenerate it with `node scripts/og.mjs`
 * after any change to the headline or the ground colour.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Ali Aljardabi",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

/**
 * Root layout.
 *
 * NO THEME BOOTSTRAP. The version this was extracted from carried an
 * inline script that set `data-theme` from localStorage or the OS
 * preference before paint — it existed for the other product in that
 * repo, which had a true dark mode.
 *
 * This site is light by design: the warm ground IS the brand, and every
 * page sets its own `bg-lab-*` surface. Keeping the script would have
 * meant a visitor whose OS prefers dark got a dark <body> behind light
 * pages — visible in the overscroll gutter and nowhere else, which is the
 * worst kind of bug to find later. Dark mode here would be a real design
 * exercise, not a token flip, so it is absent rather than half-present.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-lab-air">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-lab-ink-warm focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        {children}
        {/* Every page, every scroll position. Last in the body so it is
            last in the tab order — a button fixed over the whole site
            must not be the first thing a keyboard user meets. */}
        <WhatsAppButton number={labContent.contact.whatsapp} />
      </body>
    </html>
  );
}
