# Personal Creative Portfolio — Ali Aljardabi

The launch site. Brand identity, websites and social media design for small
and growing businesses, from Manama, Bahrain.

Extracted from the `/lab` prototype in `personal-brand-website` on
2026-08-06 and promoted to real routes. That repo keeps the prototype and
a second, unrelated product; this one contains only the site that ships.

## Routes

| Route | What it is |
|---|---|
| `/` | Home — hero, showcase, work, proof, services, promise, contact |
| `/studio` | About: the "just me" argument |
| `/work/[slug]` | Case studies — `petrolas`, `qobban`, `delivery-point` |

Only projects with a `spreads` array are routable, so a project can be
listed on the home page long before it has a case study.

## Running it

```bash
npm install
npm run dev
```

## Look at the work before calling it done

```bash
node scripts/shots.mjs
```

Screenshots every route at 390 / 1024 / 1600 into `.shots/`. **Read the
PNGs.** Every visual defect this project has shipped — an arrow with no
arrowhead, a headline behind the navbar, a phone with no navigation, a
double-encoded em dash — was invisible to `tsc`, to eslint and to DOM
measurement, and obvious in a screenshot. Measurement is not seeing.

Pass `BASE_URL` if the dev server is not on port 3000.

## Verify

```bash
npx tsc --noEmit
npx eslint src --max-warnings=0
npm run build
```

## Rules that are not up for renegotiation

- **No invented proof.** No fabricated clients, metrics, testimonials,
  awards or dates. A testimonial's `role` is the SPEAKER's job title,
  never Ali's role on the project.
- **Sections with no data render nothing** rather than showing plausible
  placeholders. Stats and testimonials both self-hide.
- **Projects without cover art** show a designed pending state, never a
  borrowed image from another client. Same for case-study spreads whose
  assets have not arrived: they render their argument over a labelled
  panel.
- **Anything drawn into a canvas must also exist as real DOM text** — it
  is invisible to search engines and screen readers.
- **No new dependency** without stating its cost first. The tilt and the
  pointer companion were adapted rather than installed for exactly this
  reason.

## Still needed from Ali

- Headshot, and the logo mark (currently drawn in code)
- Cover art and imagery for every project except Petrolas
- Years for all six projects
- Zainab Mohamed's job title at Delivery Point
- Confirmation the four process steps on `/studio` are accurate — they
  describe a proposed engagement and are **unverified**
