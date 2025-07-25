"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function CallToAction() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [sectionTop, setSectionTop] = useState(0);
  const [sectionHeight, setSectionHeight] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
      // Get section position and height
      const rect = sectionRef.current.getBoundingClientRect();
      setSectionTop(rect.top + window.scrollY);
      setSectionHeight(rect.height);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Scroll effect for fade out animation
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate opacity based on scroll position
  const getScrollOpacity = () => {
    if (typeof window === 'undefined' || sectionTop === 0) return 1;
    
    const sectionEnd = sectionTop + sectionHeight;
    const fadeStart = sectionEnd - (sectionHeight * 0.3); // Start fading when 70% scrolled through
    const fadeEnd = sectionEnd + (window.innerHeight * 0.2); // Completely fade out shortly after section
    
    if (scrollY <= fadeStart) return 1;
    if (scrollY >= fadeEnd) return 0;
    return 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart);
  };

  return (
    <section 
      ref={sectionRef} 
      className="relative py-12 md:py-20 overflow-hidden"
      style={{
        opacity: getScrollOpacity(),
        transition: 'opacity 0.3s ease-out'
      }}
    >
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Luxury Interior"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-purple-gradient opacity-90"></div>
      </div>
      
      <div className={`relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 md:mb-6 animate-text-glow">
          Ready to Find The<br />
          Perfect Place?
        </h2>
        <p className={`text-white/90 text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
        style={{ transitionDelay: isVisible ? '300ms' : '0ms' }}>
          Let our experts guide you to the perfect property that matches your lifestyle.
        </p>
        <div className={`flex justify-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
        style={{ transitionDelay: isVisible ? '600ms' : '0ms' }}>
          <Link 
            href="/properties"
            className="bg-white text-purple-primary px-6 md:px-8 py-3 md:py-4 rounded-lg font-medium hover:bg-purple-lighter transition-all duration-300 shadow-md text-sm md:text-base transform hover:scale-105"
          >
            View All Properties
          </Link>
        </div>
      </div>
    </section>
  );
}
