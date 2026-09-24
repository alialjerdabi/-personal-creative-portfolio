import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BrandGuideView from "@/components/brand/BrandGuideView";
import { brandGuides, findBrand } from "@/data/brands";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return brandGuides.map((brand) => ({ slug: brand.slug }));
}

/* Only the guides in `brandGuides` exist. Anything else is a 404 at build
   time rather than a dynamic render of nothing. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = findBrand(slug);
  if (!brand) return {};
  return pageMetadata({
    path: `/brand/${brand.slug}`,
    title: `${brand.name} — Brand guidelines`,
    description: `The ${brand.name} brand system: logo, colour, type, motion and voice, with every value ready to copy.`,
  });
}

export default async function BrandGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = findBrand(slug);
  if (!brand) notFound();
  return <BrandGuideView brand={brand} />;
}
