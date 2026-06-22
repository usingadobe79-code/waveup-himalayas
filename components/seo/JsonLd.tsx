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
    address: {
      "@type": "PostalAddress",
      streetAddress: "Raniban, Radhakrishna Mandir, Nagarjun",
      addressLocality: "Kathmandu",
      postalCode: "001",
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
    // Verified social / listing profiles.
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
