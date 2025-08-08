"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Separate primary nav from auth CTAs so we can style Login/Signup as buttons
  const primaryLinks = [
    { name: "Download", href: "#download" },
    { name: "Tournaments", href: "#tournaments" },
    { name: "About", href: "#about" },
    { name: "Privacy", href: "#privacy" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        isScrolled
          ? "bg-slate-900/95 backdrop-blur-sm border-b border-slate-800"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-primary-foreground font-bold text-lg">T</span>
          </div>
          <span className="text-xl font-bold text-foreground">TurfBuddie</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {primaryLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-slate-300 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}

          {/* Spacer */}
          <span className="mx-1 h-6 w-px bg-slate-800" />

          {/* Login (subtle) */}
          <Button
            asChild
            variant="ghost"
            className="text-slate-300 hover:text-white hover:bg-slate-800/50"
          >
            <Link href="/login">Log in</Link>
          </Button>

          {/* Signup (primary/glow) */}
          <Button
            asChild
            className="glow-button text-primary-foreground font-semibold shadow-md"
          >
            <Link href="/signup">Sign up</Link>
          </Button>

          {/* Optional: Primary action */}
          <Button className="bg-green-500 hover:bg-green-600 text-white">
            Book Now
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-slate-300 hover:text-white transition-colors"
          onClick={() => setIsMobileMenuOpen((s) => !s)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div
        id="mobile-nav"
        className={`md:hidden bg-slate-900/95 backdrop-blur-sm border-t border-slate-800 overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="flex flex-col space-y-4 px-4 py-4">
          {/* Primary links */}
          {primaryLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-slate-300 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {/* Auth CTAs */}
          <div className="pt-2 grid grid-cols-2 gap-3">
            <Button
              asChild
              variant="outline"
              className="border-slate-700 text-slate-200 hover:bg-slate-800/70"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Link href="/login">Log in</Link>
            </Button>
            <Button
              asChild
              className="glow-button text-primary-foreground font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>

          {/* Primary action */}
          <Button
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Book Now
          </Button>
        </div>
      </div>
    </header>
  );
}
