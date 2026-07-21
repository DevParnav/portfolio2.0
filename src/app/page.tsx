"use client";

import HeroContent from "@/components/Hero/HeroContent";
import HeroScene from "@/components/Hero/HeroScene";
import AboutContent from "@/components/About/AboutContent";
import SkillsContent from "@/components/Skills/SkillsContent";
import ProjectsContent from "@/components/Projects/ProjectsContent";
import ExperienceContent from "@/components/Experience/ExperienceContent";
import CertificationsContent from "@/components/Certifications/CertificationsContent";
import ContactContent from "@/components/Contact/ContactContent";
import GlobalLivingBackground from "@/components/ui/GlobalLivingBackground";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen">
      {/* Background 3D Scene - fixed globally */}
      <HeroScene />
      
      {/* Living background that fades in seamlessly after Hero */}
      <GlobalLivingBackground />
      
      
      {/* 
        Container for HTML content.
        Uses pointer-events-none so it doesn't block the canvas interactions globally,
        but child elements that need interaction will re-enable it.
      */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <HeroContent />
        <div className="absolute top-[150vh] w-full flex flex-col pointer-events-none">
          <AboutContent />
          <SkillsContent />
          <ProjectsContent />
          <ExperienceContent />
          <CertificationsContent />
          <ContactContent />
        </div>
      </div>
    </main>
  );
}
