"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Scroll-reveal wrapper — the lightweight replacement for the framer-motion
 * `m.div` + `whileInView` pattern the sections used to share.
 *
 * Why this exists: framer-motion's feature bundle (~60KB) plus the cost of
 * hydrating a motion component for every revealed block dominated the home
 * page's main-thread work, which on throttled mobile pushed the largest paint
 * out to ~4s (Lantern won't "paint" the LCP until that JS clears). This wrapper
 * is a few lines of vanilla IntersectionObserver instead, and — crucially —
 * because the animated *content* is passed in as `children` from a Server
 * Component, that content is server-rendered and never hydrated: only this thin
 * shell hydrates. One shared observer serves every Reveal on the page.
 *
 * Reveal-once semantics (matches the old `viewport={{ once: true }}`): the
 * element is unobserved the moment it first enters view. Reduced-motion and
 * no-JS users get the content immediately (see `.reveal` in globals.css).
 */

// A single observer shared by every <Reveal>; each target carries its own
// callback so we don't allocate one observer per block.
let sharedObserver: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, () => void>();

function observe(el: Element, onEnter: () => void) {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          callbacks.get(entry.target)?.();
          sharedObserver!.unobserve(entry.target);
          callbacks.delete(entry.target);
        }
      },
      // Fire as soon as any part crosses in (a touch early), matching the old
      // `amount: "some"` trigger that reliably fired on tall mobile wrappers.
      { rootMargin: "0px 0px -8% 0px" },
    );
  }
  callbacks.set(el, onEnter);
  sharedObserver.observe(el);
  return () => {
    sharedObserver?.unobserve(el);
    callbacks.delete(el);
  };
}

export function Reveal({
  children,
  className,
  /** Stagger offset in ms — the CSS-side equivalent of staggerChildren. */
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reduced motion: show immediately, skip the observer entirely.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }
    return observe(el, () => el.classList.add("is-in"));
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
