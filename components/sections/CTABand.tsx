"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { contact } from "@/lib/content";

/**
 * CTA Band (docs/01 §11) — the closing call-to-action before the footer.
 * "Subtle 3D/parallax depth" is done cheaply: a dimmed hero photo drifts on a
 * scroll-driven parallax behind a navy wash + gold radial glow (no 3D runtime
 * cost). Headline reveals; bookings route to WhatsApp (gold) and email (outline)
 * — no checkout. Reduced motion → no parallax, instant headline.
 *
 * Note: this band is deep navy (surface-darker) and flows straight into the
 * footer, which is also surface-darker. That adjacency is intentional — the band
 * reads as the emphatic closer and the footer as its quiet base, separated by
 * the glow/photo here vs. the footer's hairline divider. No #contact id here:
 * the footer owns #contact for the header nav.
 */
export function CTABand() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Parallax: background photo drifts as the band scrolls through the viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  const reveal = reduced
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.7, ease: EASE_OUT_EXPO },
      };

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden bg-surface-darker text-on-dark"
    >
      {/* Parallax photo layer — dimmed, behind the navy wash */}
      <motion.div
        aria-hidden="true"
        style={reduced ? undefined : { y }}
        className="pointer-events-none absolute inset-x-0 -top-[12%] -z-10 h-[124%]"
      >
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          quality={75}
          sizes="100vw"
          className="object-cover opacity-20"
        />
      </motion.div>

      {/* Navy wash + gold radial glow for depth */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-surface-darker/80 via-surface-darker/70 to-surface-darker/90"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[60vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-3xl"
      />

      <div className="container-page section-y">
        <motion.div
          {...reveal}
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="type-eyebrow mb-5 text-accent">Ready When You Are</p>
          <h2 className="type-h1 text-on-dark">Let&rsquo;s Plan Your Himalayan Journey</h2>
          <p className="type-body-lg mt-5 text-on-dark/75">
            Tell us your dates and what you have in mind — treks, tours, or a
            helicopter adventure — and we&rsquo;ll shape the trip around you.
          </p>

          <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              variant="gold"
              className="w-full sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </Button>
            <Button
              href={`mailto:${contact.email}`}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Mail className="h-4 w-4" />
              Email Us
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
