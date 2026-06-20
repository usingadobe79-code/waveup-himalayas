"use client";

import { useRef, type CSSProperties } from "react";
import { motion, useInView } from "framer-motion";
import {
  MountainSnow,
  Landmark,
  Helicopter,
  PlaneTakeoff,
  TreePine,
  Route,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { staggerContainer, fadeRise, REVEAL } from "@/lib/motion";
import { services } from "@/lib/content";
import { cn } from "@/lib/cn";

/**
 * Services — 6 cards (docs/01 §4). Grid 2 (mobile) → 3 (tablet) → 6 (desktop).
 * Cards stagger-reveal (rise + fade); each icon line-draws on first reveal;
 * hover lifts the card, glows the gold border and micro-rotates the icon.
 */
const ICONS: Record<string, LucideIcon> = {
  trekking: MountainSnow,
  "city-tours": Landmark,
  "heli-tours": Helicopter,
  "mountain-flights": PlaneTakeoff,
  "jungle-safari": TreePine,
  "custom-trips": Route,
};

export function Services() {
  const reduced = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, amount: 0.2 });

  const groupProps = reduced
    ? {}
    : {
        variants: staggerContainer,
        initial: "hidden" as const,
        whileInView: "show" as const,
        viewport: REVEAL.viewport,
      };
  const item = reduced ? undefined : fadeRise;

  return (
    <section id="services" className="bg-off-white py-16 sm:py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div {...groupProps}>
          <motion.div variants={item}>
            <SectionHeading
              eyebrow="What We Do"
              title="Our Services"
              intro="From first steps on the trail to summit helicopter flights — everything for your Himalayan journey, arranged end to end."
            />
          </motion.div>

          <div
            ref={gridRef}
            className="mt-10 grid grid-cols-2 gap-5 sm:mt-14 sm:gap-6 md:grid-cols-3 lg:grid-cols-6"
          >
            {services.map((service, i) => {
              const Icon = ICONS[service.key] ?? Route;
              return (
                <motion.article
                  key={service.key}
                  variants={item}
                  className="group flex flex-col rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-[0_18px_40px_-18px_rgba(27,42,74,0.45)]"
                >
                  <span
                    className={cn(
                      "icon-draw mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:rotate-6",
                      inView && "is-drawn",
                    )}
                    style={{ "--draw-delay": `${0.1 + i * 0.08}s` } as CSSProperties}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-base text-navy sm:text-lg">{service.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/65">{service.blurb}</p>
                </motion.article>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
