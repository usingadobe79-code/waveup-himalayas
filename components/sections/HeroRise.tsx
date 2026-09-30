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
        <Image
          src="/images/hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQABLAEsAAD/4QCARXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAAEsAAAAAQAAASwAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAABigAwAEAAAAAQAAABAAAAAA/+0AOFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAAAOEJJTQQlAAAAAAAQ1B2M2Y8AsgTpgAmY7PhCfv/AABEIABAAGAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2wBDAAICAgICAgMCAgMFAwMDBQYFBQUFBggGBgYGBggKCAgICAgICgoKCgoKCgoMDAwMDAwODg4ODg8PDw8PDw8PDw//2wBDAQICAgQEBAcEBAcQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/3QAEAAL/2gAMAwEAAhEDEQA/AOI8AfBOw8d6BceKPC9tLd6ZbXUloZ2hZA8kQG4oHAYpk4DYwTmpH8J+EPDPiJdDv7kWtyFLMxX90MBSVZ+g4Yc9O3Wvyv8ABHxM+JHh50s/C+t6l5TfO1lHPKYXVDvJaMELgMNxOPcmvYG/aK8WWOt3+s69rlnMb67iv5bJES7iF1bhUR4kCGOM7VAAWRRgDIwAK+//ANecRP3JyV/0Pgo8C4Wm+enE/V2XxHpfiPQYfDPh3WLe4ukiUrGTiUp6qGC7uMHjsQa5P/hCPFX/AD1P5D/GvyU8R/tN+Pdf0ttE00W2m29ys0V1dRW8f9o3UU5JdZZwu4KeBtTAAAGfXx3/AISPUf8An/uv++5f8a8/D8TummlST1PVr8OOo7uq0f/Z"
        />
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
