"use client";

import HeroContent from "@/components/Hero/HeroContent";
import AboutContent from "@/components/About/AboutContent";
import SkillsContent from "@/components/Skills/SkillsContent";
import ProjectsContent from "@/components/Projects/ProjectsContent";
import ExperienceContent from "@/components/Experience/ExperienceContent";
import CertificationsContent from "@/components/Certifications/CertificationsContent";
import ContactContent from "@/components/Contact/ContactContent";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen bg-[#050505]">
      {/* 
        The HeroContent handles its own 300vh scroll pinning.
        The rest of the content flows naturally below it.
      */}
      <HeroContent />
      
      <div className="w-full flex flex-col relative z-10 bg-[#050505]">
        <AboutContent />
        <SkillsContent />
        <ProjectsContent />
        <ExperienceContent />
        <CertificationsContent />
        <ContactContent />
      </div>
    </main>
  );
}
