/**
 * Shared motion language — see docs/01-interaction-spec.md.
 * Personality: calm, cinematic, premium. Everything glides; nothing snaps or bounces.
 */
import type { Variants, Transition } from "framer-motion";

/** Shared ease-out-expo used everywhere unless noted. */
export const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Section-reveal defaults from the spec (§Global). */
export const REVEAL = {
  rise: 24, // px the children rise from
  stagger: 0.08,
  duration: 0.6,
  /** trigger when 20% in view, play once */
  viewport: { once: true, amount: 0.2 } as const,
};

export const baseTransition: Transition = {
  duration: REVEAL.duration,
  ease: EASE_OUT_EXPO,
};

/** Parent container that staggers its children. */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: REVEAL.stagger },
  },
};

/** Default child: fade + rise. */
export const fadeRise: Variants = {
  hidden: { opacity: 0, y: REVEAL.rise },
  show: { opacity: 1, y: 0, transition: baseTransition },
};

/** Words rising into the hero headline (stagger 0.1s, start 0.3s). */
export const wordRise: Variants = {
  hidden: { opacity: 0, y: "0.4em" },
  show: { opacity: 1, y: 0, transition: baseTransition },
};

/**
 * Reduced-motion variants: instant opacity, no transform.
 * Components swap to these when prefers-reduced-motion is set.
 */
export const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0 } },
};
