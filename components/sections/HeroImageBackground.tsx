"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";

/**
 * Variant A background.
 *  - Desktop (≥768px) + motion allowed → the cinematic flythrough video
 *    (public/videos/hero.{webm,mp4}), seamless boomerang loop.
 *  - Mobile / small screens → static poster (hero.jpg) with a gentle Ken Burns,
 *    so phones never download or decode the heavy 1080p video.
 *  - prefers-reduced-motion → static poster, no motion at all.
 *
 * The poster renders server-side first (fast LCP, no layout shift); desktop
 * upgrades to the video after mount — same frame, so no visible swap.
 */
export function HeroImageBackground() {
  const reduced = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const showVideo = isDesktop && !reduced;

  useEffect(() => {
    const v = videoRef.current;
    if (v && showVideo) void v.play().catch(() => {});
  }, [showVideo]);

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-navy-deep">
      {showVideo ? (
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
          {/* ?v=2 busts browsers still caching the earlier 15s (non-looping) clip */}
          <source src="/videos/hero.webm?v=2" type="video/webm" />
          <source src="/videos/hero.mp4?v=2" type="video/mp4" />
        </video>
      ) : (
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className={cn("object-cover", !reduced && "ken-burns-soft")}
        />
      )}

      {/* Navy overlay: darkest at top, fading toward center (text legibility) */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/85 via-navy/35 to-transparent" />
      {/* Gentle center wash so white headline holds over the bright sky band */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_42%,rgba(27,42,74,0.42),transparent_60%)]" />
      {/* Slight bottom lift for the CTAs + scroll chevron */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-deep/55 to-transparent" />
    </div>
  );
}
