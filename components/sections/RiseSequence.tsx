"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ComponentProps } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useLenis } from "@/components/providers/SmoothScroll";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { riseSequence } from "@/lib/content";
import { cn } from "@/lib/cn";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Scroll-Rise — the "Wave Up" signature moment (docs/01 §3).
 * Desktop: a pinned, scroll-scrubbed ascent (parallax mountain silhouettes slide
 * away beneath us, clouds part and fall, the sky cools, the summit brightens),
 * with 3 cross-fading captions, a counting altitude readout and a final CTA.
 * Mobile / reduced-motion: a static stacked fallback with the captions shown
 * normally — no pin, no heavy parallax. Built on GSAP ScrollTrigger + Lenis.
 */
export function RiseSequence() {
  const reduced = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // SSR + mobile + reduced motion → static fallback. Desktop upgrades after mount.
  return isDesktop && !reduced ? <RisePinned /> : <RiseStatic reduced={reduced} />;
}

/* ------------------------------------------------------------------ */
/* Shared procedural scenery                                          */
/* ------------------------------------------------------------------ */

function Ridge({ color, className }: { color: string; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M0,320 L0,170 L150,120 L300,205 L470,90 L640,185 L820,70 L1010,180 L1200,110 L1370,200 L1440,160 L1440,320 Z"
        fill={color}
      />
    </svg>
  );
}

function CloudBand({ className, ...rest }: ComponentProps<"div">) {
  return (
    <div className={cn("pointer-events-none absolute inset-x-0", className)} aria-hidden="true" {...rest}>
      <div className="absolute left-[8%] h-40 w-[42%] rounded-full bg-white/25 blur-3xl" />
      <div className="absolute right-[6%] top-6 h-44 w-[46%] rounded-full bg-white/20 blur-3xl" />
      <div className="absolute left-[30%] top-10 h-36 w-[44%] rounded-full bg-white/30 blur-3xl" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop — pinned scrubbed ascent                                   */
/* ------------------------------------------------------------------ */

function RisePinned() {
  const lenis = useLenis();
  const stage = useRef<HTMLDivElement>(null);
  const altRef = useRef<HTMLSpanElement>(null);
  const { start, end } = riseSequence.altitude;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage.current!,
          start: "top top",
          end: "+=320%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (altRef.current) {
              const v = Math.round(start + (end - start) * self.progress);
              altRef.current.textContent = `${v.toLocaleString()} m`;
            }
          },
        },
      });

      // Parallax: foreground sinks fastest → strong "rising" feel.
      tl.to('[data-layer="fg"]', { yPercent: 80, duration: 1 }, 0)
        .to('[data-layer="mid"]', { yPercent: 48, duration: 1 }, 0)
        .to('[data-layer="clouds"]', { yPercent: 130, opacity: 0, duration: 1 }, 0)
        .to('[data-layer="peak"]', { scale: 1.18, yPercent: 6, duration: 1 }, 0)
        .to('[data-layer="peak-dark"]', { opacity: 0, duration: 1 }, 0)
        .to('[data-layer="sky-cold"]', { opacity: 1, duration: 1 }, 0)
        // Caption 1 (base)
        .fromTo('[data-cap="0"]', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.12 }, 0.03)
        .to('[data-cap="0"]', { opacity: 0, y: -24, duration: 0.1 }, 0.26)
        // Caption 2 (mid)
        .fromTo('[data-cap="1"]', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.12 }, 0.4)
        .to('[data-cap="1"]', { opacity: 0, y: -24, duration: 0.1 }, 0.62)
        // Caption 3 (summit) + CTA
        .fromTo('[data-cap="2"]', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.12 }, 0.74)
        .fromTo('[data-cta]', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.12 }, 0.86);
    }, stage);

    return () => ctx.revert();
  }, [start, end]);

  // Sync ScrollTrigger to Lenis' smooth scroll.
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
      ref={stage}
      className="relative h-screen w-full overflow-hidden bg-navy-deep"
      aria-label="Rise above the ordinary"
    >
      {/* Sky — warm base crossfading to a cold summit sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-deep via-navy to-[#4a3f63]" />
      <div
        data-layer="sky-cold"
        className="absolute inset-0 bg-gradient-to-b from-black via-navy-deep to-navy opacity-0"
      />

      {/* Distant summit (reuse hero imagery), brightening as we rise above the clouds */}
      <div data-layer="peak" className="absolute inset-0">
        <Image src="/images/hero.jpg" alt="" fill priority={false} sizes="100vw" className="object-cover" />
      </div>
      <div data-layer="peak-dark" className="absolute inset-0 bg-navy-deep/70" />

      {/* Clouds we break through */}
      <CloudBand data-layer="clouds" className="top-[38%]" />

      {/* Parallax ridges */}
      <div data-layer="mid" className="absolute inset-x-0 bottom-0 h-[58%]">
        <Ridge color="#243353" className="absolute inset-0 h-full w-full" />
      </div>
      <div data-layer="fg" className="absolute inset-x-0 bottom-0 h-[44%]">
        <Ridge color="#111c33" className="absolute inset-0 h-full w-full" />
      </div>

      {/* Legibility vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_40%,transparent_40%,rgba(17,28,51,0.65))]" />

      {/* Altitude readout */}
      <div className="absolute left-1/2 top-24 z-10 -translate-x-1/2 text-center">
        <span className="block text-[10px] uppercase tracking-[0.4em] text-gold-light/70">Altitude</span>
        <span ref={altRef} className="font-display text-2xl tracking-tight text-gold">
          {start.toLocaleString()} m
        </span>
      </div>

      {/* Captions (stacked, cross-fade via GSAP) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
        <div className="relative w-full max-w-3xl text-center">
          {riseSequence.captions.map((caption, i) => (
            <p
              key={i}
              data-cap={i}
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 font-display text-3xl font-light leading-tight tracking-tight text-white opacity-0 md:text-4xl lg:text-5xl"
            >
              {caption}
            </p>
          ))}
          {/* CTA revealed at summit */}
          <div data-cta className="absolute inset-x-0 top-[calc(50%+5rem)] flex justify-center opacity-0">
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
/* Mobile / reduced-motion — static stacked fallback                  */
/* ------------------------------------------------------------------ */

function RiseStatic({ reduced }: { reduced: boolean }) {
  const { start, end } = riseSequence.altitude;
  const fade = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.6 },
        transition: { duration: 0.6, ease: EASE_OUT_EXPO },
      };

  return (
    <section id="rise" className="relative overflow-hidden bg-navy-deep text-white">
      {/* Static scene backdrop */}
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep via-navy to-[#3a3252]" />
        <Image src="/images/hero.jpg" alt="" fill sizes="100vw" className="object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 via-navy-deep/45 to-navy-deep/85" />
        <div className="absolute inset-x-0 bottom-0 h-[40%]">
          <Ridge color="#243353" className="absolute inset-0 h-full w-full" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[28%]">
          <Ridge color="#111c33" className="absolute inset-0 h-full w-full" />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-14 px-6 py-24 text-center sm:gap-20 sm:py-28">
        <div>
          <span className="block text-[10px] uppercase tracking-[0.4em] text-gold-light/70">Altitude</span>
          <span className="font-display text-xl tracking-tight text-gold">
            {start.toLocaleString()} – {end.toLocaleString()} m
          </span>
        </div>

        {riseSequence.captions.map((caption, i) => (
          <motion.p
            key={i}
            {...fade}
            className="font-display text-2xl font-light leading-snug tracking-tight sm:text-3xl"
          >
            {caption}
          </motion.p>
        ))}

        <motion.div {...fade}>
          <Button href="#packages" variant="gold">
            {riseSequence.cta}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
