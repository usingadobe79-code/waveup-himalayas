"use client";

import { useEffect } from "react";

/**
 * GA4 measurement ID. Public by design — it ships in the page source of every
 * site that uses it, so there is nothing to protect here. Overridable per build
 * via NEXT_PUBLIC_GA_ID, matching how siteUrl is handled in lib/content.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-DJGG3LQXX2";

/**
 * Google Analytics 4 — loaded on the first real interaction (scroll, tap, key,
 * pointer), not at page load.
 *
 * Even next/script's `lazyOnload` ran gtag (~180ms of main-thread work plus a
 * 180KB request) inside the window the largest paint is measured in, which on
 * throttled mobile dragged the LCP out. Virtually every real visitor scrolls or
 * taps, so gating on interaction loses almost no sessions while keeping the
 * third-party script off the critical path entirely (a headless audit never
 * interacts, so it isn't charged for analytics at all). gtag still queues the
 * initial page_view and sends it the moment it loads.
 */
export function Analytics() {
  useEffect(() => {
    if (!GA_ID) return;

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      remove();

      const s = document.createElement("script");
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      s.async = true;
      document.head.appendChild(s);

      const w = window as unknown as { dataLayer: unknown[] };
      w.dataLayer = w.dataLayer || [];
      // Same shape as Google's inline snippet.
      function gtag(...args: unknown[]) {
        w.dataLayer.push(args);
      }
      gtag("js", new Date());
      gtag("config", GA_ID);
    };

    const events = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
    const remove = () =>
      events.forEach((e) => window.removeEventListener(e, start));
    events.forEach((e) =>
      window.addEventListener(e, start, { passive: true }),
    );
    return remove;
  }, []);

  return null;
}
