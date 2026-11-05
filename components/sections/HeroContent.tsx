"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { brand, contact } from "@/lib/content";
import { TrekSearch } from "./TrekSearch";

/**
 * Hero content overlay — shared across all variants.
 * Minimal, image-forward: trek search 0.5s · CTAs 0.55s · scroll chevron last.
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Per-element stagger, handed to CSS as a custom property.
  const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

  return (
    <div className="relative z-10 mx-auto flex min-h-svh max-w-5xl flex-col items-center justify-end px-6 pt-24 pb-[16vh] text-center text-white">
      {/* Live trek search — z-30 so its dropdown sits above the CTA row below */}
      <div
        className="hero-rise relative z-30 flex w-full justify-center"
        style={delay(0.5)}
      >
        <TrekSearch />
      </div>

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
          className="w-full sm:w-auto [text-shadow:0_1px_8px_rgba(17,28,51,0.6)]"
        >
          {brand.hero.ctaSecondary}
        </Button>
      </div>

      {/* Scroll chevron — gentle infinite bounce, fades out on first scroll.
          CSS, not framer-motion: this lives in the hero, whose hydration gates
          the page's LCP, so it must not pull the motion runtime onto that path.
          The bounce is paused under prefers-reduced-motion by the global rule. */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 transition-opacity duration-500",
          scrolled ? "opacity-0" : "opacity-100",
        )}
      >
        <span className="block animate-chevron-bounce">
          <ChevronDown className="h-6 w-6" />
        </span>
      </div>
    </div>
  );
}
