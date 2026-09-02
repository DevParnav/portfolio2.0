"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { LogOut, Save, Calendar, Clock, PenLine, LayoutGrid, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { saveExperiment, getUserExperiments, Experiment } from "@/lib/firestore";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

export default function ExperimentJournalPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [isLoadingExperiments, setIsLoadingExperiments] = useState(true);

  // Protect route and initialize date/time
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/experiment/login");
        return;
      }
      
      if (profile && !profile.profileCompleted) {
        router.push("/experiment/setup");
        return;
      }

      // Initialize date and time to current
      const now = new Date();
      setDate(now.toISOString().split('T')[0]); // YYYY-MM-DD
      setTime(now.toTimeString().split(' ')[0].substring(0, 5)); // HH:MM
      
      fetchExperiments(user.uid);
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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/experiment/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out.");
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    if (!title.trim()) {
      toast.error("Please enter a title for your experiment.");
      return;
    }
    
    if (!notes.trim()) {
      toast.error("Please enter some notes for your experiment.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await saveExperiment({
        userId: user.uid,
        title: title.trim(),
        notes: notes.trim(),
        date,
        time,
      });
      
      toast.success("Experiment saved successfully.");
      
      // Reset form
      setTitle("");
      setNotes("");
      const now = new Date();
      setDate(now.toISOString().split('T')[0]);
      setTime(now.toTimeString().split(' ')[0].substring(0, 5));
      
      // Refresh list
      await fetchExperiments(user.uid);
      
    } catch (error: any) {
      console.error("Save experiment error:", error);
      toast.error(`Failed to save experiment: ${error.message || "Please try again."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#e5b36e] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-white/50 font-mono tracking-widest uppercase">Loading Journal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col font-sans overflow-x-hidden">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0 fixed">
        <Image
          src="https://i.postimg.cc/W1PRkhCz/wallpaperflare-com-wallpaper.jpg"
          alt="Experiment Lab Background"
          fill
          priority
          className="object-cover opacity-80"
          unoptimized
        />
        <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-[4px]" />
      </div>

      {/* Standalone Header */}
      <header className="relative z-20 w-full max-w-[1400px] mx-auto px-6 py-6 md:py-8 flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-lg md:text-xl font-serif tracking-tight font-medium text-white/90">
            {profile?.fullName ? profile.fullName.split(' ')[0] : 'Parnav'}<span className="text-[#e5b36e]">.</span>
          </div>
          <div className="hidden sm:block text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/50">
            EXPERIMENT JOURNAL
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all"
        >
          <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
          Sign Out
        </button>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-4 py-8 sm:py-12 max-w-[900px] mx-auto w-full">
        
        {/* Title Area */}
        <div className="w-full mb-10">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-3">Experiment Journal</h1>
          <p className="text-white/50 text-base font-light">Record what you learned, built, tested, or discovered.</p>
        </div>

        {/* Editor Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden flex flex-col relative mb-16"
        >
          {/* Top Bar - Meta Info */}
          <div className="flex flex-col sm:flex-row border-b border-white/10 bg-black/20">
            <div className="flex-1 flex items-center gap-3 p-4 border-b sm:border-b-0 sm:border-r border-white/10">
              <Calendar className="w-4 h-4 text-white/40" />
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent text-sm text-white/80 outline-none w-full uppercase font-mono tracking-wider custom-date-input"
              />
            </div>
            <div className="flex-1 flex items-center gap-3 p-4">
              <Clock className="w-4 h-4 text-white/40" />
              <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-transparent text-sm text-white/80 outline-none w-full uppercase font-mono tracking-wider custom-time-input"
              />
            </div>
          </div>

          {/* Title Input */}
          <div className="p-6 sm:p-8 border-b border-white/5">
            <input
              type="text"
              placeholder="What did you work on today?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-2xl sm:text-3xl font-serif text-white outline-none placeholder:text-white/20 transition-colors"
            />
          </div>

          {/* Notes Area */}
          <div className="p-6 sm:p-8 flex-1 min-h-[300px] flex flex-col group relative">
            <PenLine className="absolute top-8 right-8 w-5 h-5 text-white/10 group-focus-within:text-[#e5b36e]/30 transition-colors pointer-events-none" />
            <textarea
              placeholder="Write your experiment notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full flex-1 bg-transparent text-white/80 text-base leading-relaxed outline-none placeholder:text-white/20 resize-none custom-scrollbar"
            />
          </div>

          {/* Action Bar */}
          <div className="p-4 sm:p-6 border-t border-white/10 bg-black/20 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="group relative overflow-hidden flex items-center gap-2 px-8 py-3.5 bg-[#e5b36e]/90 hover:bg-[#e5b36e] text-black disabled:opacity-50 rounded-xl font-medium text-sm transition-all"
            >
              <span className="relative z-10">{isSubmitting ? "Saving..." : "Save Experiment"}</span>
              {!isSubmitting && <Save className="w-4 h-4 relative z-10" />}
              {!isSubmitting && <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />}
            </button>
          </div>
        </motion.div>

        {/* Recent Experiments Section */}
        <div className="w-full flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <LayoutGrid className="w-5 h-5 text-[#e5b36e]" />
            <h2 className="font-serif text-2xl font-bold text-white">Recent Experiments</h2>
          </div>
          
          {isLoadingExperiments ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : experiments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white/[0.02] border border-white/5 rounded-2xl text-center border-dashed">
              <FileText className="w-10 h-10 text-white/20 mb-4" />
              <p className="text-white/50 text-sm">No experiments recorded yet.</p>
              <p className="text-white/30 text-xs mt-1">Your saved experiments will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experiments.map((exp) => (
                <div key={exp.id} className="bg-white/[0.03] border border-white/10 hover:border-white/20 p-6 rounded-2xl transition-colors flex flex-col group">
                  <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-white/40 uppercase mb-3">
                    <Calendar className="w-3 h-3" /> {exp.date}
                    <span className="mx-1">•</span>
                    <Clock className="w-3 h-3" /> {exp.time}
                  </div>
                  <h3 className="text-lg font-serif text-white mb-2 line-clamp-1 group-hover:text-[#e5b36e] transition-colors">{exp.title}</h3>
                  <p className="text-white/50 text-sm line-clamp-3 leading-relaxed flex-1">
                    {exp.notes}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
      
      {/* Global styles for this page */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        /* Make date/time inputs look better in dark mode */
        .custom-date-input::-webkit-calendar-picker-indicator,
        .custom-time-input::-webkit-calendar-picker-indicator {
          filter: invert(1) opacity(0.5);
          cursor: pointer;
        }
        .custom-date-input::-webkit-calendar-picker-indicator:hover,
        .custom-time-input::-webkit-calendar-picker-indicator:hover {
          filter: invert(1) opacity(0.8);
        }
      `}} />
    </div>
  );
}
