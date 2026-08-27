import type { LabPalette } from "@/data/lab";

/**
 * One phrase of a sentence, set in the service's own colour.
 *
 * The scanning aid Ali asked for (2026-08-26): someone moving down
 * /services at speed reads four coloured phrases rather than four
 * paragraphs, and still gets what each service is for.
 *
 * IT USES THE INK VALUES, NOT THE FIELDS. `--lab-lime` is a card
 * background measured against dark ink on top of it; as text on the page
 * ground it is 1.13:1, which is not a word anyone can read. `ACCENT_INK`
 * maps to the same hues solved for text — see the palette block in
 * globals.css.
 *
 * A MISSED KEYWORD IS NOT AN ERROR. If the phrase is not found the plain
 * sentence renders. The alternative — throwing, or highlighting a
 * fragment — turns a copy edit into a broken page.
 */

export const ACCENT_FIELD: Record<LabPalette, string> = {
  orange: "var(--lab-orange)",
  blue: "var(--lab-blue)",
  lime: "var(--lab-lime)",
  violet: "var(--lab-violet)",
  cream: "var(--lab-cream)",
  teal: "var(--lab-teal)",
  sun: "var(--lab-sun)",
  amber: "var(--lab-amber)",
};

export const ACCENT_INK: Record<LabPalette, string> = {
  orange: "var(--lab-orange-ink)",
  blue: "var(--lab-blue-ink)",
  lime: "var(--lab-lime-ink)",
  violet: "var(--lab-violet-ink)",
  cream: "var(--lab-cream-ink)",
  teal: "var(--lab-teal-ink)",
  sun: "var(--lab-sun-ink)",
  amber: "var(--lab-amber-ink)",
};

export default function Keyed({
  text,
  keyword,
}: {
  text: string;
  /** Must appear verbatim in `text`. Omitted or unmatched renders plain. */
  keyword?: string;
}) {
  if (!keyword) return <>{text}</>;
  const at = text.indexOf(keyword);
  if (at < 0) return <>{text}</>;

  return (
    <>
      {text.slice(0, at)}
      <span className="lab-key">{keyword}</span>
      {text.slice(at + keyword.length)}
    </>
  );
}
