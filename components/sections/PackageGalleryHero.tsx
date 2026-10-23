"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Camera, ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { PackageImage } from "@/components/ui/PackageImage";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { cn } from "@/lib/cn";

/**
 * Interactive photo gallery at the top of a package detail page: one large
 * main image (prev/next arrows, swipe, photo counter), a thumbnail strip
 * (vertical column beside the image on lg+, horizontal row below on mobile),
 * and a full-screen lightbox opened by clicking the main image.
 *
 * `images` are resolved on-page display paths (`galleryDisplay`); when empty
 * we fall back to the single `cover` (`imageDisplay`), and when that is also
 * missing the PackageImage branded placeholder renders.
 *
 * `badge` is server-rendered content (e.g. <SaleBadge />) shown top-left.
 */
export function PackageGalleryHero({
  images,
  cover,
  title,
  slug,
  badge,
}: {
  images: string[];
  cover?: string | null;
  title: string;
  slug: string;
  badge?: ReactNode;
}) {
  const list = images.length > 0 ? images : cover ? [cover] : [];
  const count = list.length;
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const isOpen = lightbox !== null;
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const wrap = (i: number) => (i + count) % count;
  const step = (d: number) => setIndex((i) => wrap(i + d));
  const stepLightbox = (d: number) => setLightbox((i) => (i === null ? i : wrap(i + d)));

  // Keep the active thumbnail visible within its own scroller (no page scroll).
  useEffect(() => {
    const el = thumbRefs.current[index];
    const parent = el?.parentElement;
    if (!el || !parent) return;
    const isRow = parent.scrollWidth > parent.clientWidth;
    if (isRow) {
      parent.scrollTo({
        left: el.offsetLeft - (parent.clientWidth - el.clientWidth) / 2,
        behavior: "smooth",
      });
    } else {
      parent.scrollTo({
        top: el.offsetTop - (parent.clientHeight - el.clientHeight) / 2,
        behavior: "smooth",
      });
    }
  }, [index]);

  // Lightbox: body scroll lock + keyboard controls only while open.
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      else if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? i : (i - 1 + count) % count));
      else if (e.key === "ArrowRight") setLightbox((i) => (i === null ? i : (i + 1) % count));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, count]);

  // Touch swipe (shared by main image and lightbox): horizontal-dominant
  // drag past SWIPE_MIN px steps prev/next.
  const SWIPE_MIN = 45;
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = e.touches.length === 1 ? { x: t.clientX, y: t.clientY } : null;
    swiped.current = false;
  };
  const makeTouchEnd = (go: (d: number) => void) => (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || count < 2) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_MIN) {
      swiped.current = true;
      go(dx < 0 ? 1 : -1);
    }
  };

  const arrowClass =
    "absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-card backdrop-blur-sm transition-transform hover:scale-110 focus-visible:scale-110";
  const lightboxControl =
    "absolute flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:bg-white/10";

  return (
    <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_7.5rem] lg:gap-4">
      {/* Main image */}
      <div
        className="relative aspect-[3/2] min-w-0 overflow-hidden rounded-card bg-surface-darker shadow-card"
        onTouchStart={onTouchStart}
        onTouchEnd={makeTouchEnd(step)}
      >
        <PackageImage
          src={list[index] ?? null}
          alt={title}
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
        />

        {count > 0 && (
          <button
            type="button"
            aria-label={`Open photo ${index + 1} of ${count} full screen`}
            onClick={() => {
              if (swiped.current) {
                swiped.current = false;
                return;
              }
              setLightbox(index);
            }}
            className="absolute inset-0 cursor-zoom-in"
          />
        )}

        <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-2">
          {badge}
        </div>
        <WishlistButton slug={slug} className="absolute right-3 top-3 z-10" />

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => step(-1)}
              className={cn(arrowClass, "left-3")}
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => step(1)}
              className={cn(arrowClass, "right-3")}
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </>
        )}

        {count > 0 && (
          <div className="pointer-events-none absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-surface-darker/75 px-3 py-1 text-xs font-medium text-on-dark backdrop-blur-sm">
            <Camera className="h-3.5 w-3.5" aria-hidden="true" />
            {count > 1 ? `${index + 1} / ${count} Photos` : "1 Photo"}
          </div>
        )}
        {count > 0 && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface-darker/75 text-on-dark backdrop-blur-sm"
          >
            <Maximize2 className="h-4 w-4" />
          </span>
        )}
      </div>

      {/* Thumbnails: horizontal row on mobile, vertical column on lg+ */}
      {count > 1 && (
        <div className="relative min-w-0">
          <div
            role="group"
            aria-label="Photo thumbnails"
            className="flex gap-2 overflow-x-auto pb-1 lg:absolute lg:inset-0 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0 lg:pr-1"
          >
            {list.map((src, i) => (
              <button
                key={`${src}-${i}`}
                ref={(el) => {
                  thumbRefs.current[i] = el;
                }}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "relative aspect-[3/2] w-24 shrink-0 overflow-hidden rounded-lg ring-2 ring-offset-2 ring-offset-surface transition lg:w-full",
                  i === index ? "ring-accent" : "opacity-70 ring-transparent hover:opacity-100",
                )}
              >
                <PackageImage src={src} alt="" sizes="120px" quality={60} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photo gallery`}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4"
          onTouchStart={onTouchStart}
          onTouchEnd={makeTouchEnd(stepLightbox)}
          onClick={() => {
            // A swipe's synthesized click must not close the lightbox.
            if (swiped.current) {
              swiped.current = false;
              return;
            }
            setIndex(lightbox);
            setLightbox(null);
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={list[lightbox]}
            alt={title}
            className="max-h-[90vh] max-w-[95vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              setIndex(lightbox);
              setLightbox(null);
            }}
            className={`${lightboxControl} right-3 top-3`}
          >
            <X className="h-6 w-6" />
          </button>

          {count > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous photo"
                onClick={(e) => {
                  e.stopPropagation();
                  stepLightbox(-1);
                }}
                className={`${lightboxControl} left-2 top-1/2 -translate-y-1/2`}
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={(e) => {
                  e.stopPropagation();
                  stepLightbox(1);
                }}
                className={`${lightboxControl} right-2 top-1/2 -translate-y-1/2`}
              >
                <ChevronRight className="h-7 w-7" />
              </button>
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/80">
                {lightbox + 1} / {count}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
