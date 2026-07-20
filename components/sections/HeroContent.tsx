"use client";

import { motion } from "framer-motion";
import { useEffect, useState, type CSSProperties } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { brand, contact } from "@/lib/content";

/**
 * Hero content overlay — shared across all variants.
 * Timeline: eyebrow 0.0s · headline words rise (stagger 0.07, start 0.12) ·
 * sub 0.4s · CTAs 0.55s · peak mark draws itself in · scroll chevron last.
 *
 * The entrance runs on CSS (see globals.css), deliberately, not framer-motion.
 * These elements decide the page's LCP, and animating them in JS left them at
 * opacity 0 until React had downloaded, parsed and hydrated — about 5.4s on a
 * mid-range phone over slow 4G. A CSS animation starts at first paint with no
 * JS in the path.
 *
 * The old timeline also ran to 1.1s before the CTAs arrived, which read as
 * sluggish once the copy itself appeared promptly; it is roughly halved here.
 * Reduced motion is handled by the media query in globals.css rather than a
 * branch per element.
 *
 * framer-motion is still used for the scroll chevron, which genuinely depends
 * on scroll state and sits below the fold, so it never gates LCP.
 */
export function HeroContent() {
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const words = brand.hero.headline.split(" ");

  // Per-element stagger, handed to CSS as a custom property.
  const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

  return (
    <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-24 text-center text-white">
      {/* Localized navy wash behind the copy — darkens just the text zone (incl.
          the bright warm sky behind the gold word) without dimming the whole image. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[60vmin] w-[min(100%,72rem)] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(17,28,51,0.68)_0%,rgba(17,28,51,0.45)_48%,transparent_78%)] blur-2xl"
      />

      {/* Self-drawing gold peak mark — echo of the logo, sits cleanly above all copy */}
      <PeakMark />

      {/* Eyebrow */}
      <p className="hero-rise type-eyebrow mb-5 text-accent">{brand.hero.eyebrow}</p>

      {/* Headline */}
      <div className="relative">
        <h1 className="type-display [text-shadow:0_1px_3px_rgba(17,28,51,0.5),0_8px_38px_rgba(17,28,51,0.55)]">
          {words.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom">
              <span className="hero-rise-word" style={delay(Number((0.12 + i * 0.07).toFixed(2)))}>
                {word === "Ordinary" ? (
                  <span className="text-gold [text-shadow:0_0_1px_rgba(17,28,51,0.9),0_2px_8px_rgba(17,28,51,0.85),0_6px_28px_rgba(17,28,51,0.7)]">
                    {word}
                  </span>
                ) : (
                  word
                )}
                {i < words.length - 1 ? " " : ""}
              </span>
            </span>
          ))}
        </h1>
      </div>

      {/* Sub — this is the LCP element, so it must never wait on hydration */}
      <p
        className="hero-rise type-body-lg mt-6 max-w-xl text-on-dark/80 [text-shadow:0_1px_14px_rgba(17,28,51,0.5)]"
        style={delay(0.4)}
      >
        {brand.hero.sub}
      </p>

      {/* CTAs — stacked full-width on mobile, inline from sm up */}
      <div
        className="hero-rise mt-9 flex w-full max-w-xs flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4"
        style={delay(0.55)}
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
      </div>

      {/* Scroll chevron — gentle infinite bounce, fades on first scroll */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 0 : 1 }}
        transition={{ duration: 0.4, delay: scrolled ? 0 : 1, ease: EASE_OUT_EXPO }}
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

/**
 * Gold peak mark that draws itself in via stroke-dashoffset. Plain SVG plus a
 * CSS animation rather than framer-motion's pathLength, so it paints on the
 * same schedule as the copy around it instead of waiting for hydration.
 */
function PeakMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 40"
      className="mb-6 h-8 w-24 sm:h-10 sm:w-28"
      fill="none"
    >
      <path
        className="hero-draw"
        style={{ "--d": "0.2s" } as CSSProperties}
        d="M10 34 L42 8 L58 24 L74 6 L110 34"
        stroke="var(--color-gold)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
