# Task 03 — /studio becomes /about, and sells Ali

Read `docs/codex/README.md` first.

## Ali's request, verbatim

> change the studio page to about page and add new elements and
> storytelling that sell me to the client

## Part A — the rename, which you can do cold

`/studio` → `/about`. Every reference, found 2026-08-14:

| file | what |
|---|---|
| `src/app/studio/page.tsx` | the route itself |
| `src/data/lab.ts:440` | `navLinks` — `{ label: "Studio", href: "/studio" }` |
| `src/app/sitemap.ts:39` | the `/studio` entry, and its comment above it names `/studio` |
| `src/data/lab.ts:1162` | the `studio` content key |
| `src/components/lab/LanyardStage.tsx:6` | types off `LabContent["studio"]["badge"]` |

**Add a permanent redirect from `/studio` to `/about`** in
`next.config.ts`. That link has already gone into DMs and proposals; a
404 on a URL a prospect was sent is a lost enquiry. This is not optional
and it is cheaper than the alternative.

Renaming the `studio` **content key** is a judgment call: it touches
`LanyardStage` and the nav label. Rename it if the diff stays small, keep
it if not — the brief notes the inherited `lab` naming is cosmetic and not
worth churning imports over. Say which you chose.

The nav label becomes "About".

## Part B — the storytelling

**BLOCKED ON ALI. Do not start Part B until this section is filled in.**

The brief's honesty rules are absolute and this is exactly the page they
exist to protect. A page whose whole argument is "you'd be working with
me" cannot carry an invented detail:

- No invented years of experience. It is the number a page like this
  usually leads with, and it is the one number Ali has deliberately not
  given. `src/data/lab.ts` already carries a comment saying so — read it.
- No invented clients, metrics, testimonials, awards, dates or education.
- Sections whose data is empty **render nothing** rather than showing a
  plausible placeholder.

### What is already on the page

- `heading`: "You'd be working with me. Just me."
- `bio`: two paragraphs, deliberately cut to two on 2026-08-10 (Ali's
  direction: smaller, simpler, to the point). Do not pad them back out.
- `highlights`: 6 brands / 6 sectors / 3 disciplines — facts, each one
  checkable against this site.
- `badge`: real headshot at `/studio/ali.jpg`, role, location.

### Source material — from Ali, 2026-08-14

Everything below came from Ali directly. **It is the only material this
page may be built from.** Do not add a fact, a number, a date or a claim
that is not here. Where a phrase is quoted, it is his — keep the voice.

#### 1. Where it started

Creative from a young age, and it ran in the house: his mother painted
walls as a side hustle, his father performed magic shows as one. He went
along with his father from the age of eight.

The career itself started at a family business. He was a part-time store
manager and an IT student when his father moved on to other ventures, and
he stepped in to market the store. It began as graphic design and social
media coverage, and grew from the moment he understood marketing — what
it actually does for winning clients, and that he could sell himself the
same way.

> **The family business is NOT named on this page.** Ali's call,
> 2026-08-14. Write it as a family business. Kids Island stays in the
> client list on its own, and the two are not connected in copy.

#### 2. What he is

Creative and strategic before technical. His own framing: a jack of all
trades whose specialty is the creative and strategic side more than the
technical one.

This is a strength on this page, not a hedge — it is why one person can
carry a project from research to build. Do not write it apologetically.

#### 3. Why him over an agency

In 7+ years he has not seen an agency in Bahrain deliver at his speed and
accuracy, from research through to build, at what he charges. He credits
being able to piece things together and learn faster than an average
agency to the projects he has put himself in since childhood.

**Keep this framed as his own experience** — "in seven years I haven't
seen…" — not as a statement of fact about every agency in the country.
The first is his to say. The second is a claim about other businesses
that cannot be substantiated, and the brief forbids unverifiable claims
for the same reason it forbids invented metrics.

#### 4. Who should NOT hire him — put this on the page

His own answer, unprompted: a client should choose an agency instead when
they need a full team of specialists who learn fast and are properly
exposed to AI and current tooling.

**This is the strongest trust device available to this page.** A solo
designer naming the case against himself is worth more than any
superlative, and it immediately earns the claim in §3 above. It also
disqualifies the wrong enquiries before they reach his inbox, which is
the whole job of the convert stage. Give it real space — not a footnote.

#### 5. Where he draws the line

He will not do poor work, and he will not take a client who wants to pay
him to make a decision he knows will not work. Every creative decision
has to be results-driven. He will say outright that he does not think an
idea will work rather than waste the client's time and his own.

He learned it expensively. He once took a client and did whatever they
asked — it damaged his reputation and burned the client's money. Since
then the limits and the guidelines get set during exploration and
research, so both sides come out of it well.

> The client in that story is **not** one of the six named on this site
> (confirmed 2026-08-14), so it may run in full — but it runs **entirely
> anonymously**. No sector, no year, no detail that narrows the field.

#### 6. The process — REPLACES the deleted four steps

The four steps deleted in `70fc8ed` ("A conversation / Direction / Design
and build / Launch and after") were confirmed on 2026-08-10, but they are
a flattened version of what Ali actually does and they give away his best
differentiator: **his process starts before the first call, not with it.**

Do not restore them from git history. Build these:

1. **Research first.** For high-ticket clients, exploration, research and
   analysis happen *before* the first call — so he arrives already
   understanding the business.
2. **The call.** The pain points in the client's own words.
3. **Exploration again**, now with suggestions personalised to what he
   heard.
4. **Analysis.** SWOT, market analysis, and whatever else the scope calls
   for. There is never a 100% guarantee, and the analysis is what
   narrows the odds — say so plainly rather than promising certainty.
5. **Planning and building** to an agreed timeline.
6. **Hand-off.** Every asset they need, plus a meeting that leaves them
   able to carry it on themselves, and templates and extra assets as a
   gift.

That is six stages as described, not four. Ali confirmed the substance;
the count changed because the deleted version compressed it. **Do not
pad, and do not invent a stage to round the number.**

The hand-off stage is also where Ali offers whatever service they may
need next. On the page that is a natural close into the contact section —
write it as continuing to work together, not as an upsell.

#### 7. Character

A perfectionist who is always learning and trying new approaches and
solutions. True, and he is comfortable saying it.

#### 8. Years — PENDING, DO NOT GUESS

7+ years of experience as of 2026-08-14. Ali chose to express this as a
**start year the site counts from**, so it never goes stale — but the
year itself has not been supplied yet.

**Leave the years figure out entirely until Ali gives the year.** Do not
compute it, do not approximate it, and do not write "7+" as a literal.

This also lifts a standing rule: `src/data/lab.ts` carries a comment
saying a years figure is the one number Ali has never given. That comment
is now out of date — update it when the year lands, and note that
`highlights` may take a fourth stat at that point.

## Traps that apply here

- **`Reveal` wraps its children in a `div`**, which makes every child a
  last-child and puts a `div` between `<ol>` and `<li>`. Put `Reveal`
  *inside* the list item.
- **Hand-placed line breaks:** never leave one word alone on a line, and
  never break inside a noun phrase.
- The four process steps that used to live on this page were deleted with
  `ProcessStepper.tsx` in `70fc8ed`. They were never confirmed as
  accurate. Do not restore them from git history.

## Done means

`npx tsc --noEmit` clean, `npx eslint src --max-warnings=0` clean,
`node scripts/shots.mjs` from PowerShell, **PNGs opened** at 390 / 1024 /
1600, and `/studio` verified to redirect rather than 404.
