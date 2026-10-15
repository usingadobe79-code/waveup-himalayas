#!/usr/bin/env node
/**
 * Codegen: fetches APPROVED reviews from Supabase at build time and emits
 * lib/reviews.data.json — a map { [package_slug]: Review[] } that
 * lib/content.ts imports (keeping content.ts free of network/fs APIs).
 *
 * NEVER throws: missing env vars, a paused project or any fetch error just
 * logs a warning and writes an empty map, so the build always proceeds.
 */

import fs from "fs";
import path from "path";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());

const OUTPUT_FILE = path.join(process.cwd(), "lib", "reviews.data.json");

function write(map) {
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(map, null, 2) + "\n");
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn("[generate-reviews] Supabase env vars missing — writing empty reviews.");
    write({});
    return;
  }

  const res = await fetch(`${url}/rest/v1/reviews?approved=eq.true&select=*&order=created_at.desc`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) {
    console.warn(`[generate-reviews] Supabase responded ${res.status} — writing empty reviews.`);
    write({});
    return;
  }

  const rows = await res.json();
  const map = {};
  let count = 0;
  for (const r of Array.isArray(rows) ? rows : []) {
    const rating = Number(r.rating);
    if (!r.package_slug || !r.name || !r.quote || !Number.isFinite(rating) || rating < 1 || rating > 5) continue;
    const review = { name: r.name, rating, quote: r.quote };
    if (r.location) review.location = r.location;
    if (r.title) review.title = r.title;
    if (r.created_at) review.date = String(r.created_at).slice(0, 10);
    if (Array.isArray(r.photo_paths) && r.photo_paths.length) {
      review.photoUrls = r.photo_paths.map(
        (p) => `${url}/storage/v1/object/public/review-photos/${p}`,
      );
    }
    if (r.reply) review.reply = r.reply;
    review.verified = r.verified === true;
    if (r.travel_month) review.travelMonth = String(r.travel_month);
    (map[r.package_slug] ??= []).push(review);
    count++;
  }
  write(map);
  console.log(`[generate-reviews] Fetched ${count} approved review(s).`);
}

main().catch((err) => {
  console.warn(`[generate-reviews] Failed (${err?.message ?? err}) — writing empty reviews.`);
  try {
    write({});
  } catch {}
});
