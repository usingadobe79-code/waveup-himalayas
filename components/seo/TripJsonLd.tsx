import { PRICE_CURRENCY, siteUrl } from "@/lib/content";

type TripJsonLdProps = {
  name: string;
  description: string;
  /** Site-relative image path (real package photo, or the hero fallback). */
  image: string;
  /** Site-relative path, e.g. "/packages/everest-base-camp-trek". */
  path: string;
  touristType: string;
  /** Real price only — null (price-on-enquiry) omits `offers` entirely. */
  price: number | null;
};

/**
 * TouristTrip structured data for a package detail page. `offers` is only
 * emitted when `price` is a real number — prices are null ("Price on
 * enquiry") for most packages today, and we never fabricate one.
 */
export function TripJsonLd({ name, description, image, path, touristType, price }: TripJsonLdProps) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name,
    description,
    image: `${siteUrl}${image}`,
    url: `${siteUrl}${path}`,
    provider: { "@id": `${siteUrl}/#travelagency` },
    touristType,
  };

  if (price != null) {
    data.offers = {
      "@type": "Offer",
      price,
      priceCurrency: PRICE_CURRENCY,
      availability: "https://schema.org/InStock",
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
