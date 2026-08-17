import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import { siteUrl } from "@/lib/site";
import WhatsAppButton from "@/components/lab/WhatsAppButton";
import { labContent } from "@/data/lab";
import "./globals.css";

/*
 * ONE FAMILY, EVERYTHING (Ali's call, 2026-08-17).
 *
 * Space Grotesk for display and for text, with Geist Mono alongside it.
 * Replaces Nunito + Schibsted Grotesk, whose rounded terminals were chosen
 * for a warm, approachable register the site no longer has — beside
 * concrete they read soft where the page needs to read authoritative.
 *
 * A serif pairing was tried first and dropped: Instrument Serif had one
 * weight and nothing to give when asked for bolder, and Fraunces fixed
 * that by buying a second family plus its own tracking table for six
 * lines of copy. One grotesque does the same job with no pairing left to
 * decide.
 *
 * SPACE GROTESK STOPS AT 700. It has more character than the neutral
 * grotesques — the R, the a, the single-storey 1 — and that character is
 * why it was chosen, but the statement rules cannot ask for 800 here.
 * See globals.css.
 */
const spaceGrotesk = Space_Grotesk({
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

/*
 * Sets `data-theme` before the first paint.
 *
 * This has to be an inline script in <head>. Any React-side solution
 * runs after hydration, by which point the page has already painted the
 * default ground — so a visitor whose OS prefers dark gets a white flash
 * on every single navigation. There is no way around it that is not a
 * blocking script.
 *
 * A stored choice outranks the OS: pressing the button is a decision,
 * and a system change afterwards should not silently overrule it.
 * Wrapped in try/catch because localStorage throws outright in some
 * hardened browsing modes, and a theme preference is not worth taking
 * the page down for.
 */
const THEME_BOOTSTRAP = `try{var s=localStorage.getItem("lab-theme");var d=s==="dark"||(!s&&matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.dataset.theme="dark"}catch(e){}`;

/**
 * Root layout.
 *
 * DARK MODE ARRIVED 2026-08-17 (Ali). The note that used to sit here said
 * this site was light by design and that dark mode would be a real design
 * exercise rather than a token flip. Both halves were right, so it was
 * built as the exercise: only the light grounds have dark values, and the
 * art-directed dark surfaces — the hall, the museum, the close — stay
 * dark in both themes. See the `[data-theme="dark"]` block in globals.css.
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
      className={`${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
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
