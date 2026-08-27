import type { FaqEntry } from "@/data/pages";

/**
 * One landing page per service.
 *
 * WHY THIS EXISTS. `/services` was targeting ten queries at once —
 * "branding Bahrain", "website design Bahrain", "logo design Bahrain",
 * "UX UI design Bahrain" and six more — from a single URL. Google ranks
 * pages rather than sites, and one page cannot be the best answer to ten
 * different questions; it competes with itself and places for none of
 * them. Each service now has a page that answers one question properly,
 * and `/services` stays as the hub that compares them.
 *
 * NOTHING HERE IS NEW ABOUT THE BUSINESS. Every claim is already on the
 * site: the scope lines and prices come from `labContent.services`, the
 * argument from `servicesPage.detail`, the process from
 * `servicesPage.process`. What is written here is the connective prose a
 * card had no room for, plus the questions a buyer asks before calling.
 *
 * THE HONESTY RULES FROM pages.ts APPLY UNCHANGED. No response times, no
 * turnaround figures, no aggregateRating, no client counts beyond the six
 * named on this site, no years of experience.
 *
 * THE GULF FRAMING IS A POSITIONING CHOICE ALI SHOULD CONFIRM. `/work`
 * already describes the projects as being for businesses "in Bahrain and
 * the Gulf", so that framing is his rather than mine, and the work is
 * remote-capable by nature. What is claimed below is availability — that
 * he takes on work from the region — never that a named client is in a
 * country they are not. `areaServed` in the structured data says the
 * same thing in the machine-readable form search engines read.
 */

export interface ServicePage {
  /** URL segment under /services. */
  slug: string;
  /** The service's index in `labContent.services.items`. */
  index: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  /** The page's H1. Says the thing, in Ali's voice, not in keyword order. */
  heading: string;
  /** One paragraph under the H1, before any structure. */
  intro: string;
  /** Section heading over the proof. */
  proofHeading: string;
  /**
   * One phrase per surface, set in the service's colour so the page can
   * be scanned rather than read. Each must appear VERBATIM in the
   * sentence it belongs to — `outcome` in `labContent`'s outcome, `lede`
   * in `servicesPage.detail[].lede`, `intro` in `intro` below. An
   * unmatched phrase renders the sentence plain rather than breaking.
   */
  highlight: { outcome: string; lede: string; intro: string };
  /**
   * What the linked work demonstrates about THIS service specifically.
   *
   * `image` is named per service rather than taken from the project's
   * cover, because a project's cover is chosen to represent the whole
   * project: Petrolas' is the website on a laptop, which is the wrong
   * evidence on a page about brand identity. Where possible these are
   * the same shots Ali curated for each service's mobile fold.
   *
   * `ratio` is the escape hatch the asset layer already uses — it is
   * here so a 4:5 social post is not cropped into a 16:11 tile, not so
   * every card can pick its own shape.
   */
  proof: {
    slug: string;
    name: string;
    note: string;
    image: { src: string; alt: string };
    ratio?: string;
  }[];
  faq: FaqEntry[];
}

export const servicePages: ServicePage[] = [
  {
    slug: "branding",
    highlight: {
      outcome: "credible",
      lede: "credible",
      intro: "a system rather than a logo",
    },
    index: "01",
    metaTitle: "Branding & Brand Identity Design in Bahrain — Ali Aljardabi",
    metaDescription:
      "Brand strategy, logo systems and full visual identity for businesses in Bahrain and the Gulf. Positioning first, then the mark, then every application you actually use. From BHD 400.",
    keywords: [
      "branding Bahrain",
      "brand identity design Bahrain",
      "logo design Bahrain",
      "brand designer Manama",
      "brand strategy Bahrain",
      "visual identity Gulf",
      "rebranding Bahrain",
      "brand guidelines Bahrain",
    ],
    heading: "Brand identity design in Bahrain.",
    intro:
      "A brand is the part a customer judges before anyone has spoken. I build it as a system rather than a logo — positioning first, then the mark, the colour, the type and the voice, then every application the business actually puts it on.",
    proofHeading: "Two identities, applied.",
    proof: [
      {
        slug: "qobban",
        name: "Qobban",
        note: "A fabrication and welding workshop that read as a general workshop. The identity runs across the premises, the vehicles, the staff ID, the stationery and the signage — the applications that decide whether a mark is finished.",
        image: {
          src: "/work/qobban/brand-signage.jpg",
          alt: "The Qobban projecting sign on a building",
        },
      },
      {
        slug: "petrolas",
        name: "Petrolas",
        note: "An energy business repositioning toward clean energy. The mark, the palette and the type system carry it from a favicon to an exhibition stand without losing the argument.",
        image: {
          src: "/work/petrolas/booth-stand.jpg",
          alt: "The Petrolas exhibition stand — the identity applied at trade-show scale",
        },
      },
    ],
    faq: [
      {
        q: "How much does branding cost in Bahrain?",
        a: "Branding starts from BHD 400. That is a starting point rather than a quote — the figure for a specific project depends on scope, which we agree before anything is designed.",
      },
      {
        q: "What do I actually get?",
        a: "Brand strategy and positioning, the visual identity and logo system, art direction, guidelines, and the applications the business needs — signage, vehicles, documents, social, packaging, whatever the work calls for. A mark that only works on a business card is not finished.",
      },
      {
        q: "Do I own the identity when it is finished?",
        a: "Yes. Everything is handed over at the end, along with a meeting to make sure you can use it without me, plus templates and extra assets.",
      },
      {
        q: "I already have a logo. Can you work with it?",
        a: "Sometimes. If the mark still fits what the business now sells, the work is the system around it. If it does not, I will say so before either of us has spent money on keeping it.",
      },
      {
        q: "Do you take on rebrands, or only new businesses?",
        a: "Both. Businesses launching, businesses that have outgrown the identity they started with, and businesses whose look no longer matches what they now sell.",
      },
    ],
  },

  {
    slug: "website-design",
    highlight: {
      outcome: "enquiries",
      lede: "enquiries",
      intro: "end to end",
    },
    index: "02",
    metaTitle: "Website Design & Development in Bahrain — Ali Aljardabi",
    metaDescription:
      "Website strategy, UX/UI and the build, done end to end by one person in Manama, Bahrain. For businesses whose site does not bring enquiries. From BHD 600.",
    keywords: [
      "website design Bahrain",
      "web design Manama",
      "web development Bahrain",
      "UX UI design Bahrain",
      "website designer Gulf",
      "business website Bahrain",
      "website redesign Bahrain",
      "landing page design Bahrain",
    ],
    heading: "Website design and development in Bahrain.",
    intro:
      "A website is where interest either becomes a message or evaporates. Most of the ones I am asked to replace are not ugly — they are unclear. I design and build them end to end, so the built site is the design rather than an approximation of it.",
    proofHeading: "Two sites, designed and built.",
    proof: [
      {
        slug: "qobban",
        name: "Qobban",
        note: "A site that has to make a workshop look like it can be trusted with the job, and turn that into a quote request.",
        image: {
          src: "/work/qobban/site-landing-dark-v3.jpg",
          alt: "The Qobban store landing page",
        },
      },
      {
        slug: "petrolas",
        name: "Petrolas",
        note: "A longer argument: a business explaining a technology and a partnership model to people who arrive sceptical.",
        image: {
          src: "/work/petrolas/site-partnership.jpg",
          alt: "The Petrolas partnership page",
        },
      },
    ],
    faq: [
      {
        q: "How much does a website cost in Bahrain?",
        a: "Website design and development starts from BHD 600, and the figure covers both. That is a starting point rather than a quote — the scope decides the number, and we agree it before anything is designed.",
      },
      {
        q: "Do you design and build websites yourself?",
        a: "Yes. Strategy, UX, UI and the build are all mine. There is no handover between a designer and a developer, which is the stage where most sites quietly stop looking like the design.",
      },
      {
        q: "Will it work on a phone?",
        a: "Yes — responsive implementation is part of the build rather than an extra. Most of the traffic these sites get arrives on a phone, so that is where the design is decided.",
      },
      {
        q: "Do I need branding first?",
        a: "Not necessarily, but a site carries the brand, so if the identity is unresolved the site inherits the problem. Where both are needed I would take them together, which is a separate offer from BHD 950.",
      },
      {
        q: "What happens after launch?",
        a: "Launch support is part of the engagement, and you own everything at hand-off. If you want someone keeping it current after that, ongoing support is a monthly engagement rather than part of the build.",
      },
    ],
  },

  {
    slug: "brand-and-website",
    highlight: {
      outcome: "built once",
      lede: "decided together",
      intro: "one decision rather than two",
    },
    index: "03",
    metaTitle: "Brand + Website Package in Bahrain — Ali Aljardabi",
    metaDescription:
      "The brand and the site decided together rather than handed between two people. One person, one system, from positioning to launch, in Manama, Bahrain. From BHD 950.",
    keywords: [
      "brand and website package Bahrain",
      "branding and web design Bahrain",
      "brand identity and website Gulf",
      "business launch package Bahrain",
      "startup branding Bahrain",
      "complete brand package Manama",
      "rebrand and website Bahrain",
    ],
    heading: "The brand and the website, decided together.",
    intro:
      "Most businesses buy these separately, and the join is where the work leaks. Taken together they are one decision rather than two — the positioning that settles the mark also settles what the homepage has to say first.",
    proofHeading: "Both, on the same business.",
    proof: [
      {
        slug: "qobban",
        name: "Qobban",
        note: "The identity and the site are the same project. What the brand decided about how the business should be read is what the homepage says in its first screen.",
        image: {
          src: "/work/qobban/cover-idcards-v2.jpg",
          alt: "Qobban staff ID cards on branded lanyards",
        },
      },
      {
        slug: "petrolas",
        name: "Petrolas",
        note: "A repositioning that had to survive all the way from the mark to the page explaining the technology. Nothing was handed to a second party to approximate.",
        image: {
          src: "/work/petrolas/system-favicon.jpg",
          alt: "The Petrolas mark as a browser favicon beside the address bar",
        },
      },
    ],
    faq: [
      {
        q: "How much is the brand and website together?",
        a: "From BHD 950. Separately they start at BHD 400 and BHD 600, so taken together they are less than the sum — the saving is real work that is not repeated, not a discount.",
      },
      {
        q: "Why is it cheaper together?",
        a: "Because the research, the positioning and the strategy are done once instead of twice. When the site follows months later with someone else, that groundwork gets redone or guessed at.",
      },
      {
        q: "Which comes first?",
        a: "The positioning, then both. The mark and the homepage are answering the same question, so they are decided in the same conversation rather than a year apart.",
      },
      {
        q: "Can I split it later if the budget changes?",
        a: "Yes. Branding and websites are separate engagements with their own scope and their own starting price. Nothing here requires buying both.",
      },
      {
        q: "Do I own all of it?",
        a: "Yes. Every asset, plus templates and a hand-off meeting that leaves you able to carry it on yourself.",
      },
    ],
  },

  {
    slug: "ongoing-support",
    highlight: {
      outcome: "consistent",
      lede: "think of",
      intro: "as one system",
    },
    index: "04",
    metaTitle: "Ongoing Brand & Creative Support in Bahrain — Ali Aljardabi",
    metaDescription:
      "Campaign direction, advertising creative and social brand systems on a monthly engagement. Stay consistent after launch without hiring in. Manama, Bahrain. From BHD 350 a month.",
    keywords: [
      "creative retainer Bahrain",
      "marketing design Bahrain",
      "advertising creative Bahrain",
      "social media design Bahrain",
      "campaign art direction Gulf",
      "brand support Manama",
      "content creative Bahrain",
    ],
    heading: "Ongoing brand and creative support.",
    intro:
      "Branding makes a business recognisable. What keeps it that way is everything published after launch. I direct campaigns as one system — the idea, the creative, and the channel it runs on — rather than producing posts to fill a calendar.",
    proofHeading: "Campaign work.",
    proof: [
      {
        slug: "qobban",
        name: "Qobban",
        note: "The social system: posts and stories built from the brand rather than decorated with it, so the channel reads as the same business as the signage.",
        image: {
          src: "/work/qobban/social/post-01.jpg",
          alt: "A Qobban opening-offers campaign post",
        },
        ratio: "4 / 5",
      },
      {
        slug: "petrolas",
        name: "Petrolas",
        note: "Campaign creative built from the identity rather than beside it — the same system that settles the mark decides what the billboard is allowed to say.",
        image: {
          src: "/work/petrolas/campaign-hero.jpg",
          alt: "A Petrolas campaign billboard at dusk — “Engineering clean energy for tomorrow.”",
        },
        ratio: "4 / 3",
      },
    ],
    faq: [
      {
        q: "How much is ongoing support?",
        a: "From BHD 350 a month. It is a monthly engagement rather than a project fee, and the scope is agreed before it starts.",
      },
      {
        q: "What does it cover?",
        a: "Campaign strategy and art direction, advertising creative — film, motion and stills — the social brand system and content direction, paid campaign creative, and channel management. The mix is set by what the business actually needs.",
      },
      {
        q: "Is this social media management?",
        a: "It includes the channel, but the point is the creative direction behind it. Posting on a schedule without an idea underneath is what produces a calendar nobody remembers.",
      },
      {
        q: "Do I need to have worked with you before?",
        a: "No, though it works best when the brand is already resolved — consistency needs something to be consistent with.",
      },
      {
        q: "Can I stop?",
        a: "Yes. It is monthly, and you own everything produced.",
      },
    ],
  },
];

/** The countries the work is offered in, for `areaServed`. */
export const AREA_SERVED = [
  "Bahrain",
  "Saudi Arabia",
  "United Arab Emirates",
  "Qatar",
  "Kuwait",
  "Oman",
];

export function servicePageBySlug(slug: string) {
  return servicePages.find((page) => page.slug === slug);
}
