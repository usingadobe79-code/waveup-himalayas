"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PackageImage } from "@/components/ui/PackageImage";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { staggerContainer, fadeRise, REVEAL } from "@/lib/motion";
import { featuredPackages, totalPackages, whatsappEnquiry } from "@/lib/content";

/**
 * "Popular Adventures" — 6 featured packages in a responsive grid (docs/01 §5).
 * Cards stagger-reveal on scroll; hover scales the framed image, lifts the card
 * and nudges the gold "View Details →" arrow. No prices/durations (none exist);
 * each card routes to a prefilled WhatsApp enquiry. Reduced motion → no reveal,
 * instant content.
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
        <motion.div {...groupProps}>
          <motion.div variants={itemVariants}>
            <SectionHeading
              eyebrow="Featured Packages"
              title="Popular Adventures"
              intro="A handful of our most-loved journeys across the Nepal Himalayas. Every trip is fully customizable — tell us what you have in mind."
            />
          </motion.div>

          <div className="mt-12 grid gap-6 md:mt-16 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPackages.map((pkg, i) => (
              <motion.article
                key={pkg.title}
                variants={itemVariants}
                className="card card-hover group relative flex flex-col overflow-hidden"
              >
                <Link
                  href={whatsappEnquiry(pkg.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                  aria-label={`Enquire about ${pkg.title} on WhatsApp`}
                >
                  {/* Fixed-ratio image frame. The real photo is the base layer;
                      a subtle BOTTOM-ONLY scrim sits above it for grounding/
                      badge legibility — never a full-card overlay. */}
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <PackageImage
                      src={pkg.image}
                      alt={pkg.title}
                      // First card is above the fold (LCP) — load it eagerly with
                      // a preload; the rest stay lazy. Branded placeholder if null.
                      priority={i === 0}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.08]"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-surface-darker/55 to-transparent" />
                    <span className="type-small absolute left-4 top-4 rounded-badge bg-surface-darker/70 px-3 py-1 font-medium text-accent-hover backdrop-blur-sm">
                      {pkg.region}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="type-h3 text-ink">{pkg.title}</h3>
                    <p className="type-small mt-2 flex-1 text-muted">{pkg.blurb}</p>
                    <span className="type-small mt-5 inline-flex items-center gap-1.5 font-semibold text-accent">
                      View Details
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {/* View All — gold underline wipe + arrow nudge.
              NOTE: the dedicated /packages page doesn't exist yet (out of v1
              scope), so this anchors to #regions, where all 25 packages are
              browsable by region. Repoint to "/packages" once that page ships.
              Plain anchor (not next/link) avoids a route prefetch 404. */}
          <motion.div variants={itemVariants} className="mt-16 flex justify-center">
            <a
              href="#regions"
              className="type-body group inline-flex items-center gap-2 font-semibold text-ink transition-colors hover:text-accent"
            >
              <span className="relative">
                View All {totalPackages} Packages
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
              </span>
              <ArrowRight className="h-4 w-4 text-accent transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
