/**
 * Single source of truth for all copy/packages/contact.
 * Sourced verbatim from docs/03-content.md — DO NOT invent prices, itineraries,
 * day-counts, reviews, or contact details. No online checkout in v1; bookings
 * route to WhatsApp or email.
 */

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
  image: string | null;
  blurb: string | null;
  price: number | null;
};

const REGION_LABELS: Record<RegionKey, string> = {
  everest: "Everest Region",
  annapurna: "Annapurna Region",
  "manaslu-langtang": "Manaslu / Langtang",
  cultural: "Cultural Tours",
  wildlife: "Wildlife",
  special: "Special",
};

/** Small factory so each row stays terse; region label is derived, not repeated. */
function pkg(
  regionKey: RegionKey,
  slug: string,
  title: string,
  extra: { image?: string; blurb?: string; price?: number } = {},
): Package {
  return {
    slug,
    title,
    regionKey,
    region: REGION_LABELS[regionKey],
    image: extra.image ?? null,
    blurb: extra.blurb ?? null,
    price: extra.price ?? null, // all null in v1 — "Price on enquiry"
  };
}

/**
 * The full 25 — exact titles from docs/03. Order within a region is curated and
 * flows through to the Regions tabs and the /packages index. Only the 6 featured
 * trips have a real photo + blurb today; the rest carry null (branded placeholder
 * + "details on enquiry") until real assets/copy are supplied. No invented detail.
 */
export const packages: Package[] = [
  // --- Everest Region ---
  pkg("everest", "everest-base-camp-trek", "Everest Base Camp Trek", {
    image: "/images/packages/everest-base-camp.jpg",
    blurb: "The iconic walk through Sherpa country to the foot of the highest mountain on earth.",
  }),
  pkg("everest", "everest-base-camp-heli-tour", "Everest Base Camp Heli Tour", {
    image: "/images/packages/everest-heli-tour.jpg",
    blurb: "Soar over the Khumbu by helicopter for an up-close Everest panorama — the high Himalaya without the long walk.",
  }),
  pkg("everest", "everest-base-camp-heli-tour-with-landing", "Everest Base Camp Heli Tour with Landing"),
  pkg("everest", "everest-base-camp-heli-trek", "Everest Base Camp Heli Trek"),
  pkg("everest", "everest-base-camp-three-passes-trek", "Everest Base Camp Trek with Three Pass"),
  pkg("everest", "everest-base-camp-gokyo-lake-trek", "Everest Base Camp Trek with Gokyo Lake"),
  pkg("everest", "everest-mountain-flight", "Everest Mountain Flight"),

  // --- Annapurna Region ---
  pkg("annapurna", "annapurna-base-camp-trek", "Annapurna Base Camp Trek", {
    image: "/images/packages/annapurna-base-camp.jpg",
    blurb: "Climb through terraced valleys and rhododendron forest into the sweeping mountain amphitheatre of the Annapurna sanctuary.",
  }),
  pkg("annapurna", "annapurna-base-camp-heli-tour", "Annapurna Base Camp Heli Tour"),
  pkg("annapurna", "annapurna-circuit-trek", "Annapurna Circuit Trek"),
  pkg("annapurna", "ghorepani-poon-hill-trek", "Ghorepani Poon Hill Trek", {
    image: "/images/packages/poon-hill.jpg",
    blurb: "A gentle classic to a celebrated sunrise viewpoint over the Dhaulagiri and Annapurna ranges.",
  }),
  pkg("annapurna", "mardi-himal-trek", "Mardi Himal Trek"),

  // --- Manaslu / Langtang ---
  pkg("manaslu-langtang", "manaslu-circuit-trek", "Manaslu Circuit Trek", {
    image: "/images/packages/manaslu-circuit.jpg",
    blurb: "A remote teahouse circuit around the world's eighth-highest peak, rich in Tibetan-influenced culture.",
  }),
  pkg("manaslu-langtang", "manaslu-tsum-valley-trek", "Manaslu Region with Tsum Valley Trek"),
  pkg("manaslu-langtang", "langtang-valley-trek", "Langtang Valley Trek"),

  // --- Cultural Tours ---
  pkg("cultural", "kathmandu-sightseeing", "Kathmandu Sightseeing"),
  pkg("cultural", "pokhara-sightseeing", "Pokhara Sightseeing"),
  pkg("cultural", "lumbini-historical-tour", "Lumbini Historical Tour"),
  pkg("cultural", "kathmandu-nagarkot-tour", "Kathmandu Sightseeing & Escape to Nearby Mountain Village (Nagarkot)"),

  // --- Wildlife ---
  pkg("wildlife", "chitwan-jungle-safari", "Chitwan – Jungle Safari", {
    image: "/images/packages/chitwan-safari.jpg",
    blurb: "Trade peaks for jungle — track rhinos and wildlife along the rivers and grasslands of Chitwan.",
  }),

  // --- Special ---
  pkg("special", "family-tour-nepal", "Family Tour in Nepal"),
  pkg("special", "dedicated-female-tour", "Dedicated Female Tour – Fully guided with lady guide, safety ensured"),
  pkg("special", "honeymoon-himalayas", "Celebrate Honeymoon in the lap of Himalayas – Destination Honeymoon"),
  pkg("special", "destination-wedding-kalapatthar", "Make Your Wedding Memorable at Kalapatthar – Destination Wedding"),
  pkg("special", "a-week-to-nepal", "A Week to Nepal – Fully customized (adventurous/cultural/historical)"),
];

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
 * Featured 6 for the landing grid ("Popular Adventures"). Curated selection of
 * canonical packages — all six have a real photo + blurb.
 */
const FEATURED_SLUGS = [
  "annapurna-base-camp-trek",
  "ghorepani-poon-hill-trek",
  "everest-base-camp-heli-tour",
  "chitwan-jungle-safari",
  "everest-base-camp-trek",
  "manaslu-circuit-trek",
] as const;

export const featuredPackages: Package[] = FEATURED_SLUGS.map((slug) => {
  const found = getPackage(slug);
  if (!found) throw new Error(`featured slug not found: ${slug}`);
  return found;
});

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

/**
 * Testimonials: docs/03 provides NO review text. Ship a flagged empty-state —
 * never fabricate quotes. Real reviews dropped in here later.
 */
export const testimonials: { quote: string; author: string }[] = [];

/** Scroll-Rise captions + altitude readout (§3). Altitude figures are from the spec. */
export const riseSequence = {
  captions: [
    "Every journey begins with a single step.",
    "Through valleys, forests, and frozen passes.",
    "Until you rise above it all.",
  ],
  cta: "Find your trek",
  altitude: { start: 2800, end: 5364 }, // metres
} as const;

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
