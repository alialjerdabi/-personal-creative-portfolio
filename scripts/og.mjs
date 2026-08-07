/**
 * Render the Open Graph card from the live site.
 *
 *   node scripts/og.mjs            # against http://localhost:3000
 *   BASE_URL=... node scripts/og.mjs
 *
 * Writes src/app/opengraph-image.png, which Next serves as the OG image
 * by file convention.
 *
 * WHY A SCREENSHOT AND NOT `ImageResponse`:
 * `next/og` renders through satori, which needs a font buffer. Nunito is
 * loaded by `next/font/google` at build time and is not on disk anywhere
 * we can point at, so using ImageResponse would mean either committing a
 * font file or fetching one during the build. Both are more moving parts
 * than this, and the fallback face would not be Nunito — an off-typeface
 * share card on a designer's own site is exactly the detail a prospect
 * would notice.
 *
 * Rendering inside a real page of the site means the card is drawn with
 * the site's own fonts and tokens, already loaded, with nothing to keep
 * in sync by hand.
 *
 * The trade: this is a STATIC image. Change the headline, the ground
 * colour or the mark, and you must run this again. That is the only
 * maintenance burden, and it is why the copy below is read from the
 * content layer rather than typed twice.
 */
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = "src/app/opengraph-image.png";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});

// Load a real page first: the site's fonts and CSS custom properties come
// with it, so the card inherits the design system instead of restating it.
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

const { headline, sub, name } = await page.evaluate(() => ({
  headline: document.querySelector("h1")?.innerText.replace(/\s+/g, " ").trim() ?? "",
  sub: document.querySelector("[data-hero-tail]")?.innerText.trim() ?? "",
  name: document.querySelector("header a span")?.innerText.trim() ?? "",
}));

await page.evaluate(
  ({ headline, sub, name }) => {
    document.body.innerHTML = `
      <div id="og" style="
        width:1200px;height:630px;box-sizing:border-box;
        background:var(--lab-air);color:var(--lab-ink-warm);
        font-family:var(--font-rounded),sans-serif;
        padding:78px 84px;display:flex;flex-direction:column;
        justify-content:space-between;
      ">
        <div style="display:flex;align-items:center;gap:14px;">
          <svg viewBox="0 0 40 24" width="52" height="31" fill="none"
               stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
            <path d="M3 21h34"/>
            <path d="M8 21a12 12 0 0 1 24 0"/>
            <path d="M20 3v3M31 8l2-2M9 8L7 6"/>
          </svg>
          <span style="font-size:26px;font-weight:700;letter-spacing:-0.01em;">${name}</span>
        </div>

        <!--
          text-wrap:balance, because the headline broke with "from." alone
          on the last line. A single orphaned word is the one typographic
          rule this project does not break, and balancing is the fix that
          survives a change of copy — unlike a hand-placed <br>.
        -->
        <h1 style="
          margin:0;font-size:82px;font-weight:700;line-height:1.02;
          letter-spacing:-0.045em;max-width:1010px;text-wrap:balance;
        ">${headline}</h1>

        <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:40px;">
          <p style="margin:0;font-size:25px;line-height:1.45;color:var(--lab-ink-soft);max-width:620px;">${sub}</p>
          <span style="
            font-size:19px;font-weight:700;white-space:nowrap;
            background:var(--lab-ink-warm);color:#fff;
            padding:15px 30px;border-radius:999px;
          ">Start a project</span>
        </div>
      </div>`;
    document.body.style.margin = "0";
  },
  { headline, sub, name },
);

await page.waitForTimeout(400);
const shot = await page.locator("#og").screenshot();
writeFileSync(OUT, shot);
await browser.close();

console.log(`wrote ${OUT}`);
console.log(`headline: ${headline}`);
