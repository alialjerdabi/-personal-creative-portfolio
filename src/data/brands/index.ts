import { aliAljardabi } from "./ali-aljardabi";
import type { BrandGuide } from "./types";

/**
 * Every published guide. Adding a brand is one file in this folder and
 * one line here — both routes and their static params follow from it.
 */
export const brandGuides: BrandGuide[] = [aliAljardabi];

export function findBrand(slug: string) {
  return brandGuides.find((brand) => brand.slug === slug);
}

export type { BrandGuide } from "./types";
