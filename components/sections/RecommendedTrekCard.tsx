import Link from "next/link";
import { PackageImage } from "@/components/ui/PackageImage";
import type { Package } from "@/lib/content";

/**
 * Compact trek card for a blog post's writer-picked "Recommended treks" —
 * shared by the desktop sidebar (BlogRecommendedSidebar) and the mobile
 * drawer (BlogRecommendedDrawer) so the two never duplicate markup. Same
 * card language as SimilarTreks/PackagesBrowser (card/card-hover, cover via
 * `imageDisplay`), just sized down for a narrow column.
 */
export function RecommendedTrekCard({ pkg }: { pkg: Package }) {
  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className="card card-hover group flex flex-col overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <PackageImage
          src={pkg.imageDisplay ?? null}
          alt={pkg.title}
          sizes="(max-width: 1024px) 85vw, 320px"
          className="transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-surface-darker/55 to-transparent" />
        <span className="type-small absolute left-3 top-3 rounded-badge bg-surface-darker/70 px-2.5 py-1 font-medium text-accent-hover backdrop-blur-sm">
          {pkg.region}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="type-small font-semibold text-ink">{pkg.title}</h3>
        {pkg.blurb && <p className="type-small mt-1.5 line-clamp-2 text-muted">{pkg.blurb}</p>}
        <span className="type-small mt-3 font-semibold text-accent-ink transition-colors group-hover:text-accent group-hover:underline group-hover:underline-offset-4">
          View trek
        </span>
      </div>
    </Link>
  );
}
