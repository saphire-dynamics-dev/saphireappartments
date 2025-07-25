"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import propertiesData from "../data/properties.json";

export default function FeaturedProperties() {
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
      className="py-12 md:py-20 bg-gray-50"
      style={{
        opacity: getScrollOpacity(),
        transition: 'opacity 0.3s ease-out'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-primary mb-4">
            Featured <span className="text-purple-secondary">Shortlets</span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto px-4">
            Experience luxury living in our premium shortlet apartments at Stargate Estate, Durumi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {propertiesData.map((property, index) => (
            <div 
              key={property.id} 
              className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ 
                transitionDelay: isVisible ? `${index * 200}ms` : '0ms' 
              }}
            >
              <div className="relative h-48 md:h-64">
                <Image
                  src={property.images[0]}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 md:top-4 md:left-4">
                  <span className="bg-purple-gradient text-white px-2 md:px-3 py-1 rounded-full text-xs font-medium shadow-md">
                    {property.type}
                  </span>
                </div>
              </div>
              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold text-purple-primary mb-2">{property.title}</h3>
                <p className="text-gray-600 text-sm mb-3 md:mb-4">{property.location}</p>
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <span className="text-xl md:text-2xl font-bold text-purple-secondary">{property.price}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3 md:mb-4">
                  <span>{property.bedrooms} bed</span>
                  <span>{property.bathrooms} bath</span>
                  <span>{property.area}</span>
                </div>
                <Link href={`/properties/${property.id}`} className="w-full bg-purple-gradient text-white py-2 px-4 rounded-lg hover:bg-purple-secondary transition-colors font-medium text-sm shadow-md block text-center">
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
