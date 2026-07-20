"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SKILLS_DATA = [
  {
    num: "01",
    title: "Interactive Frontend",
    description: "Creating immersive web experiences with modern frontend technologies and fluid interactions.",
    groups: [
      { label: "PRIMARY STACK", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
      { label: "MOTION", items: ["GSAP", "Framer Motion", "Three.js"] },
      { label: "CAPABILITIES", type: "list", items: ["Fluid Interfaces", "Complex Animations", "3D Web Experiences", "Responsive Design"] }
    ]
  },
  {
    num: "02",
    title: "Artificial Intelligence",
    description: "Building intelligent software powered by modern language models and AI workflows.",
    groups: [
      { label: "MODELS", items: ["Gemini API", "Ollama", "OpenAI"] },
      { label: "CAPABILITIES", type: "list", items: ["Prompt Engineering", "AI Workflows", "Local LLMs", "AI Integration"] },
      { label: "LEARNING", items: ["RAG", "LangGraph", "MCP Servers", "Vector Databases"] }
    ]
  },
  {
    num: "03",
    title: "Software Engineering",
    description: "Writing scalable software using strong engineering principles and problem solving.",
    groups: [
      { label: "LANGUAGES", items: ["C++", "Python", "Java", "TypeScript"] },
      { label: "FUNDAMENTALS", items: ["Data Structures", "Algorithms", "OOP"] },
      { label: "WHAT I BUILD", items: ["Scalable APIs", "System Architecture", "Performance Optimization"] }
    ]
  },
  {
    num: "04",
    title: "Product Design",
    description: "Designing intuitive digital products before writing code.",
    groups: [
      { label: "DESIGN TOOLS", items: ["Figma", "Prototyping"] },
      { label: "UX/UI", items: ["UI Systems", "UX Thinking", "Wireframes"] },
      { label: "EXPERIENCE", type: "list", items: ["Motion Design", "Interaction Flow", "User Testing"] }
    ]
  },
  {
    num: "05",
    title: "Currently Building",
    description: "Building products that combine beautiful interfaces with intelligent software.",
    groups: [
      { label: "CURRENT PROJECT", items: ["EchoOS", "Personal AI Assistant"] },
      { label: "FEATURES", type: "list", items: ["Local Memory", "Voice Interaction", "Knowledge Maps", "Automation"] }
    ]
  }
];

export default function SkillsContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Pinned ScrollTrigger
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          start: "top top", 
          end: "+=5000", // 5000px of scrolling
          scrub: 1,
          pinSpacing: true,
        }
      });

      const totalPanels = SKILLS_DATA.length;
      
      // Animate the thin gold line drawing down as a progress indicator over the entire scroll
      masterTl.to(lineRef.current, { height: "100%", ease: "none" }, 0);

      // We divide the timeline into exactly 5 equal segments
      const segment = 1 / totalPanels; // 0.2

      panelsRef.current.forEach((panel, index) => {
        if (!panel) return;

        const start = index * segment;
        const end = start + segment;
        const transitionDuration = segment * 0.3; // 30% of the segment is used for crossfading
        const holdStart = start + transitionDuration;
        const holdEnd = end - transitionDuration;
        
        const dot = dotsRef.current[index];

        // Initial Setup
        if (index === 0) {
          gsap.set(panel, { opacity: 1, y: 0, visibility: "visible" });
          if (dot) gsap.set(dot, { backgroundColor: "#C9A063", borderColor: "rgba(201,160,99,0.4)", opacity: 1, scale: 1.2 });
        } else {
          gsap.set(panel, { opacity: 0, y: 100, visibility: "hidden" });
          if (dot) gsap.set(dot, { backgroundColor: "rgba(255,255,255,0.1)", borderColor: "transparent", opacity: 0.3, scale: 1 });
        }

        // Enter Animation
        if (index > 0) {
          masterTl.to(panel, { opacity: 1, y: 0, visibility: "visible", duration: transitionDuration, ease: "power2.out" }, start);
          if (dot) {
            masterTl.to(dot, { backgroundColor: "#C9A063", borderColor: "rgba(201,160,99,0.4)", opacity: 1, scale: 1.2, duration: transitionDuration }, start);
          }
        }

        // Exit Animation
        if (index < totalPanels - 1) {
          masterTl.to(panel, { opacity: 0, y: -100, duration: transitionDuration, ease: "power2.in" }, holdEnd);
          masterTl.set(panel, { visibility: "hidden" }, end);
          if (dot) {
            masterTl.to(dot, { backgroundColor: "rgba(255,255,255,0.1)", borderColor: "transparent", opacity: 0.3, scale: 1, duration: transitionDuration }, holdEnd);
          }
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-screen bg-transparent flex items-center justify-center overflow-hidden"
      style={{
        textRendering: "optimizeLegibility",
        WebkitFontSmoothing: "antialiased",
        fontFeatureSettings: '"liga", "kern"'
      }}
    >
      {/* Background Dim & Blur Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] pointer-events-none z-0" />

      <div className="w-full max-w-[1400px] h-full px-6 md:px-12 lg:px-24 flex flex-col lg:flex-row items-center justify-between relative z-10">
        
        {/* We place the timeline on the left edge of the right 58% column */}
        <div className="absolute left-[42%] top-[15%] bottom-[15%] w-[40px] flex flex-col justify-between items-center z-20 hidden lg:flex">
          <div className="absolute left-[50%] top-0 bottom-0 w-[1px] bg-white/10 -translate-x-[50%]" />
          <div 
            ref={lineRef}
            className="absolute left-[50%] top-0 w-[2px] bg-[#C9A063] -translate-x-[50%] origin-top shadow-[0_0_10px_rgba(201,160,99,0.6)]"
            style={{ height: "0%" }}
          />
          {SKILLS_DATA.map((_, index) => (
            <div 
              key={`dot-${index}`}
              ref={el => { dotsRef.current[index] = el; }}
              className="w-[10px] h-[10px] rounded-full border-[3px] box-content bg-white/10 border-transparent relative z-30 transition-all duration-300"
            />
          ))}
        </div>

        {/* 5 Stacked Layers (Each layer is a full-width flex row containing Left (42%) and Right (58%) content) */}
        <div className="relative w-full h-full flex items-center">
          {SKILLS_DATA.map((skill, index) => (
            <div 
              key={skill.title} 
              ref={el => { panelsRef.current[index] = el; }}
              className="absolute inset-0 flex flex-col lg:flex-row items-center justify-between w-full h-full pt-20 pb-20"
            >
              
              {/* LEFT COLUMN (42%) */}
              <div className="w-full lg:w-[42%] flex flex-col justify-center h-full pr-10">
                <span className="font-sans text-[13px] font-medium tracking-widest text-[#C9A063] mb-4">
                  {skill.num}
                </span>
                
                <h2 className="font-serif text-[48px] md:text-[58px] lg:text-[64px] font-medium leading-[0.95] tracking-[-0.02em] text-[#ECE7E1] mb-[24px]">
                  {skill.title}
                </h2>
                
                <p className="text-white/75 text-[16px] md:text-[18px] font-light leading-[1.7] max-w-[420px]">
                  {skill.description}
                </p>
              </div>

              {/* RIGHT COLUMN (58%) */}
              <div className="w-full lg:w-[58%] flex flex-col justify-center h-full pl-0 lg:pl-[80px]">
                <div className="flex flex-col gap-[28px] w-full max-w-[540px]">
                  
                  {skill.groups.map((group, gIdx) => (
                    <div key={gIdx} className="flex flex-col gap-[12px]">
                      <div className="font-sans text-[12px] uppercase tracking-[0.35em] text-[#C9A063] font-medium drop-shadow-sm">
                        {group.label}
                      </div>
                      
                      {group.type === 'list' ? (
                        <div className="flex flex-col gap-[12px] pl-1">
                          {group.items.map((item, iIdx) => (
                            <div key={iIdx} className="flex items-center gap-4 text-[#ECE7E1] text-[15px] font-light tracking-wide">
                              <span className="text-[#C9A063] text-[14px]">✦</span>
                              {item}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-[10px]">
                          {group.items.map((item, iIdx) => (
                            <div 
                              key={iIdx} 
                              className="px-[18px] py-[10px] rounded-[9999px] border border-white/10 bg-white/5 text-[15px] text-white/80 font-normal tracking-wide shadow-sm hover:-translate-y-[2px] hover:shadow-[0_0_15px_rgba(201,160,99,0.2)] hover:border-[#C9A063]/50 transition-all duration-300 cursor-default"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
