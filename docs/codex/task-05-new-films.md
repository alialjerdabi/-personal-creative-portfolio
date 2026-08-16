# Task 05 — Replace the films

Read `docs/codex/README.md` first.

## Ali's request, verbatim

> i want it to change the videos used with the new uploaded 3 videos, 2 of
> them belongs to one ad and the third is separate

## BLOCKED — only two of the three files exist

Searched the whole user profile and the workspace on 2026-08-16. Two new
videos are on disk, both in `~/Downloads`:

| file | size | subject |
|---|---|---|
| `hf_20260810_200356_eb835c57-da25-4a16-b33d-2c140d7c7bc6 (1).mp4` | 17.9MB | retail / garment rack — showroom, a shopper browsing shirts, closes on the rack alone as a product hero |
| `hf_20260813_043754_efcc6ab1-1644-40e7-a41b-1ea84378fe3a.mp4` | 16.6MB | perfume — burgundy bottle with a gold snake, candlelit |

Both are 1280x720, h264, 15.04s, 24fps.

**These two are not the same ad.** One is a retail fixture, one is a
fragrance. So the missing third belongs with one of them, and which one
changes how they are captioned and ordered. **Do not start until Ali
supplies the third file and says which two pair.**

## When the third arrives

### Weight — this is the real problem

The current three films are **6.51MB total**. These two alone are
**34.5MB**, which is 5x the whole existing set for two thirds of it. The
homepage already loads its video through `ApertureLoader`, which now
waits on real bytes — so a straight swap turns a fast loader into a
guaranteed 12-second hard timeout on anything but a fast connection.

**Re-encode before installing.** The existing films are the target: about
2MB for 15 seconds at 720p. `ffmpeg` is on the WinGet path and was used
for the current set — same treatment, no new dependency. State the
before/after byte count for each file.

### Then

- Install to `public/reel/`, following the existing naming and the
  `.jpg` poster beside each `.mp4`. Posters are not optional — they are
  what keeps the museum from showing a blank panel while a film arrives.
- Update the films in `src/data/lab.ts`. Read the surrounding comments
  first; the media union and the showcase frames both changed recently.
- `ApertureLoader` reads its video list from the same content, so it
  follows automatically. Verify that it does rather than assuming.

### Captions — do not invent them

The current captions are **descriptive, not attributed**, because Ali has
never said which client each film is for. A previous session produced one
wrong caption by reading a film's poster frame instead of the film.

Sample several frames across each film before describing it, and if Ali
has not named the campaign, describe what is on screen and attribute
nothing. **Never credit a film to a client who did not commission it.**

The two known so far, described from sampled frames rather than posters:
a retail fixture film, and a fragrance film. Neither has a named client.

## Done means

`npx tsc --noEmit` clean, `npx eslint src --max-warnings=0` clean,
`node scripts/shots.mjs` from PowerShell, **PNGs opened** at 390 / 1024 /
1600 — and the museum checked with each film actually playing, not just
its poster. Report the byte count before and after re-encoding.
