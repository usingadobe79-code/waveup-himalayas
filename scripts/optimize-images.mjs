/**
 * Build-time image optimizer. Scans public/images/** for raster images and
 * writes a resized WebP derivative `X.opt.webp` next to each source `X.<ext>`
 * (max 1600px wide, never upscaled, quality 80). Sources are never modified;
 * derivatives are gitignored and regenerated in CI. Runs BEFORE
 * generate-packages / generate-offers, which swap in derivatives via fs.
 * Never fails the build: a bad file is logged and skipped.
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";

const IMAGES_DIR = path.join(process.cwd(), "public", "images");
const MAX_WIDTH = 1600;
const QUALITY = 80;
const MIN_BYTES = 40 * 1024;
const RASTER = /\.(jpe?g|png|webp)$/i;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (RASTER.test(entry.name) && !/\.opt\.webp$/i.test(entry.name)) out.push(full);
  }
  return out;
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) return;
  let converted = 0;
  let skipped = 0;
  let failed = 0;
  let before = 0;
  let after = 0;

  for (const file of walk(IMAGES_DIR)) {
    try {
      const stat = fs.statSync(file);
      if (stat.size < MIN_BYTES) {
        skipped++;
        continue;
      }
      const out = file.replace(RASTER, ".opt.webp");
      if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= stat.mtimeMs) {
        skipped++;
        continue;
      }
      const buf = await sharp(file)
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toBuffer();
      fs.writeFileSync(out, buf);
      converted++;
      before += stat.size;
      after += buf.length;
    } catch (err) {
      failed++;
      console.warn(`optimize-images: skipped ${path.relative(process.cwd(), file)} (${err.message})`);
    }
  }

  const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
  console.log(
    `optimize-images: ${converted} converted (${kb(before)} -> ${kb(after)}), ${skipped} skipped, ${failed} failed`,
  );
}

main().catch((err) => {
  console.warn(`optimize-images: ${err.message}`);
});
