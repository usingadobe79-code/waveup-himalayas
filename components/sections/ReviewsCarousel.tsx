"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";
import type { Review } from "@/lib/content";
import { Stars } from "@/components/ui/Rating";
import { cn } from "@/lib/cn";

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const letters = parts.length === 1 ? parts[0].slice(0, 1) : parts[0][0] + parts[parts.length - 1][0];
  return letters.toUpperCase();
}

function ReviewCard({ r }: { r: Review }) {
  const when = r.travelMonth ? `Travelled ${r.travelMonth}` : r.date ? formatDate(r.date) : null;
  const meta = [r.location, when].filter(Boolean).join(" · ");
  return (
    <div className="card relative w-full overflow-hidden p-6 shadow-md sm:p-8">
      <div className="relative flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink type-body font-semibold text-accent-hover ring-2 ring-accent/40"
          >
            {initials(r.name)}
          </span>
          <div>
            <p className="type-body flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold text-ink">
              {r.name}
              {r.verified === true && (
                <span
                  title="Confirmed by WaveUp Himalayas"
                  className="type-small inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-0.5 font-medium text-accent-ink"
                >
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Verified traveller
                </span>
              )}
            </p>
            {meta && <p className="type-small text-muted">{meta}</p>}
          </div>
        </div>
        <span role="img" aria-label={`${r.rating} out of 5 stars`}>
          <Stars value={r.rating} />
        </span>
      </div>

      <div className="relative mt-5 border-l-2 border-accent/60 pl-4">
        {r.title && <p className="type-h3 text-ink">{r.title}</p>}
        <p className={cn("type-body whitespace-pre-line text-muted", r.title && "mt-2")}>{r.quote}</p>
      </div>

      {r.photoUrls && r.photoUrls.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-3">
          {r.photoUrls.map((src) => (
            <li
              key={src}
              className="group relative h-28 w-28 overflow-hidden rounded-xl bg-surface-alt ring-1 ring-border sm:h-32 sm:w-32"
            >
              <Image
                src={src}
                alt={`Photo from ${r.name}'s review`}
                fill
                sizes="128px"
                loading="lazy"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </li>
          ))}
        </ul>
      )}

      {r.reply && (
        <div className="mt-6 rounded-xl border border-accent/30 border-l-4 border-l-accent bg-accent/10 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white p-2 ring-1 ring-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/symbol.png"
                alt=""
                width={800}
                height={396}
                className="h-full w-full object-contain"
              />
            </span>
            <p className="type-small font-semibold text-accent-ink">Response from WaveUp Himalayas</p>
          </div>
          <p className="type-small mt-3 whitespace-pre-line text-ink">{r.reply}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Reviews list. One review → a single card (no controls). Two or more → a
 * one-at-a-time scroll-snap carousel with arrows + dots, mirroring Testimonials.
 */
export function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  if (reviews.length === 1) {
    return (
      <div className="mt-6">
        <ReviewCard r={reviews[0]} />
      </div>
    );
  }

  function cardStep(track: HTMLDivElement): number {
    const kids = track.children;
    if (kids.length > 1) {
      return (kids[1] as HTMLElement).offsetLeft - (kids[0] as HTMLElement).offsetLeft;
    }
    return (kids[0] as HTMLElement)?.offsetWidth ?? 0;
  }
  function goTo(i: number) {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(i, reviews.length - 1));
    track.scrollTo({ left: clamped * cardStep(track), behavior: "smooth" });
  }
  function onTrackScroll() {
    const track = trackRef.current;
    if (!track) return;
    const step = cardStep(track);
    setIndex(step > 0 ? Math.round(track.scrollLeft / step) : 0);
  }

  const btn =
    "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70";

  return (
    <div className="mt-6">
      <div
        ref={trackRef}
        onScroll={onTrackScroll}
        role="region"
        aria-label="Customer reviews"
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((r, i) => (
          <div key={`${r.name}-${i}`} className="flex shrink-0 basis-full snap-start">
            <ReviewCard r={r} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Previous review"
          className={btn}
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2">
          {reviews.map((r, i) => (
            <button
              key={`${r.name}-${i}`}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to review ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className={cn(
                "h-2 rounded-full transition-all",
                i === index ? "w-6 bg-accent" : "w-2 bg-border hover:bg-muted",
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Next review"
          className={btn}
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
