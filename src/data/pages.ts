/**
 * Long-form copy for the two standalone pages, /services and /contact.
 *
 * SEPARATE FROM lab.ts ON PURPOSE. That file is the homepage's content
 * layer and is already past 1,200 lines; this is search-facing prose,
 * edited for different reasons and on a different rhythm. Nothing here
 * is duplicated from there — the pages import the services, the prices
 * and the channels from `labContent` and add only what is written for
 * these pages.
 *
 * THE HONESTY RULES APPLY HERE HARDEST.
 *
 * Search copy is where a portfolio is most tempted to invent: response
 * times nobody promised, turnaround figures nobody measured, "trusted by
 * hundreds", star ratings in structured data. Every answer below is
 * traceable to something Ali has actually said or something this site
 * already evidences.
 *
 * Specifically NOT claimed anywhere on these pages:
 * - No response-time or turnaround promise. Ali has never given one, and
 *   a number here becomes a commitment on the first enquiry that misses.
 * - No aggregateRating, no review count. Inventing either is both a lie
 *   and a Google structured-data penalty.
 * - No client counts beyond the six named on this site, and no revenue,
 *   traffic or conversion figures for anyone.
 * - No years of experience: still unresolved (see
 *   docs/codex/task-03-about-page.md §8).
 */

export interface FaqEntry {
  q: string;
  a: string;
}

export const servicesPage = {
  /* Written for search AND for a person. The <title> names the three
     disciplines and the country because that is what someone actually
     types; the H1 says the same thing in Ali's voice rather than in
     keyword order. */
  metaTitle:
    "Branding, Website Design & Marketing in Bahrain — Ali Aljardabi",
  metaDescription:
    "Independent brand, website and marketing design in Manama, Bahrain. Strategy, identity, UX/UI and advertising creative — briefed, designed and built by one person. From BHD 100.",
  keywords: [
    "branding Bahrain",
    "brand identity design Bahrain",
    "website design Bahrain",
    "web design Manama",
    "graphic designer Bahrain",
    "freelance designer Bahrain",
    "marketing design Bahrain",
    "advertising creative Bahrain",
    "logo design Bahrain",
    "UX UI design Bahrain",
  ],

  placard: "Services",
  heading: "Brand, website and marketing design in Bahrain.",
  intro:
    "I am an independent designer in Manama. I take on branding, websites and marketing for small and growing businesses — and I do the research, the design and the build myself, so the person you brief is the person who makes it.",

  /* One paragraph per service, keyed by the slug-safe service index in
     labContent.services.items. Everything factual — scope, price — still
     comes from there; this is only the explanation that a card has no
     room for. */
  detail: {
    "01": {
      lede: "Look credible to someone who has never heard of you.",
      body: [
        "Branding is the part a customer judges before they have spoken to anyone. It decides whether a business looks like it can be trusted with the job, and it is the difference between being remembered and being one of several.",
        "I build it as a system rather than a logo: positioning first, then the mark, the colour, the type and the voice, then the applications the business actually uses — signage, vehicles, documents, social, packaging. A mark that only works on a business card is not finished.",
      ],
      forWho:
        "Businesses launching, businesses that have outgrown the identity they started with, and businesses whose look no longer matches what they now sell.",
    },
    "02": {
      lede: "Turn attention into enquiries.",
      body: [
        "A website is where interest either becomes a message or evaporates. Most of the ones I am asked to replace are not ugly — they are unclear: the visitor cannot tell in five seconds what is on offer, who it is for, or what to do next.",
        "I design and build them end to end. That matters more than it sounds: when the same person does both, the built site is the design rather than an approximation of it, and there is nobody to hand the blame to when it is not.",
      ],
      forWho:
        "Businesses with no site, businesses whose site does not bring enquiries, and businesses whose site was built before the business changed.",
    },
    "03": {
      lede: "Be the one they think of, and the one they call.",
      body: [
        "Branding makes a business recognisable. Marketing is what puts it in front of people often enough for that to matter. I direct campaigns as one system — the idea, the creative, and the channel it runs on — rather than producing posts to fill a calendar.",
        "That includes advertising creative: film, motion and stills, art-directed rather than assembled from a template. The reel on the homepage is that work.",
      ],
      forWho:
        "Businesses already trading who need consistent presence, campaign creative, or someone to run the channel properly.",
    },
  } as Record<string, { lede: string; body: string[]; forWho: string }>,

  /*
   * The process, in Ali's own account (2026-08-14). Six stages, not the
   * four that were on the site before — his begins with research BEFORE
   * the first call, which is the whole differentiator and was missing.
   *
   * Search value is a side effect: this is the question every prospect
   * asks on a first call, so answering it on the page saves the call.
   */
  process: [
    {
      step: "01",
      title: "Research, before we speak",
      body: "For a substantial project I do the exploration, research and analysis before the first call — so I arrive already understanding the business rather than asking you to explain it.",
    },
    {
      step: "02",
      title: "The call",
      body: "What is actually getting in the way, in your words. This is the part I cannot do on my own.",
    },
    {
      step: "03",
      title: "Exploration",
      body: "Directions worked up against what I heard, not against what I had prepared.",
    },
    {
      step: "04",
      title: "Analysis",
      body: "SWOT, market and competitor analysis, and whatever else the scope calls for. Nothing here is a guarantee — the analysis is what narrows the odds and takes the guesswork out of the decision.",
    },
    {
      step: "05",
      title: "Planning and building",
      body: "Designed and built to an agreed timeline, by me.",
    },
    {
      step: "06",
      title: "Hand-off",
      body: "Every asset you need, and a meeting that leaves you able to carry it on yourself — plus templates and extra assets. You own everything.",
    },
  ],

  faq: [
    {
      q: "How much does branding cost in Bahrain?",
      a: "My branding work starts from BHD 250, websites from BHD 400, and marketing and advertising from BHD 100. Those are starting points rather than quotes — the figure for a specific project depends on scope, which we agree before anything is designed.",
    },
    {
      q: "Do you design and build websites yourself?",
      a: "Yes. Strategy, UX, UI and the build are all mine. There is no handover between a designer and a developer, which is the stage where most sites quietly stop looking like the design.",
    },
    {
      q: "Can I take one service without the others?",
      a: "Yes. Branding, websites, and marketing and advertising are separate engagements with their own scope and their own starting price. They work well together because a website carries the brand and the marketing spends it — but nothing here requires buying all three.",
    },
    {
      q: "Who do you work with?",
      a: "Small and growing businesses. The clients on this site run across logistics, energy, fabrication, family entertainment, food and beverage, and creative services.",
    },
    {
      q: "Do I own the work when it is finished?",
      a: "Yes. Everything is handed over at the end, along with a meeting to make sure you can use it without me.",
    },
    {
      q: "How long does a project take?",
      a: "The timeline is agreed at the planning stage, once the scope is settled, and it is set for the specific project rather than quoted from a template. I would rather commit to a date I have thought about than a number that sounds fast.",
    },
    {
      q: "What if you think my idea will not work?",
      a: "I will say so, in the exploration stage, before either of us has spent money on it. Every design decision I make has to be pointed at a result — if I think something will not get one, taking the brief anyway wastes your budget and my time.",
    },
  ] as FaqEntry[],
};

export const contactPage = {
  metaTitle: "Contact — Ali Aljardabi, Designer in Manama, Bahrain",
  metaDescription:
    "Start a branding, website or marketing project. Message me on WhatsApp, email me, or send a brief — independent designer based in Manama, Bahrain.",
  keywords: [
    "contact designer Bahrain",
    "hire freelance designer Bahrain",
    "branding agency Manama",
    "web designer Manama contact",
    "graphic designer Bahrain contact",
  ],

  placard: "Contact",
  /* NOT the close section's headline. ContactClose renders at the foot of
     this page too, and two identical headings on one page is a duplicate
     heading for search and a stutter for a reader. */
  heading: "Start a project.",
  intro:
    "A first conversation is a conversation. What the business is, where it is going, and whether the way it looks is keeping up — no pitch, and no obligation on either side.",

  /* What actually happens after someone sends a message. Written because
     "get in touch" tells a nervous first-time buyer nothing, and the
     nervous first-time buyer is most of the market for this work. */
  next: [
    {
      step: "01",
      title: "You send a message",
      body: "WhatsApp, email, or the form below — whichever you would rather use. A sentence about the business is enough to start.",
    },
    {
      step: "02",
      title: "I look at what you already have",
      body: "Your site, your channels, your market. I would rather come to the first call with questions than with a script.",
    },
    {
      step: "03",
      /* "The call", not "We talk". The brief bans the agency "we", and
         while this one means you-and-me rather than a team, it is not
         worth the reader having to work that out. */
      title: "The call",
      body: "What is getting in the way, what you have tried, and what you actually want to be true in a year.",
    },
    {
      step: "04",
      title: "You get a scope and a price",
      body: "In writing, with what is included and what is not, before anything is designed.",
    },
  ],

  faq: [
    {
      q: "Where are you based?",
      a: "Manama, Bahrain.",
    },
    {
      q: "What is the fastest way to reach you?",
      a: "WhatsApp. Email is better for briefs, documents and anything you want a record of.",
    },
    {
      q: "What should I include in a first message?",
      a: "What the business does, what you are trying to fix, and roughly when you would like it done. If you have a budget in mind, saying it early saves us both a round — it decides scope rather than quality.",
    },
    {
      q: "Do I need to know exactly what I want first?",
      a: "No. Working out what the project actually is comes before designing it, and that part is the job rather than a prerequisite for it.",
    },
    {
      q: "Do you take on small projects?",
      a: "Yes. Marketing and advertising work starts from BHD 100, and a single piece of work is a reasonable way for both of us to find out whether this is a good fit.",
    },
  ] as FaqEntry[],
};
