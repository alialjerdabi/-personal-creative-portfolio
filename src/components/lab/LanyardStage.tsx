import type { LabContent } from "@/data/lab";

/* Was imported from Lanyard.tsx, which is parked outside the compile
   graph — see below. The badge's own content type serves instead. */
type BadgeIdentity = LabContent["studio"]["badge"];

/**
 * The studio badge.
 *
 * THE 3D LANYARD IS PARKED (Ali's call, 2026-08-01). This component used
 * to mount `Lanyard` behind a dynamic import and swap to it once physics
 * reported ready. It no longer imports it at all, which is what allows
 * `three`, `@react-three/fiber`, `@react-three/drei`,
 * `@react-three/rapier` and `meshline` to leave the dependency tree — a
 * ~30MB install for one ornament on a page outside the core funnel.
 *
 * What was actually wrong: the rope, the clip and the physics all worked.
 * The card FACE rendered blank, because the canvas textures never reached
 * the material. `Lanyard.tsx` is kept in the repo with that note so the
 * work is not lost if it is ever picked back up.
 *
 * Only the flat card ships, and it was always the version that could not
 * fail — it is what the page showed before WebGL was up, and what it kept
 * showing on a lost context or a device that refused one.
 *
 * Note this is no longer a client component: with the dynamic import gone
 * there is no state and no effect left, so it renders on the server with
 * everything else.
 */
/*
  No caption. It used to read "Grab the card", which was an instruction
  for a rope that no longer exists; replacing it with the location just
  printed the card's own last line twice.
*/
export default function LanyardStage({ identity }: { identity: BadgeIdentity }) {
  return (
    <div className="relative flex h-full min-h-[26rem] w-full items-center justify-center p-8">
      <div className="flex w-[min(17rem,80%)] flex-col items-center gap-4 rounded-[1.1rem] bg-lab-card p-7 text-center shadow-[0_24px_60px_-30px_rgb(26_23_19/0.55)] ring-1 ring-lab-hairline">
        <span aria-hidden="true" className="h-1.5 w-14 rounded-full bg-lab-hairline" />

        {/*
          A labelled empty frame until Ali supplies a headshot. The page's
          whole argument is "you would be working with me", so the missing
          photograph is the one gap worth showing honestly rather than
          filling with a stock face or an initial.
        */}
        <span className="flex aspect-square w-full items-center justify-center rounded-[0.7rem] border border-dashed border-lab-hairline text-[13px] text-lab-ink-soft">
          photo
        </span>

        <span className="font-display text-lg font-bold leading-tight tracking-[-0.02em] text-lab-ink-warm">
          {identity.name}
        </span>
        <span className="font-display text-[13px] leading-snug text-lab-ink-soft">
          {identity.role}
          <br />
          {identity.location}
        </span>
      </div>
    </div>
  );
}
