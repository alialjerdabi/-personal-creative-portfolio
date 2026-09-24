import type { BrandColour } from "@/data/brands/types";
import { bestInk, contrast, rgbString } from "@/lib/contrast";
import CopyButton from "./CopyButton";

const LIGHT_GROUND = "#f1efe9";

function ratio(a: string, b: string) {
  return `${contrast(a, b).toFixed(1)}:1`;
}

/**
 * One colour, every way a person needs to take it away.
 *
 * The field copies its hex. Beneath it, the RGB and the token copy on
 * their own, because a developer wants `var(--lab-air)` and a designer in
 * Figma wants the hex, and neither should have to edit what they pasted.
 * Contrast is computed from the values, never typed.
 */
export default function Swatch({
  colour,
  size = "md",
}: {
  colour: BrandColour;
  size?: "md" | "lg";
}) {
  const ink = bestInk(colour.hex);

  return (
    <figure className="flex h-full flex-col overflow-hidden rounded-2xl border border-lab-hairline bg-lab-card">
      <CopyButton
        value={colour.hex}
        label={`Copy ${colour.name}, ${colour.hex}`}
        className={`relative flex w-full flex-col justify-between p-4 text-left ${
          size === "lg" ? "aspect-[4/3]" : "aspect-[5/2] min-[480px]:aspect-[5/4]"
        }`}
        style={{ backgroundColor: colour.hex, color: ink }}
      >
        <span className="font-display text-[15px] font-bold tracking-[-0.01em]">
          {colour.name}
        </span>
        <span className="font-mono text-[13px] uppercase">{colour.hex}</span>
      </CopyButton>

      <figcaption className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-[13px] leading-snug text-lab-ink-soft">{colour.role}</p>

        {colour.owners && colour.owners.length > 0 && (
          <p className="text-[13px] leading-snug text-lab-ink-warm">
            {colour.owners.join(" · ")}
          </p>
        )}

        <dl className="mt-auto grid gap-1.5 font-mono text-[12px] text-lab-ink-soft">
          <Row term="RGB">
            <CopyButton value={rgbString(colour.hex)} className="brand-copy--inline">
              {rgbString(colour.hex)}
            </CopyButton>
          </Row>
          {colour.token && (
            <Row term="Token">
              <CopyButton value={`var(${colour.token})`} className="brand-copy--inline">
                {colour.token}
              </CopyButton>
            </Row>
          )}
          {colour.dark && (
            <Row term="Dark">
              <CopyButton value={colour.dark} className="brand-copy--inline">
                <span
                  aria-hidden="true"
                  className="mr-1.5 inline-block size-2.5 rounded-full border border-lab-hairline align-[-1px]"
                  style={{ backgroundColor: colour.dark }}
                />
                {colour.dark}
              </CopyButton>
            </Row>
          )}
          {colour.ink && (
            <Row term="Text">
              <CopyButton value={colour.ink} className="brand-copy--inline">
                <span
                  aria-hidden="true"
                  className="mr-1.5 inline-block size-2.5 rounded-full align-[-1px]"
                  style={{ backgroundColor: colour.ink }}
                />
                {colour.ink} · {ratio(colour.ink, LIGHT_GROUND)}
              </CopyButton>
            </Row>
          )}
          <Row term="On field">
            <span>
              {ink === "#ffffff" ? "White" : "Ink"} · {ratio(colour.hex, ink)}
            </span>
          </Row>
        </dl>
      </figcaption>
    </figure>
  );
}

function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="shrink-0 uppercase tracking-[0.08em]">{term}</dt>
      <dd className="min-w-0 truncate text-right text-lab-ink-warm">{children}</dd>
    </div>
  );
}
