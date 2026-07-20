"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GradientBars } from "@/components/ui/gradient-bars";

gsap.registerPlugin(ScrollTrigger);

export default function GradientBarsBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Fade in the background just as the user scrolls past the first page (Hero)
      gsap.fromTo(containerRef.current,
        { opacity: 0 },
        {
          scrollTrigger: {
            trigger: document.body,
            start: "150vh top", // Start fading in as the portrait dissolves
            end: "250vh top", // Fully visible when portrait is gone
            scrub: 1,
          },
          opacity: 1,
          ease: "none",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none" style={{ opacity: 0, zIndex: 0 }}>
      <GradientBars numBars={7} gradientFrom="rgb(255, 60, 0)" gradientTo="transparent" animationDuration={2} className="w-full h-full opacity-100" />
    </div>
  );
}
