"use client";

import type { BrandGuide } from "@/data/brands/types";
import CopyButton from "./CopyButton";

/** The guide's colour and motion values as a paste-ready `:root` block. */
function toCss(brand: BrandGuide) {
  const colours = [...brand.colour.core, ...brand.colour.palette].filter((c) => c.token);
  const dark = brand.colour.core.filter((c) => c.token && c.dark);
  const [x1, y1, x2, y2] = brand.motion.easing.bezier;
  return [
    `/* ${brand.name} — brand tokens, revised ${brand.revised} */`,
    ":root {",
    ...colours.map((c) => `  ${c.token}: ${c.hex};`),
    `  ${brand.motion.easing.token}: cubic-bezier(${x1}, ${y1}, ${x2}, ${y2});`,
    ...brand.motion.durations.map((d) => `  ${d.token}: ${d.ms}ms;`),
    "}",
    "",
    ':root[data-theme="dark"] {',
    ...dark.map((c) => `  ${c.token}: ${c.dark};`),
    "}",
    "",
  ].join("\n");
}

/** The same values as design-token JSON, for Figma plugins and build tools. */
function toJson(brand: BrandGuide) {
  const entry = (c: BrandGuide["colour"]["core"][number]) => [
    c.name.toLowerCase().replace(/\s+/g, "-"),
    {
      $type: "color",
      $value: c.hex,
      ...(c.dark ? { $extensions: { dark: c.dark } } : {}),
      $description: c.role,
    },
  ];
  return JSON.stringify(
    {
      $description: `${brand.name} brand tokens, revised ${brand.revised}`,
      color: {
        core: Object.fromEntries(brand.colour.core.map(entry)),
        palette: Object.fromEntries(brand.colour.palette.map(entry)),
      },
      font: Object.fromEntries(
        brand.type.families.map((f) => [
          f.name.toLowerCase().replace(/\s+/g, "-"),
          { $type: "fontFamily", $value: f.name, $extensions: { weights: f.weights } },
        ])
      ),
      motion: {
        easing: { $type: "cubicBezier", $value: brand.motion.easing.bezier },
        ...Object.fromEntries(
          brand.motion.durations.map((d) => [
            d.token.replace(/^--/, ""),
            { $type: "duration", $value: `${d.ms}ms`, $description: d.use },
          ])
        ),
      },
    },
    null,
    2
  );
}

/**
 * Take the system away as code.
 *
 * Generated from the same object the page renders, so the export cannot
 * disagree with the swatches above it. The JSON follows the W3C design
 * tokens draft ($type / $value), which is what Tokens Studio and the
 * current Figma variable importers read.
 */
export default function TokenExport({ brand }: { brand: BrandGuide }) {
  function download() {
    const blob = new Blob([toJson(brand)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${brand.slug}-tokens.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <CopyButton value={toCss(brand)} label="Copy tokens as CSS" className="brand-pill brand-pill--solid">
        CSS variables
      </CopyButton>
      <button type="button" onClick={download} className="brand-pill">
        Download tokens.json
      </button>
    </div>
  );
}
