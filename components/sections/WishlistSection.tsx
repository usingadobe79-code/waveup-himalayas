"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SimilarTreks } from "@/components/sections/SimilarTreks";
import { useWishlist } from "@/lib/useWishlist";
import { packages } from "@/lib/content";

/**
 * The /wishlist grid. Reads saved slugs from localStorage (lib/useWishlist)
 * and maps them against the canonical `packages` list, preserving that
 * list's order — then reuses SimilarTreks' card markup (same card look as
 * the rest of the site, heart included) so a saved trek looks identical to
 * everywhere else it appears.
 *
 * `saved` starts empty until mount (see useWishlist's hydration note), so
 * this briefly renders the empty state on first paint even when treks ARE
 * saved — it self-corrects a moment later, same as every heart button.
 */
export function WishlistSection() {
  const { saved } = useWishlist();
  const savedPackages = packages.filter((p) => saved.includes(p.slug));

  if (savedPackages.length === 0) {
    return (
      <section className="section-y bg-surface">
        <div className="container-page">
          <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-8 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-surface-alt">
              <Heart className="h-6 w-6 text-accent" aria-hidden="true" />
            </span>
            <h2 className="type-h3 text-ink">No saved treks yet</h2>
            <p className="type-body text-muted">
              Tap the heart on any trek to save it here for later — it stays on this device,
              ready whenever you come back.
            </p>
            <Button href="/packages" className="mt-2">
              Browse all treks
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-y bg-surface">
      <div className="container-page">
        <p className="type-small text-muted">
          {savedPackages.length} saved {savedPackages.length === 1 ? "trek" : "treks"}
        </p>
        <SimilarTreks packages={savedPackages} />
      </div>
    </section>
  );
}
