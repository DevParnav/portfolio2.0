"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { DynamicProjectMockup } from "./DynamicProjectMockup";

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
        // Active indicator logic - update when project crosses the middle
        ScrollTrigger.create({
          trigger: project,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => {
            if (self.isActive) {
              setActiveProject(index);
            }
          },
        });

        // Cinematic fade and slide for the ENTIRE project block
        // It starts fading in from the bottom, is fully visible in the middle, and fades out moving up
        gsap.fromTo(project, 
          { 
            opacity: 0.2, 
            y: 150 
          },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: project,
              start: "top 95%",
              end: "top 45%",
              scrub: 1,
            }
          }
        );

        gsap.to(project, {
          opacity: 0,
          y: -100,
          ease: "none",
          scrollTrigger: {
            trigger: project,
            start: "bottom 80%",
            end: "bottom 30%",
            scrub: 1,
          }
        });

        // Parallax image
        const img = project.querySelector(".project-image");
        if (img) {
          gsap.to(img, {
            y: -80,
            ease: "none",
            scrollTrigger: {
              trigger: project,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
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
                className={`project-nav-item flex items-center gap-6 cursor-pointer transition-all duration-500 ${activeProject === idx ? "opacity-100" : "opacity-30"}`}
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
        <div ref={rightColRef} className="md:w-[60%] flex flex-col gap-[15vh] md:gap-[12vh] mt-16 md:mt-0">
          {PROJECTS.map((project, index) => (
            <div key={project.id} id={`project-${project.id}`} className="project-item flex flex-col relative w-full">
              {/* Project Header (Primary Focus) */}
              <div className="reveal-element flex flex-col gap-2 md:gap-3 mb-8 md:mb-12">
                 <div className="flex items-center gap-3 md:gap-4">
                    <span className="font-sans text-[#e5b36e] tracking-widest text-[10px] md:text-sm">{project.id}</span>
                    <span className="w-6 md:w-8 h-px bg-white/20"></span>
                    <span className="font-sans text-[10px] md:text-xs tracking-widest uppercase text-white/50">{project.status}</span>
                 </div>
                 <h4 className="font-serif text-[clamp(2.5rem,8vw,4.5rem)] text-white leading-[1.1]">{project.name}</h4>
              </div>

              {/* Side-by-side Layout (Consistent, no alternating) */}
              <div className="flex flex-col-reverse lg:flex-row gap-10 lg:gap-16 items-start">
                
                {/* Text Content (55%) */}
                <div className="w-full lg:w-[55%] flex flex-col shrink-0">
                  {/* Project Description */}
                  <p className="reveal-element text-base md:text-lg text-[#a9a7a1] font-light leading-relaxed mb-8 md:mb-10">
                    {project.description}
                  </p>

                  {/* Data Rows */}
                  <div className="reveal-element flex flex-col gap-6 md:gap-8 mb-8 md:mb-10">
                    
                    {/* Tech Stack */}
                    <div className="flex flex-col gap-3 md:gap-4">
                      <span className="font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase text-white/40">Tech Stack</span>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map(tech => (
                          <span key={tech} className="px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10 bg-white/5 text-xs md:text-sm text-white/80 transition-colors cursor-default">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Roles */}
                    <div className="flex flex-col gap-3 md:gap-4">
                      <span className="font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase text-white/40">Role</span>
                      <div className="flex flex-wrap gap-2">
                        {project.roles.map(role => (
                          <span key={role} className="px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10 bg-white/5 text-xs md:text-sm text-white/80 transition-colors cursor-default">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Buttons */}
                  <div className="reveal-element flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 font-sans text-[11px] md:text-xs font-medium mt-auto">
                    <button className="w-full sm:w-auto px-6 py-3.5 md:py-3 bg-white text-black rounded-full active:bg-gray-300 lg:hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                      Live Project <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button className="w-full sm:w-auto px-6 py-3.5 md:py-3 border border-white/10 bg-white/5 text-white/80 rounded-full active:bg-white/20 lg:hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                      Case Study <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button className="w-full sm:w-auto px-6 py-3.5 md:py-3 border border-white/10 bg-white/5 text-white/80 rounded-full active:bg-white/20 lg:hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg> GitHub
                    </button>
                  </div>
                </div>

                {/* Project Image/Animated Mockup Preview (45%) */}
                <div className="w-full lg:w-[45%] shrink-0 relative reveal-element flex-1 mb-2 lg:mb-0">
                  
                  {/* Main Desktop Mockup */}
                  <div className="w-full aspect-[16/10] rounded-xl overflow-hidden relative group border border-white/10 bg-[#0a0a0c] shadow-2xl transition-transform duration-700 lg:hover:scale-[1.02] lg:hover:shadow-[0_0_40px_rgba(229,179,110,0.15)]">
                    
                    {/* Browser-like top bar */}
                    <div className="absolute top-0 left-0 w-full h-5 md:h-6 bg-black/60 border-b border-white/5 flex items-center px-2 md:px-3 gap-1 md:gap-1.5 z-20 backdrop-blur-md">
                       <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white/20"></div>
                       <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white/20"></div>
                       <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white/20"></div>
                    </div>
                    
                    {/* Animated Live Interface */}
                    <div className="relative w-full h-full pt-5 md:pt-6">
                      <DynamicProjectMockup projectId={project.id} />
                    </div>
                    
                    {/* Glass reflection */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 lg:group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-30"></div>
                  </div>
                  
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
