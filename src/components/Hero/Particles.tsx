"use client";

import { useMemo, useRef, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const particleVertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMorphProgress;
  uniform float uDissolveProgress;
  uniform sampler2D uTexture;
  
  attribute vec3 targetPosition;
  attribute vec2 portraitUV;
  attribute float size;
  attribute vec3 color;
  attribute vec3 driftDir;
  
  varying vec3 vColor;
  varying float vAlpha;
  
  void main() {
    // Current Galaxy Position
    vec3 currentPos = position;
    
    // Rotate the galaxy slowly over time
    float angle = uTime * 0.05;
    mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    currentPos.xz = rot * currentPos.xz;

    // The target position is the portrait square.
    vec3 finalTargetPos = targetPosition;
    
    // Mouse Interaction
    vec4 mvPosition = modelViewMatrix * vec4(mix(currentPos, finalTargetPos, uMorphProgress), 1.0);
    vec2 screenPos = (projectionMatrix * mvPosition).xy / (projectionMatrix * mvPosition).w;
    float distToMouse = distance(screenPos, uMouse);
    float displacement = smoothstep(0.4, 0.0, distToMouse) * 0.3;
    
    // Apply a smoothstep to the morph progress so it eases in and out smoothly
    float smoothMorph = smoothstep(0.0, 1.0, uMorphProgress);
    
    // Morphing logic: Galaxy -> Portrait
    vec3 finalPos = mix(currentPos, finalTargetPos, smoothMorph);
    
    // Dissolve logic: Portrait -> Drifting away and upwards
    vec3 actualDrift = driftDir;
    actualDrift.y += 1.5; // Natural upward drift
    // Use an exponential curve (uDissolveProgress^3) so it starts EXTREMELY slowly and accelerates
    float slowDissolve = pow(uDissolveProgress, 3.0);
    finalPos += actualDrift * (slowDissolve * 15.0);
    
    // Apply mouse displacement
    finalPos.x += (screenPos.x - uMouse.x) * displacement * mix(1.0, 0.5, smoothMorph);
    finalPos.y += (screenPos.y - uMouse.y) * displacement * mix(1.0, 0.5, smoothMorph);
    finalPos.z += displacement * 2.0;
    
    vec4 finalMvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * finalMvPosition;
    
    float baseSize = size * (10.0 / -finalMvPosition.z);
    gl_PointSize = baseSize;
    
    // Sample texture color
    vec4 texColor = texture2D(uTexture, portraitUV);
    
    // Convert portrait to Monochrome (Luminance) with much higher contrast
    float lum = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    
    // Boost contrast for clear edges
    lum = pow(lum, 1.2); 
    lum = smoothstep(0.05, 0.8, lum); 
    vec3 targetColor = vec3(lum * 1.5);
    
    // Mix galaxy color with portrait monochrome color
    vColor = mix(color, targetColor, smoothMorph);
    
    // Smoothly scale down dark particles instead of snapping them instantly at 0.5
    float targetPointSizeMultiplier = lum < 0.05 ? 0.1 : 1.0;
    float currentSizeMultiplier = mix(1.0, targetPointSizeMultiplier, smoothstep(0.4, 0.8, uMorphProgress));
    gl_PointSize *= currentSizeMultiplier;
    
    // Fade out particles entirely as dissolve progress reaches 1.0
    vAlpha = mix(1.0, smoothstep(1.0, 0.5, uDissolveProgress), uDissolveProgress);
  }
`;

const particleFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  
  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.1, dist) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export default function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Load texture
  const texture = useLoader(THREE.TextureLoader, '/profile.webp');

  // Dramatically increased density for high quality
  const particleCount = 120000;

  // Generate Particle Data
  const [positions, targetPositions, uvs, sizes, colors, drifts] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const targetPos = new Float32Array(particleCount * 3);
    const uvArray = new Float32Array(particleCount * 2);
    const sizeArray = new Float32Array(particleCount);
    const colorArray = new Float32Array(particleCount * 3);
    const driftArray = new Float32Array(particleCount * 3);

    const colorInside = new THREE.Color("#ffa87a");
    const colorOutside = new THREE.Color("#2a48ff");

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const i2 = i * 2;

      // 1. GALAXY SHAPE
      const radius = Math.random() * 8;
      const spinAngle = radius * 1.5;
      const branchAngle = ((i % 3) * Math.PI * 2) / 3;

      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5 * (8 - radius);
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5 * (8 - radius);
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5 * (8 - radius);

      pos[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      pos[i3 + 1] = randomY;
      pos[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      const mixedColor = colorInside.clone().lerp(colorOutside, radius / 8);
      colorArray[i3] = mixedColor.r;
      colorArray[i3 + 1] = mixedColor.g;
      colorArray[i3 + 2] = mixedColor.b;

      // 2. PORTRAIT SHAPE (Positioned on the right side, kept large)
      const u = Math.random();
      const v = Math.random();
      uvArray[i2] = u;
      uvArray[i2 + 1] = v;

      // Right side position (offset X by +3.5, size 8x8)
      targetPos[i3] = (u - 0.5) * 8.0 + 3.5;
      targetPos[i3 + 1] = (v - 0.5) * 8.0;
      targetPos[i3 + 2] = (Math.random() - 0.5) * 0.2;

      // Smaller base size because of high density
      sizeArray[i] = Math.random() * 1.2 + 0.3;

      // 3. DRIFT DIRECTION for the dissolve effect
      // Drift randomly outward
      driftArray[i3] = (Math.random() - 0.5) * 3.0;
      driftArray[i3 + 1] = (Math.random() - 0.5) * 3.0;
      driftArray[i3 + 2] = (Math.random() - 0.5) * 3.0;
    }

    return [pos, targetPos, uvArray, sizeArray, colorArray, driftArray];
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(-10, -10) },
    uMorphProgress: { value: 0 },
    uDissolveProgress: { value: 0 },
    uTexture: { value: texture }
  }), [texture]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!materialRef.current) return;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;

      gsap.to(materialRef.current.uniforms.uMouse.value, {
        x: x,
        y: y,
        duration: 1,
        ease: "power2.out"
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Complex Scroll orchestration
  useEffect(() => {
    if (!materialRef.current) return;

    // 0 -> 100vh: Slow Morph from Galaxy to Portrait
    ScrollTrigger.create({
      trigger: document.body,
      start: "0% top",
      end: "100vh top",
      scrub: 1,
      onUpdate: (self) => {
        if (materialRef.current) {
          materialRef.current.uniforms.uMorphProgress.value = self.progress;
        }
      }
    });

    // 100vh -> 150vh: PAUSE. Portrait remains perfectly stable.

    // 150vh -> 250vh: Dissolve Portrait back into the star field.
    ScrollTrigger.create({
      trigger: document.body,
      start: "150vh top",
      end: "250vh top",
      scrub: 1,
      onUpdate: (self) => {
        if (materialRef.current) {
          materialRef.current.uniforms.uDissolveProgress.value = self.progress;
        }
      }
    });
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-targetPosition"
          count={targetPositions.length / 3}
          array={targetPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-portraitUV"
          count={uvs.length / 2}
          array={uvs}
          itemSize={2}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-driftDir"
          count={drifts.length / 3}
          array={drifts}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
