"use client";

import { motion } from "framer-motion";
import { MessageCircle, BadgeCheck } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { EASE_OUT_EXPO } from "@/lib/motion";
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
          <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2 xl:grid-cols-4">
            {testimonials.map((t) => (
              <motion.figure
                key={t.author}
                {...reveal}
                viewport={{ once: true, amount: 0.3 }}
                className="card flex flex-col p-8"
              >
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
                    <span className="type-small block font-semibold text-ink">{t.author}</span>
                    {(t.country || t.trek) && (
                      <span className="type-small mt-0.5 block text-muted">
                        {[
                          t.country ? `${COUNTRY_FLAGS[t.country] ?? ""} ${t.country}`.trim() : null,
                          t.trek,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    )}
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
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
