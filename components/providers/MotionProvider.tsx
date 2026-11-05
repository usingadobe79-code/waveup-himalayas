"use client";

import { LazyMotion } from "framer-motion";

/**
 * Loads framer-motion's feature set once for the whole app. Components use the
 * slim `m.*` namespace instead of `motion.*`; `strict` makes any stray
 * `motion.*` throw so it can't silently re-bundle the full feature set.
 *
 * Features load ASYNC (`() => import(...)`), not inline: domMax is ~60KB and its
 * evaluation was sitting on the critical path, delaying the largest paint on
 * throttled mobile by ~1s. Loading it as a separate chunk right after mount lets
 * the header/hero paint first; the `m.*` elements render in their initial state
 * until features arrive (a beat later), then animate as before. domMax (not
 * domAnimation) because Regions uses `layoutId`.
 */
const loadFeatures = () => import("@/lib/motionFeatures").then((m) => m.default);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
