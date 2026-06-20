"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { HeroPoster } from "@/components/sections/HeroPoster";
import type { HeroVariant } from "@/lib/hero";

/**
 * Lazy-loads the selected hero scene. Each variant is a separate client-only
 * chunk (ssr:false) so Three.js never ships in the initial HTML. While the
 * chunk loads, the static poster shows. Under prefers-reduced-motion we skip
 * the 3D entirely and render the poster as the static fallback (kickoff rule).
 */
const scenes = {
  a: dynamic(() => import("./HeroSceneA").then((m) => m.HeroSceneA), {
    ssr: false,
    loading: () => <HeroPoster />,
  }),
  b: dynamic(() => import("./HeroSceneB").then((m) => m.HeroSceneB), {
    ssr: false,
    loading: () => <HeroPoster />,
  }),
  c: dynamic(() => import("./HeroSceneC").then((m) => m.HeroSceneC), {
    ssr: false,
    loading: () => <HeroPoster />,
  }),
} as const;

export function HeroCanvas({ variant }: { variant: HeroVariant }) {
  const reduced = useReducedMotion();
  const Scene = useMemo(() => scenes[variant], [variant]);

  return (
    <div className="absolute inset-0">
      {/* Poster sits behind as the base layer (and shows through transparent sky). */}
      <HeroPoster />
      {!reduced && <Scene animate />}
    </div>
  );
}
