/**
 * Screenshot the running dev server so the work can actually be looked at.
 *
 * Every visual defect this project shipped — an arrow with no arrowhead, a
 * headline rendering behind the navbar, an ID card hanging outside the
 * camera frustum, a full-page canvas swallowing every click — was
 * invisible to type-checking and to DOM measurement, and obvious in a
 * screenshot. This script is the difference between guessing and seeing.
 *
 *   node scripts/shots.mjs                  # every route, every width
 *   node scripts/shots.mjs /                # one route
 *   node scripts/shots.mjs / 1600           # one route, one width
 *
 * Writes PNGs to .shots/ (git-ignored).
 */
import { chromium } from "playwright";
import { mkdir, rm } from "node:fs/promises";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = ".shots";

const ROUTES = [
  "/",
  "/studio",
  "/work/petrolas",
  "/work/qobban",
  "/work/delivery-point",
];
const WIDTHS = [
  { w: 390, h: 844, name: "mobile" },
  { w: 1024, h: 768, name: "tablet" },
  { w: 1600, h: 900, name: "desktop" },
];

const routeArg = process.argv[2];
const widthArg = process.argv[3] ? Number(process.argv[3]) : null;

const routes = routeArg ? [routeArg] : ROUTES;
const widths = widthArg ? WIDTHS.filter((v) => v.w === widthArg) : WIDTHS;

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();

for (const route of routes) {
  for (const { w, h, name } of widths) {
    const page = await browser.newPage({
      viewport: { width: w, height: h },
      deviceScaleFactor: 1,
    });

    await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });

    // Entrance timelines, image decode, and the physics badge all need a
    // moment; a screenshot taken at first paint shows a half-built page.
    await page.waitForTimeout(3200);

    const slug = route.replace(/\//g, "_") || "_root";

    // The fold is what decides whether someone stays, so it gets its own
    // frame rather than being the top of a long full-page capture.
    await page.screenshot({ path: `${OUT}/${slug}__${name}__fold.png` });

    if (name === "desktop") {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `${OUT}/${slug}__${name}__full.png`, fullPage: true });
    }

    console.log(`shot ${route} @ ${w}x${h}`);
    await page.close();
  }
}

await browser.close();
console.log(`\ndone -> ${OUT}/`);
