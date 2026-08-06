"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

export default function HeroContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Elements
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const textLeftRef = useRef<HTMLDivElement>(null);
  const textRightRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const revealItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Lock scroll during the 8-second cinematic intro
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add({
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)"
      }, (context) => {
        let { isDesktop } = context.conditions as { isDesktop: boolean; isMobile: boolean };
        
        const finalWidth = isDesktop ? "15vw" : "18vw";
        const finalHeight = isDesktop ? "8.5vw" : "10vw";

        const tl = gsap.timeline({
          onComplete: () => {
            document.body.style.overflow = "auto";
            // Subtle breathing on the final inline portrait
            gsap.to(imageWrapperRef.current, {
              scale: 1.02,
              duration: 4,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut"
            });
          }
        });

        // Initial States
        // Image starts absolutely fullscreen
        gsap.set(imageWrapperRef.current, { 
          position: "absolute",
          top: "50%",
          left: "50%",
          xPercent: -50,
          yPercent: -50,
          width: "100vw", 
          height: "100vh",
          borderRadius: "0px",
          zIndex: 40
        });
        gsap.set(imageRef.current, { scale: 1.08 });
        
        // Text starts faded out and spread slightly apart
        gsap.set(textLeftRef.current, { opacity: 0, x: -50 });
        gsap.set(textRightRef.current, { opacity: 0, x: 50 });
        gsap.set(revealItemsRef.current, { opacity: 0, y: 30 });

        // 0.0s - 2.5s: The Fullscreen Cinematic Zoom Out
        tl.to(imageRef.current, {
          scale: 1, 
          duration: 2.5,
          ease: "power2.out"
        }, 0.0);

        // 3.0s - 7.0s (4.0s duration): The Seamless Morph into Layout
        tl.to(imageWrapperRef.current, {
          width: finalWidth,
          height: finalHeight,
          borderRadius: "2px",
          boxShadow: "0px 0px 0px rgba(0,0,0,0)",
          duration: 4.0,
          ease: "power3.inOut"
        }, 3.0)
        
        // The text gracefully slides in to frame the image perfectly
        .to([textLeftRef.current, textRightRef.current], {
          opacity: 1,
          x: 0,
          duration: 3.5,
          ease: "power3.inOut"
        }, 3.5); // Starts slightly after the image begins shrinking

        // 6.0s - 8.0s: Footer Reveal Stagger
        tl.to(revealItemsRef.current, {
          opacity: 1,
          y: 0,
          duration: 1.5,
          stagger: 0.15,
          ease: "power2.out"
        }, 6.0);
      });

    }, containerRef);

    return () => {
      document.body.style.overflow = "auto";
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#fcfcfc] overflow-hidden flex flex-col items-center justify-center">
      
      {/* Background Ambience: Completely clean, no heavy vignettes, no noise to match PK exactly */}
      <div className="absolute inset-0 bg-[#fcfcfc] pointer-events-none z-10"></div>

      {/* =========================================
          CENTER LAYOUT: THE SEAMLESS MORPH
          ========================================= */}
          
      {/* We use a relative flex container for the final layout alignment, 
          but the image is absolutely positioned and animated into place. */}
      <div className="relative z-30 flex items-center justify-center w-full px-2 md:px-12 pointer-events-none">
        {/* Adjusted text size for mobile to ensure it fits on one line (around 10vw or 11vw) */}
        <h1 className="flex flex-row items-center justify-center w-full font-sans font-black tracking-tighter leading-none text-[#111111] whitespace-nowrap text-[11vw] md:text-[10vw]">
          
          <div ref={textLeftRef} className="flex-1 text-right flex justify-end">
            <span>Parnav</span>
          </div>
          
          {/* Placeholder gap for the inline image: matches the GSAP finalWidth */}
          <div className="mx-[1.5vw] w-[18vw] md:w-[15vw] flex-shrink-0"></div>
          
          <div ref={textRightRef} className="flex-1 text-left flex justify-start">
            <span>Yadav</span>
          </div>
          
        </h1>
      </div>

      {/* The actual image element that animates from fullscreen down into the placeholder gap. 
          Removed heavy box-shadow to match PK's flat, clean aesthetic. */}
      <div ref={imageWrapperRef} className="overflow-hidden bg-[#e0e0e0] pointer-events-auto">
        <Image
          ref={imageRef}
          src="/profile-horizontal.png"
          alt="Parnav Yadav Portrait"
          fill
          priority
          className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-700"
        />
      </div>

      {/* =========================================
          FOOTER LAYOUT: 3 COLUMNS (PAUL KALKBRENNER)
          ========================================= */}
      <div ref={footerRef} className="absolute bottom-8 md:bottom-12 left-0 w-full px-6 md:px-12 flex flex-col md:flex-row items-start md:items-end justify-between z-50 pointer-events-auto gap-6 md:gap-0">
        
        {/* Left Column */}
        <div ref={(el) => { revealItemsRef.current[0] = el; }} className="flex flex-col gap-1 md:w-1/3">
          <span className="text-[#666666] font-sans text-[10px] sm:text-xs md:text-sm font-medium uppercase tracking-widest">
            AI & Data Science Student
          </span>
          <span className="text-[#111111] font-serif text-lg sm:text-xl md:text-2xl font-bold tracking-tight">
            Frontend Developer
          </span>
        </div>

        {/* Center Column */}
        <div ref={(el) => { revealItemsRef.current[1] = el; }} className="md:w-1/3 flex justify-start md:justify-center">
          <p className="text-[#555555] text-[10px] sm:text-xs md:text-sm font-sans font-medium leading-relaxed max-w-[280px]">
            Building intelligent digital experiences through thoughtful engineering, modern web technologies and artificial intelligence.
          </p>
        </div>

        {/* Right Column */}
        <div ref={(el) => { revealItemsRef.current[2] = el; }} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto md:w-1/3 justify-start md:justify-end mt-2 md:mt-0">
          <a href="#projects" className="w-full sm:w-auto">
            <LiquidMetalButton label="View Projects" className="w-full sm:w-auto" />
          </a>
          <a href="#contact" className="w-full sm:w-auto">
            <LiquidMetalButton label="Resume" className="w-full sm:w-auto" />
          </a>
        </div>

      </div>

    </div>
  );
}
