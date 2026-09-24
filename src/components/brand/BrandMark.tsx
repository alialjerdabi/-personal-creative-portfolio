/**
 * A logo file drawn in `currentColor`.
 *
 * An <img> of an SVG cannot inherit colour, and the mark is a PNG that
 * could not anyway. Used as a CSS mask instead, both files take whatever
 * colour the text around them has — which is what lets one guide show
 * the same mark in ink, in white and on the accent without keeping three
 * copies of each file.
 */
export default function BrandMark({
  src,
  width,
  height,
  label,
  className = "",
}: {
  src: string;
  width: number;
  height: number;
  label: string;
  className?: string;
}) {
  const mask = `url(${src}) center / contain no-repeat`;
  return (
    <span
      role="img"
      aria-label={label}
      className={`block bg-current ${className}`}
      style={{
        aspectRatio: `${width} / ${height}`,
        mask,
        WebkitMask: mask,
      }}
    />
  );
}
