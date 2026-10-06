import { cn } from "@/lib/cn";
import { discountPercent, priceLabel, type Package } from "@/lib/content";

/**
 * Shared price display for packages — a compact "sm" variant for cards and a
 * larger "lg" variant for the package detail sidebar. Shows the strikethrough
 * original price + "Save {X}%" badge when `discountPercent` finds a genuine
 * discount, and/or the writer's free-text `offerLabel`. See lib/content.ts
 * `priceLabel`/`discountPercent`.
 */
export function PriceTag({
  pkg,
  size = "sm",
  className,
}: {
  pkg: Package;
  size?: "sm" | "lg";
  className?: string;
}) {
  const pct = discountPercent(pkg);
  const hasPrice = typeof pkg.price === "number";

  if (size === "lg") {
    return (
      <div className={className}>
        {pct != null && (
          <p className="type-body text-muted line-through">${pkg.originalPrice!.toLocaleString()}</p>
        )}
        <p className="type-h2 leading-none text-ink mt-1">{priceLabel(pkg.price)}</p>
        {hasPrice && <p className="type-small mt-2 text-muted">per person</p>}
        {(pct != null || pkg.offerLabel) && (
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 type-small font-semibold text-accent-ink">
            {pct != null && <span>Save {pct}%</span>}
            {pct != null && pkg.offerLabel && <span className="opacity-40">·</span>}
            {pkg.offerLabel && <span>{pkg.offerLabel}</span>}
          </span>
        )}
      </div>
    );
  }

  // size === "sm" (cards)
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="type-body font-semibold text-ink">{priceLabel(pkg.price)}</span>
        {pct != null && (
          <span className="type-small text-muted line-through">${pkg.originalPrice!.toLocaleString()}</span>
        )}
        {pct != null && (
          <span className="type-small font-semibold text-accent-ink">Save {pct}%</span>
        )}
      </div>
      {hasPrice && <span className="text-[0.7rem] uppercase tracking-[0.08em] text-muted">per person</span>}
    </div>
  );
}
