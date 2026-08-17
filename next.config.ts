import type { NextConfig } from "next";

/**
 * Response headers.
 *
 * This is a static marketing site with no accounts, no sessions and no
 * user data, so the job here is not to defend a database — it is to stop
 * the site being used against the person it represents. Framing it into
 * someone else's page, letting a browser guess at content types, or
 * leaking full referrer URLs to third parties all cost credibility
 * rather than data, and all cost nothing to prevent.
 *
 * NO CONTENT-SECURITY-POLICY YET, deliberately. Next injects inline
 * bootstrap scripts, so a useful CSP needs per-request nonces and a
 * middleware to set them — which turns a fully static site into a
 * dynamically rendered one. That is a real trade worth making later,
 * with the deploy in front of us, not blind.
 */
const SECURITY_HEADERS = [
  /* Stop the site being framed into another page — the cheap version of
     someone passing this work off as theirs, or wrapping it in a phishing
     shell. */
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  /* No MIME sniffing: a file served as one type stays that type. */
  { key: "X-Content-Type-Options", value: "nosniff" },
  /* Send the origin cross-site, the full URL same-site. Outbound links
     here go to clients' own sites; they do not need the visitor's exact
     path. */
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  /* Nothing on this site uses a camera, a microphone or a location, so
     nothing embedded in it should be able to ask. */
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  /**
   * Next 16 only serves the qualities declared here, and the default list
   * is [75] alone. MuseumScreen asks for 90 on the two hall renders — the
   * room is a large, softly graded image where 75 bands visibly in the
   * wall gradient — and without this it was being refused and quietly
   * falling back. Surfaced by a dev-server warning, not by a screenshot.
   */
  images: { qualities: [75, 90] },
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  /**
   * /studio became /about on 2026-08-16.
   *
   * PERMANENT, and not optional. That URL has already gone out in DMs and
   * proposals, and a 404 on a link a prospect was personally sent is a
   * lost enquiry — the most expensive kind of broken link there is. A 308
   * also hands the accumulated ranking to the new URL instead of
   * discarding it.
   */
  async redirects() {
    return [{ source: "/studio", destination: "/about", permanent: true }];
  },
};

export default nextConfig;
