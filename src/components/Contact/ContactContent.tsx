"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, MapPin } from "lucide-react";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

gsap.registerPlugin(ScrollTrigger);

import emailjs from '@emailjs/browser';
import { toast } from 'sonner';

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
  
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Partial<typeof formData> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    const loadingToastId = toast.loading("Sending Message...");

    try {
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const autoReplyTemplateId = process.env.NEXT_PUBLIC_EMAILJS_AUTO_REPLY_TEMPLATE_ID;

      if (!publicKey || !serviceId || !templateId) {
        throw new Error("EmailJS configuration is missing.");
      }

const templateParams = {
  user_name: formData.name,
  user_email: formData.email,
  email: formData.email,
  subject: formData.subject,
  message: formData.message,
};

      // Send to owner
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      // Send auto-reply
      if (autoReplyTemplateId) {
        try {
          await emailjs.send(serviceId, autoReplyTemplateId, templateParams, publicKey);
        } catch (autoReplyError) {
          console.error("Auto-reply failed to send:", autoReplyError);
          // Fail silently so the user still sees success if the main email went through
        }
      }

      toast.success(
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-sm">✓ Message Sent Successfully!</span>
          <span className="text-xs text-white/70">Thank you for reaching out. I'll get back to you as soon as possible.</span>
        </div>,
        { id: loadingToastId, duration: 5000 }
      );
      
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Failed to send email:", error);
      toast.error(
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-sm">Failed to send message</span>
          <span className="text-xs text-white/70">Please try again or contact me directly via email.</span>
        </div>,
        { id: loadingToastId, duration: 5000, action: { label: 'Retry', onClick: () => handleFormSubmit(e) } }
      );
    } finally {
      setIsSubmitting(false);
    }
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
          duration: 90, // Extremely subtle and slow
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
        <div className="max-w-[1200px] w-full mx-auto px-6 md:px-16 flex flex-col items-center text-center mb-16 md:mb-24">
          <div className="contact-fade mb-6 md:mb-8">
            <h2 className="font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase text-white/50">
              [ CONTACT ]
            </h2>
          </div>
          
          <h3 ref={headingRef} className="font-serif text-[clamp(2.5rem,8vw,4.5rem)] md:text-6xl lg:text-7xl leading-[1.1] md:leading-tight mb-6 md:mb-8 max-w-[800px]">
            Let's Build<br />Something<br /><span className="italic text-white/90">Extraordinary.</span>
          </h3>
          
          <p className="contact-fade text-[#a9a7a1] text-sm md:text-lg font-light leading-relaxed max-w-[600px] px-4 md:px-0">
            I'm always excited to collaborate on AI, modern web applications, and creative software projects.<br /><br className="hidden md:block" />
            Whether you have an idea, an internship opportunity, or simply want to connect, I'd love to hear from you.
          </p>
        </div>

        {/* MARQUEE */}
        <div className="relative w-full overflow-hidden mb-16 md:mb-24 py-6 md:py-8 border-y border-white/5 bg-white/[0.01] z-5">
          <div className="flex whitespace-nowrap w-[200%] opacity-15 blur-[0.5px]">
            <div ref={marqueeRef} className="flex whitespace-nowrap font-serif font-semibold text-[8vw] md:text-[6vw] leading-none tracking-widest text-[#E8E2D8] select-none" style={{ textShadow: "0 0 35px rgba(233, 196, 106, 0.08)" }}>
              <span>LET'S BUILD • LET'S CREATE • LET'S INNOVATE • LET'S BUILD • LET'S CREATE • LET'S INNOVATE • LET'S BUILD • LET'S CREATE • LET'S INNOVATE • </span>
              <span>LET'S BUILD • LET'S CREATE • LET'S INNOVATE • LET'S BUILD • LET'S CREATE • LET'S INNOVATE • LET'S BUILD • LET'S CREATE • LET'S INNOVATE • </span>
            </div>
          </div>
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div className="contact-cols max-w-[1200px] w-full mx-auto px-6 md:px-16 flex flex-col lg:flex-row gap-12 lg:gap-24 mb-16">
          
          {/* LEFT: Personal Statement */}
          <div className="contact-col-left lg:w-5/12 flex flex-col">
            <h4 className="font-serif text-[clamp(1.5rem,5vw,2rem)] md:text-3xl leading-relaxed text-white/90 mb-4 md:mb-6">
              "Every great product starts with a conversation.
            </h4>
            <p className="text-[#a9a7a1] text-[13px] md:text-base font-light leading-relaxed mb-10 md:mb-12">
              Whether you're building an AI product, a modern website, or an ambitious idea, I'm always open to creating meaningful experiences together."
            </p>
            
            <div className="mb-10 md:mb-12">
              <p className="font-serif text-lg md:text-xl text-[#e5b36e] mb-1">— Parnav Yadav</p>
              <p className="font-sans text-[10px] md:text-xs tracking-wider text-white/40 uppercase mb-1">AI & Data Science Student</p>
              <p className="font-sans text-[10px] md:text-xs tracking-wider text-white/40 uppercase">Frontend Developer</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-white/50">
                <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                <span className="font-sans text-xs md:text-sm tracking-wider uppercase">Jaipur, Rajasthan, India</span>
              </div>
              <div className="inline-flex items-center gap-2.5 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 rounded-full border border-[#10b981]/20 bg-[#10b981]/5 w-fit">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className="font-sans text-[10px] md:text-xs tracking-wider text-white/80">Open to Internships & Collaboration</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Minimal Form */}
          <div className="lg:w-7/12 flex flex-col z-10">
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="contact-form-field flex flex-col gap-2 group">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-white/40 ml-1 group-focus-within:text-[#e5b36e] transition-colors">Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({...formData, name: e.target.value});
                      if (errors.name) setErrors({...errors, name: undefined});
                    }}
                    disabled={isSubmitting}
                    className={`w-full bg-transparent border-b ${errors.name ? 'border-red-500/50' : 'border-white/20'} pb-2 text-white font-light focus:outline-none focus:border-[#e5b36e] hover:border-white/40 transition-colors rounded-none px-1 disabled:opacity-50`}
                    placeholder="John Doe"
                  />
                  {errors.name && <span className="text-red-400 text-xs ml-1">{errors.name}</span>}
                </div>
                <div className="contact-form-field flex flex-col gap-2 group">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-white/40 ml-1 group-focus-within:text-[#e5b36e] transition-colors">Email</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({...formData, email: e.target.value});
                      if (errors.email) setErrors({...errors, email: undefined});
                    }}
                    disabled={isSubmitting}
                    className={`w-full bg-transparent border-b ${errors.email ? 'border-red-500/50' : 'border-white/20'} pb-2 text-white font-light focus:outline-none focus:border-[#e5b36e] hover:border-white/40 transition-colors rounded-none px-1 disabled:opacity-50`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <span className="text-red-400 text-xs ml-1">{errors.email}</span>}
                </div>
              </div>
              
              <div className="contact-form-field flex flex-col gap-2 group">
                <label className="font-mono text-[10px] uppercase tracking-widest text-white/40 ml-1 group-focus-within:text-[#e5b36e] transition-colors">Subject</label>
                <input 
                  type="text" 
                  value={formData.subject}
                  onChange={(e) => {
                    setFormData({...formData, subject: e.target.value});
                    if (errors.subject) setErrors({...errors, subject: undefined});
                  }}
                  disabled={isSubmitting}
                  className={`w-full bg-transparent border-b ${errors.subject ? 'border-red-500/50' : 'border-white/20'} pb-2 text-white font-light focus:outline-none focus:border-[#e5b36e] hover:border-white/40 transition-colors rounded-none px-1 disabled:opacity-50`}
                  placeholder="Project Inquiry"
                />
                {errors.subject && <span className="text-red-400 text-xs ml-1">{errors.subject}</span>}
              </div>

              <div className="contact-form-field flex flex-col gap-2 group">
                <label className="font-mono text-[10px] uppercase tracking-widest text-white/40 ml-1 group-focus-within:text-[#e5b36e] transition-colors">Message</label>
                <textarea 
                  rows={4}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({...formData, message: e.target.value});
                    if (errors.message) setErrors({...errors, message: undefined});
                  }}
                  disabled={isSubmitting}
                  className={`w-full bg-transparent border-b ${errors.message ? 'border-red-500/50' : 'border-white/20'} pb-2 text-white font-light focus:outline-none focus:border-[#e5b36e] hover:border-white/40 transition-colors rounded-none resize-none px-1 disabled:opacity-50`}
                  placeholder="Hello Parnav, I'd like to discuss..."
                />
                {errors.message && <span className="text-red-400 text-xs ml-1">{errors.message}</span>}
              </div>

              <div className="flex justify-end pt-4">
  <LiquidMetalButton
    label="Initiate Contact"
    className="w-full sm:w-auto"
    disabled={isSubmitting}
    isLoading={isSubmitting}
    onClick={() => {
      const form = document.querySelector("form");
      form?.requestSubmit();
    }}
  />
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
