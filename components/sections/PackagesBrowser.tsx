"use client";

import { useEffect, useState } from "react";
import { TrekCard } from "@/components/sections/TrekCard";
import { packages, regions, services, packageService, type ServiceKey } from "@/lib/content";
import { cn } from "@/lib/cn";

/**
 * The /packages listing, filterable by service. Server components can't hold the
 * active-filter state or read the URL hash, so the interactive part lives here;
 * the page shell (header, intro, footer, metadata) stays server-rendered.
 *
 * A service card on the home page links to /packages#trekking etc. On mount we
 * read that hash and open on the matching filter, and every pill click writes the
 * hash back so the view is shareable and survives a refresh. "all" clears it.
 *
 * Grouping stays by region within the chosen service, matching the rest of the
 * site; regions with no matching trip simply don't render.
 */

type Filter = "all" | ServiceKey;

const PILLS: { key: Filter; label: string }[] = [
  { key: "all", label: "All Trips" },
  ...services.map((s) => ({ key: s.key as ServiceKey, label: s.title })),
];

export function PackagesBrowser() {
  const [filter, setFilter] = useState<Filter>("all");

  // Open on the service named in the URL hash (#trekking), if valid.
  useEffect(() => {
    const fromHash = window.location.hash.replace(/^#/, "");
    if (PILLS.some((p) => p.key === fromHash)) setFilter(fromHash as Filter);
  }, []);

  const select = (key: Filter) => {
    setFilter(key);
    // replaceState (not a navigation) so the Back button isn't polluted by
    // filter clicks; clearing to "all" drops the hash entirely.
    const url = key === "all" ? window.location.pathname : `#${key}`;
    window.history.replaceState(null, "", url);
  };

  const visible = packages.filter((p) => filter === "all" || packageService(p) === filter);

  // Group the visible set by region, reusing the canonical region order.
  const grouped = regions
    .map((r) => ({
      key: r.key,
      label: r.label,
      items: visible.filter((p) => p.regionKey === r.key),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <section className="section-y bg-surface">
      <div className="container-page">
        {/* Filter pills */}
        <div className="mb-12 flex flex-wrap gap-2.5" role="tablist" aria-label="Filter packages by service">
          {PILLS.map((p) => {
            const active = p.key === filter;
            return (
              <button
                key={p.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => select(p.key)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
                  active
                    ? "border-accent bg-accent text-surface-darker"
                    : "border-border bg-surface-alt text-muted hover:border-accent/50 hover:text-ink",
                )}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-16 md:space-y-20">
          {grouped.map((region) => (
            // id lets the header's Regions dropdown deep-link straight here
            // (/packages/#everest etc.) — SmoothScroll's arrival-hash effect
            // handles the header-offset scroll globally, no extra wiring needed.
            <div key={region.key} id={region.key}>
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="type-h3 text-ink">{region.label}</h2>
                <span className="type-small shrink-0 text-muted">
                  {region.items.length} {region.items.length === 1 ? "trip" : "trips"}
                </span>
              </div>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {region.items.map((p) => (
                  <TrekCard key={p.slug} pkg={p} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
