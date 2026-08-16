# Codex task specs

One file per task. Build them **in order, one at a time**, and stop after
each for Ali's review.

| | | |
|---|---|---|
| `task-01` | aperture loading screen | done, reviewed, committed `6171ce0` |
| `task-02` | museum scroll + morph, and the board | ready |
| `task-03` | /studio becomes /about | Part A ready, Part B needs one number |
| `task-04` | drag the testimonial rail | ready |
| `task-05` | replace the films | blocked — one of three files missing |

That gating is not ceremony. Shipping several things and reviewing them
together is what produced six rounds of rework on the predecessor project,
and it is why `docs/master-brief.md` §6.6 exists.

## Before you touch anything, in every task

1. **Read `docs/master-brief.md` in full.** It is the constitution for this
   repo. Each spec re-states the traps that apply to it, but the brief
   carries the honesty rules and the design system, and it wins over
   anything you find elsewhere.
2. The sibling repo `personal-brand-website` is **not this product**. Do
   not read its docs and do not copy code between the two.

## Verification — the one rule that matters

**Look at the work before you say it is done.**

```bash
npx tsc --noEmit
npx eslint src --max-warnings=0
node scripts/shots.mjs
```

`scripts/shots.mjs` writes PNGs to `.shots/` at 390 / 1024 / 1600. **Open
them.** Every visual defect this project has shipped passed `tsc` and
eslint and was obvious in a screenshot: an arrow with no arrowhead, a
headline behind the navbar, a phone with no navigation, a card outside the
camera frustum. Measurement is not seeing.

**Run `shots.mjs` from PowerShell, not Git Bash.** Git Bash rewrites a `/`
argument into a Windows path, and the script then tries to navigate to
`http://localhost:3000C:/Program Files/Git/`. Hit on 2026-08-14.

## Amendments to the brief, current as of 2026-08-14

- **§6.3 (no new dependencies) is lifted for animation work.** Ali's call,
  2026-08-14. You may propose and install animation libraries. State the
  bundle cost of each one in your summary. Everything else in §6.3 stands
  — do not add dependencies for things a few lines of CSS already do.
- **noth.in is a sanctioned reference for motion and wireframe.** Ali has
  their approval to copy the chronicle animation and the wireframe. The
  brief's §3 lock on upsunday.co still governs the rest of the site's
  presentation and layout register.

## Never

- Invent clients, metrics, testimonials, awards, dates or years.
- Use one client's imagery to fill another's empty slot.
- Edit files with PowerShell `Get-Content`/`Set-Content` or `[IO.File]`.
  PowerShell 5.1 reads BOM-less UTF-8 as ANSI and double-encodes every em
  dash; `[IO.File]` resolves relative paths against the .NET process
  directory and has already written to the wrong repo once. Use your
  editing tools, or Node.
- Redesign anything you were not asked to redesign.
