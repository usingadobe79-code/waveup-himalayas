"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PackageImage } from "@/components/ui/PackageImage";
import { SaleBadge } from "@/components/ui/SaleBadge";
import {
  packages,
  regions,
  services,
  packageService,
  priceLabel,
  discountPercent,
  type ServiceKey,
} from "@/lib/content";
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
                  <Link
                    key={p.slug}
                    href={`/packages/${p.slug}`}
                    className="card card-hover group flex flex-col overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                  >
                    <div className="relative aspect-[3/2] overflow-hidden">
                      <PackageImage
                        src={p.imageDisplay ?? null}
                        alt={p.title}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
                      />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-surface-darker/55 to-transparent" />
                      <span className="type-small absolute left-4 top-4 rounded-badge bg-surface-darker/70 px-3 py-1 font-medium text-accent-hover backdrop-blur-sm">
                        {p.region}
                      </span>
                      <SaleBadge pkg={p} className="absolute right-4 top-4" />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="type-h3 text-ink">{p.title}</h3>
                      {p.blurb && <p className="type-small mt-2 flex-1 text-muted">{p.blurb}</p>}
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span className="flex flex-wrap items-baseline gap-2">
                          {discountPercent(p) != null && (
                            <span className="type-small text-muted line-through">
                              ${p.originalPrice!.toLocaleString()}
                            </span>
                          )}
                          <span className="type-small font-medium text-muted">{priceLabel(p.price)}</span>
                        </span>
                        <span className="type-small font-semibold text-accent-ink transition-colors group-hover:text-accent group-hover:underline group-hover:underline-offset-4">
                          View Details
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
