import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomeComposition, { type Variant } from "@/components/lab/HomeComposition";

const VARIANTS: Variant[] = ["a", "b", "c"];

/**
 * The mobile A/B routes.
 *
 * Three static pages rendering the same homepage body as `/`, each with
 * one mobile change. Static rather than a `?v=` switch on `/` for two
 * reasons: reading a search param would turn the homepage dynamic and
 * lose its prerender, and a client-side switch would show the control
 * first and then swap — which is a layout shift the visitor sees and a
 * measurement the test cannot trust.
 *
 * NOINDEX. These are duplicates of the homepage; letting a crawler find
 * them would split the ranking of the page they are testing.
 *
 * Nothing links to them. They are opened by hand, on a phone, one at a
 * time — /ab/a, /ab/b, /ab/c.
 */
export function generateStaticParams() {
  return VARIANTS.map((variant) => ({ variant }));
}

export const metadata: Metadata = {
  title: "Mobile test — Ali Aljardabi",
  robots: { index: false, follow: false },
};

export default async function VariantPage({
  params,
}: {
  params: Promise<{ variant: string }>;
}) {
  const { variant } = await params;
  if (!VARIANTS.includes(variant as Variant)) notFound();

  return <HomeComposition variant={variant as Variant} />;
}
