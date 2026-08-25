import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";

/**
 * One page's worth of metadata, complete.
 *
 * WHY THIS EXISTS. Next does not deep-merge `openGraph` — a page that
 * declares the object replaces the parent's entirely. Every page here
 * that set an og:title therefore silently dropped the og:image,
 * og:site_name and og:locale it was inheriting from the root layout, so
 * measured on production `/services`, `/about` and `/contact` shared
 * with no image at all. The pages that declared nothing had the opposite
 * problem: `/work` and every case study inherited the homepage's title,
 * description and og:url, so a shared case study announced itself as the
 * homepage and linked there.
 *
 * `twitter` behaves the same way, which is why it is spelled out too
 * rather than left to the layout.
 *
 * The copy is not this file's business. Titles and descriptions are
 * passed in from the page or the project data that already owns them —
 * nothing here writes marketing prose, and nothing here invents a claim.
 */
export function pageMetadata({
  path,
  title,
  description,
  type = "website",
  image,
}: {
  /** Route path, leading slash, no trailing slash. "/" for the root. */
  path: string;
  title: string;
  description: string;
  type?: "website" | "article" | "profile";
  /** Absolute-from-root image path. Defaults to the site card. */
  image?: string;
}): Metadata {
  const url = path === "/" ? siteUrl : `${siteUrl}${path}`;
  /* Relative paths resolve against `metadataBase`, but scrapers get the
     absolute form either way and a few of the older ones only accept
     that, so it is resolved here. */
  const card = `${siteUrl}${image ?? "/opengraph-image.png"}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "en_US",
      siteName: "Ali Aljardabi",
      url,
      title,
      description,
      images: [{ url: card }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [card],
    },
  };
}
