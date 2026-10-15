import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Shared star display. `Stars` renders 5 stars (fractional fill for averages);
 * `RatingBadge` is the compact "★ 4.9 (7)" used in card meta rows and renders
 * nothing when a package has no reviews.
 */
export function Stars({
  value,
  className,
  starClassName,
}: {
  value: number;
  className?: string;
  starClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, value - (i - 1)));
        return (
          <span key={i} className={cn("relative inline-block h-4 w-4", starClassName)}>
            <Star className="absolute inset-0 h-full w-full text-border" strokeWidth={1.5} />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star className="h-4 w-4 max-w-none shrink-0 fill-accent text-accent" strokeWidth={1.5} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function RatingBadge({
  average,
  count,
  className,
}: {
  average?: number;
  count?: number;
  className?: string;
}) {
  if (!average || !count) return null;
  return (
    <span
      className={cn("inline-flex items-center gap-1", className)}
      aria-label={`Rated ${average} out of 5 from ${count} ${count === 1 ? "review" : "reviews"}`}
    >
      <Star className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden="true" />
      <span aria-hidden="true">
        {average.toFixed(1)} ({count})
      </span>
    </span>
  );
}
