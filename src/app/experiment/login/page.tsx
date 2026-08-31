"use client";

import React, { useState } from "react";
import { Mail, Lock, User, X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

type AuthState = "login" | "signup";

export default function ExperimentLoginPage() {
  const [authState, setAuthState] = useState<AuthState>("login");
  const router = useRouter();

  const handleAuthAction = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authState === "signup") {
      // Simulate successful signup and redirect to onboarding
      toast.success("Account created! Redirecting to setup...");
      router.push("/experiment/setup");
    } else {
      // Login
      toast.info("Authentication coming soon.", {
        description: "Backend integration will be implemented in the next phase.",
        icon: "🔒",
      });
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden font-sans">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://i.postimg.cc/W1PRkhCz/wallpaperflare-com-wallpaper.jpg"
          alt="Experiment Lab Background"
          fill
          priority
          className="object-cover opacity-80"
          unoptimized // Using external URL directly for now without configuring next.config domains
        />
        {/* Dark overlay to ensure text readability and mood */}
        <div className="absolute inset-0 bg-[#050505]/40 backdrop-blur-[2px]" />
      </div>

      {/* Auth Card Container */}
      <div className="relative z-10 w-full max-w-[400px] mx-4 p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
        
        {/* Close Button / Return to Portfolio */}
        <Link href="/" className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 border border-white/10 text-white/70 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </Link>

        {/* Header */}
        <div className="text-center mb-8 mt-2">
          <h1 className="font-serif text-3xl font-bold text-white tracking-wide">
            {authState === "login" ? "Login" : "Register"}
          </h1>
          <p className="text-white/60 text-xs mt-2 font-light">
            Welcome to the Experiment Lab
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleAuthAction} className="flex flex-col gap-5">
          
          {/* Sign Up Specific Fields */}
          {authState === "signup" && (
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-[#e5b36e] transition-colors" />
              <input
                type="text"
                placeholder="Username"
                className="w-full bg-black/20 border-b border-white/20 focus:border-[#e5b36e] text-white text-sm px-10 py-3 outline-none transition-colors"
                required
              />
            </div>
          )}

          {/* Common Fields */}
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-[#e5b36e] transition-colors" />
            <input
              type={authState === "login" ? "text" : "email"}
              placeholder={authState === "login" ? "Email or Username" : "Email"}
              className="w-full bg-black/20 border-b border-white/20 focus:border-[#e5b36e] text-white text-sm px-10 py-3 outline-none transition-colors"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-[#e5b36e] transition-colors" />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-black/20 border-b border-white/20 focus:border-[#e5b36e] text-white text-sm px-10 py-3 outline-none transition-colors"
              required
            />
          </div>

          {/* Confirm Password (Sign Up) */}
          {authState === "signup" && (
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-[#e5b36e] transition-colors" />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full bg-black/20 border-b border-white/20 focus:border-[#e5b36e] text-white text-sm px-10 py-3 outline-none transition-colors"
                required
              />
            </div>
          )}

          {/* Login Specific Extras */}
          {authState === "login" && (
            <div className="flex items-center justify-between text-xs text-white/60">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white/90 transition-colors">
                <input type="checkbox" className="accent-[#e5b36e]" />
                Remember me
              </label>
              <button type="button" className="hover:text-[#e5b36e] transition-colors">
                Forget Password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="group relative w-full flex justify-center items-center gap-2 bg-black/40 hover:bg-[#e5b36e]/20 text-white font-medium text-sm py-3 rounded-lg border border-white/10 hover:border-[#e5b36e]/50 transition-all duration-300 mt-2 overflow-hidden"
          >
            <span className="relative z-10">{authState === "login" ? "Login" : "Create Account"}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          </button>
        </form>

        {/* Toggle State */}
        <div className="mt-8 text-center text-xs text-white/60">
          {authState === "login" ? (
            <p>
              Don't have an account?{" "}
              <button
                onClick={() => setAuthState("signup")}
                className="text-white hover:text-[#e5b36e] font-medium transition-colors"
              >
                Register
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => setAuthState("login")}
                className="text-white hover:text-[#e5b36e] font-medium transition-colors"
              >
                Log in
              </button>
            </p>
          )}
        </div>
        
      </div>

      {/* Add a global style just for the shimmer animation on this page */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}} />
    </div>
  );
}
