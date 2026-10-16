"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrekCard } from "@/components/sections/TrekCard";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { staggerContainer, fadeRise, REVEAL } from "@/lib/motion";
import { featuredPackages, totalPackages } from "@/lib/content";

/**
 * "Popular Adventures" — 6 featured packages in a responsive grid (docs/01 §5).
 * Cards stagger-reveal on scroll; hover scales the framed image, lifts the card
 * and nudges the gold "View Details →" arrow; each card shows its price (see
 * priceLabel/discountPercent in lib/content.ts) and routes to a prefilled
 * WhatsApp enquiry. Reduced motion → no reveal, instant content.
 */
export function FeaturedPackages() {
  const reduced = useReducedMotion();

  // Under reduced motion, drive children to the shown state via animate="show"
  // (initial=false = no enter animation). Dropping the variants instead would
  // strand them at "hidden" opacity:0 — useReducedMotion resolves true only
  // after mount, and with Lenis off + no whileInView nothing reveals them.
  // (a11y: cards were blank for reduced-motion users before this.)
  const groupProps = reduced
    ? { variants: staggerContainer, initial: false as const, animate: "show" as const }
    : {
        variants: staggerContainer,
        initial: "hidden" as const,
        whileInView: "show" as const,
        viewport: REVEAL.viewport,
      };
  const itemVariants = fadeRise;

  return (
    <section id="packages" className="section-y bg-surface-alt">
      <div className="container-page">
        <m.div {...groupProps}>
          <m.div variants={itemVariants}>
            <SectionHeading
              eyebrow="Featured Packages"
              title="Popular Adventures"
              intro="A handful of our most-loved journeys across the Nepal Himalayas. Every trip is fully customizable — tell us what you have in mind."
            />
          </m.div>

          <div className="mt-12 grid gap-6 md:mt-16 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPackages.map((pkg, i) => (
              <m.div key={pkg.slug} variants={itemVariants}>
                {/* First card is above the fold (LCP) — load it eagerly. */}
                <TrekCard pkg={pkg} featured priority={i === 0} />
              </m.div>
            ))}
          </div>

          {/* View All — gold text + underline on hover/focus → the /packages index. */}
          <m.div variants={itemVariants} className="mt-16 flex justify-center">
            <Link
              href="/packages"
              className="type-body rounded-sm font-semibold text-ink underline-offset-4 transition-colors hover:text-accent hover:underline focus-visible:text-accent focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
            >
              View All {totalPackages} Packages
            </Link>
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
