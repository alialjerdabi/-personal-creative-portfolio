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
 * 3. The custom domain, as a last resort, so a local build still
 *    produces valid absolute URLs — and so a missing environment
 *    variable can never put a *.vercel.app host into a canonical tag,
 *    which is the one failure here that search engines act on.
 */
const FALLBACK = "https://alialjardabi.com";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : FALLBACK)
).replace(/\/$/, "");
