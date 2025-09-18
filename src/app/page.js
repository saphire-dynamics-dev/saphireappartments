"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar";
import FeaturedProperties from "../components/FeaturedProperties";
import WhyChooseUs from "../components/WhyChooseUs";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";


export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  
  // Background images for the carousel
  const backgroundImages = [
    "/apartmentimg1.png",
    "/apartmentimg2bed.png",
    // "/up5.jpeg",
    "/up2.jpeg"
  ];

  // Auto-carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // Initialize window height and scroll effect
  useEffect(() => {
    // Set initial window height
    setWindowHeight(window.innerHeight);

    const handleScroll = () => setScrollY(window.scrollY);
    const handleResize = () => setWindowHeight(window.innerHeight);

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Calculate opacity based on scroll position
  const getScrollOpacity = () => {
    if (typeof window === 'undefined' || windowHeight === 0) return 1;
    
    const fadeStart = 0;
    const fadeEnd = windowHeight * 0.6; // Fade out when scrolled 60% of viewport height
    if (scrollY <= fadeStart) return 1;
    if (scrollY >= fadeEnd) return 0;
    return 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart);
  };

  // Calculate transform based on scroll position
  const getScrollTransform = () => {
    if (typeof window === 'undefined' || windowHeight === 0) return 0;
    
    const transformStart = 0;
    const transformEnd = windowHeight * 0.5;
    if (scrollY <= transformStart) return 0;
    if (scrollY >= transformEnd) return 50;
    return (scrollY - transformStart) / (transformEnd - transformStart) * 50;
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? backgroundImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % backgroundImages.length
    );
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[80vh] md:h-screen overflow-hidden">
        {/* Background Images Carousel */}
        <div className="absolute inset-0">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={image}
                alt={`Modern Architecture ${index + 1}`}
                fill
                className="object-cover object-center"
                priority={index === 0}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Navigation Arrows - Hidden on mobile, visible on desktop */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-2 md:p-3 transition-all duration-300 group hidden md:block"
        >
          <ChevronLeft size={24} className="text-white group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-2 md:p-3 transition-all duration-300 group hidden md:block"
        >
          <ChevronRight size={24} className="text-white group-hover:scale-110 transition-transform" />
        </button>

        {/* Carousel Indicators - Visible on mobile and desktop */}
        <div className="absolute bottom-8 md:bottom-20 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>

        {/* Content Overlay with Scroll Animation */}
        <div 
          className="relative z-10 h-full flex items-center justify-center"
          style={{
            opacity: getScrollOpacity(),
            transform: `translateY(${getScrollTransform()}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-20 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left space-y-6 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight animate-slide-in-left">
                  Beautiful And<br />
                  <span className="text-purple-light animate-text-glow">Stunning</span> Properties in<br />
                  Nigeria
                </h1>
                <div className="w-24 h-1 bg-purple-light mx-auto lg:mx-0 animate-slide-in-right"></div>
              </div>

              {/* Right Content */}
              <div className="text-center lg:text-left space-y-8 animate-fade-in-up animation-delay-300">
                <div>
                  <p className="text-white/90 text-base md:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 animate-fade-in-up animation-delay-500">
                    With expert guidance and a deep understanding of Nigeria&apos;s real estate
                    landscape, we&apos;re here to help turn the key to a home that&apos;s perfect for you.
                  </p>
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up animation-delay-700">
                  <Link 
                    href="/properties"
                    className="bg-purple-gradient text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-secondary transition-all duration-300 transform hover:scale-105 shadow-lg text-center"
                  >
                    Explore Properties
                  </Link>
                  <Link 
                    href="/properties"
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-purple-primary transition-all duration-300 transform hover:scale-105 text-center"
                  >
                    Schedule Viewing
                  </Link>
                </div>
                
                {/* Copyright text */}
                <div className="hidden lg:block lg:mt-16">
                  <p className="text-xs text-white/60 animate-fade-in-up animation-delay-1000">
                    ©2024 SAPHIRE APARTMENTS ALL RIGHT RESERVED
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FeaturedProperties />
      <WhyChooseUs />
      <CallToAction />
      <Footer />
    </div>
  );
}
