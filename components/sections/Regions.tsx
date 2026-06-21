"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { regions } from "@/lib/content";

/**
 * Regions — tabbed explorer (docs/01 §7). Tabs map to the real region buckets in
 * content.ts; the active tab is a gold pill that animates between tabs via the
 * Framer `layoutId` shared-element trick. The panel lists the REAL package titles
 * for the active region (no invented trips); each routes to a WhatsApp enquiry.
 * Panel cross-fades + slides slightly on tab change. Reduced motion → the pill
 * jumps instantly and panels swap with no slide.
 */
export function Regions() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<(typeof regions)[number]["key"]>(regions[0].key);

  const current = regions.find((r) => r.key === active) ?? regions[0];
  const count: number = current.packages.length; // widen from literal union for comparison

  // layoutId transition for the gold pill — glide, never snap; instant under RM.
  const pillTransition = reduced
    ? { duration: 0 }
    : { duration: 0.4, ease: EASE_OUT_EXPO };

  return (
    <section id="regions" className="section-y bg-surface">
      <div className="container-page">
        <SectionHeading
          eyebrow="Where We Go"
          title="Explore by Region"
          intro="From the Everest icons to quiet cultural trails and the Chitwan lowlands — browse our trips by where they take you."
        />

        {/* Tab bar — wraps on small screens, gold pill animates between tabs */}
        <div
          role="tablist"
          aria-label="Regions"
          className="mt-10 flex flex-wrap justify-center gap-2 md:mt-12"
        >
          {regions.map((region) => {
            const selected = region.key === active;
            return (
              <button
                key={region.key}
                role="tab"
                type="button"
                aria-selected={selected}
                onClick={() => setActive(region.key)}
                className="relative rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2"
              >
                {selected && (
                  <motion.span
                    layoutId="region-pill"
                    aria-hidden="true"
                    transition={pillTransition}
                    className="absolute inset-0 -z-10 rounded-full bg-accent shadow-[0_4px_16px_-6px_var(--color-accent)]"
                  />
                )}
                <span className={selected ? "text-surface-darker" : "text-muted hover:text-ink"}>
                  {region.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Panel — real package titles for the active region */}
        <div className="mt-10 md:mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.key}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={reduced ? { duration: 0 } : { duration: 0.35, ease: EASE_OUT_EXPO }}
            >
              <p className="type-small mb-6 text-center text-muted">
                {count} {count === 1 ? "journey" : "journeys"} in {current.label}
              </p>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {current.packages.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/packages/${p.slug}`}
                    className="group flex items-start justify-between gap-3 rounded-card border border-border bg-surface-alt px-5 py-4 shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                    aria-label={`View details for ${p.title}`}
                  >
                    <span className="type-body font-medium text-ink">{p.title}</span>
                    <ArrowUpRight
                      className="mt-0.5 h-5 w-5 shrink-0 text-accent-ink transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
