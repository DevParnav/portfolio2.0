"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Particles from "./Particles";

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  // We make the canvas full screen and fixed so it stays in the background
  return (
    <div ref={containerRef} className="fixed inset-0 z-0 bg-black">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 2]} // Support high-DPI displays
        gl={{ antialias: false, powerPreference: "high-performance" }} // Optimized for postprocessing
      >
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.5} />
        
        <Suspense fallback={null}>
          <Particles />
        </Suspense>

        {/* Cinematic Soft Bloom Effect */}
        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={0.2} 
            luminanceSmoothing={0.9} 
            intensity={1.5} 
            mipmapBlur 
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
