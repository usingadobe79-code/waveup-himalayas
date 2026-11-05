"use client";

import { useState } from "react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import { regions } from "@/lib/content";

/**
 * Regions — tabbed explorer (docs/01 §7). Tabs map to the real region buckets in
 * content.ts; the active tab is a gold pill. The panel lists the REAL package
 * titles for the active region (no invented trips); each routes to a package
 * page. The panel cross-fades in on tab change.
 *
 * CSS, not framer-motion: Regions no longer imports the motion runtime, so the
 * bundler can drop framer-motion from the home page entirely (it gated the
 * hero's hydration, and so the LCP). The active pill cross-fades per tab rather
 * than sliding via `layoutId`; the panel replays a keyframe on its `key` change.
 * Reduced motion is handled by the global rule in globals.css.
 */
export function Regions() {
  const [active, setActive] = useState<(typeof regions)[number]["key"]>(regions[0].key);

  const current = regions.find((r) => r.key === active) ?? regions[0];
  const count: number = current.packages.length; // widen from literal union for comparison

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
                {/* Gold pill on every tab, cross-faded by `selected` (replaces
                    the framer layoutId glide). */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-0 -z-10 rounded-full bg-accent shadow-[0_4px_16px_-6px_var(--color-accent)] transition-opacity duration-300",
                    selected ? "opacity-100" : "opacity-0",
                  )}
                />
                <span className={selected ? "text-surface-darker" : "text-muted hover:text-ink"}>
                  {region.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Panel — real package titles for the active region. `key` changes on
            tab click, remounting this block so the CSS `panel-fade` keyframe
            replays (the cross-fade that AnimatePresence used to drive). */}
        <div className="mt-10 md:mt-12">
          <div key={current.key} className="panel-fade">
            <p className="type-small mb-6 text-center text-muted">
              {count} {count === 1 ? "journey" : "journeys"} in {current.label}
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {current.packages.map((p) => (
                <Link
                  key={p.slug}
                  href={`/packages/${p.slug}`}
                  className="group flex items-start rounded-card border border-border bg-surface-alt px-5 py-4 shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                  aria-label={`View details for ${p.title}`}
                >
                  <span className="type-body font-medium text-ink transition-colors group-hover:text-accent group-hover:underline group-hover:underline-offset-4">
                    {p.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
