"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const navItems = ["Home", "About", "Skills", "Projects", "Contact"];

export default function Navigation() {
  const [activeItem, setActiveItem] = useState("Home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 md:px-24 py-8 transition-all duration-500 ${
        scrolled ? "bg-black/40 backdrop-blur-md" : "bg-transparent"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
    >
      <div className="text-xl font-serif tracking-tight font-medium text-white/90 whitespace-nowrap">
        Parnav Yadav<span className="text-[#e5b36e]">.</span>
      </div>
      
      <nav className="hidden md:flex items-center gap-8 md:mr-40 text-[13px] font-sans font-medium text-white/70">
        {navItems.map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveItem(item);
            }}
            className={`relative group hover-target transition-colors ${activeItem === item ? "text-white" : "hover:text-white"}`}
          >
            {item}
          </a>
        ))}
      </nav>
    </motion.header>
  );
}
