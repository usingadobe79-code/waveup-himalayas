"use client";

import { useRef, type CSSProperties } from "react";
import Link from "next/link";
import { m, useInView } from "framer-motion";
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

  // Under reduced motion, drive children to the shown state via animate="show"
  // (initial=false = no enter animation). Simply dropping the variants would
  // strand them at the "hidden" opacity:0 they first rendered with — because
  // useReducedMotion resolves true only after mount, and with Lenis off and no
  // whileInView there is nothing left to reveal them. (a11y: was blank before.)
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
    <section id="services" className="section-y bg-surface">
      <div className="container-page">
        <m.div {...groupProps}>
          <m.div variants={item}>
            <SectionHeading
              eyebrow="What We Do"
              title="Our Services"
              intro="From first steps on the trail to summit helicopter flights — everything for your Himalayan journey, arranged end to end."
            />
          </m.div>

          <div ref={gridRef} className="mt-12 grid grid-cols-2 gap-6 md:mt-16 md:grid-cols-3">
            {services.map((service, i) => {
              const Icon = ICONS[service.key] ?? Route;
              return (
                <m.div key={service.key} variants={item} className="h-full">
                  {/* Each card links to /packages filtered to this service — the
                      browser there reads the hash and opens on the matching pill. */}
                  <Link
                    href={`/packages#${service.key}`}
                    aria-label={`${service.title} — view packages`}
                    className="card card-hover group flex h-full flex-col p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 sm:p-6 md:p-8"
                  >
                    <span
                      className={cn(
                        "icon-draw mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:rotate-6 sm:h-12 sm:w-12 md:mb-6",
                        inView && "is-drawn",
                      )}
                      style={{ "--draw-delay": `${0.1 + i * 0.08}s` } as CSSProperties}
                    >
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    {/* Smaller title on phones + break long words (e.g. "Helicopter")
                        so nothing spills out of the narrow card. */}
                    <h3 className="type-h3 text-[1.15rem] leading-snug text-ink [overflow-wrap:anywhere] sm:text-[1.35rem] md:text-[1.5rem]">
                      {service.title}
                    </h3>
                    <p className="type-small mt-2 flex-1 text-muted md:mt-3">{service.blurb}</p>
                    <span className="type-small mt-4 font-semibold text-accent-ink transition-colors group-hover:text-accent group-hover:underline group-hover:underline-offset-4 md:mt-5">
                      View packages
                    </span>
                  </Link>
                </m.div>
              );
            })}
          </div>
        </m.div>
      </div>
    </section>
  );
}
