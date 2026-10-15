import { MessageSquareText } from "lucide-react";
import type { Package } from "@/lib/content";
import { Stars } from "@/components/ui/Rating";
import { ReviewsCarousel } from "@/components/sections/ReviewsCarousel";
import { ReviewForm } from "@/components/sections/ReviewForm";

/**
 * Reviews section for a trip page: eyebrow + heading, a ratings summary panel
 * and owner-approved reviews (when any exist), or a polished empty state, and
 * ALWAYS the "Write a review" form so customers can leave the first one.
 */
export function PackageReviews({ pkg }: { pkg: Package }) {
  const reviews = pkg.reviews ?? [];
  const hasReviews = reviews.length > 0 && pkg.ratingAverage != null;

  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));
  const total = reviews.length;

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="rounded-2xl border border-border bg-accent/5 p-5 sm:p-8"
    >
      <p className="type-eyebrow text-accent-ink">Reviews</p>
      <h2 id="reviews-heading" className="type-h2 mt-2 text-ink">
        What travellers say
      </h2>

      {hasReviews ? (
        <>
          <div className="mt-6 grid gap-6 rounded-2xl border border-border bg-surface-alt p-6 shadow-sm sm:grid-cols-[auto_1fr] sm:items-center sm:gap-10 sm:p-8">
            <div className="text-center sm:border-r sm:border-border sm:pr-10">
              <p className="font-display text-6xl font-semibold leading-none text-ink">
                {pkg.ratingAverage!.toFixed(1)}
              </p>
              <Stars value={pkg.ratingAverage!} className="mt-3" />
              <p className="type-small mt-2 text-muted">
                Based on {total} {total === 1 ? "review" : "reviews"}
              </p>
            </div>

            <ul className="space-y-2" aria-label="Rating breakdown">
              {counts.map(({ star, count }) => (
                <li key={star} className="flex items-center gap-3">
                  <span className="type-small w-8 shrink-0 font-medium text-ink">{star} ★</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                    <span
                      className="block h-full rounded-full bg-accent"
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </span>
                  <span className="type-small w-6 shrink-0 text-right text-muted">{count}</span>
                </li>
              ))}
            </ul>
          </div>

          <ReviewsCarousel reviews={reviews} />
        </>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-accent/40 bg-surface-alt px-6 py-10 text-center">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent-ink">
            <MessageSquareText className="h-6 w-6" aria-hidden="true" />
          </span>
          <h3 className="type-h3 mt-4 text-ink">Be the first to review this trek</h3>
          <p className="type-body mx-auto mt-2 max-w-md text-muted">
            Have you trekked with us? Your honest words help fellow travellers choose their
            Himalayan adventure with confidence.
          </p>
        </div>
      )}

      <div className="mt-8">
        <ReviewForm tripTitle={pkg.title} tripSlug={pkg.slug} />
      </div>
    </section>
  );
}
