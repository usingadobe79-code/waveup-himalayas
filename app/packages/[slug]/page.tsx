import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, MessageCircle, Mail, Phone } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { PackageImage } from "@/components/ui/PackageImage";
import {
  packages,
  getPackage,
  priceLabel,
  whatsappEnquiry,
  emailEnquiry,
  typicalInclusions,
  contact,
  business,
} from "@/lib/content";

// Only the 25 known slugs are valid routes; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return packages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) return { title: "Package not found — WaveUp Himalayas" };
  const description =
    pkg.blurb ?? `${pkg.title} in Nepal's ${pkg.region}. Plan a tailored trip with WaveUp Himalayas.`;
  return {
    title: `${pkg.title} — WaveUp Himalayas`,
    description,
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

  // No fabricated copy: use the real blurb when present, otherwise an honest,
  // generic line. The tailoring note applies to every WaveUp trip.
  const overview =
    pkg.blurb ??
    `Full trip notes and a day-by-day plan for the ${pkg.title} are shared on enquiry.`;

  return (
    <>
      <Header solid />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative isolate flex min-h-[58vh] items-end overflow-hidden">
          <PackageImage
            src={pkg.image}
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

              {/* What's included */}
              <div>
                <h2 className="type-h3 text-ink">What&rsquo;s included</h2>
                <ul className="mt-5 space-y-3">
                  {typicalInclusions.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <Check className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                      </span>
                      <span className="type-body text-ink">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="type-small mt-4 text-muted">
                  Typical inclusions — exact details are confirmed per trip when you enquire.
                </p>
              </div>

              {/* Itinerary */}
              <div>
                <h2 className="type-h3 text-ink">Itinerary</h2>
                <div className="mt-5 rounded-card border border-dashed border-border bg-surface-alt p-6 text-center">
                  <p className="type-body font-medium text-ink">
                    Detailed itinerary on enquiry
                  </p>
                  <p className="type-small mt-2 text-muted">
                    We build a day-by-day plan around your dates and preferences — message
                    us and we&rsquo;ll send a tailored itinerary for the {pkg.title}.
                  </p>
                </div>
              </div>
            </div>

            {/* Booking card */}
            <aside className="lg:col-span-1">
              <div className="card sticky top-24 p-6 lg:p-8">
                <p className="type-eyebrow">Price</p>
                {/* All prices are null in v1 -> "Price on enquiry" (never fabricated). */}
                <p className="type-h3 mt-2 text-ink">{priceLabel(pkg.price)}</p>
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
      </main>
      <Footer />
    </>
  );
}
