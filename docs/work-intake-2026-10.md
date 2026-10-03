# Two new projects — Kiko Melt and Sweetest Days

Opened 2026-10-03. Both slots are in `src/data/lab.ts`, both carry
`wip: true`, both are **uncommitted and not live**. Neither is in the sitemap —
confirmed, it still returns the same 11 URLs.

---

## Kiko Melt — self-initiated, not a client

Ali's instruction: treat it as a case study project, not commissioned work. The
card and the popup both lead with "Self-initiated, not a client job." That line
is load-bearing. Every other project on `/work` was paid for by the business
named on it, and a visitor who cannot tell the difference has been misled by
omission.

**Built:** cover plus seven spreads — Mark, Field, Cups, Menu, Social, Loops,
Shop — from the boards supplied on 3 October.

The three logo colourways were cut out of the single 9:20 sheet: as one tall
plate it stood 1200px beside a 720px neighbour and the row stopped reading as a
row. Two of the files sent were lower-resolution copies of boards already in
(`cups`, `merch`) and were dropped in favour of the 1932px versions; the bare
wordmark PNG was dropped too, since the three colourways say the same thing
better. Everything else is placed.

Two defects fixed on the way through. `ratio` on a LabAsset is a **Tailwind
class**, not a CSS ratio — the five plates shipped on 3 October carried
`ratio: "3 / 4"`, which is not a class, so they all rendered at the default 2:3
and were cropping the boards. They are `aspect-[3/4]` now. And a lone plate in
a `plates` spread was taking a third of the row, which made the colour board's
hex values about 7px tall; one asset now takes half the row. No other project
has a one-asset plates spread, so nothing else moved.

### Three things before this publishes

1. **The store link is withheld, on purpose.** `kiko-melt-store.vercel.app`
   answers 200, but `index.html` in that repo ships `4.9 from 1,240 orders ·
   96% reorder` and six named five-star reviews — Noor A., Hussain M., Layla
   S., Dana K., Ahmed R., Fatima A. All invented. MASTER.md already says they
   must not ship as real. A button on your portfolio sending a prospect at
   fabricated testimonials is worse than no button. Strip that section,
   redeploy, then `live:` is one line and the store spread goes in with it.
2. **The Arabic is unread by you.** It runs across the social board, the menu
   and the packaging, drafted by Claude, never checked by anyone who reads it.
   This is why `wip` is set.
3. **The boards say `KIKI MELT / BRAND IDENTITY` in the top-right corner.** The
   wordmark says KIKO. Fix at source and re-export at the same filenames and I
   will swap them in; these are portfolio boards and a typo in the project
   label is the first thing an art director's eye lands on.
4. **The shop, uniform and drink frames are visualisations, not photographs.**
   MASTER.md says so and the spread note now says so too, in its first
   sentence. That line comes off only when there is a shop to photograph.

Still in `creative/campaigns/kiko-melt/` and unused here: around 380 files,
including the exports decks and the Behance set. Worth mining when the case
study grows past five plates. Two landmines named in MASTER.md — the library
holds a dead V1 identity (brown and pink, script wordmark, cookie-with-a-face),
and `assets/logo-ref.png` plus `05-store-and-menu.png` are both V1. Red
wordmark and the Loop bird is the test any new image has to pass.

---

## Sweetest Days — a real client, mid-engagement

`sweetest-days.com` resolves and answers 200. Children's parties and events in
Bahrain: bouncy castles, slides, trains, games, food stations, characters.
Arabic-first and right to left, built around a three-question planner instead of
a rental catalogue.

**Built:** card plus two spreads — the live site in browser chrome (desktop at
1440 and phone at 390, both captured from production today), and a Brand
identity spread written ahead of its imagery, rendering its pending panel.

`disciplines` says Websites only. Branding goes in when branding exists — that
is why the project is `wip`: showing a website and calling the job finished
describes the engagement wrongly.

### What it needs

- **A real cover.** What is there is a browser capture. Honest, and a
  placeholder. Qobban's cover is a presentation mockup; this deserves the same.
- **Your account of what they came in with.** The summary describes what the
  site does, which is true but thinner than the truth.
- The branding, when it is done.

---

## The case-study page you are considering

Worth doing, and it is a different page from `/work`. `/work` answers *what did
he make*; a process page answers *how does he think*, which is the question a
BHD 950 client is actually asking. Four projects is the right number.

Two things to settle before it gets built: whether it replaces the per-project
case studies at `/work/<slug>` or sits above them, and whether Kiko Melt being
self-initiated weakens a page about client process or strengthens it by being
the one project you can show every step of. My read is that it strengthens it,
as long as the page keeps saying which one was a job and which was not.

Not started. Say the word.
