# Task 04 — Drag the testimonial rail

Read `docs/codex/README.md` first.

## Ali's request, verbatim

> i want the review section interactive where i can hold them and scroll
> between reviews

Hold and drag to move between quotes. It should feel like pushing a
physical rail, not like operating a carousel — no arrows, no dots unless
you find you need them.

## What is there now, and why it fights you

`src/components/lab/Testimonials.tsx` renders `.lab-rail` wrapping a
`.lab-rail-track`. The CSS is in `src/app/globals.css` around lines
660-710. Read it before touching anything.

The mechanism is **two different things depending on motion preference**:

| | `.lab-rail` | `.lab-rail-track` |
|---|---|---|
| reduced motion | `overflow-x: auto` | static |
| motion welcome | `overflow-x: **hidden**` | `animation: lab-rail-drift 64s linear infinite`, a doubled track translated to `-50%` |

**The trap:** when motion is welcome the rail does not scroll — it is
`overflow: hidden` and the movement is a CSS `transform`. Drag-to-scroll
sets `scrollLeft`. On a hidden overflow there is nothing to set, so a
naive drag handler does nothing at all and looks like a dead pointer.
This is the whole difficulty of the task.

### The way through

Drive the loop from **`scrollLeft`** instead of from `transform`, and make
`.lab-rail` a real scroller in both states. The doubled track already
exists, so wrap `scrollLeft` at the halfway point to keep the seamless
loop. Drag then works because there is genuinely something to scroll, and
native touch scrolling works for free.

If you find a better route, take it — but state why, and do not leave the
rail with two mechanisms fighting over the same pixels.

## Requirements

- **Hold and drag** moves the rail, following the pointer 1:1.
- **The drift survives.** It still auto-advances when untouched, and it
  still pauses on hover and on `focus-within`. Those pauses exist because
  a marquee nobody can stop is unreadable, and because a keyboard user
  would otherwise be tabbing into a moving target. Do not drop them.
- **Do not hijack touch.** With a real scroller, mobile gets native
  momentum scrolling. Intercept mouse, let touch fall through — a
  hand-rolled touch scroller will feel worse than the platform's.
- **A drag must not swallow a click.** The panels contain real links.
  Use a small movement threshold so a click still lands and only a
  genuine drag suppresses it.
- **`prefers-reduced-motion`** keeps no auto-drift, but drag and native
  scroll must still work — that state is currently the *more* functional
  of the two and must not regress.
- **Keyboard and screen readers keep working.** The rail is readable
  content, not a toy. Do not trap focus and do not remove the scroller
  semantics.
- Cursor should signal it can be grabbed.

## Do not

- Add arrows, dots or autoplay controls unless Ali asks.
- Change the quotes, the names, the roles or the panel design. This task
  is the interaction only. Zainab Mohamed's title in particular is real
  and confirmed — do not touch the content layer.

## Done means

`npx tsc --noEmit` clean, `npx eslint src --max-warnings=0` clean,
`node scripts/shots.mjs` from PowerShell, **PNGs opened** at 390 / 1024 /
1600.

A drag cannot be verified from a screenshot. Drive it: script a
pointer-down, a move, and a pointer-up, and assert the rail actually
moved. Then do the same with a 2px move and assert a link still receives
its click. Report what you tested and what you saw.
