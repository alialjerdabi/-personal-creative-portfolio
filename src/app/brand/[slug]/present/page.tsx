import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Deck from "@/components/brand/Deck";
import { brandGuides, findBrand } from "@/data/brands";
import { pageMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return brandGuides.map((brand) => ({ slug: brand.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = findBrand(slug);
  if (!brand) return {};
  return {
    ...pageMetadata({
      path: `/brand/${brand.slug}/present`,
      title: `${brand.name} — Brand guidelines (presentation)`,
      description: `The ${brand.name} brand system as a slide deck.`,
    }),
    /* The deck is the guide again in another shape. Letting both rank
       splits one page's worth of relevance across two URLs. */
    robots: { index: false, follow: true },
    alternates: { canonical: `/brand/${brand.slug}` },
  };
}

/**
 * /brand/[slug]/present — the guide as a deck.
 *
 * ← → or space to move, F for full screen, Home and End to jump, and the
 * browser's print dialog saves a 16:9 PDF. The slide number is in the
 * URL, so a link can open on the slide being discussed.
 */
export default async function BrandDeckPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = findBrand(slug);
  if (!brand) notFound();
  return (
    <main id="main">
      <Deck brand={brand} guideUrl={`${siteUrl}/brand/${brand.slug}`} />
    </main>
  );
}
