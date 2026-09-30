"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { testimonials, business, contact } from "@/lib/content";

/** Country → flag emoji for the testimonial footer. Unmapped countries fall
 * back to plain text (no flag) rather than a broken/missing glyph. */
const COUNTRY_FLAGS: Record<string, string> = {
  USA: "🇺🇸",
  Italy: "🇮🇹",
  Australia: "🇦🇺",
  India: "🇮🇳",
};

/** "Daniel & Isabelle" → "DI", "Mara" → "M" — first letter of each alphabetic
 * word, uppercased, capped at 2. Used as the avatar placeholder's initials. */
function initials(author: string): string {
  return author
    .split(/\s+/)
    .filter((word) => /[a-zA-Z]/.test(word))
    .map((word) => word[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
}

/**
 * Testimonials (docs/01 §10) — FLAGGED EMPTY STATE.
 *
 * docs/03 ships NO review text and the brief forbids inventing quotes, ratings
 * or authors. So when `testimonials` is empty we render an honest placeholder
 * that leans on REAL facts only (newly listed since 2026; verified "Tourist
 * Friendly" on Tourist.com) and invites travelers to share via WhatsApp.
 *
 * The card branch below is wired and ready: drop real {quote, author} entries
 * into `testimonials` in content.ts and this section renders them as quote cards
 * automatically — no further code change needed.
 */
export function Testimonials() {
  const reduced = useReducedMotion();

  const reveal = reduced
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: EASE_OUT_EXPO },
      };

  const hasReviews = testimonials.length > 0;

  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  // Exact per-card scroll step (card width + gap), measured from the DOM so it
  // stays correct across breakpoints. Falls back to the first card's width.
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
    const clamped = Math.max(0, Math.min(i, testimonials.length - 1));
    track.scrollTo({ left: clamped * cardStep(track), behavior: "smooth" });
  }
  function onTrackScroll() {
    const track = trackRef.current;
    if (!track) return;
    const step = cardStep(track);
    setIndex(step > 0 ? Math.round(track.scrollLeft / step) : 0);
  }

  return (
    <section id="testimonials" className="section-y bg-surface">
      <div className="container-page">
        <SectionHeading
          eyebrow="Traveler Stories"
          title="What Our Travelers Say"
          intro={
            hasReviews
              ? "Real words from people who travelled with us across the Himalaya."
              : undefined
          }
        />

        {hasReviews ? (
          <motion.div
            {...reveal}
            viewport={{ once: true, amount: 0.2 }}
            className="mt-12 md:mt-16"
          >
            <div
              ref={trackRef}
              onScroll={onTrackScroll}
              role="region"
              aria-label="Traveler reviews"
              tabIndex={0}
              className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {testimonials.map((t) => (
                <figure key={t.author} className="flex shrink-0 basis-full snap-start">
                  <div className="card mx-auto flex w-full max-w-2xl flex-col p-8">
                    <span aria-hidden="true" className="type-display leading-none text-accent">
                      &ldquo;
                    </span>
                    <blockquote className="type-body -mt-4 flex-1 text-ink">{t.quote}</blockquote>
                    <figcaption className="mt-6 flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 font-semibold text-accent-ink"
                      >
                        {initials(t.author)}
                      </span>
                      <div>
                        <span className="type-small block font-semibold text-ink">
                          {t.author}
                        </span>
                        {(t.country || t.trek) && (
                          <span className="type-small mt-0.5 block text-muted">
                            {[
                              t.country
                                ? `${COUNTRY_FLAGS[t.country] ?? ""} ${t.country}`.trim()
                                : null,
                              t.trek,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                        )}
                      </div>
                    </figcaption>
                  </div>
                </figure>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                aria-label="Previous review"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>

              <div className="flex items-center gap-2">
                {testimonials.map((t, i) => (
                  <button
                    key={t.author}
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
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        ) : (
          /* Honest empty state — no fabricated reviews. */
          <motion.div
            {...reveal}
            viewport={{ once: true, amount: 0.3 }}
            className="mx-auto mt-12 max-w-2xl rounded-card border border-border bg-surface-alt p-10 text-center shadow-card md:mt-16 md:p-14"
          >
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
              <BadgeCheck className="h-7 w-7" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <p className="type-h3 mt-6 text-ink">Reviews are on the way</p>
            <p className="type-body mt-3 text-muted">
              We&rsquo;re a newly established team (since {business.touristDotCom.since}) and
              verified{" "}
              <a
                href={business.touristDotCom.listing}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent-ink underline-offset-4 hover:underline"
              >
                &ldquo;{business.touristDotCom.status}&rdquo; on Tourist.com
              </a>
              . As travelers return from the trail, their stories will appear here — never
              anything we wrote ourselves.
            </p>
            <Button
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline-dark"
              className="mt-8"
            >
              <MessageCircle className="h-4 w-4" />
              Travelled with us? Share your story
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
