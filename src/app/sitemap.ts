import type { MetadataRoute } from "next";
import { labContent } from "@/data/lab";
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

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/studio`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    ...caseStudies,
  ];
}
