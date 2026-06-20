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

/** Full package list (25) — exact titles, no invented detail. */
export const allPackages = [
  "Everest Base Camp Heli Tour",
  "Everest Base Camp Heli Tour with Landing",
  "Everest Base Camp Heli Trek",
  "Everest Base Camp Trek with Three Pass",
  "Everest Base Camp Trek with Gokyo Lake",
  "Everest Base Camp Trek",
  "Everest Mountain Flight",
  "Annapurna Base Camp Heli Tour",
  "Annapurna Base Camp Trek",
  "Annapurna Circuit Trek",
  "Ghorepani Poon Hill Trek",
  "Mardi Himal Trek",
  "Manaslu Circuit Trek",
  "Manaslu Region with Tsum Valley Trek",
  "Langtang Valley Trek",
  "Kathmandu Sightseeing",
  "Pokhara Sightseeing",
  "Chitwan – Jungle Safari",
  "Lumbini Historical Tour",
  "Kathmandu Sightseeing & Escape to Nearby Mountain Village (Nagarkot)",
  "A Week to Nepal – Fully customized (adventurous/cultural/historical)",
  "Dedicated Female Tour – Fully guided with lady guide, safety ensured",
  "Family Tour in Nepal",
  "Make Your Wedding Memorable at Kalapatthar – Destination Wedding",
  "Celebrate Honeymoon in the lap of Himalayas – Destination Honeymoon",
] as const;

export const totalPackages = allPackages.length; // 25

/**
 * Featured 6 for the landing grid ("Popular Adventures"). Order is curated.
 * Blurbs are descriptive only — NO prices, durations or day-counts (none exist).
 * Images live in /public/images/packages/ (brand-gradient placeholders in v1;
 * overwrite the files with real photos later — paths stay the same).
 */
export const featuredPackages = [
  {
    title: "Annapurna Base Camp Trek",
    region: "Annapurna Region",
    image: "/images/packages/annapurna-base-camp.jpg",
    blurb: "Climb through terraced valleys and rhododendron forest into the sweeping mountain amphitheatre of the Annapurna sanctuary.",
  },
  {
    title: "Ghorepani Poon Hill Trek",
    region: "Annapurna Region",
    image: "/images/packages/poon-hill.jpg",
    blurb: "A gentle classic to a celebrated sunrise viewpoint over the Dhaulagiri and Annapurna ranges.",
  },
  {
    title: "Everest Base Camp Heli Tour",
    region: "Everest Region",
    image: "/images/packages/everest-heli-tour.jpg",
    blurb: "Soar over the Khumbu by helicopter for an up-close Everest panorama — the high Himalaya without the long walk.",
  },
  {
    title: "Chitwan Jungle Safari",
    region: "Wildlife",
    image: "/images/packages/chitwan-safari.jpg",
    blurb: "Trade peaks for jungle — track rhinos and wildlife along the rivers and grasslands of Chitwan.",
  },
  {
    title: "Everest Base Camp Trek",
    region: "Everest Region",
    image: "/images/packages/everest-base-camp.jpg",
    blurb: "The iconic walk through Sherpa country to the foot of the highest mountain on earth.",
  },
  {
    title: "Manaslu Circuit Trek",
    region: "Manaslu / Langtang",
    image: "/images/packages/manaslu-circuit.jpg",
    blurb: "A remote teahouse circuit around the world's eighth-highest peak, rich in Tibetan-influenced culture.",
  },
] as const;

/** Regions / categories tabs. Packages filtered from allPackages where sensible. */
export const regions = [
  { key: "everest", label: "Everest Region", packages: [
    "Everest Base Camp Trek", "Everest Base Camp Heli Tour", "Everest Base Camp Heli Tour with Landing",
    "Everest Base Camp Heli Trek", "Everest Base Camp Trek with Three Pass", "Everest Base Camp Trek with Gokyo Lake",
    "Everest Mountain Flight",
  ]},
  { key: "annapurna", label: "Annapurna Region", packages: [
    "Annapurna Base Camp Trek", "Annapurna Base Camp Heli Tour", "Annapurna Circuit Trek",
    "Ghorepani Poon Hill Trek", "Mardi Himal Trek",
  ]},
  { key: "manaslu-langtang", label: "Manaslu / Langtang", packages: [
    "Manaslu Circuit Trek", "Manaslu Region with Tsum Valley Trek", "Langtang Valley Trek",
  ]},
  { key: "cultural", label: "Cultural Tours", packages: [
    "Kathmandu Sightseeing", "Pokhara Sightseeing", "Lumbini Historical Tour",
    "Kathmandu Sightseeing & Escape to Nearby Mountain Village (Nagarkot)",
  ]},
  { key: "wildlife", label: "Wildlife", packages: ["Chitwan – Jungle Safari"] },
  { key: "special", label: "Special", packages: [
    "Family Tour in Nepal", "Dedicated Female Tour – Fully guided with lady guide, safety ensured",
    "Celebrate Honeymoon in the lap of Himalayas – Destination Honeymoon",
    "Make Your Wedding Memorable at Kalapatthar – Destination Wedding",
    "A Week to Nepal – Fully customized (adventurous/cultural/historical)",
  ]},
] as const;

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
