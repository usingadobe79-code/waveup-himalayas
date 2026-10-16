"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

/**
 * "Photo gallery" grid for a package's detail page — real trip photos
 * supplied via the `gallery` frontmatter field. Rendered only when the
 * package has a non-empty gallery (see app/packages/[slug]/page.tsx); same
 * fixed-ratio frame as the package cards elsewhere on the site.
 *
 * Tapping a tile opens a full-screen lightbox with prev/next navigation.
 * The grid is still server-rendered into the static HTML at build.
 *
 * `images` is expected to already be resolved on-page display paths (a
 * package's `galleryDisplay`, not its raw `gallery`) — see lib/content.ts
 * and scripts/generate-packages.mjs.
 */
export function PackageGallery({ images, title }: { images: string[]; title: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;
  const count = images.length;

  // Lock body scroll + keyboard controls only while the lightbox is open.
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      else if (e.key === "ArrowLeft") setOpenIndex((i) => (i === null ? i : (i - 1 + count) % count));
      else if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? i : (i + 1) % count));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, count]);

  const step = (delta: number) =>
    setOpenIndex((i) => (i === null ? i : (i + delta + count) % count));

  const controlClass =
    "absolute flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:bg-white/10";

  return (
    <>
      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={`View photo ${i + 1}`}
            className="relative aspect-[3/2] cursor-zoom-in overflow-hidden rounded-card"
          >
            <Image
              src={src}
              alt={title}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photo gallery`}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpenIndex(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[openIndex]}
            alt={title}
            className="max-h-[90vh] max-w-[95vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              setOpenIndex(null);
            }}
            className={`${controlClass} right-3 top-3`}
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
                  step(-1);
                }}
                className={`${controlClass} left-2 top-1/2 -translate-y-1/2`}
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                className={`${controlClass} right-2 top-1/2 -translate-y-1/2`}
              >
                <ChevronRight className="h-7 w-7" />
              </button>
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/80">
                {openIndex + 1} / {count}
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
}
