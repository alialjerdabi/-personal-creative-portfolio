import type { Metadata } from "next";
import { Schibsted_Grotesk, Geist_Mono, Nunito } from "next/font/google";
import "./globals.css";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
});

/*
 * The display face. Nunito's rounded terminals are the closest usable
 * match to the SF Pro Rounded the reference site leans on, and it carries
 * a full weight range where most rounded faces on Google Fonts ship one
 * or two. On a site whose brief is "personality" the typeface does most
 * of that work.
 */
const nunito = Nunito({
  variable: "--font-rounded",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ali Aljardabi — Brand, Web & Social Design",
  description:
    "Brand identity, websites, and social media design for small and growing businesses. Designed and built by one person, end to end, from Manama, Bahrain.",
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
      className={`${schibstedGrotesk.variable} ${geistMono.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-lab-air">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-lab-ink-warm focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
