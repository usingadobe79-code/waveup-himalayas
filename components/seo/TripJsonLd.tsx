import { PRICE_CURRENCY, siteUrl, type Review } from "@/lib/content";

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
  /** Real owner-approved reviews only — omitted entirely when none. */
  reviews?: Review[];
  ratingAverage?: number;
};

/**
 * TouristTrip structured data for a package detail page. `offers` is only
 * emitted when `price` is a real number — prices are null ("Price on
 * enquiry") for most packages today, and we never fabricate one.
 */
export function TripJsonLd({
  name,
  description,
  image,
  path,
  touristType,
  price,
  reviews,
  ratingAverage,
}: TripJsonLdProps) {
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

  if (reviews && reviews.length > 0 && ratingAverage != null) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: ratingAverage,
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    };
    data.review = reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
      reviewBody: r.quote,
      ...(r.title ? { name: r.title } : {}),
      ...(r.date ? { datePublished: r.date } : {}),
    }));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
