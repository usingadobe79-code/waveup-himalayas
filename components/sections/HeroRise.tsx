"use client";

import Image from "next/image";
import { HeroContent } from "./HeroContent";

/**
 * Static hero: a single background photo + the headline/sub/CTAs from
 * HeroContent over a legibility scrim. No video, no scroll-driven behavior —
 * exactly what the hero looks like at page load.
 */
export function HeroRise() {
  return (
    <section id="rise" className="relative h-screen w-full overflow-hidden bg-navy-deep">
      <div className="absolute inset-0" aria-hidden="true">
        <Image src="/images/hero.webp" alt="" fill priority sizes="100vw" className="object-cover" />
      </div>

      {/* Static legibility scrim */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-deep/85 via-navy/35 to-navy-deep/55" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_40%,transparent_42%,rgba(17,28,51,0.6))]" />

      <div className="absolute inset-0 z-10">
        <HeroContent />
      </div>
    </section>
  );
}
