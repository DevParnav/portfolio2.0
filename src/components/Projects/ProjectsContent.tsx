"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    id: "01",
    name: "EchoOS",
    status: "Currently Building",
    description:
      "A privacy-first personal AI operating system designed to remember conversations, habits, goals and workflows locally while helping users make smarter decisions through intelligent memory and automation.",
    techStack: ["React", "Ollama", "Gemini API", "Firebase", "Local LLM", "Automation"],
    roles: ["UI/UX", "Frontend", "AI Integration", "System Design"],
    features: ["Local Memory", "Voice Interaction", "Knowledge Graph", "Smart Decisions", "Privacy First"],
    image: "/projects/echo-os.png",
    githubLink: "#",
    liveLink: "#",
  },
  {
    id: "02",
    name: "Antrix AI",
    status: "Hackathon Project",
    description:
      "An AI-powered interview platform that analyzes resumes, generates personalized interviews and delivers detailed performance feedback.",
    techStack: ["React", "Firebase", "Gemini API", "Authentication", "AI Interview Engine", "Resume Analysis"],
    roles: ["Frontend", "Backend", "AI Integration"],
    features: ["Resume Upload", "Live Interview", "Feedback Dashboard", "Role Based Questions"],
    image: "/projects/antrix-ai.png",
    githubLink: "#",
    liveLink: "#",
  },
  {
    id: "03",
    name: "StudySphere",
    status: "Completed",
    description:
      "A collaborative student platform that connects juniors and seniors through shared resources, assignments and academic guidance.",
    techStack: ["React", "Firebase", "Authentication", "Community Platform", "Responsive Design"],
    roles: ["Frontend", "Backend", "Database"],
    features: ["Resource Sharing", "Student Network", "Academic Support", "Responsive UI"],
    image: "/projects/studysphere.png",
    githubLink: "#",
    liveLink: "#",
  },
  {
    id: "04",
    name: "FinCafe",
    status: "In Development",
    description:
      "A modern café discovery platform that helps users explore cafés through location intelligence, ratings and personalized recommendations.",
    techStack: ["React", "Maps API", "Location Services", "Firebase", "Search"],
    roles: ["Frontend", "UI Design", "Location Services"],
    features: ["Nearby Cafés", "Smart Search", "Reviews", "Interactive Maps"],
    image: "/projects/fincafe.png",
    githubLink: "#",
    liveLink: "#",
  },
];

export default function ProjectsContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !rightColRef.current) return;

    const projectElements = gsap.utils.toArray<HTMLElement>(".project-item");

    const ctx = gsap.context(() => {
      projectElements.forEach((project, index) => {
        ScrollTrigger.create({
          trigger: project,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) {
              setActiveProject(index);
            }
          },
        });

        // Parallax image
        const img = project.querySelector(".project-image");
        if (img) {
          gsap.to(img, {
            y: -50,
            ease: "none",
            scrollTrigger: {
              trigger: project,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
        
        // Content reveal
        const contentElems = project.querySelectorAll(".reveal-element");
        gsap.fromTo(
          contentElems,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: project,
              start: "top 75%",
              toggleActions: "play none none reverse"
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen text-white pt-[15vh] pb-[20vh] pointer-events-auto"
      id="projects"
    >
      {/* Background active project gradient */}
      <div 
        className="fixed inset-0 pointer-events-none transition-opacity duration-1000 ease-in-out opacity-20"
        style={{
           background: `radial-gradient(circle at 50% 50%, rgba(229, 179, 110, 0.15) 0%, transparent 60%)`,
        }}
      />
      
      <div className="max-w-[1400px] mx-auto px-10 md:px-24 flex flex-col md:flex-row gap-16 relative z-10">
        
        {/* LEFT COLUMN - STICKY */}
        <div ref={leftColRef} className="md:w-[40%] flex flex-col md:sticky md:top-32 h-fit">
          <h2 className="font-sans text-xs tracking-[0.3em] uppercase text-white/50 mb-4">
            Selected Work
          </h2>
          <h3 className="font-serif text-5xl md:text-7xl mb-8">
            Projects
          </h3>
          <p className="text-[#a9a7a1] text-lg font-light leading-relaxed max-w-sm mb-16">
            Every project represents a step in my journey of combining thoughtful design, intelligent software and modern web technologies.
          </p>
          
          <div className="flex flex-col gap-6">
            {PROJECTS.map((project, idx) => (
              <div 
                key={project.id}
                className={`project-nav-item flex items-center gap-6 cursor-pointer transition-all duration-500 hover-target ${activeProject === idx ? "opacity-100" : "opacity-30"}`}
                onClick={() => {
                  const el = document.getElementById(`project-${project.id}`);
                  if(el) {
                    window.scrollTo({
                      top: el.offsetTop,
                      behavior: 'smooth'
                    });
                  }
                }}
              >
                <span className={`font-sans text-sm tracking-wider transition-colors duration-500 ${activeProject === idx ? "text-[#e5b36e]" : "text-white"}`}>
                  {project.id}
                </span>
                <span className={`font-serif text-3xl md:text-4xl transition-colors duration-500 ${activeProject === idx ? "text-[#e5b36e]" : "text-white"}`}>
                  {project.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN - SCROLLING */}
        <div ref={rightColRef} className="md:w-[60%] flex flex-col gap-[12vh]">
          {PROJECTS.map((project) => (
            <div key={project.id} id={`project-${project.id}`} className="project-item flex flex-col relative w-full">
              
              {/* Project Image Preview */}
              <div className="reveal-element w-full aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden relative group mb-8 border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm transition-transform duration-700 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(229,179,110,0.1)]">
                {/* Browser-like top bar */}
                <div className="absolute top-0 left-0 w-full h-8 bg-black/40 border-b border-white/5 flex items-center px-4 gap-2 z-20 backdrop-blur-md">
                   <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                </div>
                {/* Image */}
                <div className="relative w-full h-[120%] -top-[10%]">
                  <Image 
                    src={project.image} 
                    alt={project.name} 
                    fill 
                    className="object-cover project-image opacity-90 transition-opacity duration-500 group-hover:opacity-100" 
                  />
                </div>
                {/* Glass reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-30"></div>
              </div>

              {/* Project Header */}
              <div className="reveal-element flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 border-b border-white/10 pb-6">
                 <div className="flex flex-col">
                    <span className="font-sans text-[#e5b36e] tracking-widest text-sm mb-2">{project.id}</span>
                    <h4 className="font-serif text-5xl md:text-6xl text-white">{project.name}</h4>
                 </div>
                 <div className="font-sans text-xs tracking-widest uppercase border border-white/20 rounded-full px-4 py-1.5 text-white/60 bg-white/5 w-fit">
                    {project.status}
                 </div>
              </div>

              {/* Project Description */}
              <p className="reveal-element text-lg md:text-xl text-[#a9a7a1] font-light leading-relaxed mb-8">
                {project.description}
              </p>

              {/* Data Rows */}
              <div className="reveal-element flex flex-col gap-8 mb-10">
                
                {/* Tech Stack */}
                <div className="flex flex-col gap-4">
                  <span className="font-sans text-xs tracking-[0.2em] uppercase text-white/40">Tech Stack</span>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map(tech => (
                      <span key={tech} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-white/80 hover:border-[#e5b36e]/50 hover:bg-white/10 transition-colors cursor-default">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Roles */}
                <div className="flex flex-col gap-4">
                  <span className="font-sans text-xs tracking-[0.2em] uppercase text-white/40">Role</span>
                  <div className="flex flex-wrap gap-2">
                    {project.roles.map(role => (
                      <span key={role} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-white/80 hover:border-[#e5b36e]/50 hover:bg-white/10 transition-colors cursor-default">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-col gap-4">
                  <span className="font-sans text-xs tracking-[0.2em] uppercase text-white/40">Key Features</span>
                  <div className="flex flex-wrap gap-2">
                    {project.features.map(feature => (
                      <span key={feature} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-white/80 hover:border-[#e5b36e]/50 hover:bg-white/10 transition-colors cursor-default">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Buttons */}
              <div className="reveal-element flex flex-wrap gap-4 font-sans text-xs font-medium mt-auto">
                <button className="hover-target px-6 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2">
                  View Project <ArrowUpRight size={14} />
                </button>
                <button className="hover-target px-6 py-3 border border-white/10 bg-white/5 text-white/80 rounded-full hover:bg-white/10 transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg> GitHub
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
