"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import type { Certificate } from "@/lib/certificates";

gsap.registerPlugin(ScrollTrigger);

interface CertificateDetailClientProps {
  certificate: Certificate;
  prev: Certificate | null;
  next: Certificate | null;
}

export default function CertificateDetailClient({
  certificate,
  prev,
  next,
}: CertificateDetailClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Header elements — fade + slide up
      gsap.fromTo(
        ".cert-detail-header",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.15,
        }
      );

      // 2. Certificate image — gentle scale + opacity
      gsap.fromTo(
        ".cert-detail-image",
        { opacity: 0, scale: 0.96 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          delay: 0.5,
        }
      );

      // 3. About section — scroll-triggered reveal
      gsap.fromTo(
        ".cert-detail-about",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cert-about-section",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 4. Skills tags — staggered reveal
      gsap.fromTo(
        ".cert-detail-skill",
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cert-skills-section",
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 5. Official source — fade in
      gsap.fromTo(
        ".cert-detail-source",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cert-source-section",
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 6. Navigation — fade in
      gsap.fromTo(
        ".cert-detail-nav",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cert-nav-section",
            start: "top 92%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [certificate.slug]);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#050505] text-white pt-28 md:pt-36 pb-20 pointer-events-auto"
    >
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-gradient-to-tr from-[#e5b36e]/5 via-transparent to-transparent rounded-full blur-[120px] opacity-30" />
      </div>

      <div className="relative z-10 max-w-[1000px] mx-auto px-6 sm:px-10 md:px-16">
        {/* Back Navigation */}
        <div className="cert-detail-header mb-12 md:mb-16">
          <Link
            href="/certificates"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase">
              Back to Certificates
            </span>
          </Link>
        </div>

        {/* ============================================
            HEADER: Title Block
            ============================================ */}
        <div className="mb-12 md:mb-20">
          {/* Section label */}
          <div className="cert-detail-header">
            <span className="font-sans text-[#e5b36e] text-[10px] md:text-xs tracking-[0.4em] uppercase font-medium">
              Certificate
            </span>
          </div>

          {/* Title */}
          <h1 className="cert-detail-header font-serif text-[clamp(2rem,6vw,4rem)] leading-[1.1] text-[#ECE7E1] mt-4 md:mt-6">
            {certificate.title}
          </h1>

          {/* Organization · Year · Achievement */}
          <div className="cert-detail-header flex items-center gap-3 mt-4 md:mt-6 text-sm font-sans">
            <span className="text-white/70 font-medium">
              {certificate.organization}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-[#e5b36e]/80">{certificate.date}</span>
            {certificate.achievement && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-white/60 font-medium">{certificate.achievement}</span>
              </>
            )}
          </div>

          {/* Certificate type */}
          <div className="cert-detail-header mt-3">
            <span className="inline-block px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] md:text-xs text-white/60 font-medium tracking-wide">
              {certificate.type}
            </span>
          </div>
        </div>

        {/* ============================================
            CERTIFICATE IMAGE
            ============================================ */}
        <div className="cert-detail-image mb-20 md:mb-28">
          <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl shadow-black/50">
            {/* Subtle inner glow at top */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={certificate.image}
              alt={`${certificate.title} — ${certificate.organization}`}
              className="w-full h-auto object-contain"
              style={{ display: "block" }}
            />
          </div>
        </div>

        {/* ============================================
            ABOUT THIS CERTIFICATE
            ============================================ */}
        <div className="cert-about-section mb-16 md:mb-24">
          <div className="cert-detail-about">
            <span className="font-sans text-[#e5b36e] text-[10px] md:text-xs tracking-[0.4em] uppercase font-medium">
              About This Certificate
            </span>
          </div>

          <div className="cert-detail-about mt-6 md:mt-8">
            <p className="text-[#a9a7a1] text-base md:text-lg font-light leading-relaxed max-w-[720px]">
              {certificate.description}
            </p>
          </div>

          {certificate.details && (
            <div className="cert-detail-about mt-6 md:mt-8">
              <p className="text-[#a9a7a1] text-base md:text-lg font-light leading-relaxed max-w-[720px] whitespace-pre-line">
                {certificate.details}
              </p>
            </div>
          )}

          {/* Info Grid */}
          <div className="cert-detail-about grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 md:gap-y-10 mt-10 md:mt-14 pt-8 border-t border-white/10">
            <div>
              <div className="text-white/40 text-[10px] md:text-xs font-sans tracking-widest uppercase mb-2">
                Issuing Organization
              </div>
              <div className="text-white/90 text-sm font-light">
                {certificate.organization}
              </div>
            </div>
            <div>
              <div className="text-white/40 text-[10px] md:text-xs font-sans tracking-widest uppercase mb-2">
                Year
              </div>
              <div className="text-white/90 text-sm font-light">
                {certificate.year || certificate.date}
              </div>
            </div>
            {certificate.date && certificate.date !== (certificate.year || certificate.date) && (
              <div>
                <div className="text-white/40 text-[10px] md:text-xs font-sans tracking-widest uppercase mb-2">
                  Date
                </div>
                <div className="text-white/90 text-sm font-light">
                  {certificate.date}
                </div>
              </div>
            )}
            <div>
              <div className="text-white/40 text-[10px] md:text-xs font-sans tracking-widest uppercase mb-2">
                Certificate Type
              </div>
              <div className="text-white/90 text-sm font-light">
                {certificate.type}
              </div>
            </div>
            <div>
              <div className="text-white/40 text-[10px] md:text-xs font-sans tracking-widest uppercase mb-2">
                Program
              </div>
              <div className="text-white/90 text-sm font-light">
                {certificate.title}
              </div>
            </div>
            {certificate.project && (
              <div>
                <div className="text-white/40 text-[10px] md:text-xs font-sans tracking-widest uppercase mb-2">
                  Project
                </div>
                <div className="text-white/90 text-sm font-light">
                  {certificate.project}
                </div>
              </div>
            )}
            {certificate.team && (
              <div>
                <div className="text-white/40 text-[10px] md:text-xs font-sans tracking-widest uppercase mb-2">
                  Team
                </div>
                <div className="text-white/90 text-sm font-light">
                  {certificate.team}
                </div>
              </div>
            )}
            {certificate.problemStatement && (
              <div>
                <div className="text-white/40 text-[10px] md:text-xs font-sans tracking-widest uppercase mb-2">
                  Problem Statement
                </div>
                <div className="text-white/90 text-sm font-light">
                  {certificate.problemStatement}
                </div>
              </div>
            )}
            {certificate.achievement && (
              <div>
                <div className="text-white/40 text-[10px] md:text-xs font-sans tracking-widest uppercase mb-2">
                  Achievement
                </div>
                <div className="text-white/90 text-sm font-light">
                  {certificate.achievement}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================
            SKILLS / TOPICS
            ============================================ */}
        {certificate.skills.length > 0 && (
          <div className="cert-skills-section mb-16 md:mb-24">
            <div className="cert-detail-skill">
              <span className="font-sans text-[#e5b36e] text-[10px] md:text-xs tracking-[0.4em] uppercase font-medium">
                Skills & Topics
              </span>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-3 mt-6 md:mt-8">
              {certificate.skills.map((skill) => (
                <div
                  key={skill}
                  className="cert-detail-skill px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10 bg-white/5 text-[11px] md:text-xs text-white/70 font-medium tracking-wide"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================
            OFFICIAL SOURCE
            ============================================ */}
        <div className="cert-source-section mb-20 md:mb-28 pt-8 border-t border-white/10">
          <div className="cert-detail-source">
            <span className="font-sans text-[#e5b36e] text-[10px] md:text-xs tracking-[0.4em] uppercase font-medium">
              Official Program
            </span>
          </div>

          <div className="cert-detail-source mt-6 md:mt-8">
            <a
              href={certificate.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#e5b36e]/40 rounded-full transition-all duration-300 group"
            >
              <span className="text-white/80 group-hover:text-white text-xs md:text-sm font-medium tracking-wide transition-colors">
                {certificate.officialLabel}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-[#e5b36e] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </a>
          </div>
        </div>

        {/* ============================================
            PREVIOUS / NEXT NAVIGATION
            ============================================ */}
        <div className="cert-nav-section pt-8 border-t border-white/10">
          <div className="cert-detail-nav flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6">
            {/* Previous */}
            {prev ? (
              <Link
                href={`/certificates/${prev.slug}`}
                className="group flex items-center gap-4 text-left"
              >
                <ArrowLeft className="w-4 h-4 text-white/40 group-hover:text-[#e5b36e] group-hover:-translate-x-1 transition-all duration-300 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-sans tracking-widest uppercase text-white/40 group-hover:text-white/60 transition-colors">
                    Previous Certificate
                  </span>
                  <span className="text-sm font-serif text-white/70 group-hover:text-white transition-colors mt-0.5">
                    {prev.title}
                  </span>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {/* Next */}
            {next ? (
              <Link
                href={`/certificates/${next.slug}`}
                className="group flex items-center gap-4 text-right sm:ml-auto"
              >
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-sans tracking-widest uppercase text-white/40 group-hover:text-white/60 transition-colors">
                    Next Certificate
                  </span>
                  <span className="text-sm font-serif text-white/70 group-hover:text-white transition-colors mt-0.5">
                    {next.title}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-[#e5b36e] group-hover:translate-x-1 transition-all duration-300 shrink-0" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
