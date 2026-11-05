import {
  MapPinned,
  ShieldCheck,
  SlidersHorizontal,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
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
  return (
    <section id="why-us" className="section-y bg-surface-alt">
      <div className="container-page">
        <div>
          <Reveal>
            <SectionHeading
              eyebrow="Why WaveUp"
              title="Why Travel With Us"
              intro="A small, local team that builds each trip around you — with the licences, knowledge and care to do it right."
            />
          </Reveal>

          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 md:mt-16">
            {whyUs.map((point, i) => {
              const Icon = ICONS[i] ?? MapPinned;
              return (
                <Reveal key={point.title} delay={i * 80} className="flex gap-5">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Icon
                      className="h-6 w-6"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </span>
                  <div>
                    <h3 className="type-h3 text-ink">{point.title}</h3>
                    <p className="type-body mt-2 text-muted">{point.detail}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
