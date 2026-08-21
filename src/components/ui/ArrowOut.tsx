/**
 * The "leaves this site" arrow.
 *
 * DRAWN, NOT TYPED. It was the character U+2197, which carries an emoji
 * presentation as well as a text one — and the platform picks. Desktop
 * fell back to the text glyph and iOS chose the colour emoji, so the same
 * button shipped two different arrows depending on who was looking. A
 * variation selector would force the text form, but it is an invisible
 * character in the source that any later edit can drop without trace.
 *
 * An SVG cannot be reinterpreted. It sizes to the text with `1em` and
 * takes `currentColor`, so it inherits weight and colour from the label
 * exactly as the glyph did.
 */
export default function ArrowOut({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M4.5 11.5 11.5 4.5" />
      <path d="M5.75 4.5h5.75v5.75" />
    </svg>
  );
}
