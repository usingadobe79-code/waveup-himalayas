"use client";

import { motion } from "framer-motion";
import {
  MapPinned,
  ShieldCheck,
  SlidersHorizontal,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { staggerContainer, fadeRise, REVEAL } from "@/lib/motion";
import { whyUs } from "@/lib/content";

/**
 * Why Us — the 4 real differentiators from content.ts (docs/01 §8), incl. the
 * dedicated female-guided option. Rendered as icon-led feature blocks (no card
 * chrome) so the section reads distinct from the Services cards while still using
 * the shared type scale, accent and spacing tokens. Points reveal in sequence;
 * reduced motion → instant. No invented stats.
 *
 * Icons are keyed by index to the whyUs order; if that order changes in
 * content.ts, update this map to match.
 */
const ICONS: LucideIcon[] = [
  MapPinned, // Local expertise — Thamel-based, on the ground
  ShieldCheck, // Licensed guides — government-licensed
  SlidersHorizontal, // Fully customizable itineraries
  UserRoundCheck, // Dedicated female-guided option
];

export function WhyUs() {
  const reduced = useReducedMotion();

  // Under reduced motion, drive children to "show" (initial=false = no enter
  // animation). Dropping variants instead strands them at hidden opacity:0,
  // since useReducedMotion flips true only after mount with no whileInView left.
  const groupProps = reduced
    ? { variants: staggerContainer, initial: false as const, animate: "show" as const }
    : {
        variants: staggerContainer,
        initial: "hidden" as const,
        whileInView: "show" as const,
        viewport: REVEAL.viewport,
      };
  const item = fadeRise;

  return (
    <section id="why-us" className="section-y bg-surface-alt">
      <div className="container-page">
        <motion.div {...groupProps}>
          <motion.div variants={item}>
            <SectionHeading
              eyebrow="Why WaveUp"
              title="Why Travel With Us"
              intro="A small, local team that builds each trip around you — with the licences, knowledge and care to do it right."
            />
          </motion.div>

          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 md:mt-16">
            {whyUs.map((point, i) => {
              const Icon = ICONS[i] ?? MapPinned;
              return (
                <motion.div key={point.title} variants={item} className="flex gap-5">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="type-h3 text-ink">{point.title}</h3>
                    <p className="type-body mt-2 text-muted">{point.detail}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
