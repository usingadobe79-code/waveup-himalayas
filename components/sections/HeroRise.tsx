"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroContent } from "./HeroContent";
import { Button } from "@/components/ui/Button";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useLenis } from "@/components/providers/SmoothScroll";
import { riseSequence } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Hero + Scroll-Rise, merged into ONE continuous scroll-driven section.
 * On load: the hero (headline / sub / CTAs over the Higgsfield video|photo).
 * On scroll (pinned, scrubbed): the SAME real imagery scales + pans as if rising
 * up the mountain, mist clears, the sky cools, the hero copy gives way to three
 * cross-fading captions and a counting altitude readout, ending on "Find your
 * trek" — then un-pins into Services.
 *
 * Depth comes entirely from the real photography (scale / pan / crossfade /
 * mist) — no procedural triangle planes. Desktop plays the video; mobile uses
 * the lighter poster with a shorter pin; reduced motion gets a static fallback.
 */
export function HeroRise() {
  const reduced = useReducedMotion();
  return reduced ? <HeroRiseStatic /> : <HeroRisePinned />;
}

/* ------------------------------------------------------------------ */
/* Pinned, scroll-scrubbed experience                                 */
/* ------------------------------------------------------------------ */

function HeroRisePinned() {
  const lenis = useLenis();
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const altRef = useRef<HTMLSpanElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Keep the desktop video playing under the scrubbed transform.
  useEffect(() => {
    if (isDesktop) void videoRef.current?.play().catch(() => {});
  }, [isDesktop]);

  useLayoutEffect(() => {
    const { start, end } = riseSequence.altitude;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: "top top",
          end: isDesktop ? "+=420%" : "+=260%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (!altRef.current) return;
            // Altitude only climbs once the hero has handed off (~12% in).
            const t = Math.min(1, Math.max(0, (self.progress - 0.12) / 0.88));
            const v = Math.round(start + (end - start) * t);
            altRef.current.textContent = `${v.toLocaleString()} m`;
          },
        },
      });

      // Real imagery rises: scale into the peaks + a gentle downward pan to the sky.
      tl.to("[data-media]", { scale: isDesktop ? 1.32 : 1.16, yPercent: 5, duration: 1 }, 0)
        // Mist drifts down and clears as we break above the clouds.
        .to("[data-fog]", { yPercent: 75, opacity: 0, duration: 1 }, 0)
        // Sky cools; the top scrim lightens so the high-altitude air reads clearer.
        .fromTo("[data-sky-cold]", { opacity: 0 }, { opacity: 0.9, duration: 1 }, 0)
        .to("[data-scrim]", { opacity: 0.45, duration: 1 }, 0)
        // Hero copy hands off early (autoAlpha → also drops it from hit-testing).
        .to("[data-hero]", { autoAlpha: 0, y: -50, duration: 0.16 }, 0)
        // Altitude readout fades in.
        .fromTo("[data-alt]", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.12)
        // Three cross-fading captions.
        .fromTo("[data-cap='0']", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.2)
        .to("[data-cap='0']", { autoAlpha: 0, y: -24, duration: 0.08 }, 0.4)
        .fromTo("[data-cap='1']", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.5)
        .to("[data-cap='1']", { autoAlpha: 0, y: -24, duration: 0.08 }, 0.68)
        .fromTo("[data-cap='2']", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.78)
        .fromTo("[data-cta]", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.88);
    }, sectionRef);

    return () => ctx.revert();
  }, [isDesktop]);

  // Sync ScrollTrigger to Lenis smooth scroll.
  useEffect(() => {
    if (!lenis) return;
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    ScrollTrigger.refresh();
    return () => lenis.off("scroll", onScroll);
  }, [lenis]);

  return (
    <section
      id="rise"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-navy-deep"
    >
      {/* Real imagery — the only depth source. Scaled/panned by scroll. */}
      <div
        data-media
        className="absolute inset-0 will-change-transform [transform-origin:center_62%]"
        aria-hidden="true"
      >
        {isDesktop ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            poster="/images/hero.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/videos/hero.webm?v=2" type="video/webm" />
            <source src="/videos/hero.mp4?v=2" type="video/mp4" />
          </video>
        ) : (
          <Image src="/images/hero.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
        )}
      </div>

      {/* Atmospheric mist (soft, photographic — not geometric) */}
      <div data-fog className="pointer-events-none absolute inset-x-0 top-[42%]" aria-hidden="true">
        <div className="absolute left-[6%] h-44 w-[46%] rounded-full bg-white/20 blur-3xl" />
        <div className="absolute right-[4%] top-8 h-48 w-[48%] rounded-full bg-white/15 blur-3xl" />
        <div className="absolute left-[28%] top-12 h-40 w-[46%] rounded-full bg-white/25 blur-3xl" />
      </div>

      {/* Cool high-altitude sky wash, revealed as we rise */}
      <div data-sky-cold className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-navy-deep/30 to-navy/50 opacity-0" />

      {/* Legibility scrim (lightens as we ascend) */}
      <div data-scrim className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-deep/85 via-navy/35 to-navy-deep/55" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_40%,transparent_42%,rgba(17,28,51,0.6))]" />

      {/* Hero copy (fades out on scroll) */}
      <div data-hero className="absolute inset-0 z-20">
        <HeroContent />
      </div>

      {/* Rise overlay (revealed on scroll). Container ignores pointer events so
          it never blocks the hero CTAs; the revealed CTA re-enables them. */}
      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6">
        <div className="relative w-full max-w-3xl text-center text-white">
          <div data-alt className="invisible absolute inset-x-0 top-[-7.5rem]">
            <span className="block text-[10px] uppercase tracking-[0.4em] text-gold-light/70">Altitude</span>
            <span ref={altRef} className="font-display text-2xl tracking-tight text-gold">
              {riseSequence.altitude.start.toLocaleString()} m
            </span>
          </div>
          {riseSequence.captions.map((caption, i) => (
            <p
              key={i}
              data-cap={i}
              className="invisible absolute inset-x-0 top-1/2 -translate-y-1/2 font-display text-3xl font-light leading-tight tracking-tight md:text-4xl lg:text-5xl"
            >
              {caption}
            </p>
          ))}
          <div data-cta className="pointer-events-auto invisible absolute inset-x-0 top-[calc(50%+5rem)] flex justify-center">
            <Button href="#packages" variant="gold">
              {riseSequence.cta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Reduced-motion static fallback                                     */
/* ------------------------------------------------------------------ */

function HeroRiseStatic() {
  const { start, end } = riseSequence.altitude;
  return (
    <>
      {/* Hero, static */}
      <section id="rise" className="relative h-screen w-full overflow-hidden bg-navy-deep">
        <Image src="/images/hero.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-deep/85 via-navy/35 to-navy-deep/55" />
        <div className="absolute inset-0 z-10">
          <HeroContent />
        </div>
      </section>

      {/* Rise captions, shown normally below */}
      <section className="relative overflow-hidden bg-navy-deep text-white">
        <Image src="/images/hero.jpg" alt="" fill sizes="100vw" className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-navy-deep/80" />
        <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-14 px-6 py-24 text-center">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.4em] text-gold-light/70">Altitude</span>
            <span className="font-display text-xl tracking-tight text-gold">
              {start.toLocaleString()} – {end.toLocaleString()} m
            </span>
          </div>
          {riseSequence.captions.map((caption, i) => (
            <p key={i} className="font-display text-2xl font-light leading-snug tracking-tight sm:text-3xl">
              {caption}
            </p>
          ))}
          <Button href="#packages" variant="gold">
            {riseSequence.cta}
          </Button>
        </div>
      </section>
    </>
  );
}
