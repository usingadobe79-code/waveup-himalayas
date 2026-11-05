import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrekCard } from "@/components/sections/TrekCard";
import { Reveal } from "@/components/ui/Reveal";
import { featuredPackages, totalPackages } from "@/lib/content";

/**
 * "Popular Adventures" — 6 featured packages in a responsive grid (docs/01 §5).
 * Cards stagger-reveal on scroll; hover scales the framed image, lifts the card
 * and nudges the gold "View Details →" arrow; each card shows its price (see
 * priceLabel/discountPercent in lib/content.ts) and routes to a prefilled
 * WhatsApp enquiry. Reduced motion → no reveal, instant content.
 */
export function FeaturedPackages() {
  return (
    <section id="packages" className="section-y bg-surface-alt">
      <div className="container-page">
        <div>
          <Reveal>
            <SectionHeading
              eyebrow="Featured Packages"
              title="Popular Adventures"
              intro="A handful of our most-loved journeys across the Nepal Himalayas. Every trip is fully customizable — tell us what you have in mind."
            />
          </Reveal>

          <div className="mt-12 grid gap-6 md:mt-16 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPackages.map((pkg, i) => (
              <Reveal key={pkg.slug} delay={i * 80}>
                {/* Below the full-height hero, so lazy-load — eager-loading the
                    first card here preloaded a ~287KB image that competed with
                    the hero for bandwidth on mobile and pushed LCP out. */}
                <TrekCard pkg={pkg} featured />
              </Reveal>
            ))}
          </div>

          {/* View All — gold text + underline on hover/focus → the /packages index. */}
          <Reveal className="mt-16 flex justify-center">
            <Link
              href="/packages"
              className="type-body rounded-sm font-semibold text-ink underline-offset-4 transition-colors hover:text-accent hover:underline focus-visible:text-accent focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
            >
              View All {totalPackages} Packages
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
