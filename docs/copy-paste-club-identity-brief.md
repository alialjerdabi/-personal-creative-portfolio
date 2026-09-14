# Identity brief — three visual concepts

Companion to `MASTER.md` §7 (Visual identity). Two parts:

1. The name question — what "Copy Paste Club" does and does not promise.
2. Three copy-paste prompts for an image generator, each producing a full
   brand board. Concept 1 is deliberately close to Mobile Editing Club.

---

## Part 1 — The name

### The objection, stated plainly

The system being built is not a template shop. It reads a client's market,
finds their real strengths and openings, positions them against that, works
around their weaknesses, and learns which content and ad formats are actually
performing — then packages all of it so a non-technical owner can point their
own agents at it. "Copy Paste Club" sounds like the opposite: everyone gets the
same thing with a different product dropped in.

That objection is correct **about the product**. It is not correct about the
content.

### The split that resolves it

Two different things are being named, and they are being forced to share one
name:

| Layer | What it actually is | What the reader does | Name must promise |
|---|---|---|---|
| **Media / top of funnel** | Free tutorials, prompt drops, before/after | Copies a prompt, uses it tonight | Speed, zero friction, it works as-is |
| **Product / the engine** | Positioning + market analysis + format intelligence, run by the client's own agents | Feeds in their own business, gets a strategy and a kit that is theirs | Bespoke, analytical, compounding |

"Copy Paste Club" is a **very good name for the first layer** and a **bad name
for the second**. Copy-paste describes the reader's physical action on a free
post — not the output of the engine.

### Recommendation

**Keep Copy Paste Club as the media brand. Give the engine its own name.**
One house, two names, like Nike / Air Max or HubSpot / the Academy:

- **Copy Paste Club** — the account, the free posts, the freebies, rungs 0–1.
  Promise: copy it, paste it, it works tonight.
- **The engine** — rungs 2–4. Needs a name that says *this is yours, not a
  template*. Working candidates, none checked for availability yet:
  *Position Engine*, *Market Read*, *Own Your Lane*, *Edge Kit*, *Signal*,
  *Fit* (خزنة / بصمة / موقع / زاوية if the product name goes Arabic).

The tagline does the reconciling in one line:

> **Copy Paste Club — copy the method, not the market.**
> انسخ الطريقة، مو السوق.

That sentence is worth locking even if nothing else here is. It answers the
exact objection on the first slide of every carousel: the prompts are shared,
the positioning is not.

### If you would rather rename outright

You can. Per `MASTER.md` §10, **the domain is not registered and no handle is
claimed** — so the switching cost right now is zero, and it stops being zero
the day you register. That is the decision to make before anything is designed,
not after.

If renaming: the name should carry *fit* or *edge*, not *replication*. The risk
is the reverse of the current one — a strategy-sounding name makes the free
tutorials feel heavy and kills the "do it tonight" hook that grows the account.
Which is why the two-name split is the recommendation.

### What this changes in the brief

- `MASTER.md` §1 "The name is the promise" stays true for posts, and now has a
  stated limit: it governs the media layer, not the products.
- §4 rungs 2–4 get the engine's name once chosen.
- §7 requirements gain one: **the identity must hold two names** — a media
  lockup and a product lockup that read as the same house.
- The concept prompts below therefore use `[BRAND]` as a placeholder. Swap in
  whatever name survives; nothing in the visual system depends on the word.

---

## Part 2 — Three visual concepts

### How to run these

- Paste one prompt per generation. Do not merge them.
- Replace `[BRAND]` with the chosen name before generating.
- Generate at square or 4:5. Judge each at thumbnail size first — if the
  concept dies at 120px, it fails requirement §7.2.
- Arabic in generated images is usually malformed. Treat any Arabic in the
  output as a **shape placeholder** only; real Arabic gets set in the render
  pipeline, never by the image model.

---

### Concept 1 — "Workbench" (closest to Mobile Editing Club)

Light, calm, screenshot-first. The tutorial card is the whole design. This is
the safe one: proven format, lowest risk, most legible under a busy screenshot.

```
Brand identity board for "[BRAND]", an Arabic-language AI marketing education
brand for business owners. Flat 2D vector, no photography, no 3D.

Layout: one square board, 3x3 grid of white cards on a soft warm off-white
background (#F6F4F0), 32px gaps, subtle 1px warm grey borders, very soft
shadows.

Cell 1: wordmark lockup — "[BRAND]" set in a heavy geometric sans, tight
letterspacing, near-black (#141414), with a small solid accent square used as
a bullet between words.
Cell 2: color swatch row — off-white #F6F4F0, near-black #141414, warm grey
#9B948A, and a single strong accent in signal orange #FF5A1F. Each swatch a
rounded rectangle with its hex code beneath in small monospace.
Cell 3: type specimen — a Latin geometric sans shown large, and beneath it a
modern Arabic sans (Arabic glyphs drawn as clean geometric shapes) at the same
optical weight, demonstrating that the two sit together.
Cell 4, 5, 6: three mock tutorial carousel slides. Each slide is a phone
screenshot placeholder — a plain grey UI mockup with abstract buttons, sliders
and panels — sitting inside a thin rounded device frame, with a bold orange
circled number badge (1, 2, 3) in the top corner and one line of placeholder
caption text at the bottom.
Cell 7: a red-orange annotation study — the same grey UI mockup with a hand-
drawn style circle and arrow pointing at one small control, plus a short
callout label.
Cell 8: THE COPY BLOCK — the signature element. A dark charcoal rounded
rectangle containing left-aligned English monospace text set as a prompt, with
a few words highlighted in orange as variables, and a small copy icon in the
top-right corner. It must look unmistakably copyable.
Cell 9: three small level badges in a row, labeled L1, L2, L3, as solid pill
shapes in increasing accent intensity.

Style: clean, editorial, generous whitespace, Swiss grid discipline, high
contrast, absolutely no gradients, no violet, no lime, no purple. Feels like a
well-made manual, not a tech startup.
```

---

### Concept 2 — "Console" (the engine made visible)

Dark, systematic, monospace-led. This is the concept that answers the name
objection visually: it looks like a machine that reads a market and outputs a
position, not a folder of templates. Highest differentiation, highest risk —
dark grounds fight busy screenshots, so the screenshot cards stay light.

```
Brand identity board for "[BRAND]", an AI marketing system for business owners
that analyses a market and outputs a positioning kit. Flat 2D vector, no
photography, no 3D.

Layout: one square board on a deep charcoal background (#11130F), content
organised in a strict modular grid with thin 1px hairline dividers in dark
olive-grey.

Include:
- Wordmark: "[BRAND]" in a technical monospace with a blinking-cursor block
  after the final letter, set in warm bone white (#EDE8DE).
- Palette strip: deep charcoal #11130F, bone white #EDE8DE, slate #3A3F38, and
  one accent of signal amber #FFB020, each with hex in small mono type.
- A horizontal "pipeline" diagram reading RIGHT TO LEFT: four outlined
  rectangles joined by thin amber arrows pointing leftward, labelled in
  monospace, representing market input flowing into a positioned output. The
  arrows must point right-to-left, not left-to-right.
- A small bar chart module in amber on charcoal showing four unequal bars,
  labelled like a format-performance readout.
- A strengths/weaknesses module: a 2x2 quadrant grid, hairline outlines, one
  quadrant filled solid amber.
- THE COPY BLOCK: a bone-white rounded rectangle inset on the dark ground,
  containing left-aligned English monospace prompt text with variables
  highlighted in amber, and a small copy icon. It is the brightest object on
  the board — deliberately the loudest element.
- Two light-ground screenshot cards: plain grey app UI mockups on white cards
  that sit on the dark background, proving the system holds real screenshots.
- Badge set: L1, L2, L3 as outlined mono pills, plus two small tags reading
  "TUTORIAL" and "INSIGHT" in contrasting treatments.

Style: instrument panel, terminal, technical documentation. Precise, quiet,
confident. Amber is the only color. No gradients, no glow, no neon, no violet,
no lime, no purple, no cyberpunk cliché.
```

---

### Concept 3 — "Blueprint" (analyst, not template shop)

Diagram-led and paper-like. Positions the brand as the strategist in the room.
Strongest for rungs 2–4 and for the "show the system" pillar; weakest for the
fast, casual tutorial post.

```
Brand identity board for "[BRAND]", a strategy and AI marketing system for
business owners. Flat 2D vector, technical-drawing aesthetic, no photography,
no 3D, no isometric.

Layout: one square board on a pale blue-grey paper ground (#E8EBE6) with a
faint 8mm graph grid printed across the whole surface, plus small registration
marks in the corners.

Include:
- Wordmark: "[BRAND]" in a precise grotesque, set inside a thin ruled rectangle
  with small dimension lines and tick marks running along its edges, as if
  measured on a draughtsman's sheet. Ink black (#1A1D1A).
- Palette: paper #E8EBE6, ink black #1A1D1A, drafting blue #2E5E8C, and one
  correction red #D63A21 reserved for annotation only, shown as swatches with
  hex codes.
- A market-map module: a 2x2 positioning matrix with axis labels, small plotted
  dots, and one dot circled in correction red.
- A right-to-left process flow: four thin-outlined circles joined by arrows
  pointing leftward, each circle containing a simple icon. Arrows must run
  right to left.
- A before/after module: two stacked rectangles, the upper one plain grey, the
  lower one the same shape with annotation marks and a red callout, joined by a
  leftward arrow.
- THE COPY BLOCK: a crisp white rectangle with a hard 2px ink border and a
  small tab label at its top-left corner, containing left-aligned English
  monospace prompt text with variables underlined in drafting blue, and a copy
  icon. It reads like a specimen pinned to the sheet.
- Badges: L1, L2, L3 drawn as small stamped squares with ink borders, plus
  "TUTORIAL" and "INSIGHT" as rubber-stamp style labels.
- One light screenshot card: a plain grey app UI mockup on white, pinned to the
  grid with small corner marks.

Style: architect's drawing, field manual, engineering specification sheet.
Restrained, credible, slightly analogue. No gradients, no violet, no lime, no
purple, no blueprint-white-on-blue cliché — this is ink on pale paper, not a
negative blueprint.
```

---

## How to judge the three

Against `MASTER.md` §7:

| Requirement | Concept 1 Workbench | Concept 2 Console | Concept 3 Blueprint |
|---|---|---|---|
| Holds busy screenshots | Best | Needs light cards | Good |
| Reads at thumbnail | Good | Best (amber on dark) | Weakest (grid noise) |
| Arabic + Latin together | Best | Needs care in mono | Good |
| Copy block as hero | Good | Best | Good |
| Level + type badges | Good | Best | Good |
| Says "positioning, not template" | Weakest | Best | Best |
| Risk of looking like MEC | Highest | None | None |

A defensible outcome is a hybrid: **Concept 1's light tutorial cards carrying
Concept 2's copy block and badges**, with Concept 3's diagram language reserved
for the "show the system" and "real insights" pillars. Generate all three
before deciding.

---

## Open, for Ali

1. The name split — one name or two? Decide before registering the domain.
2. If two: what does the engine promise in three words?
3. Does the founder appear in the identity at all (a founder mark, a signature),
   or is the account fully faceless? (`MASTER.md` §11.4.)
