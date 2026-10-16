"use client";

import { LazyMotion, domMax } from "framer-motion";

/**
 * Loads framer-motion's feature set once for the whole app. Components use the
 * slim `m.*` namespace instead of `motion.*`; `strict` makes any stray
 * `motion.*` throw so it can't silently re-bundle the full feature set.
 * domMax (not domAnimation) because Regions uses `layoutId`.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      {children}
    </LazyMotion>
  );
}
