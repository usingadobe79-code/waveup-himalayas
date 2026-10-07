"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/cn";
import { useWishlist } from "@/lib/useWishlist";

/**
 * Circular heart toggle for a package card's cover image — saves/removes the
 * package in the client-side wishlist (lib/useWishlist.ts; localStorage only,
 * no server/db). Outline when not saved; filled gold once saved.
 *
 * Cards that use this sit inside (or behind) a "stretched link" to the
 * package's detail page, so the click MUST stop there: both preventDefault
 * (blocks the anchor's own navigation) and stopPropagation (blocks the click
 * bubbling to the card's link/handlers) are required, not just one.
 */
export function WishlistButton({ slug, className }: { slug: string; className?: string }) {
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(slug);
  const label = saved ? "Saved" : "Save to wishlist";

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-white/90 p-2 shadow-card backdrop-blur-sm transition-transform duration-200 hover:scale-110",
        className,
      )}
    >
      <Heart
        className={cn("h-4 w-4", saved ? "fill-current text-accent" : "text-ink")}
        aria-hidden="true"
      />
    </button>
  );
}
