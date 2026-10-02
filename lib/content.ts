/**
 * Single source of truth for all copy/packages/contact.
 * Sourced verbatim from docs/03-content.md — DO NOT invent prices, itineraries,
 * day-counts, reviews, or contact details. No online checkout in v1; bookings
 * route to WhatsApp or email.
 *
 * Package simple fields (title/regionKey/serviceKey/image/blurb/price/featured)
 * live in content/packages/<slug>.md and are generated at build time into
 * ./packages.data.json by scripts/generate-packages.mjs (run via the `dev`
 * and `build` npm scripts). This file is imported by client components too
 * ("use client"), so it must stay free of `fs`/Node-only APIs — the JSON
 * import below is the only link to the filesystem-backed source.
 */
import packagesData from "./packages.data.json";

export const business = {
  name: "WaveUp Himalayas",
  alsoTradesAs: "Wave Up Nepal Holidays",
  base: "Thamel, Kathmandu, Nepal",
  registeredAddress:
    "Nepal, Kathmandu, Nagarjun, Raniban, Radhakrishna Mandir, 001",
  coords: { lat: 27.7300148, lng: 85.2874875 },
  touristDotCom: {
    since: "2026",
    status: "Tourist Friendly",
    verified: true,
    listing: "https://tourist.com/p/33425/wave_up_nepal_holidays",
  },
} as const;

/**
 * Canonical site origin for metadata / OG / sitemap / JSON-LD.
 * NOTE: the production domain isn't stated in docs/03 — this is INFERRED from the
 * real info@waveuphimalayas.com email address. Confirm/override via the
 * NEXT_PUBLIC_SITE_URL env var (no trailing slash) when the real domain is known.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://waveuphimalayas.com"
).replace(/\/+$/, "");

export const contact = {
  phone: "+977 9861992878",
  whatsapp: "https://wa.me/+9779861992878",
  email: "info@waveuphimalayas.com",
  instagram: { handle: "@waveup_himalayas", url: "https://www.instagram.com/waveup_himalayas/" },
  facebook: { handle: "waveupnepalholidays", url: "https://facebook.com/waveupnepalholidays" },
  hours: "Sun–Fri, 9:30 AM – 5:30 PM",
  person: "Gautam Lamichhane — Thamel, Kathmandu",
} as const;

export const brand = {
  tagline: "Treks • Tours • Flights • Experiences",
  hero: {
    eyebrow: "Nepal • Himalayas • Since 2026",
    headline: "Rise Above the Ordinary", // locked
    sub: "Treks, tours & helicopter adventures across the Nepal Himalayas.", // locked
    ctaPrimary: "Explore Packages",
    ctaSecondary: "Plan My Trip",
  },
} as const;

/** Top-level services (icon assigned in the Services component). */
export const services = [
  { key: "trekking", title: "Trekking", blurb: "Guided treks across Everest, Annapurna, Manaslu & Langtang." },
  { key: "city-tours", title: "City Tours", blurb: "Kathmandu, Pokhara, Bhaktapur & Lumbini heritage." },
  { key: "heli-tours", title: "Helicopter Tours", blurb: "Scenic heli flights to Everest Base Camp and beyond." },
  { key: "mountain-flights", title: "Mountain Flights", blurb: "Dawn fixed-wing flights along the Himalayan skyline." },
  { key: "jungle-safari", title: "Jungle Safari", blurb: "Chitwan wildlife — rhinos, elephants, riverside trails." },
  { key: "custom-trips", title: "Custom Trips", blurb: "Fully customized packages, permits, bus tickets & info." },
] as const;

/** Current offers (from Tourist.com). */
export const offers = [
  {
    badge: "-20%",
    title: "Everest Base Camp Heli Tour with Breakfast",
    detail: "20% off for Tourist “Plus” members.",
  },
  {
    badge: "-10%",
    title: "All Himalayan Adventures",
    detail: "10% off trekking, city tours & jungle safari.",
  },
] as const;

/* ==========================================================================
   Packages — ONE canonical list. featuredPackages + regions derive from it.
   ========================================================================== */

export type RegionKey =
  | "everest"
  | "annapurna"
  | "manaslu-langtang"
  | "cultural"
  | "wildlife"
  | "special";

/** A bookable package.
 *  - price: null renders the literal "Price on enquiry". NEVER fabricate a price.
 *    Fill the number in here when known (set CURRENCY below to match).
 *  - image: null renders the branded placeholder (never a broken image).
 *  - blurb: null = no card description yet (no fabricated copy). */
export type Package = {
  slug: string;
  title: string;
  regionKey: RegionKey;
  region: string; // display label, derived from REGION_LABELS
  serviceKey: ServiceKey;
  image: string | null;
  blurb: string | null;
  price: number | null;
  /** Drives inclusion in `featuredPackages` ("Popular Adventures" on the homepage). */
  featured: boolean;
  /** Real day-by-day / time-based itinerary (client-supplied), if available.
   *  Packages without one keep the "Detailed itinerary on enquiry" placeholder. */
  itinerary?: Itinerary;
};

/* ---- Itinerary shapes ----
   Two kinds: "days" for day-by-day trips, "schedule" for time-based flights/heli.
   All altitudes/durations are stored EXACTLY as supplied — never computed. */

export type ItineraryDay = {
  day: number;
  route: string; // the day's route / heading
  altitude?: string; // e.g. "2,170m", "5,545m (Kala Patthar)", "—"
  duration?: string; // e.g. "6–7 hrs"
  description?: string; // narrative column, where supplied
  highlights?: string; // per-day highlights column, where supplied
};

export type ScheduleRow = { time: string; activity: string };
export type ScheduleSection = { title?: string; rows: ScheduleRow[] };

export type Itinerary =
  | {
      kind: "days";
      summary?: string;
      highlights?: string[]; // trip-level highlights list
      notes?: string[]; // permits / accommodation / "good to know"
      days: ItineraryDay[];
    }
  | {
      kind: "schedule";
      summary?: string;
      peaks?: string[]; // "peaks you'll see"
      notes?: string[]; // "good to know"
      sections: ScheduleSection[];
    };

const REGION_LABELS: Record<RegionKey, string> = {
  everest: "Everest Region",
  annapurna: "Annapurna Region",
  "manaslu-langtang": "Manaslu / Langtang",
  cultural: "Cultural Tours",
  wildlife: "Wildlife",
  special: "Special",
};

/** Shape of each entry in the generated lib/packages.data.json. */
type PackageData = {
  slug: string;
  title: string;
  regionKey: RegionKey;
  serviceKey: ServiceKey;
  image: string | null;
  blurb: string | null;
  price: number | null;
  featured: boolean;
  /** Present when the package's content/packages/<slug>.md has itineraryDays
   *  (a "kind: days" trip). Absent otherwise — falls back to ITINERARIES. */
  itinerary?: Itinerary;
};

/**
 * Real itineraries (client-supplied, cleaned) for the handful of packages
 * whose itinerary is "schedule"-shaped (time-based flights/heli tours) and
 * hasn't been moved into CMS-editable content yet. Keyed by package slug;
 * values are verbatim — no invented times/peaks/notes. Attached to the
 * matching package below. Day-by-day ("kind: days") itineraries now live in
 * content/packages/<slug>.md (itineraryDays etc.) and are generated into
 * packages.data.json instead — see scripts/generate-packages.mjs.
 */
const ITINERARIES: Record<string, Itinerary> = {
  "everest-mountain-flight": {
    kind: "schedule",
    summary: "A 50–60-minute scenic mountain flight from Kathmandu along the Himalayas.",
    peaks: ["Langtang", "Ganesh Himal", "Gauri Shankar", "Cho Oyu", "Manaslu", "Makalu", "Mount Everest"],
    notes: [
      "If a flight is canceled due to weather or operational issues, you're offered a full refund or a free reschedule for the next day.",
    ],
    sections: [
      {
        title: "Morning schedule",
        rows: [
          { time: "05:00–05:30 AM", activity: "Hotel pickup, transfer to Kathmandu domestic airport." },
          { time: "05:30–06:15 AM", activity: "Airline check-in and security clearance." },
          { time: "06:30–07:30 AM", activity: "One-hour scenic flight — heads east past Langtang Valley, Gauri Shankar, and Cho Oyu before circling Mount Everest." },
          { time: "07:30–08:00 AM", activity: "Land back at airport; receive personalized experience certificate." },
          { time: "08:00–08:30 AM", activity: "Drive back to your hotel." },
        ],
      },
      {
        title: "In-flight timeline",
        rows: [
          { time: "0–15 min", activity: "Takeoff; views of Ganesh Himal and Langtang." },
          { time: "15–30 min", activity: "Passing Gauri Shankar, entering the Everest region." },
          { time: "30–45 min", activity: "Close-up of Everest, Lhotse, and Nuptse (the climax)." },
          { time: "45–60 min", activity: "Return leg with views of Makalu; journey back to Kathmandu." },
        ],
      },
    ],
  },
  "everest-base-camp-heli-tour-with-landing": {
    kind: "schedule",
    summary:
      "A typical 4-hour morning EBC helicopter tour with a landing and breakfast at Everest View Hotel.",
    sections: [
      {
        rows: [
          { time: "5:30–6:30 AM", activity: "Hotel pickup, transfer to Tribhuvan International Airport (domestic terminal)." },
          { time: "6:30–7:00 AM", activity: "Check-in and pre-flight briefing." },
          { time: "7:00–7:45 AM", activity: "Fly Kathmandu → Lukla (2,860m); scenic flight over hills, rivers, terraced farms; short refuel stop (5–10 min)." },
          { time: "7:45–8:15 AM", activity: "Lukla → Pheriche (4,240m); fly over Namche Bazaar, Tengboche Monastery, Everest View Hotel; land for group weight management." },
          { time: "8:15–8:45 AM", activity: "EBC & Kala Patthar flyover — Everest Base Camp (5,364m), Khumbu Glacier; hover near Kala Patthar (5,545m); aerial photos of Everest, Lhotse, Nuptse, Pumori, Ama Dablam." },
          { time: "8:45–9:45 AM", activity: "Breakfast at Everest View Hotel (3,880m) with 360° Himalayan views." },
          { time: "9:45–10:15 AM", activity: "Return flight to Lukla; refuel stop." },
          { time: "10:15–11:00 AM", activity: "Fly Lukla → Kathmandu; final views of the Everest region." },
          { time: "11:00–11:30 AM", activity: "Transfer to your hotel." },
        ],
      },
    ],
  },
};

/**
 * The full 25 — exact titles from docs/03. Order within a region is curated and
 * flows through to the Regions tabs and the /packages index (preserved by
 * scripts/generate-packages.mjs). Only the 6 featured trips have a real photo
 * + blurb today; the rest carry null (branded placeholder + "details on
 * enquiry") until real assets/copy are supplied. No invented detail.
 */
export const packages: Package[] = (packagesData as PackageData[]).map((p) => ({
  slug: p.slug,
  title: p.title,
  regionKey: p.regionKey,
  region: REGION_LABELS[p.regionKey],
  serviceKey: p.serviceKey,
  image: p.image,
  blurb: p.blurb,
  price: p.price,
  featured: p.featured,
  itinerary: p.itinerary ?? ITINERARIES[p.slug],
}));

export const totalPackages = packages.length; // 25

/** Currency for any price that gets filled in later. Prices are null today, so
 *  this is unused until you add numbers — set it to match how you quote. */
export const PRICE_CURRENCY = "USD";

/** Render a price as text. null → the required "Price on enquiry" placeholder. */
export function priceLabel(price: number | null): string {
  if (price == null) return "Price on enquiry";
  return `From ${PRICE_CURRENCY} ${price.toLocaleString()}`;
}

/** Look up a package by slug (used by the detail route + links). */
export function getPackage(slug: string): Package | undefined {
  return packages.find((p) => p.slug === slug);
}

/**
 * The six top-level services (see `services` above) double as filter categories
 * on /packages. A package's service is a stored field (serviceKey, see
 * content/packages/<slug>.md) — set once when the package was authored, by
 * applying the same title/region derivation this function used to compute
 * inline. Kept as a function (rather than reading p.serviceKey directly at
 * call sites) so every caller keeps working unchanged:
 *
 *  - "…Mountain Flight"  → mountain-flights   (fixed-wing scenic flights)
 *  - "…Heli Tour"        → heli-tours         (a Heli *Trek* stays a trek)
 *  - cultural region     → city-tours
 *  - wildlife region     → jungle-safari
 *  - special region      → custom-trips       (family / honeymoon / bespoke)
 *  - everything else     → trekking
 */
export type ServiceKey =
  | "trekking"
  | "city-tours"
  | "heli-tours"
  | "mountain-flights"
  | "jungle-safari"
  | "custom-trips";

export function packageService(p: Package): ServiceKey {
  return p.serviceKey;
}

/** How many trips sit under each service — used to hide empty filter pills. */
export function serviceCount(key: ServiceKey): number {
  return packages.filter((p) => packageService(p) === key).length;
}

/**
 * Featured packages for the landing grid ("Popular Adventures"). Driven by the
 * `featured` flag set per package in content/packages/<slug>.md (editable via
 * the CMS), preserving the canonical `packages` order and capped at 6 to
 * protect the homepage grid layout.
 */
export const featuredPackages: Package[] = packages.filter((p) => p.featured).slice(0, 6);

/** Regions / category tabs — derived from the canonical list (single source). */
export const regions = (Object.keys(REGION_LABELS) as RegionKey[]).map((key) => ({
  key,
  label: REGION_LABELS[key],
  packages: packages.filter((p) => p.regionKey === key),
}));

/** Why choose us — exact points, no invented stats. */
export const whyUs = [
  { title: "Local expertise", detail: "Thamel-based, on-the-ground knowledge of the Himalaya." },
  { title: "Licensed guides", detail: "Government-licensed, experienced mountain guides." },
  { title: "Fully customizable", detail: "Itineraries shaped around how you want to travel." },
  { title: "Dedicated female-guided option", detail: "A fully guided tour with a lady guide for solo women travelers." },
] as const;

/** Real client testimonials, provided by the site owner. */
export const testimonials: { quote: string; author: string; country?: string; trek?: string }[] = [
  {
    quote:
      "It was our first time in Nepal and we were a little nervous, but from the moment we landed we felt looked after. Our guide's personality just clicked with ours — he answered every question with real patience and made sure we understood everything on the trail. What stayed with us most was stopping in the villages and getting to know the local people. Professional from the first day to the last.",
    author: "Daniel & Isabelle",
    country: "USA",
    trek: "Langtang Valley Trek",
  },
  {
    quote:
      "I'd asked for a female guide and WaveUp arranged exactly that, along with a porter who was just as kind and dependable — both were wonderful the whole way. As a first-timer in Nepal I felt completely safe and cared for, and my guide explained everything with such sincerity. I loved how much time we spent with the locals in every place we stopped.",
    author: "Mara",
    country: "Italy",
    trek: "Mardi Himal Trek",
  },
  {
    quote:
      "First time in Nepal and it went beyond anything I'd pictured. The team was professional from start to finish, and my guide felt more like a mate than a guide — happy to explain anything, and genuinely caring when the altitude got tough. Gokyo and Base Camp were unreal, but honestly it was how friendly everyone was that made the trip.",
    author: "Nick",
    country: "Australia",
    trek: "Everest Base Camp Trek with Gokyo Lakes",
  },
  {
    quote:
      "Everyone was so warm and welcoming — my first time in Nepal, and definitely not my last. The guide's vibe matched mine perfectly and he explained everything I needed to know along the way, always with a smile. Mingling with the locals was a real highlight. Sincere, caring people who clearly love what they do.",
    author: "Rohan",
    country: "India",
    trek: "Ghorepani Poon Hill Trek",
  },
];

/** Photo assets the client provided (placeholders in v1). */
export const photoAssets = [
  "Annapurna Base Camp — group at “NAMASTE / ABC 4130m” sign, full peak backdrop",
  "Poon Hill sunrise — Dhaulagiri range, trekkers at viewpoint",
  "Swayambhunath (Monkey Temple) stupa, prayer flags",
  "Bhaktapur Durbar Square — pagoda temples",
  "Helicopter on ridge, snow peaks behind",
  "Chitwan jungle safari — elephant-back ride with one-horned rhinos",
  "Chitwan riverside — two rhinos by water",
  "Hero dashboard image — Himalayan peak at sunset (provided)",
] as const;

/**
 * Typical inclusions shown on the detail page. These are GENERIC and editable —
 * not a per-package guarantee. Marked as such in the UI so nothing is implied
 * that isn't real. Adjust per package once confirmed.
 */
export const typicalInclusions = [
  "Government-licensed English-speaking guide",
  "Required permits & paperwork",
  "Airport / hotel transfers",
] as const;

/** CTA destinations — bookings always route to WhatsApp or email. */
export const cta = {
  whatsapp: contact.whatsapp,
  email: `mailto:${contact.email}`,
  enquireLabel: "Enquire",
  requestQuoteLabel: "Request a Quote",
} as const;

/** Phone digits only, for building wa.me deep links. */
const WHATSAPP_DIGITS = "9779861992878";

/**
 * Build a WhatsApp deep link with a prefilled enquiry message about `subject`
 * (e.g. a package title). Bookings have no online checkout — everything routes
 * to a real conversation.
 */
export function whatsappEnquiry(subject: string): string {
  const text = `Hi WaveUp Himalayas, I'd like to enquire about the ${subject}.`;
  return `https://wa.me/${WHATSAPP_DIGITS}?text=${encodeURIComponent(text)}`;
}

/** Same, for email — returns a mailto: with subject + body prefilled. */
export function emailEnquiry(subject: string): string {
  const s = encodeURIComponent(`Enquiry: ${subject}`);
  const body = encodeURIComponent(
    `Hi WaveUp Himalayas,\n\nI'd like to enquire about the ${subject}.\n\nDates / group size:\nQuestions:\n\nThank you!`,
  );
  return `mailto:${contact.email}?subject=${s}&body=${body}`;
}
