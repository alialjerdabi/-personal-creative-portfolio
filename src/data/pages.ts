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
    "Independent brand, website and marketing design in Manama, Bahrain. Strategy, identity, UX/UI and advertising creative — briefed, designed and built by one person. From BHD 400.",
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
      diagram: "Schematic — where a business sits against the others in its market.",
      /* The question the service answers, asked from the buyer's side.
         Not a claim — a claim invites scepticism, a question invites
         them to check their own experience against it. */
      question:
        "How many customers decided against you before they ever spoke to you?",
      lede: "Look credible to someone who has never heard of you.",
      body: [
        "Branding is the part a customer judges before they have spoken to anyone. It decides whether a business looks like it can be trusted with the job, and it is the difference between being remembered and being one of several.",
        "I build it as a system rather than a logo: positioning first, then the mark, the colour, the type and the voice, then the applications the business actually uses — signage, vehicles, documents, social, packaging. A mark that only works on a business card is not finished.",
      ],
      forWho:
        "Businesses launching, businesses that have outgrown the identity they started with, and businesses whose look no longer matches what they now sell.",
    },
    "02": {
      diagram: "Schematic — where visitors fall away before they ever enquire.",
      question:
        "Your website gets visits. How many of them turn into enquiries?",
      lede: "Turn attention into enquiries.",
      body: [
        "A website is where interest either becomes a message or evaporates. Most of the ones I am asked to replace are not ugly — they are unclear: the visitor cannot tell in five seconds what is on offer, who it is for, or what to do next.",
        "I design and build them end to end. That matters more than it sounds: when the same person does both, the built site is the design rather than an approximation of it, and there is nobody to hand the blame to when it is not.",
      ],
      forWho:
        "Businesses with no site, businesses whose site does not bring enquiries, and businesses whose site was built before the business changed.",
    },
    "03": {
      diagram: "Schematic — one decision made twice, or made once.",
      /* NEW OFFER (Ali, 2026-08-24). The copy is written for it because
         it did not exist before; nothing else on this page moved. */
      question:
        "How much of a rebrand gets lost by the time it reaches the website?",
      lede: "The brand and the site, decided together.",
      body: [
        "Most businesses buy these separately, and the join is where the work leaks. The identity is agreed with one person, the site is built by another months later, and half of what made the brand distinctive quietly does not survive the handover.",
        "Taken together they are one decision rather than two. The positioning that settles the mark also settles what the homepage has to say first, and because I design and build both, nothing has to be explained to a second party or approximated by them.",
      ],
      forWho:
        "Businesses launching, and businesses replacing an identity and a site that no longer match what they sell.",
    },
    "04": {
      diagram: "Schematic — which channels are actually carrying the work.",
      question:
        "When someone here needs what you sell, do they think of you first?",
      lede: "Be the one they think of, and the one they call.",
      body: [
        "Branding makes a business recognisable. Marketing is what puts it in front of people often enough for that to matter. I direct campaigns as one system — the idea, the creative, and the channel it runs on — rather than producing posts to fill a calendar.",
        "That includes advertising creative: film, motion and stills, art-directed rather than assembled from a template. The reel on the homepage is that work.",
      ],
      forWho:
        "Businesses already trading who need consistent presence, campaign creative, or someone to run the channel properly.",
    },
  } as Record<
    string,
    {
      lede: string;
      body: string[];
      forWho: string;
      /** The question the service answers, asked from the buyer's side. */
      question: string;
      /** What the diagram beside it is, said plainly — it is schematic. */
      diagram: string;
    }
  >,

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
      a: "Branding starts from BHD 400, website design and development from BHD 600, and the two together from BHD 950. Ongoing brand and creative support is from BHD 350 a month. Those are starting points rather than quotes — the figure for a specific project depends on scope, which we agree before anything is designed.",
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
      a: "Yes. Ongoing brand and creative support starts from BHD 350 a month, and a single month is a reasonable way for both of us to find out whether this is a good fit.",
    },
  ] as FaqEntry[],
};

/**
 * /about — the person, and the honest case against hiring him.
 *
 * Every fact below came from Ali directly on 2026-08-14. Two things are
 * deliberately held back, both on his instruction:
 *
 * - THE FAMILY BUSINESS IS NOT NAMED. It is a client on this site, and he
 *   chose to tell the story without connecting the two.
 * - NO YEARS FIGURE. He said 7+ years and, separately, gave an anchor of
 *   mid-2020 — six years and change. Unresolved, so it is absent rather
 *   than rounded. See docs/codex/task-03-about-page.md §8.
 *
 * The client in the "expensive lesson" is not one of the six named on
 * this site (confirmed), so the story runs — with nothing that could
 * identify them.
 */
export const aboutPage = {
  metaTitle: "About Ali Aljardabi — Independent Designer in Manama, Bahrain",
  metaDescription:
    "I build brands, websites and advertising for small and growing businesses in Bahrain — research, design and build, all by one person. Here is how I work, and when you should hire an agency instead.",
  keywords: [
    "Ali Aljardabi",
    "independent designer Bahrain",
    "freelance brand designer Manama",
    "solo designer Bahrain",
    "brand strategist Bahrain",
    "designer and developer Bahrain",
  ],

  placard: "About",

  /* Sections, in the order a stranger needs them: who, where it came
     from, why him, when NOT him, and what he refuses. */
  origin: {
    placard: "Where it started",
    heading: "It started as a side hustle, in a family that had them.",
    body: [
      "My mother painted walls as a side hustle. My father performed magic shows as one. I went along with him from the age of eight, and I have been around people making things for an audience for as long as I can remember.",
      "The work itself started at a family business. I was a part-time store manager and an IT student when my father moved on to other ventures, and I stepped in to market the store. It began as graphic design and social coverage.",
      "It grew the moment I understood what marketing actually does — that it is the difference between a good business and a busy one, and that the same thinking works on selling yourself as a service. I have been doing it for other people ever since.",
    ],
  },

  approach: {
    placard: "How I think",
    heading: "Creative and strategic first. Technical second.",
    body: [
      "I am a jack of all trades whose specialty is the creative and strategic side rather than the technical one. That is not a hedge — it is the reason one person can carry a project from research through to a built website without it falling apart in the middle.",
      "It also means I pick things up quickly. Being around real businesses since childhood, and putting myself into every kind of project since, means I can usually work out what a business actually needs faster than a process designed to work it out for me.",
      "I am a perfectionist, and I am always trying new approaches rather than repeating the one that worked last time.",
    ],
  },

  /*
   * THE COUNTER-CASE. Ali's own answer, unprompted, to "when should
   * someone hire an agency instead" — and the single most valuable thing
   * on this page.
   *
   * A solo designer naming the case against himself is worth more than
   * any superlative, and it disqualifies the wrong enquiries before they
   * reach his inbox, which is the whole job of the convert stage.
   */
  agency: {
    placard: "When not to hire me",
    heading: "Hire an agency when you need a team.",
    body: [
      "If what you need is a full team of specialists — several people, each deep in their own discipline, all learning fast and properly equipped with current tooling — an agency will serve you better than I will. That is a real advantage and I am not going to pretend otherwise.",
      "What I have not seen, in the years I have been doing this in Bahrain, is an agency delivering this range at this speed and this level of accuracy for what I charge. Research through to build, by the person you briefed. That is the trade: fewer hands, no translation losses, one person accountable.",
    ],
  },

  line: {
    placard: "Where I draw the line",
    heading: "I will tell you if I think it will not work.",
    body: [
      "I do not do poor work, and I will not take a client who wants to pay me to make a decision I already know will not get a result. Every creative decision has to be pointed at an outcome, or it is decoration someone is paying for.",
      "I learned that expensively. Early on I took a client and did whatever they asked, exactly as they asked it. It damaged my reputation and it burned their money, and both of those were my fault for not saying so at the start.",
      "Now the limits get set during exploration and research, in writing, before anything is designed. If I think an idea will not work, I say it then — rather than waste your budget and my time finding out slowly.",
    ],
  },

  faq: [
    {
      q: "Do you actually work alone?",
      a: "Yes. Research, strategy, design and build are all mine. The person you brief is the person who designs it and the person who builds it, and there is one person accountable for whether it works.",
    },
    {
      q: "When should I hire an agency instead of you?",
      a: "When you need a full team of specialists working in parallel — several people, each deep in their own discipline. That is a genuine advantage an agency has and I will tell you so rather than take the brief anyway.",
    },
    {
      q: "Where are you based, and who do you work with?",
      a: "Manama, Bahrain. Small and growing businesses — the clients on this site run across logistics, energy, fabrication, family entertainment, food and beverage, and creative services.",
    },
    {
      q: "Will you tell me if you disagree with my idea?",
      a: "Yes, during exploration and before anything is designed. I would rather lose the argument early than spend your budget proving the point slowly.",
    },
    {
      q: "What do I end up owning?",
      a: "Everything. Every asset is handed over at the end, with a meeting to make sure you can carry it on without me, plus templates and extra assets.",
    },
  ] as FaqEntry[],
};
