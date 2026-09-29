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
  image: string | null;
  blurb: string | null;
  price: number | null;
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

/**
 * Real itineraries (client-supplied, cleaned). Keyed by package slug. Mapped by
 * title/region; values are verbatim — no invented days/altitudes/durations.
 * Attached to the matching package below. Packages not listed here keep the
 * "Detailed itinerary on enquiry" placeholder. Prices stay null everywhere.
 */
const itineraries: Record<string, Itinerary> = {
  "mardi-himal-trek": {
    kind: "days",
    summary:
      "Experience one of Nepal's most scenic short treks with breathtaking views of Machhapuchhre and the Annapurna range. Perfect for travelers seeking a peaceful trail, rich nature, and an authentic mountain experience.",
    highlights: [
      "Close-up views of Machhapuchhre and the Annapurna range",
      "Peaceful, less-crowded trekking",
      "Diverse landscape: forest, ridge, alpine terrain",
      "Authentic Gurung culture in Siding village",
    ],
    days: [
      { day: 1, route: "Kathmandu → Pokhara (drive/flight)", duration: "6–7 hrs drive / 25 min flight", description: "Scenic highway drive along rivers or short flight with Himalayan views. Explore Lakeside in the evening." },
      { day: 2, route: "Pokhara → Kande → Forest Camp", duration: "5–6 hrs", description: "Drive to Kande, then trek through lush rhododendron and oak forests. Waterfalls and glimpses of Machhapuchhre." },
      { day: 3, route: "Forest Camp → Low Camp → High Camp", duration: "6–7 hrs", description: "Gradual ascent through forest into alpine terrain. Ridge walk with views of Annapurna South and Machhapuchhre." },
      { day: 4, route: "High Camp → Mardi Base Camp → Low Camp", duration: "6–7 hrs", description: "Early sunrise hike to Mardi Himal Base Camp. Panoramic views of the Annapurna range. Return via scenic ridge." },
      { day: 5, route: "Low Camp → Siding → Pokhara", duration: "5–6 hrs", description: "Descend through forest and traditional villages. Gurung culture. Jeep drive back to Pokhara." },
      { day: 6, route: "Pokhara → Kathmandu", duration: "6–7 hrs drive / 25 min flight", description: "Return journey. Option for scenic flight or comfortable drive. End of trek." },
    ],
  },
  "ghorepani-poon-hill-trek": {
    kind: "days",
    highlights: [
      "Poon Hill sunrise (3,210m) — Annapurna I, Dhaulagiri, Machhapuchhre",
      "Rhododendron forests (vibrant in spring)",
      "Gurung & Magar village culture",
      "Diverse terrain — rivers, terraced fields, forests, ridges",
      "Great photographic short trek",
      "Moderate difficulty, good for beginners & families",
    ],
    days: [
      { day: 1, route: "Kathmandu → Pokhara (drive)", duration: "6–7 hrs", description: "Scenic drive via Trishuli River, hills & villages; optional Lakeside walk at Phewa Lake." },
      { day: 2, route: "Pokhara → Nayapul → Ulleri", duration: "1.5 hr drive + 5–6 hr trek", description: "Trek along Modi Khola, terraced farms, traditional villages, 3,000+ stone-step climb." },
      { day: 3, route: "Ulleri → Ghorepani", duration: "5–6 hrs", description: "Dense rhododendron & oak forest, waterfalls, first Himalayan views." },
      { day: 4, route: "Ghorepani → Poon Hill → Tadapani", duration: "6–7 hrs", description: "Sunrise over Annapurna & Dhaulagiri, Machhapuchhre views, ridge & forest trails." },
      { day: 5, route: "Tadapani → Ghandruk", duration: "3–4 hrs", description: "Descend through forest; Gurung culture, stone houses, museum, mountain backdrop." },
      { day: 6, route: "Ghandruk → Nayapul → Pokhara", duration: "4–5 hr trek + 2 hr drive", description: "Easy downhill, rural scenery, farmland & suspension bridges; relax in Pokhara." },
      { day: 7, route: "Pokhara → Kathmandu (drive)", duration: "6–7 hrs", description: "Scenic highway return, river valleys, hills." },
    ],
  },
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
  "annapurna-base-camp-trek": {
    kind: "days",
    summary:
      "A 10-day Annapurna Base Camp trek combining cultural villages, lush forests, natural hot springs, and breathtaking Himalayan views up to 4,130m. Perfectly paced for comfort, safety, and an unforgettable experience.",
    days: [
      { day: 1, route: "Kathmandu → Pokhara (drive/flight)", altitude: "822m", duration: "6–7 hrs drive / 25 min flight", description: "Scenic journey to Pokhara. Relax by Lakeside with Annapurna views." },
      { day: 2, route: "Pokhara → Jhinu → Chhomrong", altitude: "2,170m", duration: "2–3 hrs drive + 5–6 hrs trek", description: "Drive to Jhinu, trek to Chhomrong, a Gurung village with mountain views." },
      { day: 3, route: "Chhomrong → Bamboo", altitude: "2,310m", duration: "5–6 hrs", description: "Descend stone steps, trek through lush forests along the Modi Khola." },
      { day: 4, route: "Bamboo → Deurali", altitude: "3,200m", duration: "5–6 hrs", description: "Bamboo and rhododendron forest; gradual transition to alpine terrain." },
      { day: 5, route: "Deurali → MBC → ABC", altitude: "4,130m", duration: "5–6 hrs", description: "Trek to Machhapuchhre Base Camp, continue to ABC. Stunning panorama." },
      { day: 6, route: "ABC → Bamboo", altitude: "2,310m", duration: "6–7 hrs", description: "Sunrise at ABC, then descend through valleys and forests." },
      { day: 7, route: "Bamboo → Jhinu Danda", altitude: "1,780m", duration: "5–6 hrs", description: "Trek down to Jhinu. Natural hot spring beside the river." },
      { day: 8, route: "Jhinu → Pokhara", altitude: "822m", duration: "3 hrs trek + 2–3 hrs drive", description: "Short trek and drive back to Pokhara." },
      { day: 9, route: "Pokhara → Kathmandu", altitude: "1,400m", duration: "6–7 hrs drive / 25 min flight", description: "Return to Kathmandu. Optional sightseeing or rest." },
      { day: 10, route: "Final departure", altitude: "—", duration: "—", description: "Transfer to airport for onward journey." },
    ],
  },
  "everest-base-camp-trek": {
    kind: "days",
    summary:
      "A 12-day Everest Base Camp trek offering a perfect balance of adventure and acclimatization. Experience Sherpa culture and Himalayan landscapes, and reach the base of the world's highest peak (5,364m) with a sunrise view from Kala Patthar (5,545m).",
    days: [
      { day: 1, route: "Kathmandu → Lukla → Phakding", altitude: "2,610m", duration: "30 min flight + 3–4 hrs trek", description: "Scenic flight to Lukla, easy trek along Dudh Koshi to Phakding." },
      { day: 2, route: "Phakding → Namche Bazaar", altitude: "3,440m", duration: "5–6 hrs", description: "Enter Sagarmatha NP, cross suspension bridges to Namche." },
      { day: 3, route: "Acclimatization — Namche", altitude: "3,440m", duration: "3–4 hrs (hike)", description: "Hike to Everest View Hotel. First views of Everest and Ama Dablam." },
      { day: 4, route: "Namche → Tengboche", altitude: "3,860m", duration: "5–6 hrs", description: "Scenic trail; visit Tengboche Monastery." },
      { day: 5, route: "Tengboche → Dingboche", altitude: "4,410m", duration: "5–6 hrs", description: "Alpine landscapes, Sherpa villages, Ama Dablam views." },
      { day: 6, route: "Acclimatization — Dingboche", altitude: "4,410m", duration: "3–4 hrs (hike)", description: "Hike to Nagarjun Hill or Chhukung for adaptation." },
      { day: 7, route: "Dingboche → Lobuche", altitude: "4,910m", duration: "5–6 hrs", description: "Glacier views, memorial sites at Thukla Pass." },
      { day: 8, route: "Lobuche → Gorakshep → EBC", altitude: "5,364m", duration: "7–8 hrs", description: "Trek to Gorakshep, continue to Everest Base Camp." },
      { day: 9, route: "Gorakshep → Kala Patthar → Pheriche", altitude: "5,545m (Kala Patthar)", duration: "7–8 hrs", description: "Sunrise hike to Kala Patthar, descend to Pheriche." },
      { day: 10, route: "Pheriche → Namche Bazaar", altitude: "3,440m", duration: "6–7 hrs", description: "Descend through Pangboche and Tengboche to Namche." },
      { day: 11, route: "Namche → Lukla", altitude: "2,860m", duration: "6–7 hrs", description: "Final trek along Dudh Koshi to Lukla." },
      { day: 12, route: "Lukla → Kathmandu", altitude: "—", duration: "30 min flight", description: "Morning flight back to Kathmandu." },
    ],
  },
  "langtang-valley-trek": {
    kind: "days",
    notes: [
      "Permits: Langtang National Park Permit, TIMS Card",
      "Accommodation: teahouses (basic but comfortable)",
      "Walking: 4–7 hrs daily",
      "Transport: road drive from Kathmandu",
    ],
    days: [
      { day: 1, route: "Drive: Kathmandu → Syabrubesi", altitude: "1,460m", duration: "7–8 hrs drive", highlights: "Trishuli River, hills, local villages." },
      { day: 2, route: "Trek: Syabrubesi → Lama Hotel", altitude: "2,380m", duration: "5–6 hrs", highlights: "Forest walk, bamboo & rhododendron, Langtang River." },
      { day: 3, route: "Lama Hotel → Langtang Village", altitude: "3,430m", duration: "5–6 hrs", highlights: "Mountain views open up; Tamang culture." },
      { day: 4, route: "Langtang Village → Kyanjin Gompa", altitude: "3,870m", duration: "3–4 hrs", highlights: "Glacial valley, monasteries, yak pastures." },
      { day: 5, route: "Acclimatization + Kyanjin Ri / Tserko Ri", altitude: "4,773m–4,984m", duration: "5–7 hrs", highlights: "Panoramic views, Langtang Lirung." },
      { day: 6, route: "Kyanjin Gompa → Lama Hotel", altitude: "2,380m", duration: "6–7 hrs", highlights: "Descend alpine to forest landscapes." },
      { day: 7, route: "Lama Hotel → Syabrubesi", altitude: "1,460m", duration: "5–6 hrs", highlights: "Easy downhill, rivers & forests." },
      { day: 8, route: "Drive: Syabrubesi → Kathmandu", altitude: "1,400m", duration: "7–8 hrs", highlights: "Return drive, countryside views." },
    ],
  },
  "manaslu-circuit-trek": {
    kind: "days",
    days: [
      { day: 1, route: "Drive: Kathmandu → Machhakhola", altitude: "870m", duration: "8–9 hrs", description: "Scenic drive through hills, rivers, villages", highlights: "Trishuli River, off-road adventure." },
      { day: 2, route: "Trek: Machhakhola → Jagat", altitude: "1,340m", duration: "6–7 hrs", description: "Budhi Gandaki River, gradual ascent", highlights: "Suspension bridges, hot springs at Tatopani, waterfalls." },
      { day: 3, route: "Trek: Jagat → Deng", altitude: "1,860m", duration: "6–7 hrs", description: "Enter restricted Manaslu region", highlights: "Tibetan-influenced culture, Mani walls, gorges." },
      { day: 4, route: "Trek: Deng → Namrung", altitude: "2,630m", duration: "6–7 hrs", description: "Gradual climb, better views", highlights: "First Manaslu-region peaks, pine forests." },
      { day: 5, route: "Trek: Namrung → Samagaon", altitude: "3,530m", duration: "6–7 hrs", description: "High Himalayan zone, Tibetan settlements", highlights: "Mount Manaslu views, monasteries, yak pastures." },
      { day: 6, route: "Acclimatization: Samagaon (Manaslu BC)", altitude: "3,530m", duration: "—", description: "Rest & explore for adaptation", highlights: "Manaslu Base Camp or Pungyen Gompa, glaciers." },
      { day: 7, route: "Trek: Samagaon → Samdo", altitude: "3,860m", duration: "4–5 hrs", description: "Short trek, gradual gain", highlights: "Tibetan culture, views toward Tibet." },
      { day: 8, route: "Acclimatization: Samdo", altitude: "3,860m", duration: "—", description: "Rest, optional hike", highlights: "Tibet viewpoint, glacier panoramas." },
      { day: 9, route: "Trek: Samdo → Dharamsala", altitude: "4,460m", duration: "4–5 hrs", description: "Trek to base of Larke Pass", highlights: "Alpine terrain, high-pass prep." },
      { day: 10, route: "Trek: Dharamsala → Larke Pass → Bimthang", altitude: "5,160m", duration: "8–9 hrs", description: "Long, challenging pass day", highlights: "Larke Pass crossing, panoramas, glaciers." },
      { day: 11, route: "Trek: Bimthang → Tilije", altitude: "2,300m", duration: "6–7 hrs", description: "Descend forests and valleys", highlights: "Himlung & Annapurna views, rhododendron." },
      { day: 12, route: "Trek: Tilije → Dharapani", altitude: "1,960m", duration: "5–6 hrs", description: "Join Annapurna Circuit trail", highlights: "Mixed-culture villages, greenery." },
      { day: 13, route: "Drive: Dharapani → Besisahar → Kathmandu", altitude: "1,400m", duration: "8–9 hrs", description: "Scenic drive to capital", highlights: "Marsyangdi valley, terraced farms." },
      { day: 14, route: "Departure day", altitude: "—", duration: "—", description: "Transfer to airport", highlights: "Trip completion." },
    ],
  },
  "everest-base-camp-three-passes-trek": {
    kind: "days",
    highlights: [
      "Three high passes (Kongma La, Cho La, Renjo La)",
      "EBC (5,364m)",
      "Kala Patthar sunrise",
      "Gokyo Lakes",
      "Sherpa villages, glaciers, high alpine passes",
    ],
    days: [
      { day: 1, route: "Fly: Kathmandu → Lukla, trek to Phakding", altitude: "2,610m", duration: "3–4 hrs", highlights: "Lukla flight, Dudh Koshi, suspension bridges." },
      { day: 2, route: "Trek: Phakding → Namche Bazaar", altitude: "3,440m", duration: "6–7 hrs", highlights: "Hillary Bridge, first Everest view, Namche." },
      { day: 3, route: "Acclimatization: Namche Bazaar", altitude: "3,440m", duration: "—", highlights: "Everest View Hotel, panoramas." },
      { day: 4, route: "Trek: Namche → Tengboche", altitude: "3,860m", duration: "5–6 hrs", highlights: "Tengboche Monastery, Ama Dablam." },
      { day: 5, route: "Trek: Tengboche → Dingboche", altitude: "4,410m", duration: "5–6 hrs", highlights: "Ama Dablam, Imja Valley." },
      { day: 6, route: "Acclimatization: Dingboche", altitude: "4,410m", duration: "—", highlights: "Nangkartshang Hill, panoramas." },
      { day: 7, route: "Trek: Dingboche → Chhukung", altitude: "4,730m", duration: "3–4 hrs", highlights: "Glacier views, Island Peak region." },
      { day: 8, route: "Trek: Chhukung → Kongma La → Lobuche", altitude: "5,535m", duration: "7–8 hrs", highlights: "Cross Kongma La, glaciers, dramatic terrain." },
      { day: 9, route: "Trek: Lobuche → Gorak Shep → EBC", altitude: "5,364m", duration: "7–8 hrs", highlights: "Everest Base Camp, Khumbu Glacier." },
      { day: 10, route: "Hike: Kala Patthar, trek to Dzongla", altitude: "5,545m", duration: "6–7 hrs", highlights: "Best Everest view from Kala Patthar." },
      { day: 11, route: "Trek: Dzongla → Cho La Pass → Thagnak", altitude: "5,420m", duration: "7–8 hrs", highlights: "Cross Cho La, ice & snow terrain." },
      { day: 12, route: "Trek: Thagnak → Gokyo", altitude: "4,790m", duration: "3–4 hrs", highlights: "Turquoise Gokyo Lakes." },
      { day: 13, route: "Acclimatization: Gokyo (Gokyo Ri)", altitude: "5,357m", duration: "3–4 hrs", highlights: "Gokyo Ri, Everest & Cho Oyu panorama." },
      { day: 14, route: "Trek: Gokyo → Renjo La → Lungden", altitude: "5,360m", duration: "7–8 hrs", highlights: "Cross Renjo La, stunning views." },
      { day: 15, route: "Trek: Lungden → Namche Bazaar", altitude: "3,440m", duration: "6–7 hrs", highlights: "Remote villages, culture." },
      { day: 16, route: "Trek: Namche → Lukla", altitude: "2,860m", duration: "6–7 hrs", highlights: "Celebrate completion." },
      { day: 17, route: "Fly: Lukla → Kathmandu", altitude: "1,400m", duration: "30 min", highlights: "Aerial Himalayan views." },
      { day: 18, route: "Departure day", altitude: "—", duration: "—", highlights: "Transfer to airport." },
    ],
  },
  "annapurna-circuit-trek": {
    kind: "days",
    days: [
      { day: 1, route: "Drive: Kathmandu → Besisahar", altitude: "760m", duration: "6–7 hrs", highlights: "Trishuli River, terraced farms, countryside." },
      { day: 2, route: "Drive: Besisahar → Chame", altitude: "2,670m", duration: "5–6 hrs", highlights: "Marsyangdi valley, waterfalls, mountains." },
      { day: 3, route: "Trek: Chame → Pisang", altitude: "3,200m", duration: "5–6 hrs", highlights: "Lamjung Himal, suspension bridges." },
      { day: 4, route: "Trek: Pisang → Manang (upper route)", altitude: "3,540m", duration: "6–7 hrs", highlights: "Annapurna II & III views." },
      { day: 5, route: "Acclimatization: Manang", altitude: "3,540m", duration: "—", highlights: "Gangapurna Lake, glaciers, culture." },
      { day: 6, route: "Trek: Manang → Yak Kharka", altitude: "4,050m", duration: "4–5 hrs", highlights: "Yak pastures, open landscapes." },
      { day: 7, route: "Trek: Yak Kharka → Thorong High Camp", altitude: "4,925m", duration: "5–6 hrs", highlights: "High Camp, dramatic scenery." },
      { day: 8, route: "Trek: High Camp → Thorong La → Muktinath", altitude: "5,416m", duration: "7–8 hrs", highlights: "Cross Thorong La Pass, panoramas." },
      { day: 9, route: "Trek/Drive: Muktinath → Jomsom", altitude: "2,720m", duration: "5–6 hrs", highlights: "Muktinath Temple, desert landscape." },
      { day: 10, route: "Trek/Drive: Jomsom → Tatopani", altitude: "1,190m", duration: "6–7 hrs", highlights: "Deepest gorge, apple orchards, hot springs." },
      { day: 11, route: "Trek: Tatopani → Ghorepani", altitude: "2,860m", duration: "6–7 hrs", highlights: "Rhododendron forests, villages." },
      { day: 12, route: "Hike: Poon Hill, trek to Tadapani", altitude: "3,210m", duration: "6–7 hrs", highlights: "Poon Hill sunrise, Annapurna & Dhaulagiri." },
      { day: 13, route: "Trek: Tadapani → Ghandruk → drive to Pokhara", altitude: "822m", duration: "5–6 hrs", highlights: "Gurung culture, relaxed finish." },
      { day: 14, route: "Drive: Pokhara → Kathmandu", altitude: "1,400m", duration: "6–7 hrs", highlights: "Scenic highway, river valleys." },
    ],
  },
  "manaslu-tsum-valley-trek": {
    kind: "days",
    days: [
      { day: 1, route: "Drive: Kathmandu → Machhakhola", altitude: "870m", duration: "8–9 hrs", highlights: "Trishuli River, waterfalls, countryside." },
      { day: 2, route: "Trek: Machhakhola → Jagat", altitude: "1,340m", duration: "6–7 hrs", highlights: "Suspension bridges, hot springs, narrow trails." },
      { day: 3, route: "Trek: Jagat → Lokpa", altitude: "2,240m", duration: "6–7 hrs", highlights: "First Ganesh Himal views, forests." },
      { day: 4, route: "Trek: Lokpa → Chumling", altitude: "2,386m", duration: "5–6 hrs", highlights: "Traditional villages, Tibetan culture begins." },
      { day: 5, route: "Trek: Chumling → Chhokang Paro", altitude: "3,010m", duration: "5–6 hrs", highlights: "Ganesh Himal views, monasteries." },
      { day: 6, route: "Trek: Chhokang Paro → Nile", altitude: "3,361m", duration: "5–6 hrs", highlights: "Tibetan-plateau feel, ancient settlements." },
      { day: 7, route: "Exploration: Nile / Mu Gompa", altitude: "3,700m", duration: "—", highlights: "Visit Mu Gompa, panoramas." },
      { day: 8, route: "Trek: Nile → Chumling", altitude: "2,386m", duration: "6–7 hrs", highlights: "Scenic retrace, cultural immersion." },
      { day: 9, route: "Trek: Chumling → Deng", altitude: "1,860m", duration: "6–7 hrs", highlights: "River crossings, lush forests." },
      { day: 10, route: "Trek: Deng → Namrung", altitude: "2,630m", duration: "6–7 hrs", highlights: "First Manaslu peaks, pine forests." },
      { day: 11, route: "Trek: Namrung → Samagaon", altitude: "3,530m", duration: "6–7 hrs", highlights: "Mount Manaslu views, monasteries." },
      { day: 12, route: "Acclimatization: Samagaon", altitude: "3,530m", duration: "—", highlights: "Manaslu Base Camp or Pungyen Gompa." },
      { day: 13, route: "Trek: Samagaon → Samdo", altitude: "3,860m", duration: "4–5 hrs", highlights: "Tibetan culture, wide valley." },
      { day: 14, route: "Trek: Samdo → Dharamsala", altitude: "4,460m", duration: "4–5 hrs", highlights: "Alpine terrain, glacier views." },
      { day: 15, route: "Trek: Dharamsala → Larke Pass → Bimthang", altitude: "5,160m", duration: "8–9 hrs", highlights: "Cross Larke Pass, panoramas." },
      { day: 16, route: "Trek: Bimthang → Tilije", altitude: "2,300m", duration: "6–7 hrs", highlights: "Rhododendron forests, mountain views." },
      { day: 17, route: "Trek/Drive: Tilije → Dharapani → Besisahar", altitude: "760m", duration: "6–7 hrs", highlights: "Mixed-culture villages, greenery." },
      { day: 18, route: "Drive: Besisahar → Kathmandu", altitude: "1,400m", duration: "6–7 hrs", highlights: "River valleys, relaxed finish." },
    ],
  },
  "a-week-to-nepal": {
    kind: "days",
    days: [
      { day: 1, route: "Kathmandu sightseeing", altitude: "1,400m", duration: "Full day", highlights: "Pashupatinath, Boudhanath, Swayambhunath, Durbar Square." },
      { day: 2, route: "Drive/Fly: Kathmandu → Pokhara", altitude: "822m", duration: "6–7 hrs drive / 25 min flight", highlights: "Scenic travel, relax at Phewa Lake." },
      { day: 3, route: "Drive: Pokhara → Nayapul, trek to Ulleri", altitude: "2,050m", duration: "5–6 hrs", highlights: "Stone steps, villages, first mountain glimpses." },
      { day: 4, route: "Trek: Ulleri → Ghorepani", altitude: "2,860m", duration: "5–6 hrs", highlights: "Forest trails, mountain views." },
      { day: 5, route: "Hike: Poon Hill, trek to Tadapani", altitude: "3,210m", duration: "6–7 hrs", highlights: "Poon Hill sunrise, Annapurna & Dhaulagiri." },
      { day: 6, route: "Trek: Tadapani → Ghandruk, drive to Pokhara", altitude: "822m", duration: "5–6 hrs", highlights: "Gurung culture in Ghandruk." },
      { day: 7, route: "Drive: Pokhara → Chitwan National Park", altitude: "415m", duration: "5–6 hrs", highlights: "Riverside resort, sunset, Tharu culture." },
      { day: 8, route: "Jungle activities & drive/fly: Chitwan → Kathmandu", altitude: "1,400m", duration: "Full day", highlights: "Jeep safari, wildlife (rhino, deer), canoe ride." },
    ],
  },
};

// Attach each itinerary to its matching package (mutates the package objects;
// featuredPackages / regions reference the same objects, so they see it too).
for (const p of packages) {
  const it = itineraries[p.slug];
  if (it) p.itinerary = it;
}

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
 * on /packages. A package's service is derived from its own title and region —
 * never a hand-maintained second list — so it cannot drift out of sync:
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
  if (/mountain flight/i.test(p.title)) return "mountain-flights";
  if (/heli tour/i.test(p.title)) return "heli-tours";
  if (p.regionKey === "cultural") return "city-tours";
  if (p.regionKey === "wildlife") return "jungle-safari";
  if (p.regionKey === "special") return "custom-trips";
  return "trekking";
}

/** How many trips sit under each service — used to hide empty filter pills. */
export function serviceCount(key: ServiceKey): number {
  return packages.filter((p) => packageService(p) === key).length;
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
