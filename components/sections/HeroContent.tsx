"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { brand, contact } from "@/lib/content";

/**
 * Hero content overlay — shared across all variants.
 * Timeline (docs/01 §2): eyebrow 0.0s · headline words rise (stagger 0.1, start
 * 0.3) · sub 0.9s · CTAs 1.1s · scroll chevron (infinite bounce, fades on first
 * scroll) · gold peak mark draws itself in near the headline.
 * Under reduced motion every entrance collapses to instant opacity.
 */
export function HeroContent() {
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Helper: a timed fade+rise that becomes instant under reduced motion.
  const rise = (delay: number, y = 24) =>
    reduced
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: EASE_OUT_EXPO },
        };

  const words = brand.hero.headline.split(" ");

  return (
    <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-24 text-center text-white">
      {/* Self-drawing gold peak mark — echo of the logo, sits cleanly above all copy */}
      <PeakMark reduced={reduced} />

      {/* Eyebrow */}
      <motion.p
        {...rise(0)}
        className="mb-5 text-xs uppercase tracking-[0.35em] text-gold-light sm:text-sm"
      >
        {brand.hero.eyebrow}
      </motion.p>

      {/* Headline */}
      <div className="relative">
        <h1 className="font-display text-4xl font-light leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem]">
          {words.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom">
              <motion.span
                className="inline-block"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: "0.4em" }}
                animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { duration: 0.7, delay: 0.3 + i * 0.1, ease: EASE_OUT_EXPO }
                }
              >
                {word === "Ordinary" ? <span className="text-gold">{word}</span> : word}
                {i < words.length - 1 ? " " : ""}
              </motion.span>
            </span>
          ))}
        </h1>
      </div>

      {/* Sub */}
      <motion.p {...rise(0.9)} className="mt-6 max-w-xl text-base text-white/80 sm:text-lg">
        {brand.hero.sub}
      </motion.p>

      {/* CTAs — stacked full-width on mobile, inline from sm up */}
      <motion.div
        {...rise(1.1)}
        className="mt-9 flex w-full max-w-xs flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4"
      >
        <Button href="#packages" variant="gold" className="w-full sm:w-auto">
          {brand.hero.ctaPrimary}
        </Button>
        <Button
          href={contact.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
          className="w-full sm:w-auto"
        >
          {brand.hero.ctaSecondary}
        </Button>
      </motion.div>

      {/* Scroll chevron — gentle infinite bounce, fades on first scroll */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 0 : 1 }}
        transition={{ duration: 0.4, delay: scrolled ? 0 : 1.6, ease: EASE_OUT_EXPO }}
      >
        <motion.span
          className="block"
          animate={reduced ? {} : { y: [0, 8, 0] }}
          transition={reduced ? {} : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-6 w-6" />
        </motion.span>
      </motion.div>
    </div>
  );
}

/** Gold peak mark that draws itself in via stroke-dashoffset (pathLength). */
function PeakMark({ reduced }: { reduced: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 40"
      className="mb-6 h-8 w-24 sm:h-10 sm:w-28"
      fill="none"
    >
      <motion.path
        d="M10 34 L42 8 L58 24 L74 6 L110 34"
        stroke="var(--color-gold)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: reduced ? 1 : 0, opacity: reduced ? 1 : 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={reduced ? { duration: 0 } : { duration: 1.3, delay: 0.4, ease: EASE_OUT_EXPO }}
      />
    </svg>
  );
}
