"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, PointLight } from "three";
import { HeroCanvasFrame } from "./Frame";

/**
 * Variant A — real 3D range (default). Placeholder procedural geometry.
 * Three depth-staggered ridges (dark back → snow-lit front) dissolving into
 * near fog so the placeholder reads as an intentional misty range, not flat
 * triangles. Step 4 / Higgsfield assets replace this; structure stays the same
 * (peak cluster + soft sun + fog).
 */

type Peak = { x: number; y: number; z: number; r: number; h: number; color: string; rot: number };

// Helper: a ridge row of overlapping peaks across x.
function ridge(count: number, z: number, y: number, baseR: number, baseH: number, color: string): Peak[] {
  const spread = 11;
  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const jitter = Math.sin(i * 12.9898) * 0.5; // deterministic pseudo-variation
    return {
      x: (t - 0.5) * spread + jitter * 0.4,
      y,
      z,
      r: baseR * (0.85 + Math.abs(jitter) * 0.4),
      h: baseH * (0.8 + Math.abs(Math.sin(i * 4.21)) * 0.6),
      color,
      rot: (i % 2 ? 1 : -1) * (Math.PI / 4 + jitter * 0.3),
    };
  });
}

// Back (dark, hazy) → mid → front (snow-lit). Bases sit low so fog hides them.
const RANGES: Peak[] = [
  ...ridge(7, -6, -2.6, 1.7, 3.0, "#1d2b45"),
  ...ridge(5, -3, -2.3, 1.9, 3.4, "#3a4a6b"),
  ...ridge(3, -0.4, -2.0, 2.1, 3.8, "#e9eef6"),
];

function Range({ animate }: { animate: boolean }) {
  const group = useRef<Group>(null);
  const sun = useRef<PointLight>(null);

  useFrame((state) => {
    if (!animate) return;
    const t = state.clock.elapsedTime;
    if (group.current) group.current.rotation.y = Math.sin(t * 0.04) * 0.05; // very gentle sway
    if (sun.current) sun.current.intensity = 2.2 + Math.sin(t * 0.4) * 0.5; // slow sun-glow pulse
  });

  return (
    <group ref={group}>
      {RANGES.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]} rotation={[0, p.rot, 0]}>
          <coneGeometry args={[p.r, p.h, 5]} />
          <meshStandardMaterial color={p.color} roughness={0.92} metalness={0.04} flatShading />
        </mesh>
      ))}
      <pointLight ref={sun} position={[5, 5, 4]} intensity={2.4} color="#ffe9c2" />
      <ambientLight intensity={0.5} color="#9fb4d6" />
      {/* Near fog dissolves the bases + back ridge into haze */}
      <fog attach="fog" args={["#1b2a4a", 3.2, 13]} />
    </group>
  );
}

export function HeroSceneA({ animate = true }: { animate?: boolean }) {
  return (
    <HeroCanvasFrame animate={animate} cameraPosition={[0, 0.8, 6.5]}>
      <Range animate={animate} />
    </HeroCanvasFrame>
  );
}
