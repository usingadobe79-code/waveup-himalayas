"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import { HeroCanvasFrame } from "./Frame";

/**
 * Variant C — floating model. STUB for step 3.
 * One procedural peak slow-rotating + bobbing over the navy→sunset poster.
 * Step 4: optionally swap in a helicopter/peak model + soft particles.
 * Lightest variant.
 */
function FloatingPeak({ animate }: { animate: boolean }) {
  const mesh = useRef<Mesh>(null);
  useFrame((state) => {
    if (!animate || !mesh.current) return;
    const t = state.clock.elapsedTime;
    mesh.current.rotation.y = t * 0.25;
    mesh.current.position.y = Math.sin(t * 0.8) * 0.18; // gentle bob
  });

  return (
    <group>
      <mesh ref={mesh}>
        <coneGeometry args={[1.4, 2.4, 4]} />
        <meshStandardMaterial color="#eef2f8" roughness={0.6} metalness={0.15} flatShading />
      </mesh>
      <directionalLight position={[3, 4, 5]} intensity={2} color="#ffe9c2" />
      <ambientLight intensity={0.5} color="#b9c6e0" />
    </group>
  );
}

export function HeroSceneC({ animate = true }: { animate?: boolean }) {
  return (
    <HeroCanvasFrame animate={animate} cameraPosition={[0, 0, 5.5]}>
      <FloatingPeak animate={animate} />
    </HeroCanvasFrame>
  );
}
