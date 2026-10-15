import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
import { PackageImage } from "@/components/ui/PackageImage";
import { SaleBadge } from "@/components/ui/SaleBadge";
import { PriceTag } from "@/components/ui/PriceTag";
import { RatingBadge } from "@/components/ui/Rating";
import { WishlistButton } from "@/components/ui/WishlistButton";
import type { Package } from "@/lib/content";

/**
 * "Similar treks" cards for a package's detail page — reuses the same card
 * markup as the /packages listing (PackagesBrowser). The caller
 * (app/packages/[slug]/page.tsx) supplies the already-filtered list from
 * `relatedPackages()` in lib/content.ts and hides the section entirely when
 * it's empty.
 */
export function SimilarTreks({ packages }: { packages: Package[] }) {
  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {packages.map((p) => (
        <Link
          key={p.slug}
          href={`/packages/${p.slug}`}
          className="card card-hover group flex flex-col overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
        >
          <div className="relative aspect-[3/2] overflow-hidden">
            <PackageImage
              src={p.imageDisplay ?? null}
              alt={p.title}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-surface-darker/55 to-transparent" />
            <div className="absolute left-4 top-4 z-10 flex flex-col items-start gap-1.5">
              <span className="type-small rounded-badge bg-surface-darker/70 px-3 py-1 font-medium text-accent-hover backdrop-blur-sm">
                {p.region}
              </span>
              <SaleBadge pkg={p} />
            </div>
            <WishlistButton slug={p.slug} className="absolute right-4 top-4 z-10" />
          </div>
          <div className="flex flex-1 flex-col p-5">
            <h3 className="type-h3 text-ink">{p.title}</h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 type-small text-muted">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                {p.region}
              </span>
              {p.tripFacts?.duration && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                  {p.tripFacts.duration}
                </span>
              )}
              <RatingBadge average={p.ratingAverage} count={p.reviewCount} />
            </div>
            {p.blurb && <p className="type-small mt-2 flex-1 text-muted">{p.blurb}</p>}
            <PriceTag pkg={p} size="sm" className="mt-3" />
            <span className="type-small mt-4 font-semibold text-accent-ink transition-colors group-hover:text-accent group-hover:underline group-hover:underline-offset-4">
              View details
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
