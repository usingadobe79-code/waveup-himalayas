import { TrekCard } from "@/components/sections/TrekCard";
import type { Package } from "@/lib/content";

/**
 * "Similar treks" cards for a package's detail page — uses the shared TrekCard,
 * same as the /packages listing and homepage. The caller
 * (app/packages/[slug]/page.tsx) supplies the already-filtered list from
 * `relatedPackages()` in lib/content.ts and hides the section entirely when
 * it's empty.
 */
export function SimilarTreks({ packages }: { packages: Package[] }) {
  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {packages.map((p) => (
        <TrekCard key={p.slug} pkg={p} />
      ))}
    </div>
  );
}
