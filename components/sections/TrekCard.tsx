import Link from "next/link";
import { MapPin, Calendar, MessageCircle, ArrowRight } from "lucide-react";
import { PackageImage } from "@/components/ui/PackageImage";
import { SaleBadge } from "@/components/ui/SaleBadge";
import { RatingBadge } from "@/components/ui/Rating";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { discountPercent, priceLabel, whatsappEnquiry, type Package } from "@/lib/content";
import { cn } from "@/lib/cn";

/**
 * The single trek/package listing card, shared by /packages (PackagesBrowser),
 * the homepage (FeaturedPackages) and package-detail "Similar treks".
 *
 * Default: the whole card is one <Link>. `featured`: the card is an <article>
 * whose title carries a stretched link (::before covers the card) and a
 * WhatsApp "Enquire" action sits above it (z-10) — plus the blurb is shown.
 * WishlistButton is always its own interactive element layered above (z-10).
 * `priority` eagerly loads the image (above-the-fold LCP card).
 */
export function TrekCard({
  pkg,
  featured = false,
  priority = false,
  className,
}: {
  pkg: Package;
  featured?: boolean;
  priority?: boolean;
  className?: string;
}) {
  const href = `/packages/${pkg.slug}`;
  const pct = discountPercent(pkg);
  const hasPrice = typeof pkg.price === "number";
  const duration = pkg.tripFacts?.duration;

  const cardClass = cn(
    "card card-hover group flex h-full flex-col overflow-hidden hover:border-accent/50",
    className,
  );

  const inner = (
    <>
      <div className="relative aspect-[3/2] overflow-hidden">
        <PackageImage
          src={pkg.imageDisplay ?? null}
          alt={pkg.title}
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-surface-darker/55 to-transparent" />
        <div className="absolute left-4 top-4 z-10 flex flex-col items-start gap-1.5">
          <span className="type-small rounded-badge bg-surface-darker/70 px-3 py-1 font-medium text-accent-hover backdrop-blur-sm">
            {pkg.region}
          </span>
          <SaleBadge pkg={pkg} />
        </div>
        <WishlistButton slug={pkg.slug} className="absolute right-4 top-4 z-10" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        {/* 1. Location */}
        <p className="inline-flex items-center gap-1 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-accent-ink">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {pkg.region}
        </p>

        {/* 2. Title */}
        <h3 className="type-h3 mt-1.5 text-ink transition-colors group-hover:text-accent-ink">
          {featured ? (
            <Link
              href={href}
              className="rounded-card before:absolute before:inset-0 before:z-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
              aria-label={`View details for ${pkg.title}`}
            >
              {pkg.title}
            </Link>
          ) : (
            pkg.title
          )}
        </h3>

        {/* 3. Duration + rating */}
        <div className="mt-2 flex items-center justify-between gap-3 type-small text-muted">
          {duration ? (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              {duration}
            </span>
          ) : (
            <span />
          )}
          <RatingBadge average={pkg.ratingAverage} count={pkg.reviewCount} />
        </div>

        {featured && pkg.blurb && (
          <p className="type-small mt-2 line-clamp-2 text-muted">{pkg.blurb}</p>
        )}

        {/* 4. Divider + 5. Price row. "Per person" sits above the price (shown once). */}
        <div className="flex-1" />
        <div className="mt-4 flex items-end justify-between gap-3 border-t border-border pt-4">
          <div className="min-w-0">
            {hasPrice && (
              <p className="text-[0.7rem] uppercase tracking-[0.08em] text-muted">Per person</p>
            )}
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="type-body font-bold text-ink">{priceLabel(pkg.price)}</span>
              {pct != null && (
                <span className="type-small text-muted line-through">
                  ${pkg.originalPrice!.toLocaleString()}
                </span>
              )}
              {pct != null && (
                <span className="type-small font-semibold text-accent-ink">Save {pct}%</span>
              )}
            </div>
          </div>
          {!featured && (
            <ArrowRight
              className="mb-0.5 h-4 w-4 shrink-0 -translate-x-1 text-accent-ink opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
              aria-hidden="true"
            />
          )}
          {featured && (
            <a
              href={whatsappEnquiry(pkg.title)}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 type-small inline-flex shrink-0 items-center gap-1.5 font-medium text-muted transition-colors hover:text-accent-ink"
              aria-label={`Enquire about ${pkg.title} on WhatsApp`}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Enquire
            </a>
          )}
        </div>
      </div>
    </>
  );

  if (featured) {
    return <article className={cn(cardClass, "relative")}>{inner}</article>;
  }
  return (
    <Link
      href={href}
      className={cn(
        cardClass,
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
      )}
    >
      {inner}
    </Link>
  );
}
