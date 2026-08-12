/**
 * Structural audit: the defects a screenshot cannot show you.
 *
 *   node scripts/audit.mjs
 *   BASE_URL=http://localhost:3200 node scripts/audit.mjs
 *
 * scripts/shots.mjs answers "does it look right". This answers "is it
 * wired right", and the two miss completely different things. Neither
 * tsc, eslint nor a PNG can see a dangling aria reference, a duplicate
 * id, a heading level skipped from h2 to h4, a link to a 404, or an
 * external tab opened without rel=noreferrer.
 *
 * It found one on its first run: the project dialog carried a permanent
 * aria-labelledby pointing at an id that only exists once a card has
 * been clicked, so the reference was broken on every page that mounts
 * the grid — and the dialog was unnamed at the exact moment it opened.
 *
 * Exits non-zero when anything is found, so it can gate a deploy.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const ROUTES = [
  "/",
  "/work",
  "/studio",
  "/work/petrolas",
  "/work/qobban",
  "/work/delivery-point",
];

const b = await chromium.launch();
let problems = 0;

for (const route of ROUTES) {
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto(BASE + route, { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);

  const report = await p.evaluate(() => {
    const out = [];
    const text = (el) =>
      (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40);

    // One h1, and no skipped heading levels.
    const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")];
    const h1s = hs.filter((h) => h.tagName === "H1");
    if (h1s.length !== 1) out.push(`h1 count = ${h1s.length}`);
    let prev = 0;
    for (const h of hs) {
      const lvl = Number(h.tagName[1]);
      if (prev && lvl > prev + 1) out.push(`heading jump h${prev}->h${lvl} "${text(h)}"`);
      prev = lvl;
    }

    // Images must have an alt attribute (empty is fine when decorative).
    for (const img of document.querySelectorAll("img")) {
      if (!img.hasAttribute("alt")) out.push(`img without alt: ${img.src.slice(-40)}`);
    }

    // Interactive elements need an accessible name.
    for (const el of document.querySelectorAll("a,button")) {
      if (el.closest("[inert],[aria-hidden='true']")) continue;
      const name =
        el.getAttribute("aria-label") ||
        el.getAttribute("title") ||
        text(el) ||
        [...el.querySelectorAll("img")].map((i) => i.alt).join("");
      if (!name) out.push(`${el.tagName.toLowerCase()} with no accessible name`);
    }

    // Duplicate ids break every aria reference that points at them.
    const ids = [...document.querySelectorAll("[id]")].map((e) => e.id);
    const dupes = [...new Set(ids.filter((v, i) => ids.indexOf(v) !== i))];
    if (dupes.length) out.push(`duplicate ids: ${dupes.join(", ")}`);

    // Every aria-labelledby must resolve.
    for (const el of document.querySelectorAll("[aria-labelledby]")) {
      for (const id of el.getAttribute("aria-labelledby").split(/\s+/)) {
        if (!document.getElementById(id)) out.push(`aria-labelledby -> missing #${id}`);
      }
    }

    // External links that open a new tab should not leak the opener.
    for (const a of document.querySelectorAll('a[target="_blank"]')) {
      const rel = a.getAttribute("rel") || "";
      if (!/noreferrer|noopener/.test(rel))
        out.push(`target=_blank without rel: ${a.href.slice(0, 50)}`);
    }

    if (document.documentElement.lang !== "en") out.push("html lang not set");
    return out;
  });

  // Every link must resolve.
  const hrefs = await p.evaluate(() =>
    [...document.querySelectorAll("a[href]")]
      .map((a) => a.href)
      .filter((h) => h.startsWith("http://localhost"))
  );
  for (const href of [...new Set(hrefs)]) {
    const res = await p.request.get(href).catch(() => null);
    if (!res || res.status() >= 400)
      report.push(`broken link ${res ? res.status() : "ERR"}: ${href.replace(BASE, "")}`);
  }

  if (report.length) {
    problems += report.length;
    console.log(`\n${route}`);
    for (const line of report) console.log(`  ${line}`);
  } else {
    console.log(`${route}  clean`);
  }
  await p.close();
}
await b.close();
console.log(`\n${problems} issue(s)`);
if (problems > 0) process.exitCode = 1;
