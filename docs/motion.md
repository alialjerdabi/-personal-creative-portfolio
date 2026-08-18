# Motion rules

Status: drafted 2026-08-18 from measurements of the two reference sites,
at Ali's direction. This is the constitution for movement in this repo —
if a component animates and is not covered here, it is wrong.

## What the references actually do

Not impressions. Values read out of the live pages.

### symbolstudio.pl

| | |
|---|---|
| Easing | `cubic-bezier(.44, 0, .56, 1)` — one curve, used everywhere |
| Durations | 400ms, 600ms, 800ms. Nothing else |
| Entrance distance | 5–10px on inline spans; larger on blocks |
| Trigger | **Enter once.** Scrubbing a sweep after the animations fire shows nothing moving |
| Sticky | Section stacking only — pinned panels at increasing offsets |

The easing is the finding. `.44, 0, .56, 1` is close to symmetric — it
accelerates and decelerates about equally, which is why their motion
reads as *considered* rather than as snappy UI. Most sites reach for
`ease-out`, which starts fast and is why they feel like software.

### noth.in

| | |
|---|---|
| CSS transitions | `0.3s ease`, opacity only |
| Real motion | JavaScript, writing inline transforms — 169 transformed elements |
| Text | Line-by-line masks, translating Y **11–75px** |
| Sticky | Two elements. The scroll work is transforms, not pinning |

Their signature is the **line mask**: text clipped by its own line box and
sliding up from behind it. Not a fade — a reveal.

## The rules

### 1. One easing

```
--ease-motion: cubic-bezier(0.44, 0, 0.56, 1);
```

Everything scroll- or state-driven uses it. Two exceptions, both
deliberate: a scrubbed scroll value uses `smoothstep` in JS (the museum
already does), and a hover state may use a faster ease-out, because a
hover answers a pointer and should feel immediate.

### 2. Three durations

| Token | Value | For |
|---|---|---|
| `--dur-quick` | 260ms | Hover, focus, small state changes |
| `--dur-base` | 520ms | Entrances. The default |
| `--dur-slow` | 800ms | Large surfaces — a full-bleed image, a panel |

Nothing between. A duration that is not one of these is a decision
nobody made.

### 3. Three distances

| Token | Value | For |
|---|---|---|
| `--rise-text` | 12px | Lines, labels, paragraphs |
| `--rise-block` | 28px | Cards, panels, list items |
| Mask | 100% | Images and media — travels its own height |

### 4. Enter once. Never leave.

Elements animate **in** and stay. Nothing animates out as it leaves the
viewport.

This is measured, not taste: symbolstudio's elements do not move again
after they arrive. On a page of 8,000–9,500px — which every page here now
is — animating content away while the reader is still passing it is the
fastest way to make motion feel like interference.

The one exception is a scrubbed sequence the reader is deliberately
driving, like the museum reveal, where the scroll IS the transport.

### 5. Stagger is 60ms, and it stops at six

Siblings enter 60ms apart. Past six items the delay caps, or the last
card in a long grid arrives a second after the first and the reader has
already moved on.

### 6. Morph is for scale, not position

The "size morph" — an element growing into place — is reserved for
things that are genuinely changing size: the hero aperture, the museum
screen, a card being opened. It runs `scale(0.94) → scale(1)` paired with
opacity, never with a large translate at the same time. Two large
simultaneous transforms read as a bounce.

### 7. Composited properties only

`transform` and `opacity`. Never `width`, `height`, `top`, `left`,
`margin` — those trigger layout on every frame and are how a scroll
becomes sticky on a mid-range phone.

### 8. `prefers-reduced-motion` removes movement, never content

Under reduced motion everything renders in its final state immediately.
Nothing is hidden, nothing is delayed, no information is behind an
animation that never runs.

### 9. Server-render visible

Entrances arm themselves after hydration and only for elements still
below the fold. Without JavaScript the page is complete — a reveal that
hides content until a script runs is a reveal that can fail closed.

## Library

**GSAP, which is already a runtime dependency.** It already provides the
two things asked for: `Flip` for size morph and `ScrollTrigger` for
scroll-driven sequences.

Rejected, with reasons:

- **Motion / Framer Motion** — a second animation runtime for behaviour
  GSAP already covers. ~30KB to express the same rules twice.
- **Lenis** — smooth scroll changes scrolling globally and fights CSS
  `position: sticky`, which the museum pin and the services stack both
  depend on. Would need proving before adopting, not adopting then
  proving.
- **AOS / similar** — the `Reveal` primitive here already does this, with
  the reduced-motion and no-JS behaviour those libraries get wrong.

## Where it is implemented

`src/components/ui/Reveal.tsx` is the primitive; the tokens live in
`globals.css`. Scrubbed sequences (museum, hero threshold, services
stack) own their own rAF loops and read the same tokens.
