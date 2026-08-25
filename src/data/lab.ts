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
  /**
   * Which bento cell this belongs in, 1-indexed. READ ONLY BY THE BENTO
   * LAYOUT; every other layout is positional and ignores it.
   *
   * It exists because a bento's slots are not interchangeable — a 9:16
   * cell and a 16:9 cell want different photographs — so "the billboard
   * goes in 01" has to be sayable without padding the array with
   * placeholders for the slots that are still empty.
   */
  slot?: number;
  /**
   * An escape hatch, not a default.
   *
   * Layouts declare their own cell shapes so a composition stays a
   * composition — and the bento is shared by every project that uses it,
   * so a cell cannot be re-cut for one of them without moving the other.
   * This lets a single asset keep its own ratio where the cell would
   * otherwise destroy it: a 3:2 palette board cropped into a square
   * loses its end swatches, and no amount of good layout is worth that.
   *
   * Use it when the material demands it. Reach for it for every asset
   * and the grid stops being designed.
   */
  ratio?: string;
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

/**
 * One exhibit on the museum screen.
 *
 * A discriminated union rather than an optional `video` field, because
 * the two need different markup — a poster frame is meaningless on a
 * still, and `alt` on a <video> is not a thing. The screen switches on
 * `kind` and nothing has to guess.
 *
 * Both are wanted: Jitter exports MP4 loops AND animated stills, and a
 * showreel that can only take one of them would decide Ali's asset
 * pipeline for him.
 */
export type LabMedia =
  | { kind: "image"; src: string; alt: string }
  | {
      kind: "video";
      src: string;
      /**
       * REQUIRED on video, not optional. A muted autoplaying loop shows
       * nothing at all until it has buffered, and a blank screen in the
       * middle of a dark room reads as broken rather than as loading.
       */
      poster: string;
      /** Described in text, because a <video> is invisible to a reader. */
      alt: string;
    };

/**
 * The social band: three formats, each with its own ratio and its own
 * job. Posts loop, stories sit in a row, films play.
 *
 * Separate arrays rather than one list with a `ratio` field, because the
 * three are laid out differently and a component that had to sort a
 * mixed list into three buckets would be doing at render what the
 * content layer can just state.
 *
 * Every entry is a LabMedia, so a still and a video are the same kind of
 * thing here — a campaign is both, and a shape that only took images
 * would decide that for Ali.
 */
export interface LabShowreel {
  /** 4:5. Six is what makes the rail read as continuous. */
  posts: LabMedia[];
  /** 9:16, up to five. */
  stories: LabMedia[];
  /** 16:9. */
  films: LabMedia[];
}

/**
 * A site that is live right now, shown in browser chrome.
 *
 * The URL is the point. Everything else on a portfolio is a claim about
 * work the visitor has to take on trust; this is the one thing they can
 * check in a single click, so it is stated rather than implied.
 */
export interface LabSite {
  url: string;
  /** The link's own words — never a bare "visit site". */
  label: string;
  desktop: LabAsset;
  /** Optional. A responsive build is one design at two sizes. */
  mobile?: LabAsset;
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
  layout: "bleed-plate" | "bleed-plates" | "plates" | "bleeds" | "bento";
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
  /**
   * Present only where the project shipped a site that is live. Renders
   * above this spread's assets, in browser chrome, with a link out.
   */
  site?: LabSite;
  /**
   * Present only on a spread whose job is the social output. Replaces
   * the asset layouts entirely — posts, stories and films are three
   * ratios that a `bleeds` or `plates` grid cannot hold together.
   */
  showreel?: LabShowreel;
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
  | "sun"
  | "amber";

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
  /**
   * The site Ali built for this client, if it is live.
   *
   * Set here rather than derived from a spread's `site`, because the two
   * answer different questions: a spread's site is evidence inside a
   * case study, and this is where the featured card SENDS you. Ali's
   * call 2026-08-12 — press a card on the homepage and you land on the
   * real thing, not on a page about it. The branding and the rest of the
   * assets are what /work is for.
   */
  live?: string;
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
  /**
   * The offer Ali wants led with (2026-08-24). Exactly one should carry
   * it — a page where everything is featured has featured nothing.
   */
  featured?: boolean;
  /** The business outcome, in the client's own words — not the deliverable. */
  outcome: string;
  scope: string[];
  /**
   * THE MOBILE FOLD (Ali, 2026-08-24 — variant A, promoted).
   *
   * On a phone the hero shows each service as a card: the outcome with
   * one word carrying the service's colour, and two pieces of real work
   * beneath it. Measured before this existed, the first price on the
   * mobile homepage was 9.4 screens down and nothing above the fold said
   * what was for sale.
   *
   * `keyword` must appear verbatim in `outcome` — it is found by string
   * match, and a miss simply leaves the line unhighlighted.
   *
   * `shotRatio` is the pair's shared native ratio. Both shots are cut to
   * it before they ship, so the tile never trims anything at runtime.
   * `poster` marks a shot as film.
   */
  fold?: {
    keyword: string;
    shotRatio: string;
    shots: { src: string; alt: string; poster?: string }[];
  };
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

export interface LabContent {
  identity: string;
  /** The single line that says what this is. Nothing more on the lobby. */
  descriptor: string;
  navLinks: { label: string; href: string }[];
  navCta: { label: string; href: string };

  /*
    THE OPENING (Ali, 2026-08-19) — a visual test adapted from noth.in.

    The structure is borrowed; the words are not. Every line here is
    written for Ali in his own register, first person, no agency voice.
    The reference's own headline copy is its property in a way its
    layout conventions are not, and this site's whole argument is that
    it was made for this business rather than filled in from a template.
  */
  opening: {
    /** Two compact lines, upper left. */
    lede: string[];
    cta: string;
    /** Set as one line, sized to fill the screen. No spaces. */
    wordmark: string;
    role: string;
    showreel: {
      statement: string[];
      film: { src: string; poster: string; alt: string };
      label: string;
      body: string;
    };
    works: {
      title: string;
      statement: string[];
      mark: string;
    };
  };

  hero: {
    /** Hand-broken lines of one claim, set as a statement in the room. */
    statement: string[];
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

  /**
   * The museum screen under the hero: one screen in a dark room, pinned
   * while the page scrolls, cutting between exhibits.
   *
   * Replaced the stacked-card showcase 2026-08-12 (Ali's call). Frames
   * take `media` rather than `image` so a reel and a still are the same
   * kind of thing to this section — the Jitter exports drop in beside
   * the photographs without the component changing shape.
   */
  showcase: {
    label: string;
    heading: string;
    frames: { media: LabMedia; caption: string; project: string }[];
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
   * No `process` and no `cta` any more. The process section was cut on
   * 2026-08-12 — it had been a card row, a scroll stepper and a
   * press-through stepper, and none of them answered what a client
   * actually asks. The one durable line moved into the services index,
   * beside the prices. The steps themselves are in git if they are ever
   * wanted back.
   */
  studio: {
    eyebrow: string;
    heading: string;
    bio: string[];
    /** Scannable facts beside the bio — never an invented figure. */
    highlights: { value: string; label: string }[];
    badge: { name: string; role: string; location: string; photo?: string; mark?: string };
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

  opening: {
    lede: ["Not a style. A standard.", "Because I design it, then I build it."],
    /* "Start a project" rather than the reference's "Book a call" — it is
       the CTA every other page on this site already uses, and a second
       name for the same action is a second thing to remember. */
    cta: "Start a project",
    wordmark: "ALIALJARDABI",
    role: "Independent designer — Manama, Bahrain",
    showreel: {
      statement: ["Anyone can post more.", "Fewer can make it worth seeing."],
      film: {
        src: "/reel/fragrance.mp4",
        poster: "/reel/fragrance.jpg",
        alt: "A burgundy fragrance bottle wrapped in a gold serpent, in candlelight",
      },
      label: "( The long look )",
      body: "Most of this work is decided before anything is drawn. What the business actually sells, who is already buying, and what a stranger reads in the first four seconds. The design is the last step, and it is short, because by then there is only one sensible answer.",
    },
    works: {
      title: "WORKS",
      statement: ["Being remembered", "is cheaper than being advertised."],
      mark: "MMXXVI · MANAMA",
    },
  },

  /*
    POSITIONING CHANGED 2026-08-06 (Ali's call): social media design
    replaces web & app products across the site. The claim lived in seven
    places — this descriptor, the hero's supporting line, the loader's
    three words, both page titles, the studio bio and the badge role — and
    a page that animates the word PRODUCT on entry while offering
    something else at the services index reads as out of date.
  */
  descriptor: "Brand, Web & Marketing",
  /* Absolute, not bare fragments: the same header renders on case-study
     pages, where "#services" would resolve to nothing. */
  navLinks: [
    /* /work, not /#work: the homepage now shows only the projects with
       finished imagery, so "Work" in the nav has to reach the index
       rather than the two-card sample of it. */
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  /* The button says "Start a project", so it goes to the brief rather
     than to a contact section further down the homepage. /start was
     built and then left unreachable when /services reverted. */
  navCta: { label: "Start a project", href: "/start" },

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
    /*
      THE CLAIM SURVIVED; THE COMPOSITION DID NOT (2026-08-17).

      This used to be a token array — text, inline stills, a hand-drawn
      arrow, hand-placed breaks — which composed the spoken sentence the
      hero was built around. That composition was upsunday.co's, and
      running three of their devices at once is why the page read as
      borrowed no matter how the words were edited.

      The words are Ali's and they are good, so they are unchanged. They
      are simply set as a statement in the room now, in the same uppercase
      voice as /services and /about, instead of as a sentence with
      pictures in it.

      Hand-broken, under the same two rules as before: never leave one
      word alone on a line, and never break inside a noun phrase. Each
      line below is a complete phrase.
    */
    statement: ["I make businesses", "easy to remember", "and easy to buy from."],
    sub: "Brand identity, websites, and advertising — made and run by one person, end to end.",
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
      /* Preview deployment — swap for the production domain when there
         is one. This is the link the homepage card sends people to. */
      live: "https://petrolas-v2-git-feature-process-ignition-redesign-ali-aljardabi.vercel.app/",
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
        Replaced 2026-08-14 with Ali's own presentation mockup — the
        Petrolas site on a laptop, shot on a blue bench in a dark room.
        Matches what Qobban's card does, and for the same reason: the two
        sit side by side on the homepage, and a pair of presentation
        mockups reads as a portfolio while a trade-show photograph next
        to a laptop reads as two unrelated things.

        Cropped from 1448x1086 to a 1086 square starting at x=117 rather
        than a centred x=181 — that centres the LAPTOP rather than the
        frame, which keeps the machine whole and drops the amber glass
        prop instead of slicing it.

        The stand is not lost: booth.jpg still opens the identity spread
        inside the case study.
      */
      feature: {
        src: "/work/petrolas/cover-laptop-v2.jpg",
        alt: "The Petrolas website on a laptop set on blue velvet in a dark room, its headline reading Waste is not the end. It is potential.",
        form: "bleed",
      },
      spreads: [
        /*
          THE FIVE ROLES (Ali, 2026-08-19). Every case study now reads in
          the same order, and each project keeps its own words for them:

            1  the mark        — what the business is recognised by
            2  the system      — palette, type, and the mark applied
            3  the campaign    — the identity spent on an audience
            4  the screen      — the site
            5  the place       — where the business physically shows up

          The SEQUENCE is unified; the VOCABULARY is not. Three case
          studies using the same five words would read as one template
          filled in three times, which is the opposite of what this site
          is arguing. Petrolas keeps IDENTITY, SYSTEM, CAMPAIGN, SCREEN
          and PLACE; Qobban keeps MARK, BRANDING, SOCIAL, SITE, STREET.

          Empty cells are labelled with the shape that belongs in them,
          so the composition can be judged before the files exist.
        */
        {
          id: "identity",
          label: "01 — Brand identity",
          title: "IDENTITY",
          note: "Mark, colour, type, and voice — built to hold from a business card to a trade-show hall without losing itself.",
          layout: "bleeds",
          /* Each keeps its own shape: a 16:9 board squeezed into the
             layout's 4:3 would lose a quarter of its width, and the
             square gadget shot would lose its edges. */
          assets: [
            {
              src: "/work/petrolas/identity-mark.jpg",
              alt: "The Petrolas mark and its construction — the drop and the connected circuit, set out on a dark board",
              form: "bleed",
            },
            {
              src: "/work/petrolas/identity-board.jpg",
              alt: "The Petrolas identity applied across a spread of brand surfaces",
              form: "bleed",
              ratio: "aspect-[16/9]",
            },
            {
              src: "/work/petrolas/identity-gadget.jpg",
              alt: "The Petrolas mark on a device screen",
              form: "bleed",
              ratio: "aspect-square",
            },
          ],
        },
        {
          id: "system",
          label: "02 — Brand system",
          title: "SYSTEM",
          note: "A mark is one shape. A system is what makes it usable everywhere — the palette, the type, and the rules that hold them together across every surface the business puts its name on.",
          layout: "bento",
          /*
            The guidelines page takes slot 01 because it is the one asset
            here that IS the system rather than an application of it.
            Everything else is labelled and waiting.
          */
          assets: [
            {
              slot: 1,
              src: "/work/petrolas/system-pump.jpg",
              alt: "A Petrolas fuel pump carrying the identity",
              form: "bleed",
              ratio: "aspect-[4/3]",
            },
            {
              slot: 2,
              src: "/work/petrolas/system-packaging.jpg",
              alt: "A five-litre Petrolas Syntech 5W-30 engine oil bottle, the identity carried onto packaging",
              form: "bleed",
            },
            {
              slot: 3,
              src: "/work/petrolas/system-palette.jpg",
              alt: "The Petrolas palette, its blues set out with their values",
              form: "bleed",
              ratio: "aspect-[3/2]",
            },
            {
              slot: 4,
              src: "/work/petrolas/system-type.jpg",
              alt: "The Petrolas type specimen — the grotesque and the serif italic that answers it",
              form: "bleed",
            },
            {
              /* 0.73 against the cell's 0.75 — a three per cent trim, so
                 it takes the cell as it is rather than spending the
                 ratio override on a crop nobody can see. */
              slot: 5,
              src: "/work/petrolas/system-idcard.jpg",
              alt: "A Petrolas staff ID card on a branded lanyard",
              form: "bleed",
            },
            {
              slot: 7,
              src: "/work/petrolas/system-favicon.jpg",
              alt: "The Petrolas mark as a browser favicon beside the address bar",
              form: "bleed",
              ratio: "aspect-[4/3]",
            },
            {
              /* 2.5 is a panorama, and the width is the whole point of a
                 wayfinding set read left to right — so the ratio travels
                 with the image rather than with the cell. */
              slot: 8,
              src: "/work/petrolas/system-wayfinding.jpg",
              alt: "The Petrolas wayfinding set — visitor parking, innovation lab, a numbered department directory and an exit sign",
              form: "bleed",
              ratio: "aspect-[5/2]",
            },
            {
              /* 1.33 into cell 09's 4:3 — an exact fit, no override. */
              slot: 9,
              src: "/work/petrolas/system-station.jpg",
              alt: "A Petrolas service station — the canopy, the pumps and the shopfront carrying the identity",
              form: "bleed",
            },
            {
              /* 5:4 into the cell's 3:2 would take seventeen per cent off
                 the sides, and the figures sit near them. */
              slot: 10,
              src: "/work/petrolas/system-stats.jpg",
              alt: "A Petrolas statistics board — the identity applied to figures and charts",
              form: "bleed",
              ratio: "aspect-[5/4]",
            },
            {
              /* 0.78 against the cell's 0.75 — under four per cent, so it
                 takes the cell rather than spending the override. */
              slot: 6,
              src: "/work/petrolas/system-signpanel.jpg",
              alt: "A hand holding an illuminated acrylic sign panel with the Petrolas mark glowing through it",
              form: "bleed",
            },
          ],
        },
        {
          id: "campaign",
          label: "03 — Campaign",
          title: "CAMPAIGN",
          note: "One argument, carried across every format the business actually buys — not three unrelated adverts.",
          /* A holding shape (Ali, 2026-08-22) — the lead card and three
             posts now, a fuller campaign layout once the rest of the
             mockups exist. */
          layout: "bleed-plates",
          assets: [
            {
              src: "/work/petrolas/campaign-hero.jpg",
              alt: "The Petrolas campaign key visual",
              form: "bleed",
              ratio: "aspect-[4/3]",
            },
            {
              src: "/work/petrolas/campaign-post-01.jpg",
              alt: "A Petrolas campaign post",
              form: "plate",
              ratio: "aspect-[3/4]",
            },
            {
              src: "/work/petrolas/campaign-post-02.jpg",
              alt: "A Petrolas campaign post",
              form: "plate",
              ratio: "aspect-[3/4]",
            },
            {
              src: "/work/petrolas/campaign-post-03.jpg",
              alt: "A Petrolas campaign post",
              form: "plate",
              ratio: "aspect-[3/4]",
            },
          ],
        },
        {
          id: "digital",
          label: "04 — Digital",
          title: "SCREEN",
          note: "The same language carried into screens — social, site, and a live operations view built in the identity, not beside it. The partnership page is the argument at its sharpest: a serif italic against the grotesque, and a brief set as a document rather than a pitch.",
          layout: "plates",
          /* Captured from the live build 2026-08-12, at Ali's
             instruction. The URL is a preview deployment, so it is the
             one link on this site that can rot — swap it for the
             production domain the moment Petrolas has one. */
          site: {
            /* The frame shows the landing page now, so the address bar
               and the link have to say so — a browser chrome captioned
               with a page it is not showing is a small lie in the middle
               of a case study about getting details right. */
            url: "https://petrolas-v2-git-feature-process-ignition-redesign-ali-aljardabi.vercel.app/",
            label: "Open the Petrolas site",
            desktop: {
              src: "/work/petrolas/site-landing.jpg",
              alt: "The Petrolas landing page: Waste is not the end. It is potential.",
              form: "bleed",
              ratio: "aspect-[1969/1000]",
            },
          },
          /*
            PLATES, NOT BLEEDS. Both of these are 418px wide — running
            either full width would show the visitor a soft image and
            call it the work. As plates they are objects on a page at a
            size their resolution can carry.
          */
          /*
            TWO PAGES, NOT THREE (Ali, 2026-08-22).

            Both are full-page captures — 18,214px and 7,113px tall — so
            any card shows a fraction of them. They are cropped to their
            opening screen at the plate's own 2:3, which is the part a
            visitor would recognise; the live link above carries anyone
            who wants the rest.
          */
          assets: [
            {
              src: "/work/petrolas/site-process.jpg",
              alt: "The top of the Petrolas process page",
              form: "plate",
            },
            {
              src: "/work/petrolas/site-partnership-page.jpg",
              alt: "The top of the Petrolas partnership page",
              form: "plate",
            },
          ],
        },
        {
          id: "environment",
          label: "05 — Environmental",
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
              /* 1.79 in a 4:3 cell was cutting a quarter off the tank —
                 the length of the thing is what the shot is about. */
              src: "/work/petrolas/fleet-systems.jpg",
              alt: "Petrolas-branded tanker truck with a connected circuit graphic along its tank",
              form: "bleed",
              ratio: "aspect-[16/9]",
            },
            {
              src: "/work/petrolas/system-station.jpg",
              alt: "A Petrolas service station — the canopy, the pumps and the shopfront carrying the identity",
              form: "bleed",
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
        /*
          The five roles, in Delivery Point's own words. Every asset is
          pending — the notes are Ali's account of the engagement and were
          written before any file existed, so the argument is judgeable
          now and the imagery drops into a shape that already holds.
        */
        {
          id: "identity",
          label: "01 — Positioning",
          title: "POSITION",
          note: "Competing against regional and international carriers, the problem was never capability — it was that the scale of the business did not show. Market, competitor and SWOT analysis first, design second.",
          layout: "bleeds",
          assets: [],
        },
        {
          id: "system",
          label: "02 — Brand system",
          title: "SYSTEM",
          note: "One identity across the fleet, the packaging, the tracking interface and the paperwork — the four places a logistics customer actually meets the company, made to look like one business.",
          layout: "bento",
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
        {
          id: "digital",
          label: "04 — Digital",
          title: "TRACK",
          note: "The tracking interface and the pages around it — where a logistics customer spends most of their time with the company, and the surface most likely to be built by someone who never saw the brand.",
          layout: "plates",
          assets: [],
        },
        {
          id: "environment",
          label: "05 — Fleet & premises",
          title: "ROAD",
          note: "A logistics brand is met on the road before it is met anywhere else — the fleet, the uniforms, the packaging that arrives at a door.",
          layout: "bleeds",
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
      live: "https://www.qobban.store",
      /* Their actual brand, finally. This read "violet" from the first
         pass and was wrong the whole time — Qobban is yellow and black,
         which anyone could see the moment the card started showing the
         real site. */
      palette: "amber",
      disciplines: ["Branding", "Websites"],
      year: "—",
      sector: "Fabrication & metalwork",
      summary:
        "A fabrication and welding workshop that read as a general workshop — repositioned with a full identity across the premises, the marketing, and the website.",
      cover: {
        src: "/work/qobban/cover.jpg",
        alt: "Qobban stair and terrace railing in black steel against pale stone",
        form: "bleed",
      },
      /*
        Replaced 2026-08-12 with Ali's own presentation mockup — the
        Qobban site on a laptop, shot on leather in warm light.
        Deliberately not a photograph of the metalwork: this card sits
        beside Petrolas on the homepage, and a pair of presentation
        mockups reads as a portfolio while a gate photograph next to a
        laptop reads as two unrelated things.

        Square for the homepage card only; the mosaic tile keeps the
        landscape cover above, because a 0.80 portrait cropped to 16/11
        would lose the machine.
      */
      feature: {
        src: "/work/qobban/cover-idcards-v2.jpg",
        alt: "Two Qobban staff ID cards hanging on branded lanyards — a project supervisor's photo card and the reverse carrying the mark",
        form: "bleed",
      },
      /*
        Written 2026-08-06 from Ali's account. Imagery pulled from the
        live site at qobban.store on 2026-08-12, at Ali's instruction —
        it is his work for his client, and it is the same photography the
        client publishes.

        EVERY QOBBAN IMAGE IS LANDSCAPE (1.33 or 1.78). The "plates"
        layout frames its assets at 2:3 portrait, so it is not used here:
        forcing a landscape photograph into a portrait plate crops away
        half the subject, which is what happened to the tanker on the
        featured card. Layouts are chosen to fit the material rather than
        the material cropped to fit a layout.
      */
      spreads: [
        {
          id: "identity",
          label: "01 — Brand identity",
          title: "MARK",
          note: "A letter Q built around a spirit level: the tool the trade actually measures with, made into the thing the business is recognised by. Precision as a mark rather than a promise.",
          layout: "bleeds",
          /*
            NO APERTURE (Ali, 2026-08-18). MARK was cut out of the spirit
            level below it, which put the same photograph on screen twice
            and left the title reading as texture rather than as a word.
            It sets solid in Qobban's own yellow instead — the palette was
            already there and this was the one place it went unspent.
          */
          /*
            REORDERED 2026-08-18 (Ali). The spread now argues in the right
            order: the mark and how it was built, then the object it was
            built from, then the system it turned into.

            level-on-gate.jpg comes out. The "bleeds" layout has exactly
            three slots, and a photograph of a level held against a gate
            was the weakest of four once the construction board arrived —
            it says the same thing as the vial, less clearly. The file is
            still on disk if it belongs in the premises spread later.
          */
          assets: [
            {
              /* The logo-construction board from Ali's brand guidelines,
                 supplied 2026-08-18. This is the spread's argument stated
                 outright: Q frame + spirit level = the mark. */
              src: "/work/qobban/logo-concept.jpg",
              alt: "Qobban brand guidelines: the logo built from a letter Q frame combined with a spirit level, shown as a construction diagram",
              form: "bleed",
            },
            {
              src: "/work/qobban/level-vial.jpg",
              alt: "The bubble in a spirit level vial — the device the Qobban mark is built from",
              form: "bleed",
            },
            {
              /* Ali's real stationery system, supplied 2026-08-18, in
                 place of the generic scope-document still. */
              src: "/work/qobban/stationery.jpg",
              alt: "The Qobban stationery system — letterhead, envelope, business cards, notepad, lanyard and keyring in black, white and the brand gold",
              form: "bleed",
            },
          ],
        },
        {
          /*
            Added 2026-08-18 (Ali). Sits directly after the mark because
            it is the mark's consequence: one shape becomes a system.

            "PATTERN", not "SYSTEM" — Delivery Point owns SYSTEM, and a
            spread title is the loudest thing on its page. Two projects
            sharing one reads as a template rather than as two pieces of
            work. Seven characters, single word, so it cannot wrap at 390.

            ASSETS PENDING. The spread renders its argument over a
            labelled panel until Ali supplies the pattern and the system
            boards — the honest state for a case study whose story is
            confirmed and whose files are not.
          */
          id: "pattern",
          label: "02 — Branding",
          /*
            "BRANDING" per Ali, 2026-08-18 — and it clears a collision on
            the way. This was briefly titled SYSTEM, which Delivery Point
            already owns; every title on this site is unique on purpose,
            because a spread title is the loudest thing on its page and
            two projects sharing one reads as a template. Eight
            characters, single word, so it cannot wrap at 390.
          */
          title: "BRANDING",
          note: "A mark is one shape. A system is what makes it usable everywhere — the pattern, the palette, and the rules that keep them consistent across every surface the business puts its name on.",
          layout: "bento",
          /*
            Placed by slot, not by order (Ali, 2026-08-18/19). All nine
            cells are filled.

            EVERY ONE OF THESE FITS ITS CELL WITHOUT BEING CROPPED TO
            death: the billboard is 1.78 into a 16:9, the profile 0.56
            into a 9:16, the palette 1.00 into a square, the
            type board 1.78 into a 16:9. The palette and the type sit
            side by side (Ali, 2026-08-19) because they are the two
            reference boards on this spread and they answer each other. Slot 05
            moved from 4:5 to 3:4 to match the workwear and slot 08 from
            16:9 to 3:2 to match the stationery, because the rule here
            is that the layout fits the material rather than the
            material being cropped to fit the layout.
          */
          assets: [
            {
              slot: 1,
              src: "/work/qobban/brand-billboard.jpg",
              alt: "A Qobban roadside billboard at dusk — Precision built to last, over a fabricator cutting a metal screen",
              form: "bleed",
            },
            {
              /*
                TEMPORARY. This is a screenshot of the live Instagram
                profile, standing in for a designed 9:16 asset. It is
                real work and it is honest to show, but it is a phone
                screen recorded rather than a piece made — swap it when
                Ali supplies the intended tall asset.
              */
              slot: 2,
              src: "/work/qobban/brand-profile-temp.jpg",
              alt: "The Qobban Instagram profile: the mark, the service highlights and the recent grid",
              form: "bleed",
            },
            {
              slot: 3,
              src: "/work/qobban/brand-palette.jpg",
              alt: "The Qobban palette: deep black, off-white, construction yellow and light neutral grey, with their hex values",
              form: "bleed",
            },
            {
              slot: 8,
              src: "/work/qobban/brand-appstore.jpg",
              alt: "The Qobban app listing on a store page — the mark as an app icon, Metal solutions & services beneath it",
              form: "bleed",
            },
            {
              slot: 9,
              src: "/work/qobban/brand-signage.jpg",
              alt: "The Qobban projecting sign mounted on a building façade against the sky",
              form: "bleed",
            },
            {
              slot: 5,
              src: "/work/qobban/brand-workwear.jpg",
              alt: "The Qobban mark on the back of a black work jacket, on the shop floor",
              form: "bleed",
            },
            {
              slot: 6,
              src: "/work/qobban/brand-idcard.jpg",
              alt: "Qobban staff ID cards on black lanyards, front and back — a project supervisor's photo card and the reverse carrying the mark",
              form: "bleed",
            },
            {
              slot: 7,
              src: "/work/qobban/brand-favicon.jpg",
              alt: "The Qobban mark as a browser tab favicon beside the address qobban.store",
              form: "bleed",
            },
            {
              slot: 10,
              src: "/work/qobban/brand-stationery-set.jpg",
              alt: "The Qobban stationery set laid out — letterhead, envelope, business cards, notepad, pen, keyring and lanyard",
              form: "bleed",
            },
            {
              slot: 4,
              src: "/work/qobban/brand-type.jpg",
              alt: "The Arabic display type specimen: the Qobban wordmark set large, the tagline in yellow, and the Arabic numerals",
              form: "bleed",
            },
          ],
        },
        {
          /*
            Added 2026-08-18 (Ali), and moved up to third on 2026-08-19:
            it follows BRANDING directly, so the system is shown and then
            immediately shown being spent.

            "SOCIAL", not "CAMPAIGN" or "REACH" — Petrolas owns the first
            and Delivery Point the second.

            QOBBAN ONLY. This is not a section every case study gets; it
            exists because there is social and campaign work for this
            client. A spread that appears on a project with nothing to put
            in it is a template, and the pending panel is for files that
            are coming, not for work that was never done.

          */
          id: "social",
          label: "03 — Social & campaigns",
          title: "SOCIAL",
          note: "The identity at post scale, where most of a local audience actually meets this business — content and campaign creative built from the same system rather than decorated to match it.",
          layout: "bleeds",
          assets: [],
          /*
            Empty on purpose. Each band renders its expected number of
            labelled slots, so the composition is judgeable now and the
            files drop in without the layout changing shape.
          */
          showreel: {
            /*
              Six posts and six stories (Ali, 2026-08-19). Five of the
              stories are film, one is a still — the rail takes either,
              which is the reason LabMedia is a union rather than a
              string.
            */
            posts: [
              {
                kind: "image",
                src: "/work/qobban/social/post-01.jpg",
                alt: "Opening offers: a courtyard laid out with Qobban pieces — a laundry rack, a console, a gas-cylinder cabinet, plant stands and a platform trolley",
              },
              {
                kind: "image",
                src: "/work/qobban/social/post-02.jpg",
                alt: "Living room stands: a C-shaped steel and wood side table beside a sofa, priced from 15 BHD, with the Instagram handle and WhatsApp number",
              },
              {
                kind: "image",
                src: "/work/qobban/social/post-03.jpg",
                alt: "A man working on a laptop at a two-tier steel and walnut desk in a sunlit living room",
              },
              {
                kind: "image",
                src: "/work/qobban/social/post-04.jpg",
                alt: "A steel and fabric car canopy over a villa driveway at golden hour, a car parked beneath it",
              },
              {
                kind: "image",
                src: "/work/qobban/social/post-05.jpg",
                alt: "A woman loading a stacked washer and dryer held on a Qobban rolling laundry rack with shelves and a hamper",
              },
              {
                kind: "image",
                src: "/work/qobban/social/post-06.jpg",
                alt: "Kitchen stand: a four-shelf steel and wood unit holding jars, bowls and mugs, offered at 55 BHD",
              },
            ],
            stories: [
              {
                kind: "video",
                src: "/work/qobban/social/story-01.mp4",
                poster: "/work/qobban/social/story-01.jpg",
                alt: "A gas-cylinder cabinet on a terrace and a side table beside a sofa, under the line Fits where life happens",
              },
              {
                kind: "image",
                src: "/work/qobban/social/story-02.jpg",
                alt: "A saving offer: a console table with two matching side tables in a hallway, three pieces for 80 BHD instead of 100",
              },
              {
                kind: "video",
                src: "/work/qobban/social/story-03.mp4",
                poster: "/work/qobban/social/story-03.jpg",
                alt: "A young woman sitting on a living room floor singing into a hairbrush, her books on the rug beside her",
              },
              {
                kind: "video",
                src: "/work/qobban/social/story-04.mp4",
                poster: "/work/qobban/social/story-04.jpg",
                alt: "A drive at sunset, palms passing beyond the windscreen",
              },
              {
                kind: "video",
                src: "/work/qobban/social/story-05.mp4",
                poster: "/work/qobban/social/story-05.jpg",
                alt: "A woman holding a toddler and singing into a kitchen spatula beside a stacked washer and dryer",
              },
              {
                kind: "video",
                src: "/work/qobban/social/story-06.mp4",
                poster: "/work/qobban/social/story-06.jpg",
                alt: "A slow pass across a steel and wood shelving unit in a kitchen, morning light through the window",
              },
            ],
            /*
              Three campaign films (Ali, 2026-08-19), each showing the
              product in a room rather than on a white ground — which is
              the argument the whole spread is making: the metalwork is
              furniture, not fabrication.

              Silent by construction. The audio track is stripped in the
              encode rather than only muted in markup, because a film
              that can never be unmuted has no reason to carry the bytes.
            */
            films: [
              {
                kind: "video",
                src: "/work/qobban/film-retail.mp4",
                poster: "/work/qobban/film-retail.jpg",
                alt: "A black steel and oak garment rail on castors in a boutique, hung with neutral clothing, then a close pass along its base",
              },
              {
                kind: "video",
                src: "/work/qobban/film-outdoor.mp4",
                poster: "/work/qobban/film-outdoor.jpg",
                alt: "A slatted steel cabinet opening to hold a gas cylinder, a shelving trolley on a balcony, and a close pass along a blackened metal edge",
              },
              {
                kind: "video",
                src: "/work/qobban/film-entryway.mp4",
                poster: "/work/qobban/film-entryway.jpg",
                alt: "A hallway rail and shelf unit in daylight, a garment being hung on the rail, and keys and a wallet set down on its oak shelf",
              },
            ],
          },
        },
        {
          id: "digital",
          label: "04 — Website",
          title: "SITE",
          /*
            Updated 2026-08-18 with the real captures. The note now names
            the products page too, because the page exists and the phone
            in this spread is showing it — a note that describes less than
            the images do is the same fault as one that describes more.
          */
          note: "A site that shows the craft rather than listing services: fabrication, welding, architectural metalwork and maintenance, presented so a client can tell the standard before they call. The spirit level runs across the top of the page and tips with the cursor — the mark, made operable. A second page sells ready-made pieces at a stated price, for the work that does not need a site visit.",
          layout: "bleeds",
          site: {
            url: "https://www.qobban.store",
            label: "Open qobban.store",
            /* The landing page in dark mode on the desktop frame, the
               products page in light mode on the phone — the two halves
               of the build, and the two themes, in one exhibit. */
            desktop: {
              src: "/work/qobban/site-landing-dark-v3.jpg",
              alt: "The Qobban landing page in dark mode: the headline Precision is our standard over a lit villa entrance, with the tipping spirit level above it",
              form: "bleed",
            },
            mobile: {
              src: "/work/qobban/site-products-mobile.jpg",
              alt: "The Qobban products page on a phone in light mode: ready-made pieces listed at a stated price",
              form: "bleed",
            },
          },
          /*
            NO STILLS UNDER THE SITE (Ali, 2026-08-18). The three that sat
            here were pictures OF the website plus a gate photograph
            already shown elsewhere — a section about a live site arguing
            with screenshots when the site itself is right above them, one
            click away. The frame and the URL are the evidence.
          */
          assets: [],
        },
        {
          id: "workshop",
          label: "05 — Premises & workwear",
          /* Not "PLACE" — Petrolas already owns that word, and a spread
             title is the loudest thing on its page. Repeating it makes two
             projects read as one template. */
          title: "STREET",
          /*
            The note names what is on screen, and what is on screen
            changed twice.

            It said "the vehicles" first, when no vehicle had been
            delivered — a note describing work the page cannot show reads
            as a claim. It was rewritten on 2026-08-12 to "the site
            visit", which the photography did show. Ali supplied the
            workwear and the liveried vehicle on 2026-08-18, and the site
            visit came out of the spread, so the line follows the images
            again rather than the images following the line.
          */
          note: "The identity had to survive where the work happens — the workshop, the workwear, the vehicle on the street. A client meets this business at a half-built villa long before they meet a brochure.",
          layout: "bleeds",
          /*
            site-survey.jpg and install.jpg come out. "bleeds" has three
            slots, and the workwear and the vehicle each show the identity
            APPLIED to something, where those two showed people working
            with the brand barely visible. Both stay on disk.
          */
          assets: [
            {
              src: "/work/qobban/workshop.jpg",
              alt: "The Qobban fabrication workshop, benches and stock racked along the span",
              form: "bleed",
            },
            {
              src: "/work/qobban/workwear.jpg",
              alt: "The Qobban mark on the back of a fabricator's black work jacket, on the shop floor",
              form: "bleed",
            },
            {
              src: "/work/qobban/vehicle.jpg",
              alt: "A white Qobban SUV in the company livery, its mark and phone number along the door",
              form: "bleed",
            },
          ],
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
      /*
        REPRICED 2026-08-24 (Ali). Four offers, not three: branding and
        websites separately, the two together as the offer to lead with,
        and ongoing support monthly. Marketing at BHD 100 is gone — that
        number priced a deliverable and invited a negotiation about
        deliverables.

        Every figure here is Ali's own. Nothing on this site quotes a
        price he has not set.
      */
      {
        index: "01",
        fold: {
          keyword: "credible",
          shotRatio: "4 / 3",
          shots: [
            {
              src: "/work/qobban/brand-signage.jpg",
              alt: "The Qobban projecting sign on a building",
            },
            {
              src: "/work/petrolas/booth-stand.jpg",
              alt: "The Petrolas exhibition stand — the identity applied at trade-show scale",
            },
          ],
        },
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
        from: "From BHD 400",
      },
      {
        index: "02",
        fold: {
          keyword: "enquiries",
          shotRatio: "16 / 10",
          shots: [
            { src: "/work/qobban/site-landing-dark-v3.jpg", alt: "The Qobban store landing page" },
            { src: "/work/petrolas/site-partnership.jpg", alt: "The Petrolas partnership page" },
          ],
        },
        name: "Website Design + Development",
        palette: "blue",
        outcome: "Turn attention into enquiries.",
        scope: [
          "Website strategy",
          "UX & UI design",
          "Design & build, end to end",
          "Responsive implementation",
          "Launch support",
        ],
        /* Design AND development — the figure covers both, which is the
           whole "one person, end to end" argument priced. */
        from: "From BHD 600",
      },
      {
        index: "03",
        /* The one to lead with. It is also the only offer where the
           "one person, end to end" claim is worth what it costs: the
           brand and the site are decided together rather than handed
           between two people. */
        featured: true,
        fold: {
          keyword: "built once",
          shotRatio: "4 / 3",
          shots: [
            {
              src: "/work/qobban/cover-idcards-v2.jpg",
              alt: "Qobban staff ID cards on branded lanyards",
            },
            {
              src: "/work/petrolas/system-favicon.jpg",
              alt: "The Petrolas mark as a browser favicon beside the address bar",
            },
          ],
        },
        name: "Brand + Website",
        palette: "violet",
        outcome: "One system, built once — the brand and the site that carries it.",
        scope: [
          "Brand strategy & positioning",
          "Visual identity & logo systems",
          "Website strategy",
          "UX & UI design",
          "Design & build, end to end",
          "Guidelines & launch support",
        ],
        from: "From BHD 950",
      },
      /*
        The old "Marketing & advertising" scope, priced as ongoing work
        rather than per piece. The lines below are unchanged because the
        work is unchanged — every one is already evidenced on this site:
        Kids Island's campaigns, Delivery Point's marketing plan built
        from market and competitor analysis, and the campaign films in
        the reel.
      */
      {
        index: "04",
        fold: {
          keyword: "consistent",
          shotRatio: "4 / 5",
          shots: [
            {
              src: "/reel/marketing-retail.mp4",
              poster: "/reel/marketing-retail.jpg",
              alt: "A fragrance campaign film — the retail interior and its shelves",
            },
            {
              src: "/reel/marketing-product.mp4",
              poster: "/reel/marketing-product.jpg",
              alt: "A fragrance campaign film — the bottle and its atomiser in close-up",
            },
          ],
        },
        name: "Ongoing Brand & Creative Support",
        palette: "lime",
        outcome: "Stay consistent after launch, without hiring in.",
        scope: [
          "Campaign strategy & art direction",
          "Advertising creative — film, motion, still",
          "Social brand system & content direction",
          "Paid campaign creative",
          "Channel management",
        ],
        from: "From BHD 350/month",
      }
    ],
  },

  /*
    THE HALL. Four campaign films Ali directed, supplied 2026-08-12 and
    re-encoded from 10-15 Mbps down to roughly 1.5 — the sources were
    720p at about eight times the bitrate that resolution needs, and
    67MB of homepage is not a portfolio, it is a bill.

    VIDEO ONLY IN THIS SECTION, per Ali. The hall is where the moving
    work plays; stills live on the cards and inside the case studies.

    CAPTIONS ARE DESCRIPTIVE, NOT ATTRIBUTED. Ali has not said which
    client each film was made for, and naming one would be inventing a
    credit. They describe what is on screen until he supplies the real
    campaigns.
  */
  showcase: {
    label: "Selected work",
    heading: "Directed end to end.",
    /*
      Films replaced 2026-08-16 with the set Ali supplied.

      TWO OF THESE ARE ONE AD. watch-01 and watch-02 are two cuts of the
      same film — same yacht, same man, same grade — and the captions say
      so. Running them as two separate campaigns would claim three
      campaigns where there are two, which is the same invention the
      honesty rules forbid everywhere else. Two cuts of one film is still
      three exhibits of craft, and it is true.

      Re-encoded from 48.5MB of source to 5.00MB at CRF 25, which is
      lighter than the 6.51MB set it replaces and sharper. The weight
      matters more than it used to: ApertureLoader now waits on real
      bytes, so the homepage's video budget IS the loading time.

      Posters are sampled from mid-film, never frame zero. The opening
      frame of the watch cut does not show the watch, and captioning from
      a poster is what produced a wrong caption once already.
    */
    frames: [
      {
        media: {
          kind: "video" as const,
          src: "/reel/watch-01.mp4",
          poster: "/reel/watch-01.jpg",
          alt: "A classic yacht at anchor at dusk, then under sail with her helmsman at the wheel",
        },
        caption: "Campaign film, cut one — under sail",
        project: "Art direction",
      },
      {
        media: {
          kind: "video" as const,
          src: "/reel/watch-02.mp4",
          poster: "/reel/watch-02.jpg",
          alt: "A chronograph on the yacht's cabin table, then on the wrist at the helm",
        },
        caption: "Campaign film, cut two — the watch itself",
        project: "Art direction",
      },
      {
        media: {
          kind: "video" as const,
          src: "/reel/fragrance.mp4",
          poster: "/reel/fragrance.jpg",
          alt: "A burgundy fragrance bottle wrapped in a gold serpent, in candlelight",
        },
        caption: "Campaign film — a fragrance",
        project: "Art direction",
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
      "I'm Ali. I build brands, websites and advertising for small and growing businesses in Bahrain.",
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
      { value: "3", label: "disciplines: brand, web, marketing" },
    ],
    badge: {
      name: "Ali Aljardabi",
      role: "Brand, Web & Marketing",
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
  },

  contact: {
    label: "Contact",
    /* Curly apostrophe. This line is now set at 3.75rem uppercase in the
       close, where a straight quote is unmissable. */
    heading: "Tell me what you’re building.",
    email: "alialjardabi@gmail.com",
    body: "A first conversation is a conversation — what the business is, where it’s going, and whether the way it looks is keeping up.",
    /* +973 35665422, Bahrain. Digits only for wa.me. */
    whatsapp: "97335665422",
    /* Ali's brand account (2026-08-10). If this handle changes, every
       copy of the link already sent in a DM breaks — change it here and
       nowhere else. */
    instagram: "the_brandgrid",
  },
};
