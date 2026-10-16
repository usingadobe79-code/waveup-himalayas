#!/usr/bin/env node
/**
 * Codegen: reads content/offers.md (editable via the CMS "Homepage sections"
 * singleton) and emits lib/offers.data.json — a plain JSON object that
 * lib/content.ts imports. content.ts is used by client components too, so it
 * must stay free of `fs`/Node-only APIs; this script is the only place that
 * touches the filesystem, and it only ever runs at build time (via the `dev`
 * and `build` npm scripts), never in the browser.
 *
 * Mirrors scripts/generate-packages.mjs's shape (frontmatter → JSON) but is
 * intentionally kept separate so the two codegen steps never collide.
 *
 * Safe to run repeatedly (idempotent) — it only reads offers.md and
 * overwrites the generated JSON.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_FILE = path.join(process.cwd(), "content", "offers.md");
const OUTPUT_FILE = path.join(process.cwd(), "lib", "offers.data.json");

/**
 * Resolves the DISPLAY path for an on-page offer image: returns the `.webp`
 * twin only when it actually exists on disk, otherwise returns `src`
 * unchanged. Minimal copy of the helper in scripts/generate-packages.mjs
 * (not imported from there — that script has in-flight edits of its own).
 */
function resolveDisplay(src) {
  const publicDir = path.join(process.cwd(), "public");
  // 1. Build-time optimized derivative (scripts/optimize-images.mjs).
  const optPath = src.replace(/\.(jpe?g|png|webp)$/i, ".opt.webp");
  if (optPath !== src && fs.existsSync(path.join(publicDir, optPath))) return optPath;
  // 2. Committed hand-made .webp twin.
  const webpPath = src.replace(/\.jpe?g$/i, ".webp");
  if (webpPath === src) return src; // not a .jpg/.jpeg — nothing more to resolve
  return fs.existsSync(path.join(publicDir, webpPath)) ? webpPath : src;
}

/**
 * Builds one offer card's JSON entry from its frontmatter list item. Guards
 * against missing/malformed fields — a card with no title/description is
 * skipped entirely rather than rendering a broken card.
 */
function readOffer(raw) {
  if (!raw || typeof raw !== "object") return null;
  if (!raw.title || !raw.description || !raw.label) return null;

  const image = raw.image || null;
  return {
    label: String(raw.label),
    title: String(raw.title),
    description: String(raw.description),
    buttonText: raw.buttonText ? String(raw.buttonText) : "Claim This Offer",
    ...(raw.customUrl ? { customUrl: String(raw.customUrl) } : {}),
    ...(image ? { image, imageDisplay: resolveDisplay(image) } : {}),
    ...(raw.validUntil ? { validUntil: String(raw.validUntil) } : {}),
  };
}

function main() {
  if (!fs.existsSync(CONTENT_FILE)) {
    throw new Error(`Offers content file not found: ${CONTENT_FILE}`);
  }

  const rawFile = fs.readFileSync(CONTENT_FILE, "utf8");
  const { data } = matter(rawFile);

  const offers = Array.isArray(data.offers)
    ? data.offers.map(readOffer).filter((o) => o !== null)
    : [];

  const output = {
    eyebrow: data.eyebrow || "",
    title: data.title || "Current Offers",
    intro: data.intro || "",
    offers,
  };

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2) + "\n", "utf8");

  console.log(`Generated ${OUTPUT_FILE} (${offers.length} offers)`);
}

main();
