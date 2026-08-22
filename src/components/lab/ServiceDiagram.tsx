import type { LabPalette } from "@/data/lab";

/**
 * A diagram per service — the visual half of /services.
 *
 * DRAWN, NOT PHOTOGRAPHED (Ali, 2026-08-22). The page was entirely text,
 * and the obvious fix was more client imagery. But the work is already
 * shown at length on three case studies, and repeating it here would say
 * nothing new. What this page has to argue is that the decisions come
 * before the design — so the visuals are the decisions.
 *
 * Each one is the shape of a judgement the service actually makes: where
 * a business sits against its competitors, where visitors fall out
 * before they enquire, and which channels are carrying the weight. They
 * are honest about being schematic. Nobody should mistake them for data.
 *
 * SVG in the page's own tokens rather than an image file: they take
 * `currentColor` and the project accent, they cost no request, and they
 * stay sharp at any size.
 */

const ACCENT: Record<LabPalette, string> = {
  orange: "var(--lab-orange)",
  blue: "var(--lab-blue)",
  lime: "var(--lab-lime)",
  violet: "var(--lab-violet)",
  cream: "var(--lab-cream)",
  teal: "var(--lab-teal)",
  sun: "var(--lab-sun)",
  amber: "var(--lab-amber)",
};

/** Where a business sits, and where the room is. */
function PositionMap({ accent }: { accent: string }) {
  const others = [
    [78, 96],
    [128, 62],
    [96, 148],
    [176, 122],
    [148, 176],
    [206, 78],
  ];
  return (
    <svg viewBox="0 0 260 220" className="lab-diagram__svg" aria-hidden="true">
      <line x1="30" y1="110" x2="240" y2="110" className="lab-diagram__axis" />
      <line x1="130" y1="16" x2="130" y2="204" className="lab-diagram__axis" />
      {others.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" className="lab-diagram__dot" />
      ))}
      <circle cx="196" cy="48" r="7" fill={accent} />
      <text x="30" y="14" className="lab-diagram__label">
        Distinct
      </text>
      <text x="30" y="216" className="lab-diagram__label">
        Familiar
      </text>
      <text x="240" y="128" textAnchor="end" className="lab-diagram__label">
        Premium
      </text>
      <text x="30" y="128" className="lab-diagram__label">
        Cheapest
      </text>
    </svg>
  );
}

/** Where the visitors go. */
function Funnel({ accent }: { accent: string }) {
  const steps = [
    { label: "Arrive", w: 210 },
    { label: "Read", w: 162 },
    { label: "Believe", w: 114 },
    { label: "Enquire", w: 66 },
  ];
  return (
    <svg viewBox="0 0 260 220" className="lab-diagram__svg" aria-hidden="true">
      {steps.map((step, index) => {
        const y = 26 + index * 46;
        const x = (260 - step.w) / 2;
        const last = index === steps.length - 1;
        return (
          <g key={step.label}>
            <rect
              x={x}
              y={y}
              width={step.w}
              height="30"
              rx="6"
              fill={last ? accent : "none"}
              className={last ? undefined : "lab-diagram__bar"}
            />
            <text
              x="130"
              y={y + 20}
              textAnchor="middle"
              className={last ? "lab-diagram__label lab-diagram__label--in" : "lab-diagram__label"}
            >
              {step.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** What is actually carrying the weight. */
function Channels({ accent }: { accent: string }) {
  const rows = [
    { label: "Word of mouth", at: 0.72 },
    { label: "Social", at: 0.46 },
    { label: "Search", at: 0.3 },
    { label: "Paid", at: 0.58 },
  ];
  return (
    <svg viewBox="0 0 260 220" className="lab-diagram__svg" aria-hidden="true">
      {rows.map((row, index) => {
        const y = 40 + index * 46;
        return (
          <g key={row.label}>
            <text x="30" y={y - 10} className="lab-diagram__label">
              {row.label}
            </text>
            <line x1="30" y1={y} x2="230" y2={y} className="lab-diagram__axis" />
            <circle cx={30 + 200 * row.at} cy={y} r="6" fill={accent} />
          </g>
        );
      })}
    </svg>
  );
}

export default function ServiceDiagram({
  index,
  palette,
  caption,
}: {
  index: string;
  palette: LabPalette;
  caption: string;
}) {
  const accent = ACCENT[palette];
  const figure =
    index === "01" ? (
      <PositionMap accent={accent} />
    ) : index === "02" ? (
      <Funnel accent={accent} />
    ) : (
      <Channels accent={accent} />
    );

  return (
    <figure className="lab-diagram">
      {figure}
      {/* Named as schematic, in the diagram's own caption. A drawing that
          looks like a chart and is not one has to say so. */}
      <figcaption className="lab-diagram__caption">{caption}</figcaption>
    </figure>
  );
}
