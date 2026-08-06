# Master Brief — Personal Creative Portfolio

**Status:** locked 2026-08-06. This is the constitution for this repo.

This project was extracted from the `/lab` prototype in
`personal-brand-website` and promoted to real routes. That repo still
holds the prototype and an abandoned "connected growth system" product.
**Nothing in that repo's `docs/` governs this one except by way of this
file.** If you find yourself reading `creative-direction.md`,
`landing-experience.md`, `hero-spec.md` or `roadmap.md` over there, stop:
they describe a product that no longer exists.

---

## 1. What this is

The launch site for **Ali Aljardabi** — an independent designer in
Manama, Bahrain — selling three things to **small and growing
businesses**:

1. **Branding** — identity, art direction, guidelines
2. **Websites** — strategy, UX/UI, design and build
3. **Social media design** — brand systems, content and campaign
   direction, advertising creative, social media management

He works alone, end to end. That is the central sales argument: the
person you brief is the person who designs it and the person who builds
it. It is why a small business would choose him over an agency, and the
site must make it *visible* rather than merely state it.

**Not** an agency. **Not** "we". First person, always.

This is a portfolio *and* a sales machine. Both jobs, one page.

---

## 2. The goal — the only structure that matters

Every section serves one of three stages. A section that serves none gets
cut.

| Stage | Job | How |
|---|---|---|
| **1. Hook** | Stop them in three seconds | Stunning visuals, hero animation, craft on display |
| **2. Trust** | Prove he can actually do it | The work, shown properly, with real results |
| **3. Convert** | Get the enquiry | Testimonials, the promise, and a CTA that names their actual problem |

**The promise, plainly:** make the brand *memorable*, and make the
website *convert*.

When judging any decision, ask which stage it serves. "It looks nice" is
decoration, and decoration goes.

---

## 3. The locked reference

**https://www.upsunday.co/#**

Target for **presentation, layout and animation quality**. Locked. Do not
introduce another reference without an explicit decision to replace this
one — reference churn was the single biggest source of wasted work in the
predecessor project.

**Do match:** structural model, layout system, spacing density, type
scale relationships, interaction vocabulary, animation quality and
pacing, the warm/approachable register.

**Do not reproduce:** their copy, their imagery, their brand, their name
treatment, their palette. A site a prospect *recognises* as someone
else's destroys the exact credibility this site exists to build, and
Ali's name is on it.

> **Trap:** "brands people remember" is UpSunday's own headline. Never
> use that phrase or a near-copy.

---

## 4. Design system — decided, do not relitigate

| | |
|---|---|
| **Display / UI typeface** | Nunito (rounded, full weight range). Headings at 700. |
| **Page ground** | Neutral warm-grey. `--lab-air: #f1efe9` |
| **Accent** | `#FF5A1F` orange |
| **Project palette** | orange / blue / lime / violet / teal / sun — **each project owns exactly one**, and it marks the card, the case-study header and the testimonial panel |
| **Register** | Warm, spoken, first person. Editorial, not corporate. |

The ground was cooled off yellow on 2026-08-06 because the cream fought
the cold navy in the Petrolas imagery. Do not warm it back up without
looking at Petrolas on screen first.

`--lab-cream` is **not usable as a card field** — it is within three
points of the page ground and renders a hole. It survives for type and
rules only.

### Honesty rules — non-negotiable

- No invented clients, metrics, testimonials, awards or dates.
- A testimonial's `role` is the **speaker's** job title. Never Ali's role
  on the project. This has been got wrong once already; a wrong title
  beside a real person's name costs more than the quote earns.
- Sections whose data is empty **render nothing** rather than showing
  plausible placeholders.
- Projects without cover art show a designed pending state. Case-study
  spreads without assets render their argument over a labelled panel.
  **Never borrow another client's imagery to fill a gap.**
- Anything drawn into a `<canvas>` must also exist as real DOM text — it
  is invisible to search engines and screen readers.
- Client-reported figures carry their caveats. Delivery Point's 20% / 5%
  are stated as approximate and note that the three-month plan was not
  completed. That caveat is what makes the numbers believable; do not
  quietly drop it.

---

## 5. Page structure

### `/` — home

| # | Section | Stage | State |
|---|---|---|---|
| 1 | Hero — spoken sentence, inline stills, drawn arrow | Hook | Built |
| 2 | Stacked showcase | Hook | Built |
| 3 | Work grid + popup, tilt on hover, "More +" cursor | Trust | Built |
| 4 | Stats band | Trust | Built |
| 5 | Testimonials — right-to-left rail | Convert | Built |
| 6 | Services — three cards | Trust | Built |
| 7 | Promise — three outcomes | Convert | Built |
| 8 | Notes — point of view | Trust | Built |
| 9 | Contact close | Convert | Built |

Headline: *"I make businesses easy to remember and easy to buy from."*

### `/work/[slug]` — case studies

Petrolas (complete, with imagery), Qobban and Delivery Point (written,
**imagery pending**). Only projects with a `spreads` array are routable,
so a project can be listed on the home page long before it has a page.

Nextshoot and Shawarma & Sauce are listed but have no case study yet.

### `/studio` — about

The "just me" argument: bio, a flat studio card, four process steps.

**The four process steps are UNCONFIRMED.** They describe a proposed
engagement and must not ship until Ali says they are accurate.

---

## 6. Working rules

1. **Look at the work.** `node scripts/shots.mjs` screenshots every route
   at 390/1024/1600 into `.shots/`. **Read the PNGs.** Every visual
   defect this project has shipped was invisible to `tsc`, to eslint and
   to DOM measurement, and obvious in a screenshot. Measurement is not
   seeing. **Never report visual work as done without looking at it.**
2. **Plan before building** anything structural. Show the plan, get a
   yes, build once.
3. **No new dependencies** without stating the cost and getting a
   decision. Runtime dependencies are `gsap`, `next`, `react`,
   `react-dom`. Keep it that way.
4. **Components are references, not agendas.** A React Bits or
   motion-primitives prompt is an idea to adapt, not a task to complete.
   Reach for native platform features first — `<dialog>` over a hand-
   rolled modal, CSS over JS, `position: sticky` over a pin plugin. The
   tilt and the pointer cursor were both adapted this way rather than
   pulling in `motion/react`.
5. **Fix root causes.** Grep every caller before patching one path.
6. **One thing at a time**, with a screenshot review and Ali's yes before
   the next. Shipping four things then reviewing them together is what
   produced six rounds of rework.

### Known traps in this codebase

- **Turbopack serves stale CSS.** Edits to `globals.css` can silently not
  apply through a restart. Symptom: computed value ≠ file value. Fix:
  delete `.next` and restart.
- **Tailwind v4 `translate-*` / `scale-*`** compile to the CSS
  `translate` / `scale` properties, which *compose with* rather than are
  overridden by GSAP's `transform`. Use inline transforms for anything
  GSAP animates.
- **`gsap.context(fn, ref)` scopes selector STRINGS to that ref.** The
  nav renders at page level, so `"[data-hero-chrome]"` matched nothing
  and its entrance was silently dead for weeks. Pass elements, not
  strings, for anything outside the container.
- **A `gsap.to` with a scrubbed ScrollTrigger** captures its start value
  at creation. Use `fromTo` + `immediateRender: false`.
- **`Reveal` wraps its children in a `div`.** That makes every child a
  last-child, and puts a `div` between `<ol>` and `<li>`. Put `Reveal`
  *inside* the list item.
- **`inert` must be a real boolean.** `inert=""` evaluates to false.
- **Hand-placed line breaks:** never leave one word alone on a line, and
  never break inside a noun phrase. This applies to the headline, the
  hero's supporting line, and spread titles.
- **Spread titles must never wrap** — a wrapped title breaks the mask
  device. Single words, 8 characters or fewer is proven safe. Check at
  390px.
- **Never edit files with PowerShell `Get-Content`/`Set-Content` or
  `[IO.File]`.** PowerShell 5.1 reads BOM-less UTF-8 as ANSI and
  double-encodes every em dash and curly quote; `[IO.File]` resolves
  relative paths against the .NET process directory, not `Set-Location`.
  Both have already caused damage here. Use the editing tools, or Node.

---

## 7. Current state — honest

### Works
Everything on the list in §5 renders and is verified at 390/1024/1600.
Production build clean. Mobile navigation, the promise section, five real
testimonials, six real projects, three case-study routes.

### The one real gap
**Imagery.** Only Petrolas has files. Five project cards show a colour
field, and two case studies are roughly 60% flat colour. The structure
and the copy are done; these pages are blocked purely on assets.

### Parked
The 3D lanyard badge — `docs/parked/Lanyard.tsx`, excluded from tsconfig,
dependencies removed. Physics, rope and clip all worked; the card face
rendered blank because canvas textures never reached the material.
`/studio` ships the flat card, which was always the version that could
not fail.

---

## 8. What only Ali can supply

The trust stage is the middle of the funnel. No amount of design fixes
this.

- [ ] **Headshot** — for the studio card. The page's whole argument is
      "you'd be working with me" and it does not show him.
- [ ] **Logo / mark** — currently drawn in code as a placeholder. SVG.
- [ ] **Cover art + case-study imagery** for Delivery Point, Kids Island,
      Qobban, Nextshoot, Shawarma & Sauce
- [ ] **Years** for all six projects — every one currently reads "—"
- [ ] **Zainab Mohamed's job title** at Delivery Point
- [ ] **Confirmation of the four process steps** on `/studio`
- [ ] Qobban's testimonial is written and held back — Mohammed Mahdi
      speaks for both Petrolas and Qobban, and running him twice in one
      band reads as a shortage of clients

Live reference for the Petrolas brand: https://petrolas-v2.vercel.app/

---

## 9. Immediate next steps

1. **Wire in imagery** as files arrive. Paths: `public/work/<slug>/`.
   Nothing changes shape — spreads take an `assets` array and an optional
   `aperture`.
2. Case studies for Nextshoot and Shawarma & Sauce.
3. Real favicon, OG images, `sitemap.ts`, `robots.ts` — none exist, and
   this site is about to be shared in DMs and proposals where the link
   preview *is* the first impression.
4. Deploy.

Screenshot-review every one before calling it done.

---

## 10. Repo facts

- Next.js 16.2.10 (Turbopack), React 19.2.4, Tailwind v4, TypeScript
- Content layer: `src/data/lab.ts`. Components: `src/components/lab/`.
  (The `lab` naming is inherited from the prototype. Renaming it is
  cosmetic and touches every import — do it only if asked.)
- Verify with: `npx tsc --noEmit`, `npx eslint src --max-warnings=0`,
  `npm run build`, `node scripts/shots.mjs`
