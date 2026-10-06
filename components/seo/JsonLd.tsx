import { business, contact, siteUrl } from "@/lib/content";

/**
 * TravelAgency (a LocalBusiness subtype) structured data — REAL data only.
 * No priceRange / ratings / founding claims (none are known). The address is
 * split conservatively from business.registeredAddress
 * ("Nepal, Kathmandu, Nagarjun, Raniban, Radhakrishna Mandir, 001"); addressRegion
 * is omitted because it isn't in our source data.
 */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${siteUrl}/#travelagency`,
    name: business.name,
    alternateName: business.alsoTradesAs,
    url: siteUrl,
    image: `${siteUrl}/images/hero.jpg`,
    telephone: contact.phone,
    email: contact.email,
    // Split conservatively from business.registeredAddress
    // ("Nepal, Kathmandu, Nagarjun, Raniban, Radhakrishna Mandir, 001").
    // NOTE: keep in sync if registeredAddress ever changes (it's the source of truth).
    // postalCode is intentionally omitted: the trailing "001" is not a valid Nepal
    // postal code (those are 5 digits) — we don't publish a guessed/placeholder ZIP.
    address: {
      "@type": "PostalAddress",
      streetAddress: "Raniban, Radhakrishna Mandir, Nagarjun",
      addressLocality: "Kathmandu",
      addressCountry: "NP",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.coords.lat,
      longitude: business.coords.lng,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:30",
        closes: "17:30",
      },
    ],
    areaServed: "Nepal",
    // Official profiles. Only the Tourist.com listing is verified in our data;
    // the Instagram/Facebook handles are the business's own but unverified.
    sameAs: [contact.instagram.url, contact.facebook.url, business.touristDotCom.listing],
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe to inline; no user input is interpolated.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * WebSite schema — global, references the TravelAgency above as `publisher`
 * via its `@id` so the two nodes link up in the same graph.
 */
export function WebsiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: business.name,
    publisher: { "@id": `${siteUrl}/#travelagency` },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
