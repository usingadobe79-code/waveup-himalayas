import { discountPercent, type Package } from "@/lib/content";
import { cn } from "@/lib/cn";

/**
 * Small accent-colored pill for a package on sale — "{X}% OFF" (from
 * `discountPercent`) and/or the writer's free-text `offerLabel`. Renders
 * nothing when the package has neither, so callers can drop it in
 * unconditionally as an absolutely-positioned corner badge over a card's
 * cover image. See lib/content.ts `discountPercent`/`isOnSale`.
 */
export function SaleBadge({ pkg, className }: { pkg: Package; className?: string }) {
  const percentOff = discountPercent(pkg);
  if (percentOff == null && !pkg.offerLabel) return null;

  return (
    <div className={cn("flex flex-col items-end gap-1.5", className)}>
      {percentOff != null && (
        <span className="type-small rounded-badge bg-accent px-2.5 py-1 font-semibold text-surface-darker shadow-card">
          {percentOff}% OFF
        </span>
      )}
      {pkg.offerLabel && (
        <span className="type-small rounded-badge bg-accent px-2.5 py-1 font-semibold text-surface-darker shadow-card">
          {pkg.offerLabel}
        </span>
      )}
    </div>
  );
}
