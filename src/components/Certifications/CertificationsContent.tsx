"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const CERTIFICATIONS = [
  {
    title: "Deloitte Technology Virtual Experience",
    organization: "Deloitte",
    date: "2023",
    description: "Completed practical task modules in Technology Consulting, including client communication and system architecture.",
    image: "/certificates/deloitte.png",
  },
  {
    title: "Walmart Advanced Software Engineering",
    organization: "Walmart Global Tech",
    date: "2023",
    description: "Built scalable data structures and algorithms, focusing on performance optimization and clean code principles.",
    image: "/certificates/walmart.png",
  }
];

export default function CertificationsContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  // Scroll lock when modal is open
  useEffect(() => {
    if (selectedCert) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedCert]);

  // Keyboard navigation (ESC to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCert(null);
    };
    if (selectedCert) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCert]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
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
    <>
      <div className="relative w-full pointer-events-auto flex items-start justify-center px-10 md:px-24 pt-16 pb-64">
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
            {CERTIFICATIONS.map((cert) => (
              <div 
                key={cert.title}
                className="cert-card group relative flex flex-col sm:flex-row gap-6 p-6 rounded-2xl border border-white/5 bg-black/20 hover:bg-white/[0.02] backdrop-blur-sm transition-all duration-500 ease-out hover:-translate-y-2 hover:border-[#C9A063]/40"
              >
                {/* Image Section */}
                <div className="w-full sm:w-[200px] h-[140px] shrink-0 rounded-xl overflow-hidden bg-white/5 relative border border-white/5">
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
                      <span className="text-[#C9A063]/80">{cert.date}</span>
                    </div>
                    <p className="text-[#8D8D8D] text-[14px] font-light leading-relaxed line-clamp-2 mb-4">
                      {cert.description}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedCert(cert.image)}
                    className="inline-flex items-center gap-2 text-[13px] font-medium tracking-wide uppercase text-white/50 group-hover:text-white transition-colors duration-300 w-fit"
                  >
                    View Certificate <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Premium Fullscreen Viewer Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center p-6 md:p-12"
            style={{ backgroundColor: "rgba(0,0,0,0.88)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setSelectedCert(null)}
          >
            <button 
              onClick={() => setSelectedCert(null)}
              className="absolute top-8 right-8 md:top-12 md:right-12 z-[95] w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-all duration-500 ease-out hover:rotate-90 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
              aria-label="Close"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4L20 20M4 20L20 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            
            <motion.div 
              className="relative w-auto h-auto max-w-[90vw] max-h-[90vh] flex items-center justify-center shadow-[0_10px_60px_rgba(0,0,0,0.8)] shadow-[#C9A063]/10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedCert} 
                alt="Certificate Fullscreen" 
                className="max-w-[85vw] max-h-[85vh] w-auto h-auto object-contain rounded-[12px] shadow-[0_0_40px_rgba(255,255,255,0.05)] border border-white/5"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
