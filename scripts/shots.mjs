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
 * Writes PNGs to .shots/ (git-ignored), and fails loudly on any text that
 * overflows its own box — see the overflow audit below.
 */
import { chromium } from "playwright";
import { mkdir, rm } from "node:fs/promises";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = ".shots";

const ROUTES = [
  "/",
  "/work",
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

/**
 * Walk the page so every scroll-triggered reveal has fired.
 *
 * `Reveal` hides anything below the fold at opacity 0 until an
 * IntersectionObserver fires. A fullPage screenshot does NOT scroll — it
 * resizes the capture — so without this the entire lower half of every
 * route was photographed blank, and "I looked at the screenshot" was only
 * ever true above the fold. That is how two clipped case-study headlines
 * reached a "verified at 390/1024/1600" state.
 */
async function settle(page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.6);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 90));
    }
    window.scrollTo(0, 0);
  });
  // The rail and the entrance both need a beat to come back to rest.
  await page.waitForTimeout(900);
}

/**
 * A sticky scroll scene needs two frames to prove that it moves and that the
 * handoff stays aligned. Capture the hall before the push, then halfway through
 * its own sticky track (not halfway through the following caption list).
 */
async function museumFrames(page, slug, name) {
  const metrics = await page.evaluate(() => {
    const track = document.querySelector("[data-museum-track]");
    if (!(track instanceof HTMLElement)) return null;

    const top = track.getBoundingClientRect().top + window.scrollY;
    return {
      top,
      travel: Math.max(0, track.offsetHeight - window.innerHeight),
    };
  });

  if (!metrics) return;

  await page.evaluate((top) => window.scrollTo(0, top), metrics.top);
  await page.waitForTimeout(350);
  await page.screenshot({ path: `${OUT}/${slug}__${name}__museum-rest.png` });

  await page.evaluate(
    ({ top, travel }) => window.scrollTo(0, top + travel * 0.5),
    metrics
  );
  await page.waitForTimeout(350);
  await page.screenshot({ path: `${OUT}/${slug}__${name}__museum-mid.png` });

  await page.evaluate(() => window.scrollTo(0, 0));
  // Returning to the fold wakes the hero's spring-backed chips. Give them the
  // same settling window as the initial page walk before auditing overflow.
  await page.waitForTimeout(900);
}

/**
 * Text wider than the box it sits in.
 *
 * A screenshot shows this only if you happen to look at the right band at
 * the right width, and neither tsc nor eslint can see it at all. It is
 * how "POSITION" and "CAMPAIGN" shipped with their last letter sliced off
 * at 1600 while reading fine at 390 and 1024.
 *
 * Three things are deliberately not defects and are skipped: elements
 * that scroll on purpose, elements carrying no text at all (a clipped
 * decorative rule is not clipped copy), and the pointer companion, whose
 * label is width-animated from zero on purpose.
 */
async function overflows(page) {
  return page.evaluate(() => {
    const found = new Set();
    for (const el of document.querySelectorAll("h1,h2,h3,h4,p,span,a,li,dd,dt,blockquote")) {
      if (el.scrollWidth <= el.clientWidth + 1 || el.clientWidth <= 2) continue;
      const text = el.textContent.trim();
      if (!text) continue;
      if (el.closest(".lab-cursor")) continue;
      const style = getComputedStyle(el);
      if (style.overflowX === "auto" || style.overflowX === "scroll") continue;
      /* Truncation is a decision, not a defect: `text-overflow: ellipsis`
         means someone chose to cut this string and show that it was cut.
         Without this the browser-chrome address bar, which truncates a
         long URL exactly as a real browser does, reports as clipped at
         every width. */
      if (style.textOverflow === "ellipsis") continue;
      found.add(`${el.tagName} "${text.slice(0, 40)}" — ${el.scrollWidth}px in ${el.clientWidth}px`);
    }
    return [...found];
  });
}

const browser = await chromium.launch();
const clipped = [];

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
    // frame rather than being the top of a long full-page capture — and it
    // is taken BEFORE the walk, while the page is still as it arrives.
    await page.screenshot({ path: `${OUT}/${slug}__${name}__fold.png` });

    await settle(page);

    if (route === "/") {
      await museumFrames(page, slug, name);
    }

    for (const line of await overflows(page)) {
      clipped.push(`${route} @ ${w}  ${line}`);
    }

    if (name === "desktop") {
      await page.screenshot({ path: `${OUT}/${slug}__${name}__full.png`, fullPage: true });
    }

    console.log(`shot ${route} @ ${w}x${h}`);
    await page.close();
  }
}

await browser.close();
console.log(`\ndone -> ${OUT}/`);

if (clipped.length > 0) {
  console.error(`\n${clipped.length} clipped element(s):`);
  for (const line of clipped) console.error(`  ${line}`);
  process.exitCode = 1;
}
