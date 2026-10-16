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
import offersData from "./offers.data.json";
import reviewsData from "./reviews.data.json";

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

/**
 * Current offers section (homepage) — editable via the CMS "Homepage
 * sections" singleton, backed by content/offers.md and generated at build
 * time into ./offers.data.json by scripts/generate-offers.mjs (run via the
 * `dev` and `build` npm scripts, alongside generate-packages.mjs). This file
 * is imported by client components too ("use client" — see
 * components/sections/Offers.tsx), so it must stay free of `fs`/Node-only
 * APIs — the JSON import below is the only link to the filesystem-backed
 * source.
 */
export const offersSection = {
  eyebrow: offersData.eyebrow,
  title: offersData.title,
  intro: offersData.intro,
};

/** One promo card in the "Current Offers" section.
 *  - badge/title/detail: the original fields — kept so Offers.tsx's prior
 *    shape still works unchanged.
 *  - buttonText: defaults to "Claim This Offer" when unset.
 *  - customUrl: writer-set link override — when set, the card's button goes
 *    here instead of the default WhatsApp enquiry. Omitted when unset.
 *  - image/imageDisplay: optional card photo — see `imageDisplay` on
 *    `Package` for how the `.webp` display path is resolved. Omitted
 *    together when no image is set.
 *  - validUntil: optional free-text note (e.g. an expiry date). Omitted
 *    when unset. */
export type Offer = {
  badge: string;
  title: string;
  detail: string;
  buttonText: string;
  customUrl?: string;
  image?: string;
  imageDisplay?: string;
  validUntil?: string;
};

type OfferData = {
  label: string;
  title: string;
  description: string;
  buttonText: string;
  customUrl?: string;
  image?: string;
  imageDisplay?: string;
  validUntil?: string;
};

/** Current offers (from Tourist.com) — see `offersSection` above for the
 *  section header. */
export const offers: Offer[] = (offersData.offers as OfferData[]).map((o) => ({
  badge: o.label,
  title: o.title,
  detail: o.description,
  buttonText: o.buttonText,
  customUrl: o.customUrl,
  image: o.image,
  imageDisplay: o.imageDisplay,
  validUntil: o.validUntil,
}));

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
  /** On-page display path for `image` — resolved at build time by
   *  scripts/generate-packages.mjs to the `.webp` twin ONLY when one exists
   *  on disk, else the original upload as-is (so a CMS photo with no twin
   *  never points at a 404'd .webp). Absent when `image` is null. Render this
   *  (not `image`) for on-page covers; `image` itself stays raw for
   *  og:image/metadata — see lib/img.ts. */
  imageDisplay?: string;
  blurb: string | null;
  /** Writer-set override for the Google results title — renders as an
   *  `absolute` metadata title (bypassing the sitewide "%s — {business}"
   *  template) when set. Omitted (undefined) when unset, in which case the
   *  page falls back to its generated title — see generateMetadata in
   *  app/packages/[slug]/page.tsx. */
  seoTitle?: string;
  /** Writer-set override for the Google snippet / meta description. Omitted
   *  (undefined) when unset, in which case the page falls back to the real
   *  `blurb` or a generated description — see packageDescription() in
   *  app/packages/[slug]/page.tsx. */
  seoDescription?: string;
  price: number | null;
  /** "Was" price for a discount — set alongside `price` (the current/sale
   *  price) to show a struck-through original price + an automatic % off
   *  badge. Omitted (undefined) when there's no discount — see
   *  `discountPercent` below. */
  originalPrice?: number;
  /** Free-text promo badge (e.g. "Autumn Special", "Early Bird"). Shown
   *  independently of `originalPrice`/`discountPercent` — omitted when unset. */
  offerLabel?: string;
  /** Drives inclusion in `featuredPackages` ("Popular Adventures" on the homepage). */
  featured: boolean;
  /** Real day-by-day / time-based itinerary (client-supplied), if available.
   *  Packages without one keep the "Detailed itinerary on enquiry" placeholder. */
  itinerary?: Itinerary;
  /** Quick-reference facts (duration, difficulty, altitude, etc.) — renders
   *  the Trip Facts box on the detail page when present. */
  tripFacts?: TripFacts;
  /** Real per-trip inclusions. Falls back to `typicalInclusions` when absent. */
  includes?: string[];
  /** Real per-trip exclusions — renders a "What's not included" list when present. */
  excludes?: string[];
  /** Per-trip FAQs — renders the FAQ accordion + FAQPage JSON-LD when present. */
  faqs?: Faq[];
  /** Owner-approved customer reviews (Supabase, build time) — Reviews section + Review JSON-LD. */
  reviews?: Review[];
  /** Number of valid reviews — present whenever `reviews` is. */
  reviewCount?: number;
  /** Mean star rating, 1 decimal — present whenever `reviews` is. */
  ratingAverage?: number;
  /** Extra trip photos — renders a "Photo gallery" grid when present. */
  gallery?: string[];
  /** On-page display paths for `gallery` — see `imageDisplay`. Present
   *  whenever `gallery` is. */
  galleryDisplay?: string[];
  /** A single route-map image — renders a "Route map" section when present. */
  routeMap?: string;
  /** On-page display path for `routeMap` — see `imageDisplay`. Present
   *  whenever `routeMap` is. */
  routeMapDisplay?: string;
  /** Packing checklist items — renders a "What to pack" list when present. */
  packingList?: string[];
  /** "How to prepare" body, pre-rendered from Markdown to HTML by
   *  scripts/generate-packages.mjs — renders a "How to prepare" section when present. */
  preparationHtml?: string;
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
  image?: string; // optional per-day photo — raw committed path
  /** On-page display path for `image` — see `imageDisplay` on Package. Present
   *  whenever `image` is. */
  imageDisplay?: string;
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

/** Quick-reference facts shown in the Trip Facts box on a package's detail
 *  page. All sub-fields are optional strings, stored exactly as supplied
 *  (never computed) — the box itself is omitted when none are set. */
export type TripFacts = {
  duration?: string;
  difficulty?: string;
  maxAltitude?: string;
  bestSeason?: string;
  groupSize?: string;
  accommodation?: string;
  meals?: string;
  trekDistance?: string;
  startEndPoint?: string;
};

/** One FAQ entry (also emitted as FAQPage JSON-LD — see FaqJsonLd). */
export type Faq = { question: string; answer: string };

/** One owner-approved customer review, fetched from Supabase at build time
 *  (see scripts/generate-reviews.mjs). */
export type Review = {
  name: string;
  location?: string;
  /** 1–5 */
  rating: number;
  title?: string;
  quote: string;
  /** ISO YYYY-MM-DD */
  date?: string;
  /** Full public URLs of the review's photos. */
  photoUrls?: string[];
  /** The owner's reply, shown beneath the review. */
  reply?: string;
  /** Owner-confirmed traveller (set in the Supabase dashboard; never by default). */
  verified?: boolean;
  /** Free-text travel month, e.g. "October 2026". */
  travelMonth?: string;
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
  /** Present when `image` is set — resolved by scripts/generate-packages.mjs. */
  imageDisplay?: string;
  blurb: string | null;
  /** Present when the package's content/packages/<slug>.md has a `seoTitle`. Absent otherwise. */
  seoTitle?: string;
  /** Present when the package's content/packages/<slug>.md has a `seoDescription`. Absent otherwise. */
  seoDescription?: string;
  price: number | null;
  /** Present when the package's content/packages/<slug>.md has an `originalPrice`. Absent otherwise. */
  originalPrice?: number;
  /** Present when the package's content/packages/<slug>.md has an `offerLabel`. Absent otherwise. */
  offerLabel?: string;
  featured: boolean;
  /** Present when the package's content/packages/<slug>.md has an itinerary
   *  (itineraryDays or itinerarySchedule). Absent otherwise. */
  itinerary?: Itinerary;
  /** Present when any Trip Facts sub-field is set. Absent otherwise. */
  tripFacts?: TripFacts;
  /** Present when the package has a non-empty `includes` list. Absent otherwise. */
  includes?: string[];
  /** Present when the package has a non-empty `excludes` list. Absent otherwise. */
  excludes?: string[];
  /** Present when the package has a non-empty `faqs` list. Absent otherwise. */
  faqs?: Faq[];
  /** Present when the package has a non-empty `gallery` list. Absent otherwise. */
  gallery?: string[];
  /** Present when `gallery` is — resolved by scripts/generate-packages.mjs. */
  galleryDisplay?: string[];
  /** Present when the package's content/packages/<slug>.md has a `routeMap`. Absent otherwise. */
  routeMap?: string;
  /** Present when `routeMap` is — resolved by scripts/generate-packages.mjs. */
  routeMapDisplay?: string;
  /** Present when the package has a non-empty `packingList`. Absent otherwise. */
  packingList?: string[];
  /** Present when the package's content/packages/<slug>.md has a `preparation`
   *  Markdown body, pre-rendered to HTML. Absent otherwise. */
  preparationHtml?: string;
};

/**
 * The full 25 — exact titles from docs/03. Order within a region is curated and
 * flows through to the Regions tabs and the /packages index (preserved by
 * scripts/generate-packages.mjs). Only the 6 featured trips have a real photo
 * + blurb today; the rest carry null (branded placeholder + "details on
 * enquiry") until real assets/copy are supplied. No invented detail.
 */
/** Reviews for a package slug from the build-time Supabase snapshot. */
function reviewFields(slug: string) {
  const reviews = (reviewsData as Record<string, Review[]>)[slug] ?? [];
  if (!reviews.length) return { reviews, reviewCount: 0 };
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return {
    reviews,
    reviewCount: reviews.length,
    ratingAverage: Math.round((sum / reviews.length) * 10) / 10,
  };
}

export const packages: Package[] = (packagesData as PackageData[]).map((p) => ({
  slug: p.slug,
  title: p.title,
  regionKey: p.regionKey,
  region: REGION_LABELS[p.regionKey],
  serviceKey: p.serviceKey,
  image: p.image,
  imageDisplay: p.imageDisplay,
  blurb: p.blurb,
  seoTitle: p.seoTitle,
  seoDescription: p.seoDescription,
  price: p.price,
  originalPrice: p.originalPrice,
  offerLabel: p.offerLabel,
  featured: p.featured,
  itinerary: p.itinerary,
  tripFacts: p.tripFacts,
  includes: p.includes,
  excludes: p.excludes,
  faqs: p.faqs,
  ...reviewFields(p.slug),
  gallery: p.gallery,
  galleryDisplay: p.galleryDisplay,
  routeMap: p.routeMap,
  routeMapDisplay: p.routeMapDisplay,
  packingList: p.packingList,
  preparationHtml: p.preparationHtml,
}));

export const totalPackages = packages.length; // 25

/** ISO currency code for structured data (schema.org `priceCurrency` requires
 *  the ISO code, not a symbol) — see components/seo/TripJsonLd.tsx. Visible
 *  prices render with a "$" symbol instead (see `priceLabel` below). */
export const PRICE_CURRENCY = "USD";

/** Render a price as text. null → the required "Price on enquiry" placeholder. */
export function priceLabel(price: number | null): string {
  if (price == null) return "Price on enquiry";
  return `$${price.toLocaleString()}`;
}

/**
 * The % off a package's sale price, when there's a genuine discount to show —
 * both `price` and `originalPrice` are finite numbers AND `originalPrice` is
 * strictly greater than `price`. Returns null otherwise (no price set, no
 * `originalPrice` set, or `originalPrice` <= `price`) so nothing fabricated
 * or nonsensical ever renders.
 */
export function discountPercent(pkg: Package): number | null {
  const { price, originalPrice } = pkg;
  if (typeof price !== "number" || !Number.isFinite(price)) return null;
  if (typeof originalPrice !== "number" || !Number.isFinite(originalPrice)) return null;
  if (originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/** Whether a package has a genuine discount to show — see `discountPercent`. */
export function isOnSale(pkg: Package): boolean {
  return discountPercent(pkg) != null;
}

/** Look up a package by slug (used by the detail route + links). */
export function getPackage(slug: string): Package | undefined {
  return packages.find((p) => p.slug === slug);
}

/**
 * Up to `limit` other packages for the "Similar treks" section on a
 * package's detail page — same region first (excluding the package itself);
 * when none share a region, falls back to same service; when still none,
 * returns an empty array so the caller can hide the section. Pure lookup
 * over the canonical `packages` list — no extra data/field needed.
 */
export function relatedPackages(pkg: Package, limit = 3): Package[] {
  const sameRegion = packages.filter((p) => p.slug !== pkg.slug && p.regionKey === pkg.regionKey);
  const pool =
    sameRegion.length > 0
      ? sameRegion
      : packages.filter((p) => p.slug !== pkg.slug && p.serviceKey === pkg.serviceKey);
  return pool.slice(0, limit);
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
