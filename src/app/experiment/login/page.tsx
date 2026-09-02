"use client";

import React, { useState, useEffect } from "react";
import { Mail, Lock, User, X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";

type AuthState = "login" | "signup";

export default function ExperimentLoginPage() {
  const [authState, setAuthState] = useState<AuthState>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      if (profile?.profileCompleted) {
        router.push("/experiment");
      } else {
        router.push("/experiment/setup");
      }
    }
  }, [user, profile, loading, router]);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      if (authState === "signup") {
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          setIsSubmitting(false);
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Account created! Redirecting to setup...");
        // Navigation will be handled by useEffect
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Logged in successfully");
        // Navigation will be handled by useEffect
      }
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error("Email is already registered. Please log in.");
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        toast.error("Invalid email or password.");
      } else if (error.code === 'auth/weak-password') {
        toast.error("Password is too weak. Please use at least 6 characters.");
      } else {
        toast.error("Authentication failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Signed in with Google!");
      // Navigation handled by useEffect
    } catch (error: any) {
      console.error(error);
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error("Google sign-in failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#e5b36e] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-white/50 font-mono tracking-widest uppercase">Authenticating</p>
        </div>
      </div>
    );
  }

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
          unoptimized 
        />
        {/* Dark overlay */}
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
                placeholder="Username (optional)"
                className="w-full bg-black/20 border-b border-white/20 focus:border-[#e5b36e] text-white text-sm px-10 py-3 outline-none transition-colors"
              />
            </div>
          )}

          {/* Common Fields */}
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-[#e5b36e] transition-colors" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-black/20 border-b border-white/20 focus:border-[#e5b36e] text-white text-sm px-10 py-3 outline-none transition-colors"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-[#e5b36e] transition-colors" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            disabled={isSubmitting}
            className="group relative w-full flex justify-center items-center gap-2 bg-black/40 hover:bg-[#e5b36e]/20 text-white font-medium text-sm py-3 rounded-lg border border-white/10 hover:border-[#e5b36e]/50 disabled:opacity-50 transition-all duration-300 mt-2 overflow-hidden"
          >
            <span className="relative z-10">{isSubmitting ? "Loading..." : (authState === "login" ? "Login" : "Create Account")}</span>
            {!isSubmitting && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />}
          </button>
          
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-white/30 text-xs">or</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>
          
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="group relative w-full flex justify-center items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-medium text-sm py-3 rounded-lg border border-white/10 hover:border-white/20 disabled:opacity-50 transition-all duration-300"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
