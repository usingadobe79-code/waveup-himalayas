"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
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
                key={pkg.slug}
                variants={itemVariants}
                className="card card-hover group relative flex flex-col overflow-hidden"
              >
                {/* Fixed-ratio image frame. The real photo (or branded
                    placeholder) is the base layer; a subtle BOTTOM-ONLY scrim
                    sits above it for badge legibility — never a full-card overlay. */}
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
                  {/* Stretched link: the title's ::before covers the whole card,
                      so the card opens the detail page. The WhatsApp "Enquire"
                      link below sits above it (z-10) as a separate action. */}
                  <h3 className="type-h3 text-ink">
                    <Link
                      href={`/packages/${pkg.slug}`}
                      className="rounded-card before:absolute before:inset-0 before:z-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                      aria-label={`View details for ${pkg.title}`}
                    >
                      {pkg.title}
                    </Link>
                  </h3>
                  {pkg.blurb && (
                    <p className="type-small mt-2 flex-1 text-muted">{pkg.blurb}</p>
                  )}
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="type-small font-semibold text-accent-ink transition-colors group-hover:text-accent group-hover:underline group-hover:underline-offset-4">
                      View Details
                    </span>
                    <a
                      href={whatsappEnquiry(pkg.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-10 type-small inline-flex items-center gap-1.5 font-medium text-muted transition-colors hover:text-accent-ink"
                      aria-label={`Enquire about ${pkg.title} on WhatsApp`}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Enquire
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* View All — gold text + underline on hover/focus → the /packages index. */}
          <motion.div variants={itemVariants} className="mt-16 flex justify-center">
            <Link
              href="/packages"
              className="type-body rounded-sm font-semibold text-ink underline-offset-4 transition-colors hover:text-accent hover:underline focus-visible:text-accent focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
            >
              View All {totalPackages} Packages
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
