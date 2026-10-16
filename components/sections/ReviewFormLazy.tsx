"use client";

import dynamic from "next/dynamic";

/**
 * Loads the review form (and the Supabase client it pulls in) on demand, so
 * package pages don't ship that code to visitors who never write a review.
 */
const ReviewForm = dynamic(
  () => import("@/components/sections/ReviewForm").then((m) => m.ReviewForm),
  {
    ssr: false,
    loading: () => (
      <div className="card min-h-[32rem] p-6 sm:p-8">
        <h3 className="type-h3 text-ink">Write a review</h3>
        <p className="type-small mt-2 text-muted">Loading…</p>
      </div>
    ),
  },
);

export function ReviewFormLazy({ tripTitle, tripSlug }: { tripTitle: string; tripSlug: string }) {
  return <ReviewForm tripTitle={tripTitle} tripSlug={tripSlug} />;
}
