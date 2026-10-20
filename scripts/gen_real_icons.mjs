// Generate macOS-style rounded-square dock icons from REAL brand logos.
// Builds a SINGLE SVG (rounded-square background + white brand mark), rasterizes
// with sharp at supersample, downscales to 256. No compositing step.
// Usage: node scripts/gen_real_icons.mjs
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dir = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dir, "..", "public", "sites", "rendy", "app-icons");
mkdirSync(OUT, { recursive: true });

const SIZE = 256;
const SS = 4;
const W = SIZE * SS; // 1024
const RX = Math.round(W * 0.226);
const PAD = W * 0.16;
const CDN = (s) => `https://cdn.jsdelivr.net/npm/simple-icons@13/icons/${s}.svg`;

// brand slug -> (name, background spec)
//   null           => vertical gradient (instagram-esque)
//   [r,g,b]        => solid colour
//   "lucide:<d>"   => inline lucide-style path (generic icons)
//   "lucide:<d>"   => inline lucide-style path (generic icons); requires path = d
const JOBS = [
  ["whatsapp", [37, 211, 102]],
  ["instagram", null],
  ["gmail", [234, 67, 53]],
  ["linkedin", [0, 119, 181]],
  ["googlemaps", [46, 155, 95]],
  ["website", [0, 105, 217]],
  ["cv", [238, 236, 233]],
  ["lang", [90, 90, 90]],
  ["chatgpt", [25, 25, 25]],
  ["claude", [217, 119, 87]],
];

// generic (non-brand) lucide-style white glyphs at 24-grid
const GENERIC = {
  website: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 0c2.8 2.5 4.2 5.8 4.2 10S14.8 19.5 12 22c-2.8-2.5-4.2-5.8-4.2-10S9.2 4.5 12 2Z M2 12h20",
  cv: "M6 3h8l4 4v14H6V3Zm7 1v4h4M9 13h6M9 16h6",
  lang: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 0c2.8 2.5 4.2 5.8 4.2 10S14.8 19.5 12 22c-2.8-2.5-4.2-5.8-4.2-10S9.2 4.5 12 2Z M3 8h18",
};

async function fetchPath(slug) {
  const res = await fetch(CDN(slug));
  if (!res.ok) throw new Error(`${slug} ${res.status}`);
  let text = await res.text();
  text = text.replace(/<title>[\s\S]*?<\/title>/s, "");
  const m = text.match(/<path\s+d="([^"]+)"/);
  if (!m) throw new Error(`no path in ${slug}`);
  return m[1];
}

async function pathFor(slug) {
  if (slug in GENERIC) return GENERIC[slug];
  // simple-icons uses "openai" for ChatGPT brand
  if (slug === "chatgpt") return fetchPath("openai");
  return fetchPath(slug);
}

function bgRect(spec) {
  if (spec === null) {
    return (
      `<linearGradient id="g" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="#e1306c"/><stop offset="1" stop-color="#833ab4"/>` +
      `</linearGradient>` +
      `<rect width="${W}" height="${W}" rx="${RX}" fill="url(#g)"/>`
    );
  }
  const [r, g, b] = spec;
  return `<rect width="${W}" height="${W}" rx="${RX}" fill="rgb(${r},${g},${b})"/>`;
}

async function build(slug, spec) {
  const d = await pathFor(slug);
  const isGeneric = slug in GENERIC;
  // brand mark => filled white; generic (line) => stroked glyph (dark on light for cv)
  const glyphCol = slug === "cv" ? "#4a5260" : "#ffffff";
  const k = (W - 2 * PAD) / 24;
  const inherits = isGeneric
    ? `stroke="${glyphCol}" stroke-width="${k > 0 ? 2.0 : 2}" stroke-linecap="round" stroke-linejoin="round" fill="none"`
    : `fill="${glyphCol}"`;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}">` +
    bgRect(spec) +
    `<g transform="translate(${PAD} ${PAD}) scale(${k})" ${inherits}>` +
    `<path d="${d}"/>` +
    `</g></svg>`;
  const buf = await sharp(Buffer.from(svg)).resize(SIZE, SIZE, { kernel: sharp.kernel.lanczos3 }).png().toBuffer();
  writeFileSync(path.join(OUT, slug + ".png"), buf);
  console.log("wrote", slug + ".png");
}

for (const [slug, spec] of JOBS) {
  try {
    await build(slug, spec);
  } catch (e) {
    console.log("FAIL", slug, e.message);
  }
}
console.log("done");