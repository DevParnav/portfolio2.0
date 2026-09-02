"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TIMELINE_DATA = [
  {
    year: "2026",
    title: "EchoOS",
    description: "Building a personal AI operating system.",
  },
  {
    year: "2026",
    title: "AI Hackathon",
    description: "Top 30 Finalist.",
  },
  {
    year: "2025",
    title: "Started B.Tech",
    description: "Started B.Tech in AI & Data Science.",
  },
  {
    year: "2024",
    title: "State Athlete",
    description: "State-Level Athlete.",
  },
  {
    year: "2023",
    title: "Robotics",
    description: "Robotics Competition.",
  },
];

const STATS_DATA = [
  { value: 30, prefix: "Top ", label: "Hackathon Finalist" },
  { value: 1, suffix: "st", label: "State-Level Athlete" },
  { value: 4, suffix: "", label: "Featured Projects" },
  { value: 3, suffix: "", label: "Certificates" },
  { value: 2, suffix: "+", label: "Years of Learning" },
];

export default function ExperienceContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Use a small timeout to ensure DOM is fully rendered before calculating heights for pinning
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        let mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
          // 0. Pin Left Panel ONLY on Desktop/Tablet Landscape
          if (leftPanelRef.current) {
            ScrollTrigger.create({
              trigger: containerRef.current,
              start: "top 10%", 
              end: "bottom 80%", 
              pin: leftPanelRef.current,
              pinSpacing: false,
            });
          }
        });

        // 1. Draw Timeline Line
        if (lineRef.current) {
          gsap.fromTo(
            lineRef.current,
            { height: "0%" },
            {
              height: "100%",
              ease: "none",
              scrollTrigger: {
                trigger: rightPanelRef.current,
                start: "top 60%",
                end: "bottom 80%",
                scrub: true,
              },
            }
          );
        }

        // 2. Animate Timeline Items & Dots
        itemsRef.current.forEach((item, index) => {
          if (!item) return;
          const dot = dotsRef.current[index];

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          });

          if (dot) {
            tl.to(dot, {
              backgroundColor: "#e5b36e",
              boxShadow: "0 0 15px rgba(229, 179, 110, 0.6)",
              borderColor: "rgba(229, 179, 110, 0.4)",
              duration: 0.4,
            }, 0);
          }

          tl.fromTo(
            item,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
            0.1
          );
        });

        // 3. Animate Counters
        statsRef.current.forEach((stat) => {
          if (!stat) return;
          const numberEl = stat.querySelector(".stat-number");
          if (!numberEl) return;
          
          const targetValue = parseFloat(numberEl.getAttribute("data-target") || "0");
          
          gsap.fromTo(
            numberEl,
            { innerHTML: "0" },
            {
              innerHTML: targetValue,
              duration: 2,
              ease: "power2.out",
              snap: { innerHTML: 1 },
              scrollTrigger: {
                trigger: stat,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            }
          );

          gsap.fromTo(
            stat,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", scrollTrigger: {
                trigger: stat,
                start: "top 90%",
                toggleActions: "play none none reverse",
            }},
          );
        });
        
      }, containerRef);

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen text-white pt-[15vh] pb-[20vh] pointer-events-auto"
      id="experience"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 md:px-24 flex flex-col md:flex-row gap-12 md:gap-16 relative z-10">
        
        {/* LEFT COLUMN - PINNED via GSAP */}
        <div ref={leftPanelRef} className="md:w-[40%] flex flex-col h-fit shrink-0">
          <h2 className="font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/50 mb-3 md:mb-4">
            Experience
          </h2>
          <h3 className="font-serif text-[clamp(2.5rem,8vw,4.5rem)] leading-[1.1] md:leading-none mb-6 md:mb-8">
            Journey &<br /> Milestones
          </h3>
          <p className="text-[#a9a7a1] text-base md:text-lg font-light leading-relaxed max-w-sm mb-12 md:mb-16">
            A continuous journey of growth, combining athletic discipline with a passion for software engineering, artificial intelligence, and building intuitive products.
          </p>
        </div>

        {/* RIGHT COLUMN - TIMELINE & STATS */}
        <div ref={rightPanelRef} className="md:w-[60%] flex flex-col pt-0 md:pt-4">
          
          {/* Vertical Timeline */}
          <div className="relative pl-6 sm:pl-8 md:pl-12 border-l border-white/5 mb-24 md:mb-32">
            {/* Animated drawing line */}
            <div 
              ref={lineRef}
              className="absolute top-0 left-[-1px] w-[2px] bg-gradient-to-b from-[#e5b36e]/80 via-[#e5b36e]/40 to-transparent origin-top"
              style={{ height: "0%" }}
            />

            <div className="flex flex-col gap-10 md:gap-16">
              {TIMELINE_DATA.map((item, index) => (
                <div 
                  key={index} 
                  className="relative"
                >
                  {/* Glowing Node */}
                  <div 
                    ref={(el) => { dotsRef.current[index] = el; }}
                    className="absolute -left-[31px] sm:-left-[39px] md:-left-[55px] top-1 w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-white/20 bg-black z-10 transition-colors"
                  />
                  
                  {/* Timeline Card */}
                  <div 
                    ref={(el) => { itemsRef.current[index] = el; }}
                    className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 md:p-8 shadow-xl md:shadow-2xl relative overflow-hidden group lg:hover:bg-white/10 transition-colors duration-500"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#e5b36e]/5 rounded-full blur-3xl -mr-16 -mt-16 lg:group-hover:bg-[#e5b36e]/10 transition-colors duration-500"></div>
                    
                    <span className="font-sans text-[#e5b36e] tracking-widest text-[11px] md:text-sm mb-2 md:mb-3 block">
                      {item.year}
                    </span>
                    <h4 className="font-serif text-xl md:text-3xl text-white mb-2">
                      {item.title}
                    </h4>
                    <p className="text-[#a9a7a1] font-light leading-relaxed text-[13px] md:text-base">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievement Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {STATS_DATA.map((stat, index) => (
              <div 
                key={index}
                ref={(el) => { statsRef.current[index] = el; }}
                className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center text-center shadow-lg lg:hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#e5b36e] mb-1 md:mb-2 flex items-center">
                  {stat.prefix && <span className="text-xl sm:text-2xl mr-1">{stat.prefix}</span>}
                  <span className="stat-number" data-target={stat.value}>0</span>
                  {stat.suffix && <span>{stat.suffix}</span>}
                </div>
                <span className="font-sans text-[9px] md:text-xs tracking-widest uppercase text-white/50 mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
