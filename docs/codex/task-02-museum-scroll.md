# Task 02 — The museum scroll and morph animations

Read `docs/codex/README.md` first.

## Ali's request, verbatim

> create the museum scroll effect and other morph animation directly from
> noth.in as i got their approval to copy the chronical animation and
> wireframe and ask it to use the 2 hall images to create the animation

## Permission

**Ali has noth.in's approval to copy the chronicle animation and the
wireframe.** Do not hedge, water this down, or substitute an
"inspired-by" version. Match the motion.

What that approval does **not** cover, per the brief's honesty rules:
their copy, their imagery, their brand or their name treatment. The
motion and the wireframe, yes. Their content, no.

## The two hall images

Already on disk, committed unreferenced in `eba2b7c` for exactly this
task:

| file | size | role |
|---|---|---|
| `public/hall/wide.jpg` | 1672x941 (1.78) | desktop |
| `public/hall/tall.jpg` | 1122x1402 (0.80) | mobile |

**Measured aperture in `wide.jpg`** — the black screen rectangle:
left 36.78%, top 37.94%, 26.50% x 25.82%, ratio 1.82. Near 16:9, so an
exhibit drops in without distortion.

**Measure `tall.jpg` yourself.** The automated scan merged its screen with
the dark ceiling and returned a bad top edge.

## What is there now

`src/components/lab/MuseumScreen.tsx` draws the room in CSS — four spans
at roughly lines 216-229: two skewed side-wall gradients, a pair of
ceiling light bars, and a floor gradient with the screen's light pool. All
of them already fade out as `--push` grows, which is the dolly-in.

Read that file's header comment before changing anything. It explains why
the pin is CSS `sticky` rather than ScrollTrigger, and why the exhibit
selection uses an IntersectionObserver over markers rather than
ScrollTrigger positions — ScrollTrigger measures at creation, and the
images above this section finish decoding afterwards, moving every
position it recorded. That failure has already happened twice here.

## The work

Replace the CSS room with the renders. The real job is alignment, not
markup:

1. The exhibit must sit **inside the render's own screen aperture** at
   rest. If it does not, the dolly-in begins with a screen floating over a
   picture of a screen.
2. The render must fade out as `--push` grows, before the push gets far
   enough to reveal its pixels. The current gradients already do this —
   inherit the same curve.
3. `wide` / `tall` map onto the responsive split already in the file.

Then the morph animations from noth.in's chronicle, per Ali's request.

## Do not remove

The visible caption list beneath the room. It is the same content stated
plainly for anyone who cannot use a pinned scroll experience, and every
exhibit stays in the DOM always and cross-fades precisely so the captions
are real text a screen reader and a search engine read in order. Nothing
unmounts. Keep that property.

## Traps that apply here

- **Tailwind v4 `translate-*` / `scale-*`** compose with GSAP's
  `transform` rather than being overridden by it. Inline transforms for
  anything animated.
- **A `gsap.to` with a scrubbed ScrollTrigger** captures its start value
  at creation. Use `fromTo` with `immediateRender: false`.
- **`gsap.context(fn, ref)` scopes selector STRINGS to that ref.** Pass
  elements for anything outside the container.
- **Turbopack serves stale CSS.** Computed value ≠ file value means delete
  `.next` and restart.
- The homepage already carries 6.51MB of video across three films. Two
  more full-bleed images is real weight — state what you added.

## Done means

`npx tsc --noEmit` clean, `npx eslint src --max-warnings=0` clean,
`node scripts/shots.mjs` from PowerShell, and **the PNGs opened** at
390 / 1024 / 1600. A pinned scroll effect cannot be verified from a single
frame — capture the room at rest and mid-push and look at both. Report the
bundle cost of any library you installed.
