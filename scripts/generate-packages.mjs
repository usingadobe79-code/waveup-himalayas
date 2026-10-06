#!/usr/bin/env node
/**
 * Codegen: reads content/packages/*.md (editable source of truth, eventually
 * CMS-managed) and emits lib/packages.data.json — a plain JSON array that
 * lib/content.ts imports. content.ts is used by client components too, so it
 * must stay free of `fs`/Node-only APIs; this script is the only place that
 * touches the filesystem, and it only ever runs at build time (via the `dev`
 * and `build` npm scripts), never in the browser.
 *
 * Safe to run repeatedly (idempotent) — it only reads .md files and
 * overwrites the generated JSON.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const PACKAGES_DIR = path.join(process.cwd(), "content", "packages");
const OUTPUT_FILE = path.join(process.cwd(), "lib", "packages.data.json");

/**
 * Original curated order of the 25 packages (from the formerly-inline
 * `packages` array in lib/content.ts). Preserving this order keeps the
 * /packages index, region tabs, and featured-grid ordering unchanged.
 * Any slug not in this list (e.g. a new package added later) is appended at
 * the end, alphabetically.
 */
const ORIGINAL_ORDER = [
  // --- Everest Region ---
  "everest-base-camp-trek",
  "everest-base-camp-heli-tour",
  "everest-base-camp-heli-tour-with-landing",
  "everest-base-camp-heli-trek",
  "everest-base-camp-three-passes-trek",
  "everest-base-camp-gokyo-lake-trek",
  "everest-mountain-flight",

  // --- Annapurna Region ---
  "annapurna-base-camp-trek",
  "annapurna-base-camp-heli-tour",
  "annapurna-circuit-trek",
  "ghorepani-poon-hill-trek",
  "mardi-himal-trek",

  // --- Manaslu / Langtang ---
  "manaslu-circuit-trek",
  "manaslu-tsum-valley-trek",
  "langtang-valley-trek",

  // --- Cultural Tours ---
  "kathmandu-sightseeing",
  "pokhara-sightseeing",
  "lumbini-historical-tour",
  "kathmandu-nagarkot-tour",

  // --- Wildlife ---
  "chitwan-jungle-safari",

  // --- Special ---
  "family-tour-nepal",
  "dedicated-female-tour",
  "honeymoon-himalayas",
  "destination-wedding-kalapatthar",
  "a-week-to-nepal",
];

/**
 * Builds the `Itinerary` object for a package from its frontmatter, or
 * undefined if the package has neither a schedule nor a days itinerary.
 * Optional fields are omitted entirely when absent, so the shape matches the
 * original Itinerary/ItineraryDay/ScheduleSection/ScheduleRow types exactly
 * (no empty-string/undefined keys). "schedule" (time-based flights/heli
 * tours) takes priority over "days" if both are somehow present.
 */
function readItinerary(data) {
  if (data.itinerarySchedule && data.itinerarySchedule.length) {
    const itinerary = { kind: "schedule" };
    if (data.itinerarySummary) itinerary.summary = data.itinerarySummary;
    if (data.itineraryPeaks && data.itineraryPeaks.length) {
      itinerary.peaks = data.itineraryPeaks;
    }
    if (data.itineraryNotes && data.itineraryNotes.length) {
      itinerary.notes = data.itineraryNotes;
    }
    itinerary.sections = data.itinerarySchedule.map((s) => {
      const section = {};
      if (s.title) section.title = s.title;
      section.rows = s.rows.map((r) => ({ time: r.time, activity: r.activity }));
      return section;
    });
    return itinerary;
  }

  if (!data.itineraryDays) return undefined;

  const itinerary = { kind: "days" };
  if (data.itinerarySummary) itinerary.summary = data.itinerarySummary;
  if (data.itineraryHighlights && data.itineraryHighlights.length) {
    itinerary.highlights = data.itineraryHighlights;
  }
  if (data.itineraryNotes && data.itineraryNotes.length) {
    itinerary.notes = data.itineraryNotes;
  }
  itinerary.days = data.itineraryDays.map((d) => {
    const day = { day: d.day, route: d.route };
    if (d.altitude) day.altitude = d.altitude;
    if (d.duration) day.duration = d.duration;
    if (d.description) day.description = d.description;
    if (d.highlights) day.highlights = d.highlights;
    return day;
  });

  return itinerary;
}

/**
 * Trip facts sub-fields, in display order. Only non-empty values are kept;
 * the whole `tripFacts` object is omitted (undefined) when none are set —
 * so packages without any Trip Facts data render no Trip Facts box.
 */
const TRIP_FACTS_KEYS = [
  "duration",
  "difficulty",
  "maxAltitude",
  "bestSeason",
  "groupSize",
  "accommodation",
  "meals",
  "trekDistance",
  "startEndPoint",
];

function readTripFacts(data) {
  if (!data.tripFacts) return undefined;
  const facts = {};
  for (const key of TRIP_FACTS_KEYS) {
    if (data.tripFacts[key]) facts[key] = data.tripFacts[key];
  }
  return Object.keys(facts).length ? facts : undefined;
}

function readPackage(slug) {
  const raw = fs.readFileSync(path.join(PACKAGES_DIR, `${slug}.md`), "utf8");
  const { data } = matter(raw);
  const itinerary = readItinerary(data);
  const tripFacts = readTripFacts(data);
  return {
    slug,
    title: data.title,
    regionKey: data.regionKey,
    serviceKey: data.serviceKey,
    image: data.image || null,
    blurb: data.blurb || null,
    price: data.price ?? null,
    featured: data.featured ?? false,
    ...(itinerary ? { itinerary } : {}),
    ...(tripFacts ? { tripFacts } : {}),
    ...(data.includes && data.includes.length ? { includes: data.includes } : {}),
    ...(data.excludes && data.excludes.length ? { excludes: data.excludes } : {}),
    ...(data.faqs && data.faqs.length
      ? { faqs: data.faqs.map((f) => ({ question: f.question, answer: f.answer })) }
      : {}),
  };
}

function main() {
  if (!fs.existsSync(PACKAGES_DIR)) {
    throw new Error(`Packages directory not found: ${PACKAGES_DIR}`);
  }

  const slugsOnDisk = fs
    .readdirSync(PACKAGES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));

  const knownOrder = ORIGINAL_ORDER.filter((slug) => slugsOnDisk.includes(slug));
  const extra = slugsOnDisk
    .filter((slug) => !ORIGINAL_ORDER.includes(slug))
    .sort((a, b) => a.localeCompare(b));

  const orderedSlugs = [...knownOrder, ...extra];

  const packages = orderedSlugs.map(readPackage);

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(packages, null, 2) + "\n", "utf8");

  console.log(`Generated ${OUTPUT_FILE} (${packages.length} packages)`);
}

main();
