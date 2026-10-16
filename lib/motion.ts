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
  /** trigger as soon as any part is in view (a % threshold never fires on tall mobile wrappers), play once */
  viewport: { once: true, amount: "some" } as const,
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
