import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#0f0f11]/80 backdrop-blur-md border-b border-white/10 py-4' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* --- LOGO SECTION --- */}
          <a href="#" className="flex items-center gap-3 group">
            {/* The Geometric Icon */}
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-black border border-white/5 group-hover:border-[#8B2FC9]/50 transition-colors">
              {/* LEFT HALF: Solid & Darker Purple */}
              <div className="absolute left-0 top-0 w-[44%] h-full bg-[#6D23A0]"></div>
              {/* RIGHT HALF: Split vertically into two lighter parts */}
              <div className="absolute right-0 top-0 w-[44%] h-full flex flex-col justify-between">
                  <div className="h-[46%] w-full bg-[#8B2FC9]"></div> {/* Top Right */}
                  <div className="h-[46%] w-full bg-[#8B2FC9]"></div> {/* Bottom Right */}
              </div>
            </div>
            
            <span className="text-2xl font-bold tracking-tight text-white group-hover:text-white/90 transition-colors">
              K&Co.
            </span>
          </a>

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            
            <a href="#services" className="hover:text-white transition-colors relative group">
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8B2FC9] transition-all group-hover:w-full"></span>
            </a>

            {/* Added About */}
            <a href="#about" className="hover:text-white transition-colors relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8B2FC9] transition-all group-hover:w-full"></span>
            </a>

            {/* Added Pricing */}
            <a href="#pricing" className="hover:text-white transition-colors relative group">
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8B2FC9] transition-all group-hover:w-full"></span>
            </a>

            <a href="#contact" className="hover:text-white transition-colors relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8B2FC9] transition-all group-hover:w-full"></span>
            </a>
            
            {/* CTA Button */}
            <button className="px-5 py-2.5 rounded-full border border-white/20 text-white hover:bg-[#8B2FC9] hover:border-[#8B2FC9] transition-all duration-300 shadow-[0_0_15px_rgba(139,47,201,0)] hover:shadow-[0_0_20px_rgba(139,47,201,0.4)] font-semibold">
              Get 90-Day Plan
            </button>
          </div>

          {/* --- MOBILE MENU TOGGLE --- */}
          <button 
            className="md:hidden text-white hover:text-[#8B2FC9] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* --- MOBILE MENU OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0f0f11] pt-24 px-6 md:hidden animate-in slide-in-from-top-10 fade-in duration-200">
          <div className="flex flex-col gap-6 text-xl font-bold text-gray-300">
            <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#8B2FC9]">Services</a>
            {/* Added Mobile Links */}
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#8B2FC9]">About</a>
            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#8B2FC9]">Pricing</a>
            
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#8B2FC9]">Contact</a>
            
            <button className="w-full py-4 bg-[#8B2FC9] text-white rounded-xl mt-4 shadow-lg shadow-purple-900/50">
              Get 90-Day Plan
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;