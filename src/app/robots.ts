import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * Everything is public and everything should be indexed — this site's
 * whole job is to be found. Nothing is disallowed because nothing here is
 * private: there are no admin routes, no drafts and no query-parameter
 * duplicates to keep out of an index.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
