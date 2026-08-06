"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { LanyardIdentity } from "@/components/lab/Lanyard";

/*
 * The badge is a WASM physics engine plus drei — the heaviest thing on the
 * site by a wide margin. Deferring it to the client, on this route only,
 * is what keeps the homepage from paying for it.
 *
 * This wrapper exists because `ssr: false` is not allowed from a Server
 * Component, and the /studio page is a server component so it can own its
 * metadata. The boundary is one file rather than pushing the whole page
 * client-side.
 */
const Lanyard = dynamic(() => import("@/components/lab/Lanyard"), {
  ssr: false,
  loading: () => null,
});

/**
 * A flat card, in the DOM, in the site's own typeface.
 *
 * This is what the page shows before WebGL is up — and what it keeps
 * showing if WebGL never arrives: a lost context, a device that refuses
 * one, or physics that fails to load. The 3D badge is the delight, and a
 * page whose central element can silently render nothing is a page that
 * is broken for someone. This is the version that cannot fail.
 */
function StaticCard({ identity }: { identity: LanyardIdentity }) {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="flex w-[min(15rem,70%)] flex-col items-center gap-4 rounded-[1.1rem] bg-lab-card p-6 text-center shadow-[0_24px_60px_-30px_rgb(26_23_19/0.55)] ring-1 ring-lab-hairline">
        <span aria-hidden="true" className="h-1.5 w-14 rounded-full bg-lab-hairline" />
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

export default function LanyardStage({
  identity,
  hint,
}: {
  identity: LanyardIdentity;
  hint: string;
}) {
  const [live, setLive] = useState(false);

  return (
    /*
      No panel. The badge hangs in the page itself — boxing it inside a
      framed card cropped the lanyard and left no room to swing it, which
      is the whole point of the thing. Taller, unbounded, transparent.
    */
    <div className="relative h-[82svh] min-h-[32rem] w-full">
      {!live && (
        <div className="absolute inset-0">
          <StaticCard identity={identity} />
        </div>
      )}

      <Lanyard identity={identity} onReady={() => setLive(true)} />

      <p className="pointer-events-none absolute inset-x-0 bottom-5 text-center font-display text-[13px] font-bold uppercase tracking-[0.14em] text-lab-ink-soft">
        {live ? hint : identity.role}
      </p>
    </div>
  );
}
