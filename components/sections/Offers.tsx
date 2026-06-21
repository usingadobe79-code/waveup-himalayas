"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { offers, whatsappEnquiry } from "@/lib/content";

/**
 * Offers — 2 promo cards (docs/01 §6). The cards slide in from opposite sides;
 * each discount badge pops with a *slight* overshoot — the one permitted bit of
 * playfulness, kept very subtle. Navy section so the gold offers pop. Reduced
 * motion → instant opacity, no slide, no overshoot.
 */

// Gentle back-ease for the badge overshoot (lands just past 1, settles).
const BADGE_OVERSHOOT: [number, number, number, number] = [0.34, 1.4, 0.64, 1];

export function Offers() {
  const reduced = useReducedMotion();

  return (
    <section id="offers" className="section-y bg-surface-dark text-on-dark">
      <div className="container-page">
        <SectionHeading
          onDark
          eyebrow="Limited Time"
          title="Current Offers"
          intro="Seasonal savings on our most-requested adventures. Verified offers via Tourist.com — message us to claim."
        />

        <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2">
          {offers.map((offer, i) => {
            const fromLeft = i === 0;
            const card = reduced
              ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, transition: { duration: 0 } }
              : {
                  initial: { opacity: 0, x: fromLeft ? -64 : 64 },
                  whileInView: { opacity: 1, x: 0 },
                  transition: { duration: 0.7, ease: EASE_OUT_EXPO },
                };
            const badge = reduced
              ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, transition: { duration: 0 } }
              : {
                  initial: { opacity: 0, scale: 0.5 },
                  whileInView: { opacity: 1, scale: 1 },
                  transition: { duration: 0.5, delay: 0.28, ease: BADGE_OVERSHOOT },
                };

            return (
              <motion.article
                key={offer.title}
                {...card}
                viewport={{ once: true, amount: 0.3 }}
                className="group relative overflow-hidden rounded-card border border-on-dark/10 bg-gradient-to-br from-on-dark/[0.08] to-on-dark/[0.02] p-8 backdrop-blur-sm transition-transform duration-[400ms] ease-[var(--ease-out-expo)] hover:-translate-y-1 sm:p-10"
              >
                {/* Soft gold corner glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/20 blur-3xl transition-opacity duration-500 group-hover:opacity-80"
                />

                <div className="relative flex h-full flex-col items-start">
                  <motion.span
                    {...badge}
                    viewport={{ once: true, amount: 0.6 }}
                    className="type-h2 inline-flex items-baseline gap-1 rounded-badge bg-accent px-4 py-2 font-semibold text-surface-darker shadow-[0_8px_24px_-8px_rgba(184,146,62,0.6)]"
                  >
                    {offer.badge}
                    <span className="type-small font-medium">off</span>
                  </motion.span>

                  <h3 className="type-h3 mt-6 text-on-dark">{offer.title}</h3>
                  <p className="type-body mt-3 flex-1 text-on-dark/65">{offer.detail}</p>

                  <Button
                    href={whatsappEnquiry(offer.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="gold"
                    className="mt-8"
                  >
                    Claim This Offer
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1" />
                  </Button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
