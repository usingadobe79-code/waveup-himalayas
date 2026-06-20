"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { HeroCanvasFrame } from "./Frame";

/**
 * Variant B — layered depth. STUB for step 3.
 * Several flat mountain-silhouette planes at increasing depth with fog between.
 * Step 4 adds: particle snow, per-layer mouse parallax at different rates.
 */
const LAYERS = [
  { z: -1, y: -1.2, scale: 5.5, color: "#2b3c61" },
  { z: -3, y: -1.0, scale: 7, color: "#243353" },
  { z: -5, y: -0.8, scale: 9, color: "#1e2c49" },
  { z: -7, y: -0.6, scale: 11, color: "#18243d" },
  { z: -9, y: -0.4, scale: 13, color: "#131d32" },
];

function Layers({ animate }: { animate: boolean }) {
  const group = useRef<Group>(null);
  useFrame((state) => {
    if (!animate || !group.current) return;
    group.current.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
  });

  return (
    <group ref={group}>
      {LAYERS.map((l, i) => (
        // Wide flat triangles as silhouette planes.
        <mesh key={i} position={[0, l.y, l.z]} rotation={[0, 0, 0]}>
          <coneGeometry args={[l.scale, l.scale * 0.5, 3, 1, true]} />
          <meshBasicMaterial color={l.color} />
        </mesh>
      ))}
      <fog attach="fog" args={["#16213a", 4, 16]} />
      <ambientLight intensity={0.6} />
    </group>
  );
}

export function HeroSceneB({ animate = true }: { animate?: boolean }) {
  return (
    <HeroCanvasFrame animate={animate} cameraPosition={[0, 0, 5]} fov={55}>
      <Layers animate={animate} />
    </HeroCanvasFrame>
  );
}
