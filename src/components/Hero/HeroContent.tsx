"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const ROLES = [
  "Creative Frontend Developer",
  "UI/UX Enthusiast",
  "Second-Year B.Tech CSE (AI & Data Science) Student",
  "Building EchoOS",
  "Open to Opportunities"
];

export default function HeroContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initial entry animation
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.8 });
      tl.from(".fade-up", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: "power3.out",
      });

      // Scroll out animation (Scroll Hero content away as galaxy morphs)
      gsap.to(containerRef.current, {
        scrollTrigger: {
          trigger: document.body,
          start: "100vh top",
          end: "150vh top",
          scrub: 1,
        },
        opacity: 0,
        y: "-50vh", // Scroll it halfway up the screen while fading
        ease: "power1.inOut"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Role rotation timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sticky top-0 h-screen w-full flex flex-col justify-center px-10 md:px-24">
      {/* Shifted up slightly to ensure galaxy doesn't intersect text directly */}
      <div ref={containerRef} className="pointer-events-auto max-w-2xl -mt-10">

        {/* Top small text tags - increased opacity & tracking for readability */}
        <div className="fade-up flex flex-col gap-1.5 mb-10 text-white/70 font-sans tracking-[0.3em] text-[10px] uppercase h-8 relative">
          <div>JAIPUR, INDIA</div>
          <div className="relative overflow-hidden w-full h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentRoleIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                {ROLES[currentRoleIndex]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Massive Typography - name is now elegant ivory white */}
        <h1 className="fade-up font-serif text-[5rem] md:text-[7rem] leading-[1.0] tracking-tight text-[#fdfdfc] mb-10">
          <div className="block">Parnav</div>
          <div className="block text-[#fcfbf7]">Yadav</div>
        </h1>

        {/* Intro Paragraph - Shortened and spacing increased */}
        <p className="fade-up text-[#a9a7a1] text-lg md:text-2xl max-w-lg mb-14 font-light leading-snug">
          Designing immersive digital experiences powered by creativity, modern frontend, and AI.
        </p>

        {/* Action Buttons - reduced size by ~15% */}
        <div className="fade-up flex flex-wrap gap-4 font-sans text-xs font-medium">
          <button className="hover-target px-6 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors">
            Explore Projects
          </button>

          <button className="hover-target px-6 py-3 border border-white/30 text-[#e5b36e] rounded-full hover:border-[#e5b36e] transition-colors">
            Let's Connect
          </button>

          <button className="hover-target px-6 py-3 border border-white/10 bg-white/5 text-white/80 rounded-full hover:bg-white/10 transition-colors flex items-center gap-2">
            Download CV <ArrowUpRight size={14} />
          </button>
        </div>

        {/* Bottom Left indicator */}
        <div className="fade-up absolute bottom-12 left-10 md:left-24 text-xs text-white/30 tracking-wider">
          Explore My Journey
        </div>

        {/* Bottom Center circle indicator */}
        <div className="fade-up absolute bottom-12 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border border-white/20 flex items-center justify-center">
        </div>
      </div>
    </div>
  );
}
