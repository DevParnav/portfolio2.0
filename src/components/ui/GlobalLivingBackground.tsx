"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  vx: number;
  vy: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  life: number;
  maxLife: number;
  active: boolean;
}

interface Planet {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  color1: string;
  color2: string;
  hasRing: boolean;
  ringAngle: number;
  vx: number;
  vy: number;
}

export default function GlobalLivingBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef({ velocity: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", resize);
    resize();

    // Configuration
    const STAR_COUNT = Math.floor((width * height) / 4000); 
    const stars: Star[] = [];
    const colors = [
      "255, 255, 255",     
      "229, 179, 110",     
      "139, 92, 246",      
    ];

    // Initialize stars
    for (let i = 0; i < STAR_COUNT; i++) {
      const colorProb = Math.random();
      const color = colorProb > 0.95 ? colors[1] : colorProb > 0.9 ? colors[2] : colors[0];
      
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.2 + 0.1,
        baseAlpha: Math.random() * 0.4 + 0.1,
        alpha: 0,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1 - 0.05, 
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        color: color,
      });
    }

    // Shooting Star logic
    let shootingStar: ShootingStar = {
      x: 0, y: 0, length: 0, speed: 0, angle: 0, life: 0, maxLife: 0, active: false
    };

    const spawnShootingStar = () => {
      if (Math.random() > 0.995 && !shootingStar.active) { 
        shootingStar = {
          x: Math.random() * width,
          y: Math.random() * (height / 2),
          length: Math.random() * 120 + 60,
          speed: Math.random() * 15 + 20,
          angle: (Math.random() * 30 + 30) * (Math.PI / 180), 
          life: 0,
          maxLife: Math.random() * 40 + 30,
          active: true,
        };
      }
    };

    // Mouse Tracking for Parallax
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX - width / 2) * 0.05;
      mouseRef.current.targetY = (e.clientY - height / 2) * 0.05;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Scroll Velocity Tracking
    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const deltaY = window.scrollY - lastScrollY;
      scrollRef.current.velocity = deltaY;
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.1;
      
      // Decay scroll velocity
      scrollRef.current.velocity *= 0.95;

      // Draw Stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        
        // Movement
        star.x += star.vx;
        star.y += star.vy - (scrollRef.current.velocity * 0.02); // React to scroll
        
        // Wrap around
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        // Parallax offset
        const px = star.x - mouseRef.current.x * star.size;
        const py = star.y - mouseRef.current.y * star.size;

        // Twinkle
        star.twinklePhase += star.twinkleSpeed;
        star.alpha = star.baseAlpha + Math.sin(star.twinklePhase) * 0.3;
        if (star.alpha < 0) star.alpha = 0;

        ctx.beginPath();
        ctx.arc(px, py, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color}, ${star.alpha})`;
        ctx.fill();
      }

      // Draw Shooting Star
      spawnShootingStar();
      if (shootingStar.active) {
        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.life++;

        if (shootingStar.life > shootingStar.maxLife) {
          shootingStar.active = false;
        } else {
          const fade = 1 - (shootingStar.life / shootingStar.maxLife);
          ctx.beginPath();
          ctx.moveTo(shootingStar.x, shootingStar.y);
          ctx.lineTo(
            shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length,
            shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length
          );
          ctx.strokeStyle = `rgba(255, 255, 255, ${fade * 0.4})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // GSAP Fade In Trigger
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { opacity: 0 },
        { 
          opacity: 1, 
          scrollTrigger: {
            trigger: "main",
            start: "top -50%", 
            end: "top -100%", 
            scrub: true,
          }
        }
      );
    }

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-[5] opacity-0"
    >
      {/* Soft Nebula Gradient */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
           background: `
             radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.03) 0%, transparent 40%),
             radial-gradient(circle at 80% 70%, rgba(229, 179, 110, 0.02) 0%, transparent 50%)
           `,
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
}
