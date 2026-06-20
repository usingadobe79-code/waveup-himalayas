"use client";

import { Suspense, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, Preload } from "@react-three/drei";

/**
 * Shared Canvas frame for all hero scenes.
 * - Caps pixel ratio at 1.5–2 (perf budget, docs/02).
 * - AdaptiveDpr drops resolution under load; Preload warms assets.
 * - `animate=false` (reduced motion) renders a single static frame on demand
 *   instead of a continuous render loop.
 */
export function HeroCanvasFrame({
  children,
  cameraPosition = [0, 0.6, 6],
  fov = 45,
  animate = true,
}: {
  children: ReactNode;
  cameraPosition?: [number, number, number];
  fov?: number;
  animate?: boolean;
}) {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: cameraPosition, fov }}
      frameloop={animate ? "always" : "demand"}
    >
      <Suspense fallback={null}>{children}</Suspense>
      <AdaptiveDpr pixelated />
      <Preload all />
    </Canvas>
  );
}
