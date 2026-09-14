"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { CERTIFICATES } from "@/lib/certificates";

gsap.registerPlugin(ScrollTrigger);

export default function CertificationsContent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const isStandalone = typeof window !== "undefined" && window.location.pathname.startsWith("/certificates");

      if (isStandalone) {
        gsap.set(containerRef.current, { y: "0vh", opacity: 1 });
        gsap.set(".cert-left-content", { opacity: 1, y: 0 });
        gsap.set(".cert-card", { opacity: 1, y: 0 });
        return;
      }

      // Slide up container
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 100%", // When top of container hits bottom of screen
          end: "top 60%", // When it reaches 60% of the screen
          scrub: 1,
        }
      });

      tl.fromTo(containerRef.current, 
        { y: "20vh", opacity: 0 },
        { y: "0vh", opacity: 1, duration: 1 }
      );

      // Cinematic reveal inside the Certifications section
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 70%",
        onEnter: () => {
          // Left content - fade & 20px upward
          gsap.fromTo(".cert-left-content", 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.1 }
          );

          // Right content cards - stagger 0.15s, slide from bottom 30px
          gsap.fromTo(".cert-card",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", delay: 0.2 }
          );
        },
        onLeaveBack: () => {
          gsap.set(".cert-left-content", { opacity: 0 });
          gsap.set(".cert-card", { opacity: 0 });
        }
      });

      gsap.set(".cert-left-content", { opacity: 0 });
      gsap.set(".cert-card", { opacity: 0 });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div id="certifications" className="relative w-full pointer-events-auto flex items-start justify-center px-10 md:px-24 pt-16 pb-64">
      <div ref={containerRef} className="w-full max-w-[1400px] flex flex-col lg:flex-row items-center lg:items-start justify-between gap-16 lg:gap-20">
        
        {/* Left Side: Typography */}
        <div className="w-full lg:w-[40%] flex flex-col pt-10">
          <div className="cert-left-content">
            <div className="text-[#C9A063] font-sans text-sm font-medium tracking-[0.4em] uppercase mb-10">
              CERTIFICATIONS
            </div>
          </div>

          <div className="cert-left-content font-serif text-[48px] md:text-[76px] leading-[1.05] text-[#ECE7E1] font-medium">
            <div className="block">Learning,</div>
            <div className="block text-[#C9A063]">Beyond</div>
            <div className="block">the Classroom.</div>
          </div>

          <div className="cert-left-content">
            <div className="w-16 h-[1px] bg-[#C9A063] opacity-60 mt-10 mb-8" />
          </div>

          <div className="cert-left-content">
            <p className="text-[#8D8D8D] text-[18px] font-light leading-[1.8] max-w-[420px]">
              I continuously invest in practical learning through industry-recognized certifications and hands-on experiences.
            </p>
          </div>
        </div>

        {/* Right Side: Certification Cards */}
        <div className="w-full lg:w-[60%] max-w-[600px] flex flex-col gap-8 pt-10">
          {CERTIFICATES.map((cert) => (
            <div 
              key={cert.slug}
              className="cert-card group relative flex flex-col sm:flex-row gap-6 p-6 rounded-2xl border border-white/5 bg-black/20 hover:bg-white/[0.02] backdrop-blur-sm transition-all duration-500 ease-out hover:-translate-y-2 hover:border-[#C9A063]/40"
            >
              {/* Image Section */}
              <div className="w-full sm:w-[200px] h-[140px] shrink-0 rounded-xl overflow-hidden bg-white/5 relative border border-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              {/* Content Section */}
              <div className="flex flex-col justify-between flex-1 py-1">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h3 className="font-serif text-[22px] font-medium text-[#ECE7E1] group-hover:text-[#C9A063] transition-colors duration-300 line-clamp-2">
                      {cert.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-sans mb-3">
                    <span className="text-white/70 font-medium">{cert.organization}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-[#C9A063]/80">{cert.year || cert.date}</span>
                  </div>
                  <p className="text-[#8D8D8D] text-[14px] font-light leading-relaxed line-clamp-2 mb-4">
                    {cert.description}
                  </p>
                </div>
                
                <Link 
                  href={`/certificates/${cert.slug}`}
                  className="inline-flex items-center gap-2 text-[13px] font-medium tracking-wide uppercase text-white/50 group-hover:text-white transition-colors duration-300 w-fit"
                >
                  View Certificate <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
