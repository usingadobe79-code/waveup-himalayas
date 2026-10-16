"use client";

import {
  Compass,
  Globe,
  HeartHandshake,
  MapPinned,
  MessageCircle,
  MountainSnow,
  ShieldCheck,
  SlidersHorizontal,
  Clock,
  Users,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { staggerContainer, fadeRise, REVEAL } from "@/lib/motion";
import type { WhyUsFeature } from "@/lib/about";
import { m } from "framer-motion";

/**
 * Icon keys match the `icon` select options on the `whyUs` field in
 * public/admin/config.yml. An unset/unrecognised key falls back to Compass
 * rather than rendering nothing — see `ICONS[feature.icon ?? ""] ?? Compass`
 * below.
 */
const ICONS: Record<string, LucideIcon> = {
  "map-pinned": MapPinned,
  "shield-check": ShieldCheck,
  "sliders-horizontal": SlidersHorizontal,
  "mountain-snow": MountainSnow,
  "message-circle": MessageCircle,
  "heart-handshake": HeartHandshake,
  users: Users,
  globe: Globe,
  compass: Compass,
  clock: Clock,
};

/**
 * "Why Choose Us" — a grid of feature cards for the /about page, editable via
 * the CMS "About Page" singleton (content/about.md, `whyUs`). Card chrome and
 * stagger-reveal mirror components/sections/Services.tsx; content itself is
 * entirely writer-supplied (no invented stats/claims).
 */
export function WhyChooseUs({ items }: { items: WhyUsFeature[] }) {
  const reduced = useReducedMotion();

  if (items.length === 0) return null;

  // Same reduced-motion handling as WhyUs.tsx/Services.tsx — drive straight to
  // "show" so content isn't stranded at hidden opacity:0 with no scroll trigger.
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
    <section id="why-choose-us" className="section-y bg-surface-alt">
      <div className="container-page">
        <m.div {...groupProps}>
          <m.div variants={item}>
            <SectionHeading
              eyebrow="What Sets Us Apart"
              title="Why Choose Us"
              intro="A small, local team handling your trip end to end — from the first message to the trail itself."
            />
          </m.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
            {items.map((feature) => {
              const Icon = (feature.icon && ICONS[feature.icon]) || Compass;
              return (
                <m.div key={feature.title} variants={item} className="card p-6 sm:p-8">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3 className="type-h3 mt-5 text-ink">{feature.title}</h3>
                  <p className="type-body mt-2 text-muted">{feature.description}</p>
                </m.div>
              );
            })}
          </div>
        </m.div>
      </div>
    </section>
  );
}
