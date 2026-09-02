"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Calendar, Clock, ArrowLeft, ArrowRight, RotateCw, Search, Plus, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { saveExperiment, updateExperiment, getUserExperiments, Experiment } from "@/lib/firestore";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

type Tab = {
  id: string; // "new-1", "new-2", or actual Firestore ID
  title: string;
  notes: string;
  date: string;
  time: string;
  isSaved: boolean; // True if it corresponds to an existing Firestore doc
  isDirty: boolean; // True if there are unsaved changes
};

export default function ExperimentJournalPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [isLoadingExperiments, setIsLoadingExperiments] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tab State
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>("");

  // Side Panel State
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Protect route and initialize
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/experiment/login");
        return;
      }
      if (!profile || !profile.profileCompleted) {
        router.push("/experiment/setup");
        return;
      }

      fetchExperiments(user.uid);
      
      // Initialize first blank tab if none exist
      if (tabs.length === 0) {
        createNewTab();
      }
    }
  }, [user, profile, loading, router]);

  const fetchExperiments = async (uid: string) => {
    try {
      setIsLoadingExperiments(true);
      const data = await getUserExperiments(uid);
      setExperiments(data);
    } catch (error) {
      console.error("Failed to fetch experiments:", error);
    } finally {
      setIsLoadingExperiments(false);
    }
  };

  const createNewTab = () => {
    const now = new Date();
    const newTab: Tab = {
      id: `new-${Date.now()}`,
      title: "",
      notes: "",
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0].substring(0, 5),
      isSaved: false,
      isDirty: false
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const openExperimentInTab = (exp: Experiment) => {
    // Check if already open
    const existingTab = tabs.find(t => t.id === exp.id);
    if (existingTab) {
      setActiveTabId(existingTab.id);
      return;
    }

    // Open new tab
    const newTab: Tab = {
      id: exp.id!,
      title: exp.title,
      notes: exp.notes,
      date: exp.date,
      time: exp.time,
      isSaved: true,
      isDirty: false
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const tabIndex = tabs.findIndex(t => t.id === id);
    const newTabs = tabs.filter(t => t.id !== id);
    
    if (newTabs.length === 0) {
      // If closing the last tab, create a new empty one
      const now = new Date();
      const newTab: Tab = {
        id: `new-${Date.now()}`,
        title: "",
        notes: "",
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0].substring(0, 5),
        isSaved: false,
        isDirty: false
      };
      setTabs([newTab]);
      setActiveTabId(newTab.id);
    } else if (activeTabId === id) {
      // Switch to an adjacent tab
      const nextIndex = Math.min(tabIndex, newTabs.length - 1);
      setActiveTabId(newTabs[nextIndex].id);
      setTabs(newTabs);
    } else {
      setTabs(newTabs);
    }
  };

  const updateActiveTab = (updates: Partial<Tab>) => {
    setTabs(prev => prev.map(tab => {
      if (tab.id === activeTabId) {
        return { ...tab, ...updates, isDirty: true };
      }
      return tab;
    }));
  };

  const handleSave = async () => {
    if (!user) return;
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (!activeTab) return;
    
    const titleToSave = activeTab.title.trim() || "Untitled experiment";

    setIsSubmitting(true);
    
    try {
      if (activeTab.isSaved) {
        // Update existing document
        await updateExperiment(activeTab.id, {
          title: titleToSave,
          notes: activeTab.notes.trim(),
          date: activeTab.date,
          time: activeTab.time,
        });
        
        // Update tab state
        setTabs(prev => prev.map(tab => 
          tab.id === activeTabId ? { ...tab, title: titleToSave, isDirty: false } : tab
        ));
      } else {
        // Create new document
        const newId = await saveExperiment({
          userId: user.uid,
          title: titleToSave,
          notes: activeTab.notes.trim(),
          date: activeTab.date,
          time: activeTab.time,
        });
        
        // Update tab state to reflect it's now saved
        setTabs(prev => prev.map(tab => 
          tab.id === activeTabId ? { ...tab, id: newId, title: titleToSave, isSaved: true, isDirty: false } : tab
        ));
        setActiveTabId(newId);
      }
      
      toast.success("Note saved successfully.");
      await fetchExperiments(user.uid);
      
    } catch (error: any) {
      console.error("Save experiment error:", error);
      toast.error(`Failed to save note: ${error.message || "Please try again."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/experiment/login");
    } catch (error) {
      toast.error("Failed to sign out.");
    }
  };

  // Hover Debounce Logic for Side Panel
  const handleEdgeEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsPanelOpen(true);
  };
  const handlePanelLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsPanelOpen(false);
    }, 200);
  };

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#e5b36e] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col font-sans overflow-x-hidden bg-[#050505] selection:bg-[#e5b36e]/30 selection:text-[#e5b36e]">
      
      {/* Background Image (Same as Login Page) */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://i.postimg.cc/W1PRkhCz/wallpaperflare-com-wallpaper.jpg"
          alt="Experiment Lab Background"
          fill
          priority
          className="object-cover opacity-80"
          unoptimized 
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#050505]/40 backdrop-blur-[2px]" />
      </div>

      {/* Invisible Hover Zone for Side Panel (Right Edge) */}
      <div 
        className="fixed top-0 right-0 w-8 sm:w-12 h-full z-40 cursor-w-resize"
        onMouseEnter={handleEdgeEnter}
      />

      {/* Side Panel Overlay / Close trigger */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/10"
            onClick={() => setIsPanelOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Saved Notes Panel */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full sm:w-[380px] h-full bg-black/40 backdrop-blur-2xl border-l border-white/20 z-50 shadow-[-20px_0_60px_rgba(0,0,0,0.6)] shadow-[inset_1px_0_0_0_rgba(255,255,255,0.1)] flex flex-col"
            onMouseLeave={handlePanelLeave}
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/30 shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.05)]">
              <h2 className="font-mono text-xs tracking-widest uppercase text-white/80">Saved Notes</h2>
              <button onClick={() => setIsPanelOpen(false)} className="sm:hidden text-white/50 p-2">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 flex flex-col gap-4">
              {isLoadingExperiments ? (
                <div className="flex justify-center py-10">
                  <div className="w-5 h-5 border-2 border-white/10 border-t-[#e5b36e] rounded-full animate-spin" />
                </div>
              ) : experiments.length === 0 ? (
                <div className="text-center py-10 text-white/30 text-sm font-mono">No saved notes yet.</div>
              ) : (
                experiments.map((exp) => (
                  <button
                    key={exp.id}
                    onClick={() => {
                      openExperimentInTab(exp);
                      if (window.innerWidth < 640) setIsPanelOpen(false);
                    }}
                    className={`w-full text-left bg-black/30 hover:bg-black/50 border border-white/10 p-4 rounded-lg transition-colors group flex flex-col shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] ${activeTabId === exp.id ? "bg-black/50 border-white/20" : ""}`}
                  >
                    <div className={`flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase mb-2 ${activeTabId === exp.id ? "text-[#e5b36e]/90" : "text-white/50 group-hover:text-[#e5b36e]/70"}`}>
                      <span>{exp.date}</span>
                      <span className="w-1 h-1 rounded-full bg-white/10"></span>
                      <span>{exp.time}</span>
                    </div>
                    <h3 className={`text-sm font-serif mb-2 transition-colors line-clamp-1 ${activeTabId === exp.id ? "text-white" : "text-[#E8E4DC] group-hover:text-white"}`}>{exp.title}</h3>
                    <p className={`text-xs line-clamp-2 leading-relaxed font-serif ${activeTabId === exp.id ? "text-white/80" : "text-white/60"}`}>
                      {exp.notes}
                    </p>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-0 sm:px-6 py-0 sm:py-12 w-full max-w-[90%] mx-auto min-h-screen sm:min-h-[auto]">
        
        {/* Browser-style Notepad */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex-1 sm:h-[80vh] bg-black/40 backdrop-blur-xl sm:border border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] sm:rounded-xl overflow-hidden flex flex-col sm:shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]"
        >
          {/* Browser Tabs Bar */}
          <div className="flex items-end bg-black/20 border-b border-white/5 overflow-x-auto custom-scrollbar no-scrollbar-buttons pt-2">
            
            {/* Window Controls (Mac style) */}
            <div className="hidden sm:flex items-center gap-2 px-4 pb-3 shrink-0">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-black/10"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-black/10"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-black/10"></div>
            </div>

            {/* Tabs */}
            <div className="flex items-end flex-1 gap-1 px-2 sm:px-0">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`group flex items-center gap-2 min-w-[140px] max-w-[220px] px-3 py-2.5 rounded-t-lg border-t border-x cursor-pointer transition-colors ${
                    activeTabId === tab.id
                      ? "bg-black/40 border-white/20 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                      : "bg-black/10 border-transparent text-white/60 hover:bg-black/30 hover:text-white/90"
                  }`}
                >
                  <div className="flex-1 truncate text-xs font-mono tracking-tight">
                    {tab.title || "Untitled experiment"}
                  </div>
                  {tab.isDirty && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#e5b36e]/70 shrink-0"></div>
                  )}
                  <button
                    onClick={(e) => closeTab(e, tab.id)}
                    className={`shrink-0 p-0.5 rounded-sm hover:bg-white/10 transition-colors ${
                      activeTabId === tab.id ? "text-white/60 hover:text-white" : "text-white/30 hover:text-white/70 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              <button
                onClick={createNewTab}
                className="p-2 mb-1.5 ml-1 text-white/40 hover:text-white hover:bg-white/10 rounded-md transition-colors shrink-0"
                title="New Tab"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {/* Sign Out (Right Side) */}
            <div className="px-4 pb-2.5 shrink-0 h-full flex items-end">
               <button
                onClick={handleSignOut}
                className="text-white/30 hover:text-[#e5b36e] transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Browser Chrome (Address Bar Area) */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 py-2 sm:py-3 bg-black/20 backdrop-blur-sm border-b border-white/10">
            
            {/* Navigation Icons (Visual Only) */}
            <div className="hidden sm:flex items-center gap-3 text-white/30 mr-2">
              <ArrowLeft className="w-4 h-4 cursor-not-allowed" />
              <ArrowRight className="w-4 h-4 cursor-not-allowed" />
              <RotateCw className="w-4 h-4 cursor-not-allowed" />
            </div>

            {/* Address Bar / Title Input */}
            <div className="flex-1 flex items-center bg-black/30 border border-white/10 rounded-md px-3 py-1.5 focus-within:border-[#e5b36e]/50 focus-within:bg-black/50 transition-all group shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.5)]">
              <Search className="w-3.5 h-3.5 text-white/40 mr-2.5 group-focus-within:text-[#e5b36e]/80" />
              <input
                type="text"
                placeholder="Untitled experiment"
                value={activeTab?.title || ""}
                onChange={(e) => updateActiveTab({ title: e.target.value })}
                className="w-full bg-transparent text-sm text-[#F0ECE4] placeholder:text-white/40 outline-none font-mono tracking-wide"
              />
            </div>
            
            {/* Date & Time */}
            <div className="flex items-center justify-between sm:justify-end gap-4 mt-1 sm:mt-0 px-1 sm:px-0 text-[11px] text-white/50 font-mono">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                <input 
                  type="date" 
                  value={activeTab?.date || ""}
                  onChange={(e) => updateActiveTab({ date: e.target.value })}
                  className="bg-transparent outline-none uppercase custom-date-input w-24 hover:text-white/70 transition-colors"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                <input 
                  type="time" 
                  value={activeTab?.time || ""}
                  onChange={(e) => updateActiveTab({ time: e.target.value })}
                  className="bg-transparent outline-none uppercase custom-time-input w-12 hover:text-white/70 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Distraction-Free Editor Area */}
          <div className="flex-1 px-6 py-8 sm:p-14 flex flex-col bg-transparent overflow-y-auto custom-scrollbar">
            <textarea
              placeholder="Record your thoughts, data, or discoveries..."
              value={activeTab?.notes || ""}
              onChange={(e) => updateActiveTab({ notes: e.target.value })}
              className="w-full flex-1 bg-transparent text-[#E8E4DC] text-base sm:text-lg leading-relaxed sm:leading-[1.8] outline-none placeholder:text-white/40 resize-none font-serif selection:bg-[#e5b36e]/30"
            />
          </div>

          {/* Footer / Save Area */}
          <div className="px-6 py-4 sm:px-14 sm:py-6 flex justify-end items-center bg-black/20 border-t border-white/10 shrink-0 gap-4">
             {activeTab?.isDirty && (
                <span className="text-[10px] font-mono text-[#e5b36e]/70 uppercase tracking-widest mr-auto flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e5b36e] animate-pulse"></span>
                  Unsaved changes
                </span>
             )}
            <button
              onClick={handleSave}
              disabled={isSubmitting || !activeTab?.title.trim() && !activeTab?.notes.trim()}
              className="group flex items-center gap-2 px-5 py-2 text-[#e5b36e] hover:text-black border border-[#e5b36e]/30 hover:border-[#e5b36e] hover:bg-[#e5b36e] rounded-md text-sm font-mono tracking-wide transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#e5b36e] disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? "Saving..." : activeTab?.isSaved ? "Update Note" : "Save Note"}</span>
              {!isSubmitting && <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />}
            </button>
          </div>
        </motion.div>

      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .no-scrollbar-buttons::-webkit-scrollbar-button {
          display: none;
        }
        
        .custom-date-input::-webkit-calendar-picker-indicator,
        .custom-time-input::-webkit-calendar-picker-indicator {
          filter: invert(1) opacity(0.3);
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .custom-date-input:hover::-webkit-calendar-picker-indicator,
        .custom-time-input:hover::-webkit-calendar-picker-indicator {
          filter: invert(1) opacity(0.8);
        }
      `}} />
    </div>
  );
}
