"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef } from "react";

const COLORS = ["#7c5cff", "#ff5cae", "#5cffd0", "#ffd45c", "#5cbcff"];
const GEOMETRIES = ["box", "icosahedron", "torus", "cone", "sphere"];

// Grid of shapes covering the whole frame — built once here, not on every render
const SHAPES = [];
let id = 0;
for (let x = -8; x <= 8; x += 2.5) {
  for (let y = -5; y <= 5; y += 2.5) {
    SHAPES.push({
      id: id++,
      position: [x + (Math.random() - 0.5), y + (Math.random() - 0.5), Math.random() * -4],
      scale: 0.25 + Math.random() * 0.35,
      color: COLORS[id % COLORS.length],
      type: GEOMETRIES[id % GEOMETRIES.length],
    });
  }
}

function Shape({ position, scale, color, type }) {
  const mesh = useRef(null);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.2;
    mesh.current.rotation.y += delta * 0.3;
  });

  return (
    <Float speed={1.2} floatIntensity={0.8} rotationIntensity={0.3}>
      <mesh ref={mesh} position={position} scale={scale}>
        {type === "box" && <boxGeometry args={[1, 1, 1]} />}
        {type === "icosahedron" && <icosahedronGeometry args={[0.8, 0]} />}
        {type === "torus" && <torusGeometry args={[0.5, 0.2, 16, 32]} />}
        {type === "cone" && <coneGeometry args={[0.5, 1, 6]} />}
        {type === "sphere" && <sphereGeometry args={[0.5, 24, 24]} />}
        <meshStandardMaterial color={color} metalness={0.25} roughness={0.3} />
      </mesh>
    </Float>
  );
}

export default function ShapesBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 6, 5]} intensity={1.1} />
      <pointLight position={[-4, -2, 2]} intensity={0.8} color="#ff5cae" />
      {SHAPES.map((s) => (
        <Shape key={s.id} {...s} />
      ))}
    </Canvas>
  );
}