import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { siteUrl } from "@/lib/site";
import WhatsAppButton from "@/components/lab/WhatsAppButton";
import { labContent } from "@/data/lab";
import "./globals.css";

/*
 * TWO FACES, ONE JOB EACH (Ali's call, 2026-08-17).
 *
 * Replaces Nunito + Schibsted Grotesk. Nunito's rounded terminals were
 * chosen for a warm, approachable register that the site no longer has —
 * set beside the concrete room it reads soft where it needs to read
 * authoritative, which is what Ali saw.
 *
 * `text` is the workhorse: body, UI, placards, buttons, captions, every
 * label. Geist is a sharp modern grotesque and it stays out of the way.
 *
 * `statement` is reserved for display — the big uppercase lines only.
 * The reservation IS the effect: a serif everywhere is a magazine, a
 * serif used for six lines on a site is a gallery.
 *
 * FRAUNCES IS VARIABLE (100-900), so the bold is a real cut rather than
 * a browser-synthesised smear. It replaced Instrument Serif on 2026-08-17
 * when Ali asked for bolder: Instrument ships one weight, and there is no
 * honest way to make a single-weight face heavier at 100px.
 */
const geist = Geist({
  variable: "--font-text",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-statement",
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
      className={`${geist.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
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
