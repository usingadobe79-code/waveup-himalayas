"use client";

import Image from "next/image";
import { UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { staggerContainer, fadeRise, REVEAL } from "@/lib/motion";
import type { TeamMember } from "@/lib/team";

/**
 * "Our Team" — a grid of team member cards for the /about page, editable via
 * the CMS "Team" folder collection (content/team/*.md). Renders nothing when
 * there are no members (e.g. the seeded placeholder was deleted with nothing
 * added in its place), so the section never shows an empty grid.
 */
export function OurTeam({ members }: { members: TeamMember[] }) {
  const reduced = useReducedMotion();

  if (members.length === 0) return null;

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
    <section id="our-team" className="section-y bg-surface">
      <div className="container-page">
        <motion.div {...groupProps}>
          <motion.div variants={item}>
            <SectionHeading
              eyebrow="The People Behind Your Trip"
              title="Our Team"
              intro="The local team you'll actually be talking to — on WhatsApp, on email, and on the trail."
            />
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
            {members.map((member) => (
              <motion.div
                key={member.slug}
                variants={item}
                className="card flex flex-col items-center p-6 text-center sm:p-8"
              >
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full bg-accent/10">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-accent">
                      <UserRound className="h-12 w-12" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                  )}
                </div>
                <h3 className="type-h3 mt-5 text-ink">{member.name}</h3>
                <p className="type-small mt-1 font-semibold text-accent-ink">{member.role}</p>
                {member.bio && <p className="type-small mt-3 text-muted">{member.bio}</p>}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
