/**
 * The site's own absolute URL.
 *
 * Open Graph tags and sitemaps must be absolute — a relative og:image is
 * silently ignored by every scraper — so this has to be resolved at build
 * time rather than from the request.
 *
 * Order matters:
 * 1. `NEXT_PUBLIC_SITE_URL` — set this in Vercel the moment a custom
 *    domain is attached, and everything follows without a code change.
 * 2. `VERCEL_PROJECT_PRODUCTION_URL` — Vercel supplies this for the
 *    project's stable production domain (no protocol), so previews still
 *    point their share cards at production rather than at a throwaway
 *    deployment URL.
 * 3. The current production domain, as a last resort, so a local build
 *    still produces valid absolute URLs.
 */
const FALLBACK = "https://personal-creative-portfolio-steel.vercel.app";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : FALLBACK)
).replace(/\/$/, "");
