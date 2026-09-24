/**
 * WCAG 2 contrast, computed rather than typed in.
 *
 * The guide prints a ratio beside every colour pairing. Those numbers are
 * derived here from the hex values in the brand file, so they cannot
 * drift from the colours they describe — a hand-typed "6.7:1" survives a
 * palette change and quietly becomes a lie.
 */

function channel(value: number) {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.replace(/./g, (c) => c + c) : h;
  const n = parseInt(full.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance(hex: string) {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Whichever of two inks reads better on `ground`. */
export function bestInk(ground: string, dark = "#1a1713", light = "#ffffff") {
  return contrast(ground, dark) >= contrast(ground, light) ? dark : light;
}

export function rgbString(hex: string) {
  return `rgb(${hexToRgb(hex).join(" ")})`;
}
