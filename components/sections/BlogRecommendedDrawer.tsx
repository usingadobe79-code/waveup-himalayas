"use client";

import { useEffect, useRef, useState } from "react";
import type { TouchEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RecommendedTrekCard } from "@/components/sections/RecommendedTrekCard";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";
import type { Package } from "@/lib/content";

// Tailwind needs literal class names, so the panel's width (`w-72`, below)
// and the toggle's open-state offset (`right-72`) can't share one JS
// constant — keep both at 18rem if either changes, so the tab always rests
// flush with the panel's left edge.
const SWIPE_THRESHOLD = 50; // px

/**
 * Mobile equivalent of BlogRecommendedSidebar — a slide-out edge drawer for
 * the writer-picked "Recommended treks", shown only below `lg` (the desktop
 * sidebar takes over there). Collapsed by default to a small tab pinned to
 * the viewport's right edge — vertically centered, never covering article
 * content. The same tab rides to the open panel's left edge (flipping its
 * chevron) and keeps doubling as the close control; swiping right on the
 * open panel also closes it. The caller (app/blog/[slug]/page.tsx) only
 * renders this when `packages` is non-empty.
 */
export function BlogRecommendedDrawer({ packages }: { packages: Package[] }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const touchStartX = useRef<number | null>(null);

  // Lock page scroll while the panel is open — always restored on close (or
  // unmount), never trapped permanently.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape closes the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  // Swiping left from the tab opens it. preventDefault suppresses the
  // synthetic click a touch gesture would otherwise also fire, which would
  // immediately toggle the state straight back.
  const onHandleTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (dx < -SWIPE_THRESHOLD) {
      e.preventDefault();
      setOpen(true);
    }
  };

  // Swiping right on the open panel closes it.
  const onPanelTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (dx > SWIPE_THRESHOLD) {
      e.preventDefault();
      setOpen(false);
    }
  };

  const handleTransition = reduced ? "" : "transition-[right] duration-300 ease-[var(--ease-out-expo)]";
  const panelTransition = reduced ? "" : "transition-transform duration-300 ease-[var(--ease-out-expo)]";

  return (
    <div className="lg:hidden">
      {/* Backdrop — always mounted (so it can fade), inert and invisible
          while closed; tap to close. */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-30 bg-navy-deep/40 transition-opacity",
          reduced ? "duration-0" : "duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Toggle tab — pinned to the viewport's right edge when collapsed;
          rides to the open panel's left edge (and flips its chevron) when
          open, so it keeps doubling as the close control. */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onTouchStart={onTouchStart}
        onTouchEnd={onHandleTouchEnd}
        aria-expanded={open}
        aria-label={open ? "Hide recommended treks" : "Show recommended treks"}
        className={cn(
          "fixed top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-1 rounded-l-xl border border-border bg-surface-alt px-2 py-3 text-accent-ink shadow-card",
          handleTransition,
          open ? "right-72" : "right-0",
        )}
      >
        {open ? (
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        ) : (
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="type-small font-semibold tracking-wide [writing-mode:vertical-rl]">Treks</span>
      </button>

      {/* Panel */}
      <aside
        aria-hidden={!open}
        onTouchStart={onTouchStart}
        onTouchEnd={onPanelTouchEnd}
        className={cn(
          "fixed right-0 top-0 z-40 h-full w-72 max-w-[85vw] overflow-y-auto bg-surface-alt p-5 shadow-card-hover",
          panelTransition,
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <h2 className="type-eyebrow">Recommended treks</h2>
        <div className="mt-4 space-y-4">
          {packages.map((pkg) => (
            <RecommendedTrekCard key={pkg.slug} pkg={pkg} />
          ))}
        </div>
      </aside>
    </div>
  );
}
