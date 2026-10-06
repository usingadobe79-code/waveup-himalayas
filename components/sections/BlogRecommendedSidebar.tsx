import { RecommendedTrekCard } from "@/components/sections/RecommendedTrekCard";
import type { Package } from "@/lib/content";

/**
 * Desktop sidebar of writer-picked "Recommended treks" on a blog post —
 * sticky alongside the article body, hidden below `lg` (BlogRecommendedDrawer
 * is the mobile equivalent). `top-24` matches the sticky booking card on
 * app/packages/[slug]/page.tsx, which clears the fixed header the same way.
 * The caller (app/blog/[slug]/page.tsx) only renders this when `packages` is
 * non-empty.
 */
export function BlogRecommendedSidebar({ packages }: { packages: Package[] }) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24">
        <h2 className="type-h3 text-ink">Recommended treks</h2>
        <div className="mt-5 space-y-5">
          {packages.map((pkg) => (
            <RecommendedTrekCard key={pkg.slug} pkg={pkg} />
          ))}
        </div>
      </div>
    </aside>
  );
}
