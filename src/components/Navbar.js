"use client";

import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-purple-lighter">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        <div className="flex items-center space-x-2 md:space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 md:w-8 md:h-8 relative">
              <Image
                src="/saphireapartmentlogo.jpeg"
                alt="Saphire Apartments Logo"
                fill
                className="object-contain rounded-sm"
              />
            </div>
            <span className="text-lg md:text-xl font-semibold text-purple-primary">Saphire Apartments</span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-gray-600 text-sm">
            <a href="/" className="text-purple-primary font-medium hover:text-purple-secondary transition-colors">Home</a>
            <a href="/properties" className="hover:text-purple-primary transition-colors">Properties</a>
            <a href="/about" className="hover:text-purple-primary transition-colors">About Us</a>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <button className="text-gray-600 text-sm hover:text-purple-primary transition-colors">Contact Us</button>
          <button className="bg-purple-gradient text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-secondary transition-colors">
            Book a Call
          </button>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden flex items-center justify-center w-8 h-8 text-purple-primary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-purple-lighter">
          <div className="px-4 py-2 space-y-1">
            <a href="/" className="block py-2 text-purple-primary font-medium">Home</a>
            <a href="/properties" className="block py-2 text-gray-600 hover:text-purple-primary">Properties</a>
            <a href="/about" className="block py-2 text-gray-600 hover:text-purple-primary">About Us</a>
            <button className="block w-full text-left py-2 text-gray-600 hover:text-purple-primary">Contact Us</button>
            <button className="block w-full bg-purple-gradient text-white py-2 px-4 rounded-lg text-sm mt-2 hover:bg-purple-secondary transition-colors">
              Book a Call
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
