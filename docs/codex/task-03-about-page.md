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

### Copy from Ali — TO BE FILLED

<!-- Ali's answers go here before Part B begins. Nothing in this section
     may be written by an agent. -->

_(pending)_

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
