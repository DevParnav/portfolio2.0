"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function DynamicProjectMockup({ projectId }: { projectId: string }) {
  // Select which mockup to render based on ID
  switch (projectId) {
    case "01":
      return <EchoOSMockup />;
    case "02":
      return <AntrixAIMockup />;
    case "03":
      return <StudySphereMockup />;
    case "04":
      return <FinCafeMockup />;
    default:
      return <div className="w-full h-full bg-black/40 flex items-center justify-center text-white/30">Mockup not found</div>;
  }
}

// -------------------------------------------------------------
// 01. EchoOS (Animated AI Dashboard)
// -------------------------------------------------------------
function EchoOSMockup() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      tl.to(".echo-orb", { scale: 1.1, opacity: 0.8, duration: 3, ease: "sine.inOut" })
        .to(".echo-card-1", { y: -5, duration: 2, ease: "sine.inOut" }, 0)
        .to(".echo-card-2", { y: 5, duration: 2.5, ease: "sine.inOut" }, 0);
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full bg-[#0a0a0c] relative overflow-hidden flex flex-col font-sans p-4">
      {/* Background glow */}
      <div className="echo-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-purple-500/80 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
          <span className="text-white/80 text-sm font-medium tracking-wide">EchoOS</span>
        </div>
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-white/20"></div>
          <div className="w-1 h-1 rounded-full bg-white/20"></div>
          <div className="w-1 h-1 rounded-full bg-white/20"></div>
        </div>
      </div>

      {/* Main Interface */}
      <div className="flex gap-4 flex-1 relative z-10">
        {/* Sidebar */}
        <div className="w-1/3 flex flex-col gap-2">
          <div className="w-full h-8 bg-white/5 rounded-lg border border-white/5"></div>
          <div className="w-3/4 h-8 bg-white/5 rounded-lg border border-white/5"></div>
          <div className="w-5/6 h-8 bg-white/5 rounded-lg border border-white/5"></div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="echo-card-1 flex-1 bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-xl p-4 flex flex-col justify-end relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="w-3/4 h-3 bg-white/20 rounded mb-2"></div>
            <div className="w-1/2 h-2 bg-white/10 rounded"></div>
          </div>
          
          <div className="flex gap-4 h-1/3">
            <div className="echo-card-2 flex-1 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center backdrop-blur-sm">
               <div className="w-8 h-8 rounded-full border-2 border-purple-500/50 border-t-purple-400 animate-spin"></div>
            </div>
            <div className="flex-1 bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col gap-2">
               <div className="w-full h-1.5 bg-white/10 rounded"></div>
               <div className="w-4/5 h-1.5 bg-white/10 rounded"></div>
               <div className="w-full h-1.5 bg-white/10 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 02. Antrix AI (Interview Platform)
// -------------------------------------------------------------
function AntrixAIMockup() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1 });
      // Simulate progress bar
      tl.to(".antrix-progress", { width: "100%", duration: 2, ease: "power2.inOut" })
        .to(".antrix-chart-bar", { height: (i) => ["60%", "80%", "40%"][i], duration: 1, stagger: 0.1, ease: "back.out(1.5)" }, "-=0.5")
        .to(".antrix-pulse", { scale: 1.5, opacity: 0, duration: 1, repeat: 2 }, "-=1")
        .to({}, { duration: 2 }); // hold
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full bg-[#0d0d12] relative overflow-hidden flex flex-col p-4 font-sans">
      <div className="flex justify-between items-start h-full gap-4">
        
        {/* Left Column - Video/Interview */}
        <div className="w-3/5 flex flex-col gap-4 h-full">
          <div className="w-full aspect-video bg-[#1a1a24] rounded-xl border border-white/10 relative overflow-hidden">
             {/* Fake face marker */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-20 border border-white/20 rounded-full border-dashed"></div>
             {/* Recording indicator */}
             <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/50 px-2 py-1 rounded">
               <div className="relative flex h-2 w-2">
                 <span className="antrix-pulse absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
               </div>
               <span className="text-[9px] text-white/70 tracking-widest uppercase">REC</span>
             </div>
          </div>
          
          <div className="flex-1 bg-white/5 rounded-xl border border-white/5 p-3 flex flex-col justify-end">
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-2">
              <div className="antrix-progress h-full bg-[#e5b36e] w-0"></div>
            </div>
            <div className="flex justify-between text-[8px] text-white/40">
              <span>Analyzing response...</span>
              <span>78%</span>
            </div>
          </div>
        </div>

        {/* Right Column - Feedback Charts */}
        <div className="w-2/5 flex flex-col gap-4 h-full">
          <div className="flex-1 bg-white/5 rounded-xl border border-white/5 p-3 flex items-end justify-between gap-2">
             {[0, 1, 2].map((i) => (
               <div key={i} className="w-full bg-white/10 rounded-t-sm h-[10%] relative overflow-hidden">
                 <div className="antrix-chart-bar absolute bottom-0 left-0 w-full h-0 bg-gradient-to-t from-[#e5b36e]/20 to-[#e5b36e]"></div>
               </div>
             ))}
          </div>
          <div className="h-1/3 bg-gradient-to-br from-[#e5b36e]/10 to-transparent rounded-xl border border-[#e5b36e]/20 p-3">
            <div className="w-6 h-6 rounded-full border-2 border-[#e5b36e] mb-2 flex items-center justify-center text-[10px] text-[#e5b36e] font-bold">A</div>
            <div className="w-3/4 h-1.5 bg-[#e5b36e]/40 rounded mb-1.5"></div>
            <div className="w-1/2 h-1.5 bg-[#e5b36e]/20 rounded"></div>
          </div>
        </div>

      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 03. StudySphere (Student Dashboard)
// -------------------------------------------------------------
function StudySphereMockup() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1 });
      tl.fromTo(".study-card", 
          { x: 20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power2.out" }
        )
        .to(".study-badge", { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 }, "+=1")
        .to({}, { duration: 2 });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full bg-[#f8f9fa] relative overflow-hidden flex font-sans">
      {/* Sidebar */}
      <div className="w-[30%] bg-white border-r border-gray-200 p-4 flex flex-col gap-4">
        <div className="w-8 h-8 bg-blue-500 rounded-lg shadow-sm mb-2"></div>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${i === 1 ? 'bg-blue-100' : 'bg-gray-100'}`}></div>
            <div className={`h-2 rounded ${i === 1 ? 'w-16 bg-blue-500' : 'w-12 bg-gray-300'}`}></div>
          </div>
        ))}
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-5 flex flex-col gap-4 bg-gray-50/50">
        <div className="flex justify-between items-center">
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
          <div className="w-6 h-6 rounded-full bg-white shadow-sm border border-gray-100 relative">
             <div className="study-badge absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="study-card w-full bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 p-3 flex gap-3 items-center">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex-shrink-0"></div>
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="w-3/4 h-2 bg-gray-800 rounded"></div>
                <div className="w-1/2 h-1.5 bg-gray-400 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 04. FinCafe (Interactive Map)
// -------------------------------------------------------------
function FinCafeMockup() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1 });
      
      // Map pan simulation
      tl.to(".map-bg", { backgroundPosition: "-20px -20px", duration: 4, ease: "sine.inOut", yoyo: true })
        // Marker drop
        .fromTo(".pin-marker", 
          { y: -30, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.6, ease: "bounce.out" }, 
          0
        )
        // Search expand
        .fromTo(".search-bar", 
          { width: "30%" }, 
          { width: "70%", duration: 0.8, ease: "power3.out" }, 
          0.5
        )
        // Card popup
        .fromTo(".cafe-card", 
          { scale: 0.8, opacity: 0, y: 10 }, 
          { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.5)" }, 
          1.5
        )
        .to({}, { duration: 2 });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full bg-[#181a1b] relative overflow-hidden font-sans">
      {/* Map Grid Background */}
      <div 
        className="map-bg absolute inset-[-50%] opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#4b5563 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      ></div>

      {/* Floating UI Elements */}
      <div className="absolute inset-0 p-4 flex flex-col justify-between">
        {/* Search */}
        <div className="search-bar w-[30%] h-8 bg-white/10 backdrop-blur-md border border-white/10 rounded-full flex items-center px-3 gap-2 mx-auto mt-2">
          <div className="w-3 h-3 rounded-full border-2 border-white/50"></div>
          <div className="w-1/2 h-1.5 bg-white/30 rounded"></div>
        </div>

        {/* Map Marker & Card */}
        <div className="relative flex-1 flex items-center justify-center mt-8">
           <div className="relative">
             {/* Card */}
             <div className="cafe-card absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-32 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-2 shadow-2xl origin-bottom">
               <div className="w-full h-12 bg-white/5 rounded-lg mb-2"></div>
               <div className="w-3/4 h-2 bg-white/80 rounded mb-1"></div>
               <div className="flex gap-1">
                 {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>)}
               </div>
               {/* Arrow down */}
               <div className="absolute top-full left-1/2 -translate-x-1/2 border-solid border-t-white/20 border-t-8 border-x-transparent border-x-8 border-b-0"></div>
             </div>
             
             {/* Pin Marker */}
             <div className="pin-marker flex flex-col items-center">
               <div className="w-6 h-6 bg-emerald-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
               <div className="w-1 h-3 bg-white/50 rounded-b-full"></div>
               <div className="w-4 h-1 bg-black/40 rounded-full blur-[2px] mt-0.5"></div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
