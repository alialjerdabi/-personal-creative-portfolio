/**
 * Content for the lobby direction prototype (/lab).
 *
 * The homepage opens as one locked screen — wordmark, one line of
 * description, and the work itself — then continues past the rail into
 * a short services block and the contact close. Work first, copy last;
 * the argument is made by what is on screen, not by what is written
 * about it.
 *
 * Deliberately a separate content layer from data/hero.ts, data/services.ts
 * and friends: those are written for the shipped "connected growth system"
 * positioning, which this direction removes from the centre.
 *
 * Honesty rules carried over from the rest of the project: no invented
 * clients, no invented metrics, no fabricated testimonials. Projects Ali
 * has actually done are listed by name; the ones whose cover art does not
 * exist yet say so rather than borrowing an image from somewhere else.
 */

export interface LabAsset {
  src: string;
  alt: string;
  /**
   * How this asset wants to be composed. The library is a mix of
   * photographic mockups and portrait poster artefacts, and the two do
   * not survive the same treatment — posters carry their own typography,
   * so bleeding them full-width fights the page's own type.
   *
   * "bleed"  — photographic, wide, safe to run edge to edge.
   * "plate"  — a designed artefact; framed as an object on the ground.
   */
  form: "bleed" | "plate";
}

/** An image bold enough to read inside letterforms. */
export interface ApertureAsset {
  src: string;
  /**
   * Focal point for the masked fill, as a CSS background-position. Type
   * crops hard, so the interesting part of the image has to be aimed at
   * the letterforms deliberately.
   */
  position: string;
}

export interface LabSpread {
  id: string;
  /** Mono discipline label — the system register. */
  label: string;
  /**
   * The word cut out of imagery for this spread. Single words only:
   * at display scale a space is a wrap opportunity, and a wrapped
   * spread title breaks its own mask.
   */
  title: string;
  /** Commercial context. Describes the work, never claims a result. */
  note: string;
  /**
   * How this spread composes its assets. Explicit rather than inferred
   * from the asset forms: each spread is art-directed, and "work out the
   * layout from the data" is exactly how a portfolio ends up looking
   * like a grid again.
   */
  layout: "bleed-plate" | "plates" | "bleeds";
  /**
   * Absent until this spread's imagery exists. The title then sets in
   * solid ink instead of being cut out of a photograph — the mechanic is
   * a bonus the composition never depends on.
   */
  aperture?: ApertureAsset;
  /**
   * Empty means the spread is written but its assets have not been
   * delivered. The spread still renders — label, title and note — with a
   * designed pending panel where the work will go.
   *
   * This is the honest state for a case study whose story is confirmed
   * and whose files are not: it ships the argument now and the evidence
   * when it arrives, rather than holding the whole page back or filling
   * it with another client's imagery.
   */
  assets: LabAsset[];
}

/**
 * Which field colour a project owns. Colour is identity here, not
 * decoration: the same value marks the project on the lobby mosaic and
 * anywhere else it appears, so a visitor learns the projects by colour
 * before they have read a single name.
 */
export type LabPalette =
  | "orange"
  | "blue"
  | "lime"
  | "violet"
  | "cream"
  | "teal"
  | "sun";

export interface LabProject {
  slug: string;
  name: string;
  palette: LabPalette;
  /**
   * Real disciplines only. Empty means "Ali hasn't confirmed these yet" —
   * the card renders without tags rather than guessing at them.
   */
  disciplines: string[];
  year: string;
  /** Portrait cover for the rail. Absent until real cover art exists. */
  cover?: LabAsset;
  /**
   * The client's own mark, for the badge on the featured card.
   *
   * SLOT ONLY UNTIL FILES ARRIVE. Ali has no logo files for any client
   * yet, so the badge renders only where a logo actually exists — an
   * empty rounded square on a full-width card reads as an image that
   * failed to load, which is worse than no badge at all. Drop a file at
   * `public/work/<slug>/logo.svg` and add it here; nothing else changes.
   *
   * A client's mark is theirs. Never draw one, and never substitute an
   * initial or a generic glyph for one that has not been supplied.
   */
  logo?: LabAsset;
  /**
   * The still used on the homepage's featured card, when the cover is
   * the wrong shape for it.
   *
   * The featured card is square, per Ali's reference; the mosaic tile is
   * landscape. A single image cannot serve both without one of them
   * being butchered — cropping a 1.79 photograph to 1:1 discards 44% of
   * its width, which on the tanker meant a truck cut off at both ends.
   *
   * Falls back to `cover`, so this only needs setting where the two
   * shapes genuinely disagree.
   */
  feature?: LabAsset;
  /** One line of context, shown on the card. */
  summary?: string;
  sector?: string;
  /** Present only when a case study has actually been built. */
  spreads?: LabSpread[];
}

export interface LabService {
  index: string;
  name: string;
  /** Each service owns a field colour too, carrying the mosaic downward. */
  palette: LabPalette;
  /** The business outcome, in the client's own words — not the deliverable. */
  outcome: string;
  scope: string[];
  /**
   * Starting price, supplied by Ali 2026-08-10.
   *
   * A number here does two jobs at once: it reassures the business that
   * can afford it, and it lets the one that cannot disqualify itself
   * before either of you spends a call finding out. Small businesses
   * overwhelmingly do the second silently, which is why an absent price
   * filters nothing and costs real enquiries.
   *
   * "From" is doing load-bearing work — these are floors, not quotes,
   * and every one of them is a real engagement's starting point rather
   * than a rounded-up number.
   */
  from: string;
}

/**
 * One piece of the spoken headline. The sentence is data, not markup,
 * because its personality comes from what interrupts it — a cluster of
 * work stills, a drawn arrow — and those interruptions have to be
 * positioned by whoever is writing the line, not by a component.
 */
export type HeroToken =
  | { kind: "text"; value: string }
  | { kind: "chips"; images: LabAsset[] }
  | { kind: "arrow" }
  /**
   * A hand-placed line break, honoured from `lg` up and ignored below.
   *
   * Two rules, learned the hard way: never leave a line holding a single
   * word (it reads as a mistake, not a shape), and never break inside a
   * noun phrase — "small / businesses" splits a unit the eye expects
   * whole. Each line below is a complete phrase.
   */
  | { kind: "break" };

export interface LabContent {
  identity: string;
  /** The single line that says what this is. Nothing more on the lobby. */
  descriptor: string;
  navLinks: { label: string; href: string }[];
  navCta: { label: string; href: string };

  hero: {
    /** Read in order; the tokens compose one continuous sentence. */
    tokens: HeroToken[];
    sub: string;
    cta: { label: string; href: string };
    secondary: { label: string; href: string };
  };

  loader: {
    /** The three words that arrive independently, then align on the rule. */
    words: { text: string; palette: LabPalette }[];
    /** Fragments that flash through the letterforms mid-sequence. */
    fragments: string[];
  };

  lobby: {
    /** Mono cue inviting the visitor onward. */
    scrollLabel: string;
    /** Label beside the live "n / total" counter. */
    counterLabel: string;
    /** Card state for projects whose cover art does not exist yet. */
    pendingLabel: string;
    /** Spread state for case studies written ahead of their imagery. */
    assetsPendingLabel: string;
    location: string;
    availability: string;
  };

  projects: LabProject[];

  /** Slugs of the projects on the homepage's featured cards, in order. */
  featuredWork: string[];

  services: {
    label: string;
    heading: string;
    items: LabService[];
  };

  /** Scroll-scrubbed panel of project stills under the hero. */
  showcase: {
    label: string;
    heading: string;
    frames: { image: LabAsset; caption: string; project: string }[];
  };

  /**
   * Real, publishable client quotes only. EMPTY BY DESIGN — the section
   * does not render until Ali supplies quotes he has permission to use,
   * attributed to real people. Never write these.
   */
  testimonials: {
    quote: string;
    name: string;
    role: string;
    /** Slug of the project this quote is about — supplies the card's field
     *  colour and its images. Must match an entry in `projects`. */
    project: string;
    /**
     * Exact substrings of `quote` to set in the ink colour and weight,
     * so the card can be scanned in a second without being read in full.
     *
     * They are EXCERPTS, never edits: the quote renders complete and
     * verbatim, and emphasis only changes what the eye lands on first.
     * Rewriting or trimming a client's words to make them scan better
     * would make the attribution false.
     */
    emphasis: string[];
    /**
     * The qualification a figure in the quote cannot travel without.
     *
     * A client-reported number and its caveat are one fact. The brief
     * already requires Delivery Point's 20% / 5% to carry the note that
     * the three-month plan was not completed — but that note only lived
     * on the case-study spread, so the homepage rail was quoting the
     * numbers bare to far more people than ever reached the case study.
     *
     * Never a disclaimer written to sound careful: this is the client's
     * own qualification, in the words already recorded with the figures.
     */
    caveat?: string;
  }[];

  /**
   * The convert stage's argument: what changes for the visitor's business.
   *
   * OUTCOMES, NOT DELIVERABLES. "Brand identity, website, design system"
   * is a list of things Ali makes; it belongs on the services index and it
   * is already there. This section says what the visitor ends up with,
   * which is the only version of the pitch that turns reading into an
   * email.
   *
   * Every line here is grounded in what real clients reported — becoming
   * recognisable, standing apart from competitors, getting better
   * enquiries. No guarantee, no pricing, no timeline and no numbers: none
   * of those are confirmed, and one invented figure would cost more than
   * this whole section earns.
   */
  promise: {
    label: string;
    heading: string;
    items: { outcome: string; body: string }[];
  };

  /** Point of view, not a blog index — no dates, no links to nowhere. */
  notes: {
    label: string;
    heading: string;
    items: { title: string; dek: string; tag: string }[];
  };

  /**
   * The about page. Bio is written only from what this project already
   * establishes — independent, Manama, three disciplines, end to end. No
   * invented years of experience, employers or education.
   *
   * The process steps were confirmed by Ali on 2026-08-10 as how he
   * actually works. They are no longer proposed, and they now drive the
   * stepper on both the homepage and this page.
   */
  studio: {
    eyebrow: string;
    heading: string;
    bio: string[];
    /** Scannable facts beside the bio — never an invented figure. */
    highlights: { value: string; label: string }[];
    badge: { name: string; role: string; location: string; photo?: string; mark?: string };
    /* No `cta` here any more: the process now ends in the stepper's own
       fifth panel, which carries WhatsApp and email rather than a button
       pointing at a section further down. */
    process: { step: string; title: string; body: string }[];
  };

  contact: {
    label: string;
    heading: string;
    email: string;
    body: string;
    /**
     * WhatsApp, in international format with no spaces or punctuation —
     * that is the only shape wa.me accepts.
     *
     * Added 2026-08-10 because email was the single channel on the site,
     * and in Bahrain and the wider Gulf WhatsApp is where business
     * actually happens. A `mailto:` also asks a desktop visitor to have
     * a mail client configured, which many do not: that click is a dead
     * end, and it was the only way to reach him.
     */
    whatsapp: string;
    /**
     * Instagram handle, without the @.
     *
     * For someone selling social media design the feed is portfolio that
     * already exists — which matters more than usual while five of six
     * projects are still waiting on cover art.
     */
    instagram: string;
  };
}

export const labContent: LabContent = {
  identity: "Ali Aljardabi",
  /*
    POSITIONING CHANGED 2026-08-06 (Ali's call): social media design
    replaces web & app products across the site. The claim lived in seven
    places — this descriptor, the hero's supporting line, the loader's
    three words, both page titles, the studio bio and the badge role — and
    a page that animates the word PRODUCT on entry while offering
    something else at the services index reads as out of date.
  */
  descriptor: "Brand, Web & Social Design",
  /* Absolute, not bare fragments: the same header renders on case-study
     pages, where "#services" would resolve to nothing. */
  navLinks: [
    /* /work, not /#work: the homepage now shows only the projects with
       finished imagery, so "Work" in the nav has to reach the index
       rather than the two-card sample of it. */
    { label: "Work", href: "/work" },
    { label: "Services", href: "/#services" },
    { label: "Studio", href: "/studio" },
    { label: "Contact", href: "/#contact" },
  ],
  navCta: { label: "Start a project", href: "/#contact" },

  /*
   * Written in the first person and said out loud. Ali is one person,
   * not a "we".
   *
   * REWRITTEN 2026-08-06 (Ali's pick). The old line — "look as good as
   * they already are" — sold perception only. This one carries both
   * promises the business is actually being hired for: a brand that is
   * remembered, and a site that turns a visitor into a customer. Nine
   * words instead of eleven, which is what lets the type set larger and
   * is half the fix for the mobile hero's dead space.
   *
   * Deliberately NOT "brands people remember" — that is the reference
   * site's own headline, and a prospect who recognises the line has just
   * learned something about Ali that the rest of the page then has to
   * argue against.
   *
   * Breaks: three complete phrases. No line holds a single word, and no
   * break falls inside a noun phrase.
   */
  hero: {
    tokens: [
      { kind: "text", value: "I make businesses" },
      /*
        Two stills, not four. The fourth used to orphan at the end of a
        line and read as tacked on, and at four they were each too small
        to actually be seen at hero scale — which defeats the point of
        putting real work inside the sentence at all.
      */
      {
        kind: "chips",
        images: [
          {
            src: "/work/petrolas/campaign-plastic.jpg",
            alt: "Petrolas campaign poster",
            form: "plate",
          },
          {
            src: "/work/petrolas/booth.jpg",
            alt: "Petrolas exhibition booth",
            form: "bleed",
          },
        ],
      },
      { kind: "break" },
      /*
        The gesture leads the first promise rather than the second. It sat
        on the last line to begin with, where it shared the row with the
        longest phrase in the sentence and pushed "from." onto a line of
        its own — a single orphaned word, which is the one thing the break
        rules above forbid outright.
      */
      { kind: "arrow" },
      { kind: "text", value: "easy to remember" },
      { kind: "break" },
      { kind: "text", value: "and easy to buy from." },
    ],
    sub: "Brand identity, websites, and social media design — made and run by one person, end to end.",
    cta: { label: "Start a project", href: "#contact" },
    secondary: { label: "See the work", href: "#work" },
  },

  loader: {
    words: [
      { text: "BRAND", palette: "orange" },
      { text: "WEB", palette: "lime" },
      { text: "CAMPAIGN", palette: "violet" },
    ],
    fragments: [
      "/hero/petrolas-branding.jpg",
      "/work/petrolas/hoarding-wide.jpg",
      "/work/petrolas/booth.jpg",
    ],
  },

  lobby: {
    scrollLabel: "Scroll",
    counterLabel: "selected works",
    pendingLabel: "Cover in production",
    assetsPendingLabel: "Imagery in production",
    location: "Manama, Bahrain",
    availability: "Taking on new work",
  },

  /**
   * The two projects on the homepage's featured cards, in order.
   *
   * Stated explicitly rather than derived. The first version sorted by
   * "has cover art, then source order", which quietly made Delivery
   * Point the second card — a rule that picks for you is a rule that
   * picks wrong the moment the data shifts, and which of two projects
   * leads the homepage is an editorial decision, not a computed one.
   *
   * Slugs must match entries in `projects`; anything that does not is
   * dropped rather than rendered as a gap.
   */
  featuredWork: ["petrolas", "qobban"],

  /*
   * Five entries. Petrolas is complete — cover, metadata, and a full case
   * study. The rest are real engagements Ali named, listed honestly with
   * their cover art still to come: a designed pending state, never a
   * borrowed image or an invented client. Disciplines and sectors stay
   * empty until Ali confirms them; guessing them would be inventing
   * scope on a real client's behalf.
   */
  projects: [
    {
      slug: "petrolas",
      name: "Petrolas",
      palette: "blue",
      disciplines: ["Branding", "Websites"],
      year: "2026",
      sector: "Energy & sustainability",
      summary:
        "A conventional energy business repositioning toward clean energy — given an identity, campaigns, and a digital presence that match where it is actually headed.",
      /*
        Changed 2026-08-10 from campaign-plastic.jpg.

        That poster is 418x627 — portrait, and small. Every card that
        shows a cover is landscape, so it was being centre-cropped to
        about 45% of itself AND upscaled: on the new full-width featured
        card it ran at 2.7x its own resolution with the word TURNING
        sliced in half. This one is 2400x1340, lands within a few percent
        of every card ratio it has to fill, and shows the identity
        applied to something real rather than a poster of it.

        The poster is not lost: it is still the first hero still, and it
        still runs inside the case study.
      */
      cover: {
        src: "/work/petrolas/fleet-systems.jpg",
        alt: "Petrolas identity applied to a tanker in the company's blue and white",
        form: "bleed",
      },
      /*
        The stand, not the tanker, on the square featured card. The
        tanker is a long horizontal object and loses both ends at 1:1;
        the stand is composed around a centred logo, so a square crop
        lands on the mark and the reception desk rather than cutting
        through the subject.

        It also appears in the showcase directly above. Unavoidable while
        Petrolas is the only project with imagery — the fix is cover art
        for a second client, not a weaker image here.
      */
      feature: {
        src: "/work/petrolas/booth.jpg",
        alt: "Petrolas exhibition stand, identity applied at trade-show scale",
        form: "bleed",
      },
      spreads: [
        {
          id: "identity",
          label: "01 — Brand identity",
          title: "IDENTITY",
          note: "Mark, colour, type, and voice — built to hold from a business card to a trade-show hall without losing itself.",
          layout: "bleed-plate",
          aperture: { src: "/hero/petrolas-branding.jpg", position: "50% 45%" },
          assets: [
            {
              src: "/work/petrolas/booth.jpg",
              alt: "Petrolas exhibition booth staffed and busy with visitors, the full identity applied at trade-show scale",
              form: "bleed",
            },
            {
              src: "/work/petrolas/brand-guidelines.jpg",
              alt: "Petrolas brand guidelines page detailing the primary, secondary, and accent colour system",
              form: "plate",
            },
          ],
        },
        {
          id: "campaign",
          label: "02 — Campaign",
          title: "CAMPAIGN",
          note: "One argument, carried across every format the business actually buys — not three unrelated adverts.",
          layout: "plates",
          aperture: { src: "/work/petrolas/campaign-plastic.jpg", position: "70% 50%" },
          assets: [
            {
              src: "/work/petrolas/campaign-plastic.jpg",
              alt: "Petrolas campaign poster: Turning plastic into possibility",
              form: "plate",
            },
            {
              src: "/work/petrolas/campaign-waste-fuel.jpg",
              alt: "Petrolas campaign poster: Waste today. Fuel tomorrow.",
              form: "plate",
            },
            {
              src: "/work/petrolas/refinery.jpg",
              alt: "Petrolas campaign poster: Built for a cleaner future, over the refining facility",
              form: "plate",
            },
          ],
        },
        {
          id: "environment",
          label: "03 — Environmental",
          title: "PLACE",
          note: "The identity had to survive outside a browser — on a hoarding, on a fleet, wherever the business physically shows up.",
          layout: "bleeds",
          assets: [
            {
              src: "/work/petrolas/hoarding-wide.jpg",
              alt: "Petrolas construction hoarding with connected circuit-line graphics reading Powering progress. Fueling tomorrow.",
              form: "bleed",
            },
            {
              src: "/work/petrolas/fleet-systems.jpg",
              alt: "Petrolas-branded tanker truck with a connected circuit graphic along its tank",
              form: "bleed",
            },
            {
              src: "/work/petrolas/ev-charging.jpg",
              alt: "Petrolas-branded EV charging station reading From waste to what moves us forward",
              form: "bleed",
            },
          ],
          aperture: { src: "/work/petrolas/hoarding-wide.jpg", position: "38% 50%" },
        },
        {
          id: "digital",
          label: "04 — Digital",
          title: "SCREEN",
          note: "The same language carried into screens — social, site, and a live operations view built in the identity, not beside it.",
          layout: "bleed-plate",
          aperture: { src: "/hero/petrolas-digital.jpg", position: "55% 45%" },
          assets: [
            {
              src: "/work/petrolas/dashboard.jpg",
              alt: "Petrolas operations dashboard interface showing live production and feedstock data",
              form: "bleed",
            },
            {
              src: "/work/petrolas/loop-diagram.jpg",
              alt: "Petrolas diagram showing the loop from plastic waste through refining to clean fuel",
              form: "plate",
            },
          ],
        },
      ],
    },
    /*
      The five without case studies. Disciplines, sectors and summaries are
      Ali's own account of each engagement, supplied 2026-08-06 — not
      inferred from the artwork. Years stay "—" because he has not given
      them; a plausible-looking date is still an invented one.
    */
    {
      slug: "delivery-point",
      name: "Delivery Point",
      palette: "lime",
      disciplines: ["Branding", "Strategy"],
      year: "—",
      sector: "Logistics",
      summary:
        "A major Bahraini logistics company competing against regional and international carriers — given a position, a brand system, and a marketing plan built from market and competitor analysis.",
      /*
        Written 2026-08-06 from Ali's account. The reach and sales figures
        below are the client's own reported numbers, stated as
        approximate, and carry her caveat: the proposed three-month plan
        was not completed, so they describe the implemented period only.
        Stating that is what makes the rest of the page believable.

        Assets to come in `public/work/delivery-point/`.
      */
      spreads: [
        {
          id: "position",
          label: "01 — Positioning",
          title: "POSITION",
          note: "Competing against regional and international carriers, the problem was never capability — it was that the scale of the business did not show. Market, competitor and SWOT analysis first, design second.",
          layout: "bleed-plate",
          assets: [],
        },
        {
          id: "identity",
          label: "02 — Brand system",
          title: "SYSTEM",
          note: "One identity across the fleet, the packaging, the tracking interface and the paperwork — the four places a logistics customer actually meets the company, made to look like one business.",
          layout: "bleeds",
          assets: [],
        },
        {
          id: "campaign",
          label: "03 — Marketing",
          title: "REACH",
          note: "Branding and marketing planned as one system rather than two briefs. During the first month of implementation the client reported reach up approximately 20% and sales up approximately 5%. The full three-month plan was not completed; those figures cover the implemented period.",
          layout: "plates",
          assets: [],
        },
      ],
    },
    {
      slug: "kids-island",
      name: "Kids Island",
      palette: "sun",
      disciplines: ["Branding", "Social & campaigns"],
      year: "—",
      sector: "Family entertainment",
      summary:
        "A business with no consistent identity and almost no social presence — given a recognisable brand, a managed social channel, and advertising that brought enquiries in.",
    },
    {
      slug: "qobban",
      name: "Qobban",
      palette: "violet",
      disciplines: ["Branding", "Websites"],
      year: "—",
      sector: "Fabrication & metalwork",
      summary:
        "A fabrication and welding workshop that read as a general workshop — repositioned with a full identity across the premises, the marketing, and the website.",
      /*
        Written 2026-08-06 from Ali's account of the engagement. The
        assets have not been delivered yet, so each spread renders its
        label, title and note over a pending panel. When the files land
        they go in `public/work/qobban/` and get added here — the page
        does not change shape.
      */
      spreads: [
        {
          id: "identity",
          label: "01 — Brand identity",
          title: "MARK",
          note: "A letter Q built around a spirit level: the tool the trade actually measures with, made into the thing the business is recognised by. Precision as a mark rather than a promise.",
          layout: "bleed-plate",
          assets: [],
        },
        {
          id: "workshop",
          label: "02 — Premises & fleet",
          /* Not "PLACE" — Petrolas already owns that word, and a spread
             title is the loudest thing on its page. Repeating it makes two
             projects read as one template. */
          title: "STREET",
          note: "The identity had to survive where the work happens — signage, workwear, the vehicles. For a workshop the van in the street is the advert, so it was designed as one.",
          layout: "bleeds",
          assets: [],
        },
        {
          id: "digital",
          label: "03 — Website",
          title: "SITE",
          note: "A site that shows the craft rather than listing services: fabrication, welding, architectural metalwork and maintenance, presented so a client can tell the standard before they call.",
          layout: "plates",
          assets: [],
        },
      ],
    },
    {
      slug: "nextshoot",
      name: "Nextshoot",
      palette: "teal",
      disciplines: ["Branding"],
      year: "—",
      sector: "Creative agency",
      summary:
        "A creative agency presenting itself through templates — rebuilt around a distinctive identity and a results-driven presentation system that reads premium without losing its personality.",
    },
    {
      slug: "shawarma-and-sauce",
      name: "Shawarma & Sauce",
      palette: "orange",
      disciplines: ["Branding", "Packaging"],
      year: "—",
      sector: "Food & beverage",
      summary:
        "A shawarma business that needed to taste like something before you ate it — an identity carried through packaging and uniforms so the promise of quality and generous portions shows up at the counter.",
    },
  ],

  services: {
    label: "What I do",
    heading: "Three things, done properly.",
    items: [
      {
        index: "01",
        name: "Branding",
        palette: "orange",
        outcome: "Look as credible as you already are.",
        scope: [
          "Brand strategy & positioning",
          "Visual identity & logo systems",
          "Art direction",
          "Guidelines & applications",
          "Campaign direction",
        ],
        from: "From BHD 250",
      },
      {
        index: "02",
        name: "Websites",
        palette: "blue",
        outcome: "Turn attention into enquiries.",
        scope: [
          "Website strategy",
          "UX & UI design",
          "Design & build, end to end",
          "Responsive implementation",
          "Launch support",
        ],
        /* Design AND development — the 400 covers both, which is the
           whole "one person, end to end" argument priced. */
        from: "From BHD 400",
      },
      {
        index: "03",
        name: "Social media design",
        palette: "lime",
        outcome: "Look like yourself every time you post.",
        scope: [
          "Social brand system & templates",
          "Content & art direction",
          "Campaign & advertising creative",
          "Social media management",
          "Launch campaigns",
        ],
        from: "From BHD 100",
      },
    ],
  },

  showcase: {
    label: "Selected work",
    heading: "Proof, one frame at a time.",
    frames: [
      {
        image: {
          src: "/work/petrolas/booth.jpg",
          alt: "Petrolas exhibition booth with the full identity applied at trade-show scale",
          form: "bleed",
        },
        caption: "Identity, applied at trade-show scale",
        project: "Petrolas",
      },
      {
        image: {
          src: "/work/petrolas/hoarding-wide.jpg",
          alt: "Petrolas construction hoarding with connected circuit-line graphics",
          form: "bleed",
        },
        caption: "Environmental graphics, on site",
        project: "Petrolas",
      },
      {
        image: {
          src: "/work/petrolas/dashboard.jpg",
          alt: "Petrolas operations dashboard showing live production data",
          form: "bleed",
        },
        caption: "Operations dashboard, built in the identity",
        project: "Petrolas",
      },
      {
        image: {
          src: "/hero/petrolas-digital.jpg",
          alt: "Phone on a stone plinth showing Petrolas social content",
          form: "bleed",
        },
        caption: "Social and digital, same language",
        project: "Petrolas",
      },
    ],
  },


  /*
    Real people, real titles, permission confirmed 2026-08-06; attributions
    corrected 2026-08-06 after the first pass carried Ali's own project role
    in the client's title field.

    `role` is the SPEAKER's position — never Ali's role on the project.
    Zainab Mohamed's title is unconfirmed, so her line carries her company
    and nothing else. A plausible title is still a fabricated one.

    Qobban's quote is held for its own case-study page: Mohammed Mahdi
    speaks for two of these companies, and running him twice in one band
    reads as a shortage of clients rather than a repeat one.
  */
  testimonials: [
    {
      quote:
        "Ali built Petrolas into a clear, recognizable brand across every physical and digital touchpoint. His research-led, precise execution helped us launch with confidence, strengthen awareness, and attract valuable supporters and investors.",
      name: "Mohammed Mahdi",
      role: "CEO, Petrolas",
      project: "petrolas",
      emphasis: ["clear, recognizable brand", "attract valuable supporters and investors"],
    },
    {
      quote:
        "Ali gave Delivery Point a clearer and more competitive position in the logistics market. His branding and marketing strategy helped differentiate us locally and internationally, increased our reach by approximately 20%, and contributed to approximately 5% sales growth in the first month.",
      name: "Zainab Mohamed",
      /* Supplied by Ali 2026-08-10. Until now this read "Delivery Point"
         — the company, not a job title — which sat beside "CEO, Kids
         Island" and "CEO, Nextshoot" and made the one quote carrying
         real numbers look like the least sourced on the page. */
      role: "Marketing Manager, Delivery Point",
      project: "delivery-point",
      emphasis: [
        "increased our reach by approximately 20%",
        "approximately 5% sales growth in the first month",
      ],
      /* Ali's own wording, already carried on the case-study spread. The
         figures are the client's, and the caveat is what makes them
         believable — it must not be the part that stays behind. */
      caveat:
        "The full three-month plan was not completed; those figures cover the implemented period.",
    },
    {
      quote:
        "Ali created a distinctive identity that captures Shawarma & Sauce’s focus on great taste, quality, and generous family portions. His work made a major difference in how the brand stands out and helped build stronger customer trust.",
      name: "Qassim Jalal",
      role: "CEO, Shawarma & Sauce",
      project: "shawarma-and-sauce",
      emphasis: ["a major difference in how the brand stands out", "stronger customer trust"],
    },
    {
      quote:
        "Ali helped transform Kids Island into a recognizable brand with a strong social presence. His branding and campaign work gave the business a clearer identity and contributed to stronger customer enquiries.",
      name: "A. Hussain Ahmed Ali",
      role: "CEO, Kids Island",
      project: "kids-island",
      emphasis: ["a recognizable brand with a strong social presence", "stronger customer enquiries"],
    },
    {
      quote:
        "Ali gave Nextshoot a more distinctive and premium identity, replacing its previous template-driven presentation with a clear, results-focused brand system. The rebrand strengthened trust and positioned us competitively without losing the personality of working with Nextshoot.",
      name: "Ali Alhaddar",
      role: "CEO, Nextshoot",
      project: "nextshoot",
      emphasis: ["more distinctive and premium identity", "strengthened trust and positioned us competitively"],
    },
  ],

  promise: {
    label: "The promise",
    heading: "What changes for your business.",
    items: [
      {
        outcome: "People remember who you are.",
        body: "One identity, used the same way everywhere you appear — so someone who runs into you twice knows it is you both times. Recognition is the cheapest advantage a small business can buy, and most are still paying full price for the lack of it.",
      },
      {
        outcome: "Your website starts doing the selling.",
        body: "It stops being a brochure you send people to and starts answering the things that were quietly stopping them. Fewer reasons to leave means more of the people who arrive actually get in touch.",
      },
      {
        outcome: "The enquiries get better, not just more.",
        body: "Saying clearly what you do filters as much as it attracts. The people who write to you already understand the work and what it is worth, so the conversation starts further along.",
      },
    ],
  },

  notes: {
    label: "Point of view",
    heading: "What I actually believe about this.",
    items: [
      {
        tag: "Branding",
        title: "Most businesses look worse than they are.",
        dek: "The gap between how good a business actually is and how good it looks is the cheapest gap in business to close — and the one that costs the most while it stays open.",
      },
      {
        tag: "Websites",
        title: "A website’s job is to remove doubt.",
        dek: "Nobody reads a homepage. They scan it for reasons to leave. Design is mostly the work of removing those reasons one at a time.",
      },
      {
        tag: "Social",
        title: "Social media is the brand, not an advert for it.",
        dek: "For most small businesses the feed is the only place a customer ever sees them. Post by post it is either building something recognisable or quietly spending it.",
      },
    ],
  },

  studio: {
    eyebrow: "Studio",
    heading: "You'd be working with me. Just me.",
    /*
      CUT to two short paragraphs 2026-08-10 (Ali's direction: smaller,
      simpler, to the point). The third paragraph explained the argument
      the second one had already made — "fewer people between the idea
      and the thing" is the same sentence as "nothing gets lost in
      translation", said again more slowly.

      What is left is the claim and the reason for it. The facts that
      were buried in the prose now sit in `highlights`, where they can be
      scanned instead of read.
    */
    bio: [
      "I'm Ali. I design brands, websites and social media for small and growing businesses in Bahrain.",
      "I work alone, end to end. The person you brief is the person who designs it and the person who builds it — so nothing gets lost between a designer and a developer, and one person is accountable for whether it works.",
    ],
    /*
      Facts, not claims — each one is checkable against this site.

      NO YEARS OF EXPERIENCE. It is the number a page like this usually
      leads with, and it is the one number Ali has not given. An
      approximate one here would be the same invention the brief forbids
      everywhere else.
    */
    highlights: [
      { value: "6", label: "brands built, end to end" },
      { value: "6", label: "sectors, logistics to food" },
      /* A figure, not the phrase "Brand · Web · Social". Set at the same
         size as the numbers beside it, that phrase ran to two lines and
         broke the row's rhythm — three values that scan as one rank have
         to be the same kind of thing. The disciplines are still named,
         in the label where they are read rather than counted. */
      { value: "3", label: "disciplines: brand, web, social" },
    ],
    badge: {
      name: "Ali Aljardabi",
      role: "Brand, Web & Social",
      location: "Manama, Bahrain",
      /*
        Supplied by Ali 2026-08-10. Cropped square to head-and-shoulders
        and re-encoded as JPEG — the original is a 5MB full-length PNG,
        which is ~40x the bytes and, squared from the full frame, put his
        face at about a fifth of the card.

        `mark` is still absent: the logo is drawn in code until a real
        SVG exists, and a client's or one's own mark is not something to
        approximate.
      */
      photo: "/studio/ali.jpg",
    },
    /* Confirmed by Ali 2026-08-10. */
    process: [
      {
        step: "01",
        title: "A conversation",
        body: "A call about the business — where it's going, who it's for, and what's getting in the way. Not a pitch.",
      },
      {
        step: "02",
        title: "Direction",
        body: "Positioning and visual direction agreed before anything is designed, so the work is judged against a decision rather than a taste.",
      },
      {
        step: "03",
        title: "Design and build",
        body: "Designed and built together rather than thrown over a wall — which is why it ends up looking like the design instead of an approximation of it.",
      },
      {
        step: "04",
        title: "Launch and after",
        body: "Handover, and a period of support while it settles. You own everything.",
      },
    ],
  },

  contact: {
    label: "Contact",
    heading: "Tell me what you're building.",
    email: "alialjardabi@gmail.com",
    body: "A first conversation is a conversation — what the business is, where it's going, and whether the way it looks is keeping up.",
    /* +973 35665422, Bahrain. Digits only for wa.me. */
    whatsapp: "97335665422",
    /* Ali's brand account (2026-08-10). If this handle changes, every
       copy of the link already sent in a DM breaks — change it here and
       nowhere else. */
    instagram: "the_brandgrid",
  },
};
