"use client";

import { useEffect, useRef, useState } from "react";
import type Lenis from "lenis";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Smooth inertia scroll via Lenis (lerp ~0.1), per docs/01 §Global.
 * Disabled entirely when prefers-reduced-motion is set or on touch /
 * coarse-pointer devices (native momentum scroll is smoother there).
 */

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // reduced motion or touch/coarse pointer → native scroll, no Lenis, no rAF loop
    if (reduced || window.matchMedia("(pointer: coarse)").matches) return;

    let cancelled = false;
    let instance: Lenis | null = null;
    let idleId: number | null = null;
    let timeoutId: number | null = null;

    const raf = (time: number) => {
      instance?.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };

    // Lenis is fetched only here, past the guard, so touch / reduced-motion
    // users never download it. Wait for idle so it doesn't compete with load.
    const load = () => {
      import("lenis").then(({ default: LenisCtor }) => {
        if (cancelled) return;
        instance = new LenisCtor({ lerp: 0.1, smoothWheel: true });
        setLenis(instance);
        rafRef.current = requestAnimationFrame(raf);
      });
    };

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(load);
    } else {
      timeoutId = window.setTimeout(load, 200); // Safari fallback
    }

    return () => {
      cancelled = true;
      if (idleId !== null) window.cancelIdleCallback(idleId);
      if (timeoutId !== null) clearTimeout(timeoutId);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      instance?.destroy();
      setLenis(null);
    };
  }, [reduced]);

  /**
   * In-page anchor navigation. Lenis owns the scroll position, so a native hash
   * jump is reverted on the next frame; and the GSAP-pinned hero adds a tall
   * pin-spacer that a raw jump ignores. So we intercept clicks on same-page
   * anchors and drive Lenis (or native smooth scroll under reduced motion) to
   * the target with a header-sized offset. Targets resolve correctly because the
   * pin-spacer occupies real layout height, and Lenis fires scroll events that
   * keep ScrollTrigger in sync as it animates.
   */
  useEffect(() => {
    const HEADER_OFFSET = 80; // clear the fixed header + a little breathing room

    const targetHash = (a: HTMLAnchorElement): string | null => {
      const href = a.getAttribute("href");
      if (!href) return null;
      if (href.startsWith("#")) return href.length > 1 ? href : null;
      // "/#section" links (e.g. from sub-pages) only when already on the homepage
      if (href.startsWith("/#") && window.location.pathname === "/") return href.slice(1);
      return null;
    };

    const scrollToHash = (hash: string, smooth = true) => {
      let el: Element | null = null;
      try {
        el = document.querySelector(hash);
      } catch {
        return;
      }
      if (!el) return;
      if (lenis) {
        lenis.scrollTo(el as HTMLElement, { offset: -HEADER_OFFSET });
      } else {
        const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
      }
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank") return;
      const hash = targetHash(a);
      if (!hash) return;
      const el = (() => {
        try {
          return document.querySelector(hash);
        } catch {
          return null;
        }
      })();
      if (!el) return;
      e.preventDefault();
      scrollToHash(hash);
      history.pushState(null, "", hash);
    };

    document.addEventListener("click", onClick);

    // Arriving with a hash (e.g. navigated from a sub-page to "/#gallery"):
    // let layout + the pinned hero settle, then land on the section.
    let raf1 = 0;
    let t = 0;
    if (window.location.hash) {
      const hash = window.location.hash;
      t = window.setTimeout(() => {
        raf1 = requestAnimationFrame(() => scrollToHash(hash, false));
      }, 350);
    }

    return () => {
      document.removeEventListener("click", onClick);
      clearTimeout(t);
      cancelAnimationFrame(raf1);
    };
  }, [lenis]);

  return <>{children}</>;
}
