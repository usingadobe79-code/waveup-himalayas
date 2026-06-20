"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Smooth inertia scroll via Lenis (lerp ~0.1), per docs/01 §Global.
 * Exposes the Lenis instance through context so scroll-driven 3D (the Rise
 * sequence) can read progress and GSAP ScrollTrigger can sync to it.
 * Disabled entirely when prefers-reduced-motion is set.
 */
const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) return; // reduced motion → native scroll, no Lenis

    const instance = new Lenis({ lerp: 0.1, smoothWheel: true });
    setLenis(instance);

    const raf = (time: number) => {
      instance.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
