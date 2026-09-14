"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Experience", href: "/experience" },
  { name: "Certificates", href: "/#certifications" },
  { name: "Contact", href: "/#contact" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update active item based on current route
  useEffect(() => {
    if (!pathname) return;
    setIsOpen(false);
    if (pathname === "/") {
      setActiveItem("Home");
    } else if (pathname.startsWith("/about")) {
      setActiveItem("About");
    } else if (pathname.startsWith("/projects")) {
      setActiveItem("Projects");
    } else if (pathname.startsWith("/experience")) {
      setActiveItem("Experience");
    } else if (pathname.startsWith("/certificates")) {
      setActiveItem("Certificates");
    } else if (pathname.includes("contact")) {
      setActiveItem("Contact");
    }
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleNavClick = (item: NavItem) => {
    setActiveItem(item.name);
    setIsOpen(false);
    
    // Smooth scroll if anchor on current homepage
    if (item.href.startsWith("/#") && pathname === "/") {
      const id = item.href.replace("/#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Hide global navigation completely for experiment lab routes
  // MUST be placed after all hooks to prevent React hook order violations
  if (pathname && pathname.startsWith("/experiment")) {
    return null;
  }

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 md:px-10 lg:px-24 py-6 md:py-8 transition-all duration-500 ${
          scrolled || isOpen ? "bg-black/40 backdrop-blur-md" : "bg-transparent"
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      >
        <Link
          href="/"
          onClick={() => {
            setActiveItem("Home");
            setIsOpen(false);
          }}
          className="text-xl font-serif tracking-tight font-medium text-white/90 whitespace-nowrap z-[70] hover:text-white transition-colors"
        >
          Parnav Yadav<span className="text-[#e5b36e]">.</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 md:mr-10 lg:mr-24 text-[13px] font-sans font-medium text-white/70">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => handleNavClick(item)}
              className={`relative group transition-colors ${activeItem === item.name ? "text-white" : "hover:text-white"}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button 
          className="md:hidden z-[70] text-white/90 p-2 -mr-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 z-[55] bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={() => setIsOpen(false)}
          >
            <nav 
              className="flex flex-col items-center gap-8 text-2xl font-serif tracking-wide text-white/80"
              onClick={(e) => e.stopPropagation()} // Prevent close when clicking nav area
            >
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.08, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => handleNavClick(item)}
                    className={`transition-colors ${activeItem === item.name ? "text-[#e5b36e]" : "hover:text-white"}`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
