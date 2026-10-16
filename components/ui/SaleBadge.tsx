import { Tag } from "lucide-react";
import { cn } from "@/lib/cn";
import { discountPercent, type Package } from "@/lib/content";

/**
 * Small accent-colored pill for a package on sale — the writer's free-text
 * `offerLabel` when set, else "{X}% OFF" (from `discountPercent`). Renders
 * nothing when the package has neither, so callers can drop it in
 * unconditionally as an absolutely-positioned corner badge over a card's
 * cover image. See lib/content.ts `discountPercent`.
 */
export function SaleBadge({ pkg, className }: { pkg: Package; className?: string }) {
  const pct = discountPercent(pkg);
  const label = pkg.offerLabel ?? (pct != null ? `${pct}% OFF` : null);
  if (!label) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-surface-darker shadow-card",
        className
      )}
    >
      <Tag className="h-3 w-3" aria-hidden="true" />
      {label}
    </span>
  );
}
