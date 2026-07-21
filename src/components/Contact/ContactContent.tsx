"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, MapPin } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ContactContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:parnavyadav002@gmail.com?subject=${encodeURIComponent(formData.subject || 'New Contact Inquiry')}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
    window.location.href = mailtoUrl;
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      
      // Top entrance stagger
      gsap.fromTo(".contact-fade", 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power2.out",
          scrollTrigger: { trigger: containerRef.current, start: "top 75%" }
        }
      );

      // Heading letter spacing
      if (headingRef.current) {
        gsap.fromTo(headingRef.current,
          { letterSpacing: "0.15em", opacity: 0, y: 20 },
          { letterSpacing: "normal", opacity: 1, y: 0, duration: 1.2, ease: "power3.out", 
            scrollTrigger: { trigger: headingRef.current, start: "top 80%" } 
          }
        );
      }

      // Infinite Marquee
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -50,
          repeat: -1,
          duration: 30,
          ease: "linear"
        });
      }

      // Two-column entrance
      gsap.fromTo(".contact-col-left > *",
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 1, stagger: 0.1, ease: "power2.out",
          scrollTrigger: { trigger: ".contact-cols", start: "top 80%" }
        }
      );

      gsap.fromTo(".contact-form-field",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out",
          scrollTrigger: { trigger: ".contact-cols", start: "top 80%" }
        }
      );

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen text-white flex flex-col pointer-events-auto overflow-hidden bg-transparent pt-[15vh] pb-[10vh]"
      id="contact"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-gradient-to-tr from-[#e5b36e]/5 via-transparent to-transparent rounded-full blur-[120px] opacity-20" />
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="w-full flex flex-col flex-1 relative z-10">
        
        {/* TOP SECTION */}
        <div className="max-w-[1200px] w-full mx-auto px-6 md:px-16 flex flex-col items-center text-center mb-24">
          <div className="contact-fade mb-8">
            <h2 className="font-sans text-xs tracking-[0.2em] uppercase text-white/50">
              [ CONTACT ]
            </h2>
          </div>
          
          <h3 ref={headingRef} className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight mb-8 max-w-[800px]">
            Let's Build<br />Something<br /><span className="italic text-white/90">Extraordinary.</span>
          </h3>
          
          <p className="contact-fade text-[#a9a7a1] text-base md:text-lg font-light leading-relaxed max-w-[600px]">
            I'm always excited to collaborate on AI, modern web applications, and creative software projects.<br /><br />
            Whether you have an idea, an internship opportunity, or simply want to connect, I'd love to hear from you.
          </p>
        </div>

        {/* MARQUEE */}
        <div className="w-full overflow-hidden mb-24 py-8 border-y border-white/5 bg-white/[0.01]">
          <div className="flex whitespace-nowrap" style={{ width: '200%' }}>
            <div ref={marqueeRef} className="flex whitespace-nowrap font-serif text-[6vw] leading-none tracking-widest text-white/[0.03] select-none">
              <span>LET'S BUILD • LET'S CREATE • LET'S INNOVATE • LET'S BUILD • LET'S CREATE • LET'S INNOVATE • LET'S BUILD • LET'S CREATE • LET'S INNOVATE • </span>
              <span>LET'S BUILD • LET'S CREATE • LET'S INNOVATE • LET'S BUILD • LET'S CREATE • LET'S INNOVATE • LET'S BUILD • LET'S CREATE • LET'S INNOVATE • </span>
            </div>
          </div>
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div className="contact-cols max-w-[1200px] w-full mx-auto px-6 md:px-16 flex flex-col lg:flex-row gap-16 lg:gap-24 mb-16">
          
          {/* LEFT: Personal Statement */}
          <div className="contact-col-left lg:w-5/12 flex flex-col">
            <h4 className="font-serif text-2xl md:text-3xl leading-relaxed text-white/90 mb-6">
              "Every great product starts with a conversation.
            </h4>
            <p className="text-[#a9a7a1] text-base font-light leading-relaxed mb-12">
              Whether you're building an AI product, a modern website, or an ambitious idea, I'm always open to creating meaningful experiences together."
            </p>
            
            <div className="mb-12">
              <p className="font-serif text-xl text-[#e5b36e] mb-1">— Parnav Yadav</p>
              <p className="font-sans text-xs tracking-wider text-white/40 uppercase mb-1">AI & Data Science Student</p>
              <p className="font-sans text-xs tracking-wider text-white/40 uppercase">Frontend Developer</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-white/50">
                <MapPin className="w-4 h-4" />
                <span className="font-sans text-sm tracking-wider uppercase">Jaipur, Rajasthan, India</span>
              </div>
              <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full border border-[#10b981]/20 bg-[#10b981]/5 w-fit">
                <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className="font-sans text-xs tracking-wider text-white/80">Open to Internships & Collaboration</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Minimal Form */}
          <div className="lg:w-7/12 flex flex-col">
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="contact-form-field flex flex-col gap-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-white/40 ml-1">Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-transparent border-b border-white/20 pb-2 text-white font-light focus:outline-none focus:border-[#e5b36e] transition-colors rounded-none px-1"
                    placeholder="John Doe"
                  />
                </div>
                <div className="contact-form-field flex flex-col gap-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-white/40 ml-1">Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-transparent border-b border-white/20 pb-2 text-white font-light focus:outline-none focus:border-[#e5b36e] transition-colors rounded-none px-1"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div className="contact-form-field flex flex-col gap-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-white/40 ml-1">Subject</label>
                <input 
                  type="text" 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-transparent border-b border-white/20 pb-2 text-white font-light focus:outline-none focus:border-[#e5b36e] transition-colors rounded-none px-1"
                  placeholder="Project Inquiry"
                />
              </div>

              <div className="contact-form-field flex flex-col gap-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-white/40 ml-1">Message</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-transparent border-b border-white/20 pb-2 text-white font-light focus:outline-none focus:border-[#e5b36e] transition-colors rounded-none resize-none px-1"
                  placeholder="Hello Parnav, I'd like to discuss..."
                />
              </div>

              <div className="contact-form-field mt-4">
                <button 
                  type="submit"
                  className="group flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-[1.02]"
                >
                  Start a Conversation
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </form>

            {/* Form Footer Links */}
            <div className="contact-form-field flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-white/10">
              <a href="https://github.com/DevParnav" target="_blank" rel="noopener noreferrer" className="font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors">GitHub</a>
              <a href="https://linkedin.com/in/parnav-yadav-255003382" target="_blank" rel="noopener noreferrer" className="font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors">LinkedIn</a>
              <a href="https://leetcode.com/u/DevParnav" target="_blank" rel="noopener noreferrer" className="font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors">LeetCode</a>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors">Resume</a>
            </div>
          </div>
          
        </div>

        <footer className="w-full max-w-[1200px] mx-auto px-6 md:px-16 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-mono uppercase tracking-widest text-white/30">
          <p>© 2026 Parnav Yadav</p>
          <p className="text-center">"Designed & Developed by Parnav Yadav"</p>
          <p>Built with React • GSAP • Three.js</p>
        </footer>

      </div>
    </div>
  );
}
