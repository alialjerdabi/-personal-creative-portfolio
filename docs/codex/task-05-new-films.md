# Task 05 — Replace the films

Read `docs/codex/README.md` first.

## Ali's request, verbatim

> i want it to change the videos used with the new uploaded 3 videos, 2 of
> them belongs to one ad and the third is separate

## The three films — confirmed by Ali 2026-08-16

All in `~/Downloads`, all 1280x720 h264. **These three replace the
current set entirely.**

| # | file | length | size | subject |
|---|---|---|---|---|
| 1 | `hf_20260812_041245_9004b0c9-f94a-4638-be41-b647f0713af5 (1).mp4` | 10.08s | 13.2MB | the watch — hero shots on a cabin table, on the wrist at the helm |
| 2 | `hf_20260812_032358_52942205-a00d-470b-bb62-0b926f10bf80.mp4` | 15.07s | 18.7MB | the same yacht under sail, the cabin interior |
| 3 | `hf_20260813_043754_efcc6ab1-1644-40e7-a41b-1ea84378fe3a.mp4` | 15.04s | 16.6MB | perfume — burgundy bottle with a gold snake, candlelit |

**Films 1 and 2 are the same ad**, confirmed by Ali and by frame
sampling: same yacht, same man, same grade. Film 3 is separate.

A fourth video sits in Downloads — `hf_20260810_200356_...`, a garment
rack in a showroom. **It is not part of this set. Do not install it.**

### The two cuts are ONE campaign — caption them as one

This is an honesty point, not a layout preference. Presenting two cuts of
a single ad as two separate campaign films inflates the body of work on
display, which is the same thing the brief forbids everywhere else. Two
cuts of one ad, said plainly, is still three exhibits' worth of craft and
it is true.

How that reads in the museum is your call — one exhibit that runs both
cuts, or two exhibits that share a campaign label. Say which you chose
and why.

## The work

### Weight — this is the real problem

The current three films are **6.51MB total**. These three are **48.5MB**,
seven and a half times the set they replace. The homepage loads its video
through `ApertureLoader`, which now waits on real bytes — so a straight
swap turns a fast loader into a guaranteed 12-second hard timeout on
anything but a fast connection, on every first visit.

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

The existing captions read "a watch, at sea", "under sail", and "a
material study". The first two still describe films 1 and 2 accurately.
The third is now a fragrance film and its caption must change.

None of the three has a named client. Describe what is on screen and
attribute nothing.

## Done means

`npx tsc --noEmit` clean, `npx eslint src --max-warnings=0` clean,
`node scripts/shots.mjs` from PowerShell, **PNGs opened** at 390 / 1024 /
1600 — and the museum checked with each film actually playing, not just
its poster. Report the byte count before and after re-encoding.
