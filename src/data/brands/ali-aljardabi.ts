import { hasCaseStudy, labContent, type LabPalette } from "@/data/lab";
import type { BrandGuide } from "./types";

/*
 * ALI'S OWN BRAND, AS A GUIDE (2026-09-24).
 *
 * Nothing here is new. Every value is lifted from the places it already
 * lives — the tokens in globals.css, the type decision in layout.tsx, the
 * motion rules in docs/motion.md, the voice and honesty rules in
 * docs/master-brief.md — and the headline and the project list are read
 * straight out of `labContent`, so the guide cannot fall out of step with
 * the site it describes.
 *
 * If a value changes in globals.css, change it here too. The two are
 * kept in step by hand for the same reason the rgb triplets are: there
 * are few enough of them that a build step would cost more than it saves.
 */

/** Field values from globals.css, keyed the way `LabPalette` names them. */
const FIELD: Record<LabPalette, string> = {
  orange: "#ff5a1f",
  blue: "#1b3fe0",
  lime: "#c6f24e",
  violet: "#6e3bff",
  cream: "#eeece7",
  teal: "#00bfa6",
  sun: "#ffc220",
  amber: "#f8b800",
};

/** The same hues solved for text on the light grounds (globals.css). */
const INK: Record<LabPalette, string> = {
  orange: "#bf4317",
  blue: "#1b3fe0",
  lime: "#5f7425",
  violet: "#6e3bff",
  cream: "#6d6c6a",
  teal: "#007a6a",
  sun: "#896811",
  amber: "#8a6700",
};

/** Who owns each colour, derived — so a recoloured project moves itself. */
function ownersOf(palette: LabPalette) {
  return [
    ...labContent.projects.filter((p) => p.palette === palette).map((p) => p.name),
    ...labContent.services.items
      .filter((s) => s.palette === palette)
      .map((s) => `${s.name} (service)`),
  ];
}

const PALETTE_ORDER: { key: LabPalette; name: string }[] = [
  { key: "orange", name: "Orange" },
  { key: "blue", name: "Blue" },
  { key: "lime", name: "Lime" },
  { key: "violet", name: "Violet" },
  { key: "teal", name: "Teal" },
  { key: "sun", name: "Sun" },
  { key: "amber", name: "Amber" },
];

export const aliAljardabi: BrandGuide = {
  slug: "ali-aljardabi",
  name: labContent.identity,
  descriptor: labContent.opening.role,
  revised: "2026-09-24",

  intro: {
    statement: labContent.hero.statement,
    summary:
      "Brand identity, websites and social media design for small and growing businesses — designed and built by one person, end to end. This guide is the system the site is built on, written down.",
    principles: [
      {
        title: "Colour is identity, not decoration",
        body: "Each project owns exactly one colour. The same value marks it everywhere it appears, so a visitor learns the work by colour before reading a single name.",
      },
      {
        title: "One family, everything",
        body: "Space Grotesk for display and for text, with Geist Mono alongside it. One grotesque does the job a pairing would, with no pairing left to decide.",
      },
      {
        title: "Flat fields only",
        body: "No gradients, no glows. Colour is laid down as a field and left alone.",
      },
      {
        title: "Enter once. Never leave.",
        body: "Things animate in and stay. Nothing animates out as it leaves the viewport.",
      },
    ],
  },

  logo: {
    mark: { src: "/brand/mark.png", width: 277, height: 160 },
    lockup: { src: "/brand/lockup-name.svg", width: 1177, height: 382 },
    markIsRaster: true,
    rules: [
      {
        title: "Mark beside the name",
        body: "In navigation the mark sits to the left of the name, set in Space Grotesk 700.",
      },
      {
        title: "Flat ink only",
        body: "The mark is drawn in the ink colour: black on light grounds, white on dark ones. It never takes a project colour, a gradient or a shadow.",
      },
      {
        title: "The mark is a raster for now",
        body: "The mark exists as a 277×160 black PNG and softens when set much larger; an SVG is still owed. The lockup is an outlined SVG and holds at any size.",
      },
    ],
  },

  colour: {
    rule: "The core set carries every page. The project palette is for identity only: one colour per project or service, and never two projects on the same colour.",
    core: [
      {
        name: "Air",
        token: "--lab-air",
        hex: "#f1efe9",
        dark: "#131313",
        role: "The page ground. Warm paper, cooled until it stops fighting cold imagery.",
      },
      {
        name: "Haze",
        token: "--lab-haze",
        hex: "#e9e6e0",
        dark: "#0e0e0e",
        role: "Recessed sections.",
      },
      {
        name: "Card",
        token: "--lab-card",
        hex: "#fcfbf9",
        dark: "#0b0b0b",
        role: "Raised surfaces. They sit below the page in dark mode, not above it.",
      },
      {
        name: "Ink",
        token: "--lab-ink-warm",
        hex: "#1a1713",
        dark: "#f4f4f4",
        role: "Headlines and body text.",
      },
      {
        name: "Soft ink",
        token: "--lab-ink-soft",
        hex: "#6b6459",
        dark: "#a3a3a3",
        role: "Secondary text, labels, captions.",
      },
      {
        name: "Accent",
        token: "--accent",
        hex: "#ff5a1f",
        role: "The one accent. The same value in both themes: the accent does not get themed.",
      },
    ],
    palette: PALETTE_ORDER.map(({ key, name }) => ({
      name,
      token: `--lab-${key}`,
      hex: FIELD[key],
      ink: INK[key],
      role: "Project field",
      owners: ownersOf(key),
    })),
  },

  type: {
    note: "Space Grotesk stops at 700. It has more character than the neutral grotesques — the R, the a, the single-storey 1 — and that character is why it was chosen, but nothing can ask it for 800.",
    families: [
      {
        name: "Space Grotesk",
        role: "Display and text",
        cssVar: "--font-text",
        weights: [300, 400, 500, 600, 700],
        source: "Google Fonts, via next/font",
        sample: "Not a style. A standard.",
      },
      {
        name: "Geist Mono",
        role: "Code, tokens, figures",
        cssVar: "--font-geist-mono",
        weights: [400, 500, 700],
        source: "Google Fonts, via next/font",
        sample: "cubic-bezier(0.44, 0, 0.56, 1)",
      },
    ],
    scale: [
      {
        name: "Page heading",
        spec: "700 · clamp(2.15rem, 5.9vw, 4.4rem) · 1.04 · -0.04em · uppercase",
        style: {
          fontWeight: 700,
          fontSize: "clamp(2.15rem, 5.9vw, 4.4rem)",
          lineHeight: 1.04,
          letterSpacing: "-0.04em",
          textTransform: "uppercase",
        },
        sample: "Easy to remember",
      },
      {
        name: "Lede",
        spec: "400 · clamp(1.05rem, 1.6vw, 1.3rem) · 1.6",
        style: { fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)", lineHeight: 1.6 },
        sample: labContent.hero.sub,
      },
      {
        name: "Placard",
        spec: "700 · 0.6875rem · 0.16em · uppercase",
        style: {
          fontWeight: 700,
          fontSize: "0.6875rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        },
        sample: "Independent designer — Manama, Bahrain",
      },
    ],
  },

  motion: {
    note: "Measured from two reference sites, not chosen. One curve, three durations, three distances.",
    easing: {
      token: "--ease-motion",
      bezier: [0.44, 0, 0.56, 1],
      why: "Near symmetric: it accelerates and decelerates about equally, which is why the movement reads as considered rather than as snappy software.",
    },
    against: { name: "ease-out", bezier: [0, 0, 0.58, 1] },
    durations: [
      { token: "--dur-quick", ms: 260, use: "Hover, focus, small state changes" },
      { token: "--dur-base", ms: 520, use: "Entrances. The default" },
      { token: "--dur-slow", ms: 800, use: "Large surfaces — a full-bleed image, a panel" },
    ],
    rules: [
      {
        title: "Stagger is 60ms, and it stops at six",
        body: "Siblings enter 60ms apart. Past six the delay caps, so the last card in a long grid does not arrive a second after the first.",
      },
      {
        title: "Composited properties only",
        body: "transform and opacity. Never width, height, top, left or margin.",
      },
      {
        title: "Reduced motion removes movement, never content",
        body: "Everything renders in its final state. Nothing is hidden behind an animation that never runs.",
      },
    ],
  },

  voice: {
    summary: "Warm, spoken, first person. Editorial, not corporate.",
    rules: [
      {
        title: "First person, always",
        do: "I design it, then I build it.",
        dont: "Our team delivers end-to-end solutions.",
        why: "It is one person, and that is the argument. \"We\" hides the thing a client is buying.",
      },
      {
        title: "Outcomes, not deliverables",
        do: "Easy to remember, and easy to buy from.",
        dont: "Brand identity, website, design system.",
        why: "A list of things made belongs on the services page. The pitch is what changes for the business.",
      },
      {
        title: "Numbers keep their caveats",
        do: "Around 20%, reported by the client, over a plan that was not completed.",
        dont: "20% more sales.",
        why: "The caveat is what makes the number believable. No figure is invented, and none loses its qualifier.",
      },
      {
        title: "Nobody else's lines",
        do: "Say it in words that are yours.",
        dont: "A near-copy of a reference site's headline.",
        why: "A prospect who recognises a borrowed line has just learned something the rest of the page has to argue against.",
      },
    ],
  },

  applications: {
    note: "Where the palette is spent. Each colour below is owned by one piece of work, and marks it on the home page, the work index and its case study.",
    items: labContent.projects.map((project) => ({
      name: project.name,
      kind: "Project",
      colour: FIELD[project.palette],
      href: hasCaseStudy(project) ? `/work/${project.slug}` : undefined,
    })),
  },

  assets: [
    { label: "Mark", file: "/brand/mark.png", format: "PNG · 277×160 · black" },
    { label: "Name lockup", file: "/brand/lockup-name.svg", format: "SVG · outlined · currentColor" },
  ],
};
