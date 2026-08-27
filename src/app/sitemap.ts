import type { MetadataRoute } from "next";
import { labContent } from "@/data/lab";
import { servicePages } from "@/data/service-pages";
import { siteUrl } from "@/lib/site";

/**
 * Derived from the content layer, not typed out.
 *
 * The case-study routes come from the same `spreads` filter the route
 * itself uses, so a project can never appear in the sitemap before its
 * page exists — a sitemap that lists a 404 is worse than no sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const caseStudies = labContent.projects
    .filter((project) => project.spreads)
    .map((project) => ({
      url: `${siteUrl}/work/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  /* One page per service. These are the pages meant to rank for the
     individual queries, so they sit at the same priority as the hub
     that lists them. Derived, so adding a service adds its URL. */
  const servicePageUrls = servicePages.map((page) => ({
    url: `${siteUrl}/services/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      /* The work index. Higher priority than /about: it is the page
         the homepage now hands most visitors, since only the projects
         with finished imagery are featured there. */
      url: `${siteUrl}/work`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      /* The two search-facing pages. `/services` carries the money
         keywords and the prices, so it ranks above the work index; both
         sit above /about, which is read after someone is interested
         rather than before. */
      url: `${siteUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    ...servicePageUrls,
    ...caseStudies,
  ];
}
