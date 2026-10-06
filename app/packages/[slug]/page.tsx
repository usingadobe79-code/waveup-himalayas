import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, X, MessageCircle, Mail, Phone } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { PackageImage } from "@/components/ui/PackageImage";
import { PriceTag } from "@/components/ui/PriceTag";
import { PackageItinerary } from "@/components/sections/PackageItinerary";
import { TripFacts } from "@/components/sections/TripFacts";
import { PackageFaq } from "@/components/sections/PackageFaq";
import { PackageGallery } from "@/components/sections/PackageGallery";
import { SimilarTreks } from "@/components/sections/SimilarTreks";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { TripJsonLd } from "@/components/seo/TripJsonLd";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import {
  packages,
  getPackage,
  relatedPackages,
  whatsappEnquiry,
  emailEnquiry,
  typicalInclusions,
  contact,
  business,
  services,
  type Package,
  type ServiceKey,
} from "@/lib/content";

// Only the 25 known slugs are valid routes; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return packages.map((p) => ({ slug: p.slug }));
}

/** Trip type as a plain noun, for the generated meta-description sentence. */
const SERVICE_NOUNS: Record<ServiceKey, string> = {
  trekking: "trek",
  "heli-tours": "helicopter tour",
  "mountain-flights": "mountain flight",
  "city-tours": "tour",
  "jungle-safari": "jungle safari",
  "custom-trips": "custom trip",
};

/**
 * Meta/OG description for a package. Real blurb when present; otherwise a
 * factual sentence built only from real fields — the trip-type noun, the
 * region label, and (when the package has a day-by-day itinerary) its real
 * day count. No invented difficulty/season/price.
 */
function packageDescription(pkg: Package): string {
  if (pkg.blurb) return pkg.blurb;
  const noun = SERVICE_NOUNS[pkg.serviceKey];
  const days = pkg.itinerary?.kind === "days" ? pkg.itinerary.days.length : undefined;
  const span = days ? `a guided ${days}-day ${noun}` : `a guided ${noun}`;
  return `${pkg.title} — ${span} in Nepal's ${pkg.region} with WaveUp Himalayas. Expert local guides, tailored departures.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) return { title: "Package not found" };
  // Writer-set overrides (optional, from content/packages/<slug>.md) take
  // priority; otherwise fall back to the existing generated title/description.
  const description = pkg.seoDescription ?? packageDescription(pkg);
  // Placeholder packages (no photo) fall back to the hero image for link previews
  // — the branded placeholder is a component, not a shareable image file.
  const ogImage = pkg.image ?? "/images/hero.jpg";
  const ogTitle = pkg.seoTitle ?? `${pkg.title} — ${business.name}`;
  return {
    // `absolute` bypasses the sitewide "%s — {business}" title template
    // (see app/layout.tsx) so a custom seoTitle renders verbatim.
    title: pkg.seoTitle ? { absolute: pkg.seoTitle } : pkg.title,
    description,
    alternates: { canonical: `/packages/${pkg.slug}` },
    openGraph: {
      type: "website",
      siteName: business.name,
      url: `/packages/${pkg.slug}`,
      title: ogTitle,
      description,
      images: [{ url: ogImage, alt: pkg.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [ogImage],
    },
  };
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) notFound();

  // Overview text, in order of richness: the itinerary's own summary (real,
  // trip-specific) → the card blurb → an honest generic line. No fabrication.
  const overview =
    pkg.itinerary?.summary ??
    pkg.blurb ??
    `Full trip notes and a day-by-day plan for the ${pkg.title} are shared on enquiry.`;
  // Trip-level highlights only exist on day-by-day itineraries.
  const tripHighlights =
    pkg.itinerary?.kind === "days" ? pkg.itinerary.highlights : undefined;
  // Real service label (e.g. "Trekking", "Helicopter Tours") — same source as
  // the /packages filter pills, used as TouristTrip.touristType below.
  const touristType = services.find((s) => s.key === pkg.serviceKey)?.title ?? pkg.serviceKey;
  // "Similar treks" — same region first, falling back to same service; see
  // lib/content.ts. Empty array hides the section below.
  const related = relatedPackages(pkg);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Packages", path: "/packages" },
          { name: pkg.title, path: `/packages/${pkg.slug}` },
        ]}
      />
      <TripJsonLd
        name={pkg.title}
        description={packageDescription(pkg)}
        image={pkg.image ?? "/images/hero.jpg"}
        path={`/packages/${pkg.slug}`}
        touristType={touristType}
        price={pkg.price}
      />
      {pkg.faqs && pkg.faqs.length > 0 && <FaqJsonLd faqs={pkg.faqs} />}
      <Header solid />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative isolate flex min-h-[58vh] items-end overflow-hidden">
          <PackageImage
            src={pkg.imageDisplay ?? null}
            alt={pkg.title}
            priority
            sizes="100vw"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-surface-darker via-surface-darker/55 to-surface-darker/25"
          />
          <div className="container-page relative z-10 pb-12 pt-28 text-on-dark">
            <nav aria-label="Breadcrumb" className="type-small mb-5 text-on-dark/70">
              <Link href="/" className="transition-colors hover:text-on-dark">
                Home
              </Link>
              <span className="px-2 text-on-dark/40">/</span>
              <Link href="/packages" className="transition-colors hover:text-on-dark">
                Packages
              </Link>
              <span className="px-2 text-on-dark/40">/</span>
              <span className="text-on-dark/90">{pkg.title}</span>
            </nav>
            <span className="type-small inline-block rounded-badge bg-surface-darker/70 px-3 py-1 font-medium text-accent-hover backdrop-blur-sm">
              {pkg.region}
            </span>
            <h1 className="type-h1 mt-4 max-w-3xl text-on-dark">{pkg.title}</h1>
          </div>
        </section>

        {/* Body */}
        <section className="section-y bg-surface">
          <div className="container-page grid gap-12 lg:grid-cols-3 lg:gap-16">
            {/* Main column */}
            <div className="space-y-12 lg:col-span-2">
              <div>
                <h2 className="type-h3 text-ink">Overview</h2>
                <p className="type-body-lg mt-4 text-muted">{overview}</p>
                <p className="type-body mt-4 text-muted">
                  Every WaveUp trip is fully customizable — tell us your dates, pace and
                  group size and we&rsquo;ll shape the itinerary around you.
                </p>
              </div>

              {/* Trip facts — only for trips that supplied at least one fact */}
              {pkg.tripFacts && (
                <div>
                  <h2 className="type-h3 text-ink">Trip facts</h2>
                  <div className="mt-5">
                    <TripFacts facts={pkg.tripFacts} />
                  </div>
                </div>
              )}

              {/* Highlights — only for trips that supplied a highlights list */}
              {tripHighlights && tripHighlights.length > 0 && (
                <div>
                  <h2 className="type-h3 text-ink">Highlights</h2>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {tripHighlights.map((h) => (
                      <li key={h} className="flex items-start gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                        />
                        <span className="type-body text-ink">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What's included — real per-trip inclusions when supplied, else the
                  generic typicalInclusions placeholder (unchanged for existing trips). */}
              <div>
                <h2 className="type-h3 text-ink">What&rsquo;s included</h2>
                <ul className="mt-5 space-y-3">
                  {(pkg.includes && pkg.includes.length > 0 ? pkg.includes : typicalInclusions).map(
                    (item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                          <Check className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                        </span>
                        <span className="type-body text-ink">{item}</span>
                      </li>
                    ),
                  )}
                </ul>
                {!(pkg.includes && pkg.includes.length > 0) && (
                  <p className="type-small mt-4 text-muted">
                    Typical inclusions — exact details are confirmed per trip when you enquire.
                  </p>
                )}
              </div>

              {/* What's not included — only for trips that supplied exclusions */}
              {pkg.excludes && pkg.excludes.length > 0 && (
                <div>
                  <h2 className="type-h3 text-ink">What&rsquo;s not included</h2>
                  <ul className="mt-5 space-y-3">
                    {pkg.excludes.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-darker/10 text-muted">
                          <X className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                        </span>
                        <span className="type-body text-ink">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Itinerary — real timeline when supplied, else the placeholder. */}
              <div>
                <h2 className="type-h3 text-ink">Itinerary</h2>
                {pkg.itinerary ? (
                  <PackageItinerary itinerary={pkg.itinerary} />
                ) : (
                  <div className="mt-5 rounded-card border border-dashed border-border bg-surface-alt p-6 text-center">
                    <p className="type-body font-medium text-ink">
                      Detailed itinerary on enquiry
                    </p>
                    <p className="type-small mt-2 text-muted">
                      We build a day-by-day plan around your dates and preferences — message
                      us and we&rsquo;ll send a tailored itinerary for the {pkg.title}.
                    </p>
                  </div>
                )}
              </div>

              {/* Route map — only for trips that supplied one. object-contain
                  (not the card-grid's object-cover) so no part of the map is
                  cropped out. */}
              {pkg.routeMap && (
                <div>
                  <h2 className="type-h3 text-ink">Route map</h2>
                  <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-card bg-surface-alt">
                    <Image
                      src={pkg.routeMapDisplay ?? pkg.routeMap}
                      alt={`${pkg.title} route map`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-contain"
                    />
                  </div>
                </div>
              )}

              {/* What to pack — only for trips that supplied a packing list;
                  styled like the "What's included" list above. */}
              {pkg.packingList && pkg.packingList.length > 0 && (
                <div>
                  <h2 className="type-h3 text-ink">What to pack</h2>
                  <ul className="mt-5 space-y-3">
                    {pkg.packingList.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                          <Check className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                        </span>
                        <span className="type-body text-ink">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* How to prepare — only for trips that supplied preparation
                  notes; preparationHtml is pre-rendered from Markdown by
                  scripts/generate-packages.mjs (same technique as blog posts). */}
              {pkg.preparationHtml && (
                <div>
                  <h2 className="type-h3 text-ink">How to prepare</h2>
                  <div
                    className="prose-blog mt-5"
                    dangerouslySetInnerHTML={{ __html: pkg.preparationHtml }}
                  />
                </div>
              )}

              {/* FAQ — only for trips that supplied faqs (see FaqJsonLd above). */}
              {pkg.faqs && pkg.faqs.length > 0 && (
                <div>
                  <h2 className="type-h3 text-ink">Frequently asked questions</h2>
                  <PackageFaq faqs={pkg.faqs} />
                </div>
              )}

              {/* Photo gallery — only for trips that supplied one. */}
              {pkg.gallery && pkg.gallery.length > 0 && (
                <div>
                  <h2 className="type-h3 text-ink">Photo gallery</h2>
                  <PackageGallery images={pkg.galleryDisplay ?? pkg.gallery} title={pkg.title} />
                </div>
              )}
            </div>

            {/* Booking card */}
            <aside className="lg:col-span-1">
              <div className="card sticky top-24 p-6 lg:p-8">
                <p className="type-eyebrow">Price</p>
                <PriceTag pkg={pkg} size="lg" className="mt-2" />
                <p className="type-small mt-3 text-muted">
                  No online checkout — we confirm everything with you directly, then send a
                  tailored quote.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <Button
                    href={whatsappEnquiry(pkg.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="gold"
                    className="w-full"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Book on WhatsApp
                  </Button>
                  <Button href={emailEnquiry(pkg.title)} variant="outline-dark" className="w-full">
                    <Mail className="h-4 w-4" />
                    Email Us
                  </Button>
                </div>

                <div className="mt-6 border-t border-border pt-5">
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2.5 text-muted transition-colors hover:text-accent-ink"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                    <span className="type-small">{contact.phone}</span>
                  </a>
                  <p className="type-small mt-2 text-muted">{contact.hours}</p>
                  <p className="type-small mt-1 text-muted">{business.base}</p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/packages"
                  className="type-small font-semibold text-accent-ink underline-offset-4 hover:underline"
                >
                  ← All {packages.length} packages
                </Link>
              </div>
            </aside>
          </div>
        </section>

        {/* Similar treks — up to 3 other packages from the same region (or,
            with none, the same service); computed in lib/content.ts. Hidden
            entirely when a package has no matches. */}
        {related.length > 0 && (
          <section className="section-y bg-surface-alt">
            <div className="container-page">
              <h2 className="type-h3 text-ink">Similar treks</h2>
              <SimilarTreks packages={related} />
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
