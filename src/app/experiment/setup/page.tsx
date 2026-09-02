"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { MapPin, User, Camera, ArrowRight, ArrowLeft, Check, LayoutGrid, LogOut, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile } from "@/lib/firestore";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

type SetupData = {
  fullName: string;
  city: string;
  country: string;
  role: string;
  experienceLevel: string;
  bio: string;
  interests: string[];
  currentFocus: string;
  goals: string[];
  profileImage: string;
};

const ROLES = ["Student", "Developer", "Designer", "Engineer", "Researcher", "Freelancer", "Other"];
const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const INTERESTS = ["Frontend", "Backend", "AI / Machine Learning", "Data Science", "DSA", "UI/UX", "DevOps", "Cybersecurity", "Other"];
const GOALS = ["Build projects", "Learn new technologies", "Prepare for interviews", "Prepare for a hackathon", "Get an internship", "Improve existing skills", "Other"];

export default function SetupPage() {
  const router = useRouter();
  const { user, profile, loading, refreshProfile } = useAuth();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<SetupData>({
    fullName: "",
    city: "",
    country: "",
    role: "",
    experienceLevel: "",
    bio: "",
    interests: [],
    currentFocus: "",
    goals: [],
    profileImage: "",
  });

  // Protect route and pre-fill data
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/experiment/login");
        return;
      }
      
      // Pre-fill from existing profile
      if (profile) {
        if (profile.profileCompleted) {
          router.push("/experiment");
          return;
        }
        setData(prev => ({
          ...prev,
          fullName: profile.fullName || prev.fullName,
          city: profile.city || prev.city,
          country: profile.country || prev.country,
          role: profile.role || prev.role,
          experienceLevel: profile.experienceLevel || prev.experienceLevel,
          bio: profile.bio || prev.bio,
          interests: profile.interests || prev.interests,
          currentFocus: profile.currentFocus || prev.currentFocus,
          goals: profile.goals || prev.goals,
          profileImage: profile.profileImage || prev.profileImage,
        }));
      } else {
        // Pre-fill from Google account if new profile
        setData(prev => ({
          ...prev,
          fullName: user.displayName || prev.fullName,
          profileImage: user.photoURL || prev.profileImage,
        }));
      }
    }
  }, [user, profile, loading, router]);

  const [photoError, setPhotoError] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPhotoError("");
    
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setPhotoError("Please select a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Image must be smaller than 5 MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setData(prev => ({ ...prev, profileImage: previewUrl }));
  };

  const removePhoto = () => {
    setData(prev => ({ ...prev, profileImage: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setPhotoError("");
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const isStep1Valid = data.fullName.trim() !== "" && data.city.trim() !== "" && data.country.trim() !== "" && data.role !== "" && data.experienceLevel !== "";
  const isStep2Valid = data.interests.length > 0;
  const isStep3Valid = data.goals.length > 0;

  const handleFinish = async () => {
    if (!isStep3Valid || !user) return;
    setIsSubmitting(true);
    try {
      const updateData = {
        ...data,
        profileCompleted: true,
      };
      if (user.email) {
        (updateData as any).email = user.email;
      }
      
      await updateUserProfile(user.uid, updateData);
      await refreshProfile();
      setStep(4);
    } catch (error: any) {
      console.error("Profile save error:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
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

  const toggleArrayItem = (field: "interests" | "goals", item: string) => {
    setData((prev) => {
      const array = prev[field];
      if (array.includes(item)) {
        return { ...prev, [field]: array.filter((i) => i !== item) };
      }
      return { ...prev, [field]: [...array, item] };
    });
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: "easeIn" } },
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#e5b36e] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-white/50 font-mono tracking-widest uppercase">Loading Profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col font-sans overflow-hidden">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://i.postimg.cc/W1PRkhCz/wallpaperflare-com-wallpaper.jpg"
          alt="Experiment Lab Background"
          fill
          priority
          className="object-cover opacity-80"
          unoptimized
        />
        <div className="absolute inset-0 bg-[#050505]/70 backdrop-blur-[4px]" />
      </div>

      {/* Standalone Header */}
      <header className="relative z-20 w-full max-w-[1400px] mx-auto px-6 py-6 md:py-8 flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-lg md:text-xl font-serif tracking-tight font-medium text-white/90">
            Parnav Yadav<span className="text-[#e5b36e]">.</span>
          </div>
          <div className="hidden sm:block text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/50">
            EXPERIMENT LAB
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
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-4 sm:py-8">
        
        <div className="w-full max-w-[700px] flex flex-col items-center">
          
          {/* Progress Indicator (Moved outside the card, styled nicely) */}
          {step < 4 && (
            <div className="w-full flex items-start justify-between sm:justify-center sm:gap-16 mb-10 px-2 sm:px-0">
              <div className="flex flex-col items-center text-center">
                <div className={`text-xl font-serif mb-1 transition-colors ${step >= 1 ? "text-[#e5b36e]" : "text-white/40"}`}>01</div>
                <div className={`text-[9px] sm:text-[10px] font-mono tracking-widest uppercase transition-colors ${step === 1 ? "text-white/90" : "text-white/40"}`}>About You</div>
              </div>
              <div className={`w-8 sm:w-16 h-[1px] mt-3 sm:mt-4 transition-colors ${step >= 2 ? "bg-[#e5b36e]/50" : "bg-white/10"}`} />
              
              <div className="flex flex-col items-center text-center">
                <div className={`text-xl font-serif mb-1 transition-colors ${step >= 2 ? "text-[#e5b36e]" : "text-white/40"}`}>02</div>
                <div className={`text-[9px] sm:text-[10px] font-mono tracking-widest uppercase transition-colors ${step === 2 ? "text-white/90" : "text-white/40"}`}>What You Build</div>
              </div>
              <div className={`w-8 sm:w-16 h-[1px] mt-3 sm:mt-4 transition-colors ${step >= 3 ? "bg-[#e5b36e]/50" : "bg-white/10"}`} />
              
              <div className="flex flex-col items-center text-center">
                <div className={`text-xl font-serif mb-1 transition-colors ${step >= 3 ? "text-[#e5b36e]" : "text-white/40"}`}>03</div>
                <div className={`text-[9px] sm:text-[10px] font-mono tracking-widest uppercase transition-colors ${step === 3 ? "text-white/90" : "text-white/40"}`}>Your Goals</div>
              </div>
            </div>
          )}

          {/* Form Card */}
          <div className="w-full bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden p-6 sm:p-10 min-h-[500px] flex flex-col relative">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: ABOUT YOU */}
              {step === 1 && (
                <motion.div key="step1" variants={cardVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col flex-1 h-full">
                  <div className="mb-8">
                    <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#e5b36e] mb-3">
                      [ EXPERIMENT LAB / PROFILE SETUP ]
                    </div>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2">Let's get to know you.</h2>
                    <p className="text-white/60 text-sm font-light">A few details to personalize your Experiment Lab.</p>
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono uppercase tracking-widest text-white/50 pl-1">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#e5b36e] transition-colors" />
                        <input
                          type="text"
                          placeholder="Your full name"
                          value={data.fullName}
                          onChange={(e) => setData({ ...data, fullName: e.target.value })}
                          className="w-full bg-black/20 border border-white/10 rounded-xl focus:border-[#e5b36e]/50 text-white text-sm px-10 py-3.5 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono uppercase tracking-widest text-white/50 pl-1">City</label>
                        <div className="relative group">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#e5b36e] transition-colors" />
                          <input
                            type="text"
                            placeholder="San Francisco"
                            value={data.city}
                            onChange={(e) => setData({ ...data, city: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl focus:border-[#e5b36e]/50 text-white text-sm px-10 py-3.5 outline-none transition-colors"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono uppercase tracking-widest text-white/50 pl-1">Country</label>
                        <input
                          type="text"
                          placeholder="United States"
                          value={data.country}
                          onChange={(e) => setData({ ...data, country: e.target.value })}
                          className="w-full bg-black/20 border border-white/10 rounded-xl focus:border-[#e5b36e]/50 text-white text-sm px-4 py-3.5 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono uppercase tracking-widest text-white/50 pl-1">Current Role</label>
                      <div className="flex flex-wrap gap-2">
                        {ROLES.map((role) => (
                          <button
                            key={role}
                            onClick={() => setData({ ...data, role })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${data.role === role ? "bg-[#e5b36e]/10 border-[#e5b36e] text-[#e5b36e]" : "bg-black/30 text-white/50 border-white/5 hover:border-white/20 hover:text-white"}`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono uppercase tracking-widest text-white/50 pl-1">Experience Level</label>
                      <div className="flex flex-wrap gap-2">
                        {EXPERIENCE_LEVELS.map((level) => (
                          <button
                            key={level}
                            onClick={() => setData({ ...data, experienceLevel: level })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${data.experienceLevel === level ? "bg-[#e5b36e]/10 border-[#e5b36e] text-[#e5b36e]" : "bg-black/30 text-white/50 border-white/5 hover:border-white/20 hover:text-white"}`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 mb-4">
                      <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/50 pl-1">
                        Short Bio <span className="text-[9px] text-white/30 border border-white/10 rounded px-1.5 py-0.5">Optional</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Tell us a little about yourself..."
                        value={data.bio}
                        onChange={(e) => setData({ ...data, bio: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 rounded-xl focus:border-[#e5b36e]/50 text-white text-sm p-4 outline-none transition-colors resize-none custom-scrollbar"
                      />
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                    <button
                      onClick={nextStep}
                      disabled={!isStep1Valid}
                      className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:hover:bg-white/10 text-white rounded-xl font-medium text-sm transition-all border border-white/10 hover:border-white/30"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: WHAT YOU BUILD */}
              {step === 2 && (
                <motion.div key="step2" variants={cardVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col h-full">
                  <div className="mb-8">
                    <h2 className="font-serif text-3xl font-bold text-white mb-2">What are you working on?</h2>
                    <p className="text-white/60 text-sm font-light">Choose the areas you're currently learning or building in.</p>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-6">
                    
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-mono uppercase tracking-widest text-white/50 pl-1">Interests</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {INTERESTS.map((interest) => {
                          const isActive = data.interests.includes(interest);
                          return (
                            <button
                              key={interest}
                              onClick={() => toggleArrayItem("interests", interest)}
                              className={`flex items-center gap-3 p-3 rounded-xl text-sm transition-all border text-left ${isActive ? "bg-[#e5b36e]/10 border-[#e5b36e]/50 text-[#e5b36e] shadow-[0_0_15px_rgba(229,179,110,0.05)]" : "bg-black/20 border-white/5 text-white/70 hover:bg-white/5 hover:border-white/20 hover:text-white"}`}
                            >
                              <div className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${isActive ? "border-[#e5b36e] bg-[#e5b36e]" : "border-white/20"}`}>
                                {isActive && <Check className="w-2.5 h-2.5 text-black" />}
                              </div>
                              {interest}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 mb-4">
                      <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/50 pl-1">
                        Current Focus <span className="text-[9px] text-white/30 border border-white/10 rounded px-1.5 py-0.5">Optional</span>
                      </label>
                      <input
                        type="text"
                        placeholder="What are you currently building or learning?"
                        value={data.currentFocus}
                        onChange={(e) => setData({ ...data, currentFocus: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 rounded-xl focus:border-[#e5b36e]/50 text-white text-sm px-4 py-3.5 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                    <button onClick={prevStep} className="flex items-center gap-2 px-6 py-3 text-white/50 hover:text-white bg-transparent hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl transition-all text-sm font-medium">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={!isStep2Valid}
                      className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:hover:bg-white/10 text-white rounded-xl font-medium text-sm transition-all border border-white/10 hover:border-white/30"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: YOUR GOALS */}
              {step === 3 && (
                <motion.div key="step3" variants={cardVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col h-full">
                  <div className="mb-8">
                    <h2 className="font-serif text-3xl font-bold text-white mb-2">What are you working toward?</h2>
                    <p className="text-white/60 text-sm font-light">Choose what you want to accomplish.</p>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-8">
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-mono uppercase tracking-widest text-white/50 pl-1">Goals</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {GOALS.map((goal) => {
                          const isActive = data.goals.includes(goal);
                          return (
                            <button
                              key={goal}
                              onClick={() => toggleArrayItem("goals", goal)}
                              className={`flex items-center gap-3 p-3 rounded-xl text-sm transition-all border text-left ${isActive ? "bg-[#e5b36e]/10 border-[#e5b36e]/50 text-[#e5b36e] shadow-[0_0_15px_rgba(229,179,110,0.05)]" : "bg-black/20 border-white/5 text-white/70 hover:bg-white/5 hover:border-white/20 hover:text-white"}`}
                            >
                              <div className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${isActive ? "border-[#e5b36e] bg-[#e5b36e]" : "border-white/20"}`}>
                                {isActive && <Check className="w-2.5 h-2.5 text-black" />}
                              </div>
                              {goal}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-white/10 pt-6">
                      <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/50 pl-1">
                        Profile Photo <span className="text-[9px] text-white/30 border border-white/10 rounded px-1.5 py-0.5">Optional</span>
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handlePhotoSelect}
                          className="hidden"
                        />
                        {data.profileImage ? (
                          <div className="relative group">
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <button
                              onClick={removePhoto}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-fit flex items-center gap-4 p-3 rounded-xl bg-black/20 border border-white/10 hover:bg-white/5 hover:border-white/30 transition-all group"
                          >
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors border border-white/10">
                              <Camera className="w-4 h-4 text-white/50 group-hover:text-white" />
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">Add Photo</span>
                              <span className="text-[10px] text-white/40">You can add one later.</span>
                            </div>
                          </button>
                        )}
                      </div>
                      {photoError && <span className="text-xs text-red-400 mt-1">{photoError}</span>}
                    </div>

                    <div className="flex flex-col gap-3 border-t border-white/10 pt-6 mb-4 bg-white/[0.02] p-4 rounded-xl border-dashed">
                      <h4 className="text-xs font-mono uppercase tracking-widest text-white/60 mb-2">Your Profile</h4>
                      <div className="grid grid-cols-2 gap-y-3 text-sm">
                        <div className="text-white/40">Name</div>
                        <div className="text-white text-right sm:text-left">{data.fullName || "—"}</div>
                        <div className="text-white/40">Location</div>
                        <div className="text-white text-right sm:text-left">{data.city}{data.city && data.country ? ", " : ""}{data.country || "—"}</div>
                        <div className="text-white/40">Role</div>
                        <div className="text-white text-right sm:text-left">{data.role || "—"} ({data.experienceLevel})</div>
                        <div className="text-white/40">Interests</div>
                        <div className="text-white text-right sm:text-left">{data.interests.length} selected</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                    <button onClick={prevStep} className="flex items-center gap-2 px-6 py-3 text-white/50 hover:text-white bg-transparent hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl transition-all text-sm font-medium">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      onClick={handleFinish}
                      disabled={!isStep3Valid || isSubmitting}
                      className="group relative overflow-hidden flex items-center gap-2 px-6 py-3 bg-[#e5b36e]/90 hover:bg-[#e5b36e] text-black disabled:opacity-50 rounded-xl font-medium text-sm transition-all"
                    >
                      <span className="relative z-10">{isSubmitting ? "Saving..." : "Finish Setup"}</span>
                      {!isSubmitting && <ArrowRight className="w-4 h-4 relative z-10" />}
                      {!isSubmitting && <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: SUCCESS SCREEN */}
              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: "easeOut" }} className="flex flex-col items-center justify-center h-full text-center py-10">
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                    className="w-20 h-20 rounded-full bg-[#e5b36e]/10 border border-[#e5b36e]/30 flex items-center justify-center mb-8"
                  >
                    <Check className="w-10 h-10 text-[#e5b36e]" />
                  </motion.div>
                  
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
                    You're all set, {data.fullName.split(' ')[0] || "there"}.
                  </h2>
                  <p className="text-white/60 text-lg font-light mb-10">
                    Welcome to Experiment Lab.
                  </p>
                  
                  <button
                    onClick={() => router.push("/experiment")}
                    className="group relative flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#e5b36e]/50 text-white rounded-full font-mono text-xs tracking-[0.2em] uppercase transition-all duration-300"
                  >
                    Enter Experiment Lab <LayoutGrid className="w-4 h-4 text-[#e5b36e] group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 rounded-full bg-[#e5b36e]/0 group-hover:bg-[#e5b36e]/10 blur-lg transition-colors duration-500 -z-10" />
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </main>
      
      {/* Global styles for this page (scrollbar and shimmer) */}
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
      `}} />
    </div>
  );
}
