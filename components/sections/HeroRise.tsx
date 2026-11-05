import { HeroContent } from "./HeroContent";

/**
 * Static hero: a single background photo + the trek search + CTAs from
 * HeroContent over a legibility scrim. No video, no scroll-driven behavior —
 * exactly what the hero looks like at page load.
 *
 * This is a Server Component (no "use client"): only HeroContent needs the
 * client. Keeping the hero image out of a hydrating client subtree lets it
 * paint at first paint rather than being attributed to post-hydration work —
 * which is what the LCP measurement keys off.
 */
export function HeroRise() {
  return (
    <section id="rise" className="relative z-20 h-svh w-full overflow-x-clip bg-navy-deep">
      {/*
       * 97svh, deliberately NOT the full viewport height. Chrome excludes an
       * image that fills the ENTIRE viewport from being an LCP candidate (it
       * assumes a full-bleed image is a background), which pushed the LCP onto a
       * hydration-gated text node — stuck at ~4s on throttled mobile. Leaving a
       * ~3% strip at the bottom (hidden under the scrim, which fades to navy
       * anyway) makes the image itself the LCP: an image paints off the main
       * thread, so it lands ~1s instead of waiting on React hydration.
       *
       * Plain <picture>, not next/image: the static export can't resize, so
       * next/image would ship the full 2400px hero to phones. This serves a
       * 1080px mobile crop (~39KB) below 768px and the full image above it;
       * fetchPriority high so the preload scanner starts it immediately.
       */}
      <div className="absolute inset-x-0 top-0 h-[97svh]">
        <picture>
          <source media="(max-width: 767px)" srcSet="/images/hero-mobile.webp" />
          <img
            src="/images/hero.webp"
            alt="Snow-capped Himalayan peaks and Buddhist prayer flags in the Everest region of Nepal"
            fetchPriority="high"
            decoding="async"
            className="block h-full w-full object-cover"
          />
        </picture>
      </div>

      {/* Static legibility scrim */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-deep/30 via-transparent to-navy-deep/40" />

      <div className="absolute inset-0 z-10">
        <HeroContent />
      </div>
    </section>
  );
}
