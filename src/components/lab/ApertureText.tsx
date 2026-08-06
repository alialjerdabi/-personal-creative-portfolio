import type { CSSProperties } from "react";
import type { ApertureAsset } from "@/data/lab";

/**
 * The custom properties the `.aperture` rule in globals.css consumes.
 * Exported because the loader builds aperture layers imperatively and
 * needs to write the same two properties from GSAP.
 */
export function apertureStyle(aperture: ApertureAsset): CSSProperties {
  return {
    "--aperture-image": `url(${aperture.src})`,
    "--aperture-position": aperture.position,
  } as CSSProperties;
}

interface ApertureTextProps {
  children: string;
  aperture: ApertureAsset;
  className?: string;
}

/**
 * A word cut out of imagery — the Mask direction's signature mechanic.
 *
 * The text is real text: it stays in the DOM, stays selectable, and is
 * read normally by assistive technology. Only the fill is an image, and
 * where `background-clip: text` isn't supported the CSS falls back to
 * solid ink, so the composition never depends on the effect landing.
 */
export default function ApertureText({
  children,
  aperture,
  className = "",
}: ApertureTextProps) {
  return (
    <span className={`aperture ${className}`.trim()} style={apertureStyle(aperture)}>
      {children}
    </span>
  );
}
