"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function AboutContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const isStandalone = typeof window !== "undefined" && window.location.pathname.startsWith("/about");

      if (isStandalone) {
        gsap.set(containerRef.current, { y: "0vh", opacity: 1 });
        if (imageRef.current) gsap.set(imageRef.current, { opacity: 1, scale: 1 });
        gsap.set([".about-left-item", ".heading-line", ".about-left-desc", ".about-left-info", ".about-left-tag", ".about-left-button"], { opacity: 1, y: 0 });
        return;
      }

      // Container slides up between 250vh and 400vh
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: "250vh top", // Start sliding up during the dissolve phase
          end: "400vh top",
          scrub: 1, 
        }
      });

      tl.fromTo(containerRef.current, 
        { y: "100vh", opacity: 0 },
        { y: "0vh", opacity: 1, duration: 1 }
      );

      // The text reveals cinematically at 350vh (after dissolve is completely finished)
      ScrollTrigger.create({
        trigger: document.body,
        start: "350vh top",
        onEnter: () => {
          // Untouched image animation
          if (imageRef.current) {
            gsap.fromTo(imageRef.current, 
              { scale: 1.03, opacity: 0 },
              { scale: 1.00, opacity: 1, duration: 1.5, ease: "power4.out" }
            );
          }
          
          // 1. Section Label
          gsap.fromTo(".about-left-item", 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
          );

          // 2. Main Heading (staggered lines)
          gsap.fromTo(".heading-line",
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: "power3.out", delay: 0.2 }
          );

          // 3. Description
          gsap.fromTo(".about-left-desc",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out", delay: 0.6 }
          );

          // 4. Information Block
          gsap.fromTo(".about-left-info",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.9 }
          );

          // 5. Feature tags
          gsap.fromTo(".about-left-tag",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 1.1 }
          );

          // 6. Button
          gsap.fromTo(".about-left-button",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 1.5 }
          );
        },
        onLeaveBack: () => {
          if (imageRef.current) gsap.set(imageRef.current, { opacity: 0 });
          gsap.set([".about-left-item", ".heading-line", ".about-left-desc", ".about-left-info", ".about-left-tag", ".about-left-button"], { opacity: 0 });
        }
      });

      if (imageRef.current) gsap.set(imageRef.current, { opacity: 0 });
      gsap.set([".about-left-item", ".heading-line", ".about-left-desc", ".about-left-info", ".about-left-tag", ".about-left-button"], { opacity: 0 });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-full pointer-events-auto flex items-start justify-center px-6 sm:px-10 md:px-24 pt-20 md:pt-32 pb-0">
      <div ref={containerRef} className="w-full max-w-7xl flex flex-col-reverse lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-20">
        
        {/* Left Side: Text Content */}
        <div className="w-full lg:w-[50%] flex flex-col gap-8 md:gap-12 pt-6 md:pt-10 lg:pt-20">
          
          {/* 1. Section Label */}
          <div className="about-left-item">
            <div className="text-[#e5b36e] font-sans text-xs md:text-sm font-medium tracking-[0.4em] uppercase">
              ABOUT ME
            </div>
          </div>

          {/* 2. Main Heading */}
          <div className="about-left-heading font-serif text-[clamp(2.5rem,7vw,3.25rem)] leading-[1.1] text-white">
            <div className="overflow-hidden"><div className="heading-line">Building experiences</div></div>
            <div className="overflow-hidden"><div className="heading-line text-[#d0cdc4]">people remember.</div></div>
            <div className="overflow-hidden mt-4 md:mt-6"><div className="heading-line">The goal isn't</div></div>
            <div className="overflow-hidden"><div className="heading-line text-[#d0cdc4]">just writing code.</div></div>
          </div>

          {/* 3. Description */}
          <div className="flex flex-col gap-4 md:gap-6 text-[#a9a7a1] text-base md:text-lg font-light leading-relaxed">
            <p className="about-left-desc">
              I'm Parnav Yadav, a second-year B.Tech CSE (AI & Data Science) student passionate about building immersive digital experiences where design, interaction, and intelligent technology come together.
            </p>
            <p className="about-left-desc">
              I enjoy transforming ideas into products that are elegant, meaningful, and memorable.
            </p>
          </div>

          {/* 4. Information Block */}
          <div className="about-left-info grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 md:gap-y-10 pt-4 border-t border-white/10">
            <div>
              <div className="text-white/40 text-[10px] md:text-xs font-sans tracking-widest uppercase mb-1 md:mb-2">Location</div>
              <div className="text-white/90 text-sm font-light">Jaipur, India</div>
            </div>
            <div>
              <div className="text-white/40 text-[10px] md:text-xs font-sans tracking-widest uppercase mb-1 md:mb-2">Education</div>
              <div className="text-white/90 text-sm font-light">B.Tech Computer Science (AI & Data Science)</div>
            </div>
            <div>
              <div className="text-white/40 text-[10px] md:text-xs font-sans tracking-widest uppercase mb-1 md:mb-2">University</div>
              <div className="text-white/90 text-sm font-light">JECRC University</div>
            </div>
            <div>
              <div className="text-white/40 text-[10px] md:text-xs font-sans tracking-widest uppercase mb-1 md:mb-2">Current Focus</div>
              <div className="text-white/90 text-sm font-light flex flex-col gap-1">
                <span>Frontend Development</span>
                <span>UI/UX Design</span>
                <span>Artificial Intelligence</span>
              </div>
            </div>
          </div>

          {/* 5. Feature tags */}
          <div className="pt-2 md:pt-4 flex flex-wrap gap-2 md:gap-3">
            {["Creative Thinker", "Problem Solver", "Fast Learner", "Building EchoOS"].map((tag) => (
              <div key={tag} className="about-left-tag px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10 bg-white/5 text-white/70 text-[10px] md:text-xs font-medium tracking-wide">
                {tag}
              </div>
            ))}
          </div>

          {/* 6. Button */}
          <div className="about-left-button flex flex-col sm:flex-row gap-4 pt-6 md:pt-8 w-full sm:w-auto">
            <LiquidMetalButton label="Download Resume" onClick={() => window.location.href = '#contact'} className="w-full sm:w-auto text-center" />
            <a href="#contact" className="w-full sm:w-auto text-center px-8 py-3.5 border border-white/10 text-white rounded-full text-xs font-medium hover:bg-white/10 transition-colors flex items-center justify-center">
              Contact Me
            </a>
          </div>

        </div>

        {/* Right Side: Editorial Unboxed Portrait (Untouched per user request) */}
        <div 
          ref={imageRef} 
          className="relative w-full max-w-[320px] sm:max-w-[400px] lg:w-[500px] lg:max-w-none aspect-square lg:sticky lg:top-32 flex-shrink-0 mx-auto lg:mx-0"
        >
          {/* Using a radial gradient mask to blend the image softly into the background */}
          <div className="absolute inset-0 w-full h-full" style={{ WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 75%)", maskImage: "radial-gradient(circle at center, black 40%, transparent 75%)" }}>
            <Image 
              src="/about-profile.png" 
              alt="Parnav Yadav" 
              fill 
              className="object-cover grayscale contrast-125 brightness-90"
              sizes="(max-width: 768px) 100vw, 500px"
              priority
            />
          </div>
        </div>

      </div>
    </div>
  );
}
