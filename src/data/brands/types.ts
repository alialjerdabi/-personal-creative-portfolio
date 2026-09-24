/**
 * The shape of one brand guideline.
 *
 * ONE FILE PER BRAND, TWO SURFACES. `/brand/[slug]` renders this as a
 * scrolling guide and `/brand/[slug]/present` renders the same object as
 * a slide deck, so a colour corrected here is corrected in both — the
 * guide and the deck can never disagree, which is the failure a PDF plus
 * a separate Keynote always ends in.
 *
 * Every section is optional in the sense the rest of this repo uses:
 * empty arrays render nothing rather than a plausible placeholder.
 */

import type { CSSProperties } from "react";

export interface BrandColour {
  name: string;
  /** The CSS custom property that carries it in code, if there is one. */
  token?: string;
  hex: string;
  /** What the colour is for, in one line. */
  role: string;
  /** Its dark-theme value, when the colour themes. */
  dark?: string;
  /**
   * A darker (or lighter) variant solved to clear 4.5:1 as text on the
   * page ground. A field colour and a text colour are different problems.
   */
  ink?: string;
  /** Who owns it — a project, a service. Colour is identity here. */
  owners?: string[];
}

export interface BrandTypeface {
  name: string;
  role: string;
  /** The CSS variable next/font writes, so the specimen renders the real face. */
  cssVar: string;
  weights: number[];
  source: string;
  sample: string;
}

export interface BrandTypeStyle {
  name: string;
  /** Human-readable spec, shown beside the sample and copied on click. */
  spec: string;
  style: CSSProperties;
  sample: string;
}

export interface BrandDuration {
  token: string;
  ms: number;
  use: string;
}

export interface BrandGuide {
  slug: string;
  name: string;
  /** Short line under the name on the cover. */
  descriptor: string;
  /** ISO date the guide was last revised. */
  revised: string;

  intro: {
    /** Hand-broken lines, same rules as the site's headlines. */
    statement: string[];
    summary: string;
    principles: { title: string; body: string }[];
  };

  logo: {
    mark: { src: string; width: number; height: number };
    lockup: { src: string; width: number; height: number };
    /**
     * Whether the files can take `currentColor`. A raster cannot, so on a
     * dark ground it is inverted with a filter — and the guide says so
     * rather than pretending it recolours.
     */
    markIsRaster: boolean;
    rules: { title: string; body: string }[];
  };

  colour: {
    rule: string;
    core: BrandColour[];
    palette: BrandColour[];
  };

  type: {
    note: string;
    families: BrandTypeface[];
    scale: BrandTypeStyle[];
  };

  motion: {
    note: string;
    easing: { token: string; bezier: [number, number, number, number]; why: string };
    /** What the easing is chosen against, drawn beside it for contrast. */
    against: { name: string; bezier: [number, number, number, number] };
    durations: BrandDuration[];
    rules: { title: string; body: string }[];
  };

  voice: {
    summary: string;
    rules: { title: string; do: string; dont: string; why: string }[];
  };

  applications: {
    note: string;
    items: { name: string; kind: string; colour: string; href?: string }[];
  };

  assets: { label: string; file: string; format: string }[];
}
