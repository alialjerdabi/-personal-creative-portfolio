# Task 01 — Loading screen

Read `docs/codex/README.md` first.

## Ali's request, verbatim

> create a loading screen for the website so the user can look at
> something while the website loads the creative ad videos and assets.

## The approach — "the aperture" (Ali's pick, 2026-08-14)

The loader **is** the hall's screen, not a lid on top of it.

The page opens on black with a single rectangle at the exact size and
position the screen occupies in the hall render at rest. A small mono
counter sits inside it. When the assets are ready, the rectangle expands
to full-bleed and hands straight into the hero.

The point is that the loader and the museum share one motion vocabulary —
the same expand-from-the-aperture move the dolly-in already performs in
`MuseumScreen.tsx`. A visitor should not be able to say where the loading
screen ended.

**Measured aperture in `public/hall/wide.jpg`** (1672x941), the rest
position to open from:

| | |
|---|---|
| left | 36.78% |
| top | 37.94% |
| width | 26.50% |
| height | 25.82% |
| ratio | 1.82 |

`public/hall/tall.jpg` (1122x1402) is the mobile render. **Measure its
aperture yourself** — the automated scan merged the screen with the dark
ceiling above it and returned a bad top edge. Sample a column below the
ceiling line.

## What it must load

Real progress, not a fake timer. The weight this exists for is the
homepage video: four films in `public/reel/` at roughly 8.8MB total, plus
the hero stills. Drive the counter off actual decode/load events for the
film posters and hero stills. A timer that finishes before the assets do
is worse than no loader, because it hands over to a page that then stalls.

## Non-negotiable guards

These are the parts not to simplify away.

- **A hard timeout.** If an asset never loads — dead connection, a 404, a
  CDN hiccup — the loader must release anyway. A visitor trapped behind a
  loader on a failed image is a lost enquiry. Pick a ceiling and comment
  it.
- **Content is not gated behind JS.** The hero must still be
  server-rendered in the DOM underneath. The loader is an overlay that
  removes itself. If JS never runs, the visitor gets the site, not a black
  screen. The brief is explicit that anything drawn into a `<canvas>` must
  also exist as real DOM text, and the same reasoning applies here.
- **`prefers-reduced-motion`.** No expand animation; resolve immediately.
- **The overlay must be `aria-hidden` and must not trap focus.** When it
  removes itself, focus must not be left on a detached node.
- **`inert` must be a real boolean.** `inert=""` evaluates to false. This
  has bitten this codebase before.

## A decision to make and flag

Should the loader run on every page load, or once per session
(`sessionStorage`)? Once per session is kinder to someone browsing from
the homepage into a case study and back. **Build once-per-session, and say
in your summary that you did**, so Ali can overrule it in one line.

## Traps that apply here

- **Tailwind v4 `translate-*` / `scale-*`** compile to the CSS `translate`
  and `scale` properties, which *compose with* rather than override GSAP's
  `transform`. Use inline transforms for anything animated.
- **`gsap.context(fn, ref)` scopes selector STRINGS to that ref.** A
  loader that renders at page level is outside any container ref. Pass
  elements, not strings.
- **Turbopack serves stale CSS.** If a computed value disagrees with the
  file, delete `.next` and restart before debugging further.

## Done means

`npx tsc --noEmit` clean, `npx eslint src --max-warnings=0` clean,
`node scripts/shots.mjs` run from PowerShell and **the PNGs opened and
read** at 390 / 1024 / 1600. Report the bundle cost of any library you
installed.
