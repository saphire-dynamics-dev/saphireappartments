"use client";

import { useState, useEffect, useRef } from "react";

export default function WhyChooseUs() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [sectionTop, setSectionTop] = useState(0);
  const [sectionHeight, setSectionHeight] = useState(0);
  const sectionRef = useRef(null);

  const features = [
    {
      title: "Expert Guidance",
      description: "Our experienced team provides personalized guidance throughout your property journey.",
      icon: "🏆"
    },
    {
      title: "Prime Locations",
      description: "Access to the most sought-after properties in Nigeria's premier destinations.",
      icon: "📍"
    },
    {
      title: "Trusted Partnership",
      description: "Building lasting relationships through transparency and professional excellence.",
      icon: "🤝"
    },
    {
      title: "Investment Value",
      description: "Properties selected for their strong potential for appreciation and returns.",
      icon: "💎"
    }
  ];

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
      className="py-12 md:py-20 bg-white"
      style={{
        opacity: getScrollOpacity(),
        transition: 'opacity 0.3s ease-out'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className={`text-center lg:text-left transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-primary mb-4 md:mb-6">
              Why Choose<br />
              <span className="text-purple-secondary">Saphire Apartments?</span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6 md:mb-8 max-w-md mx-auto lg:mx-0">
              We combine local expertise with international standards to deliver 
              exceptional real estate experiences that exceed expectations.
            </p>
            <button className="bg-purple-gradient text-white px-6 md:px-8 py-2 md:py-3 rounded-lg hover:bg-purple-secondary transition-colors shadow-md text-sm md:text-base transform hover:scale-105">
              Learn More About Us
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-8 lg:mt-0">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`p-4 md:p-6 rounded-2xl bg-purple-lighter hover:bg-purple-light hover:text-white transition-all duration-500 shadow-sm text-center sm:text-left transform hover:scale-105 ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ 
                  transitionDelay: isVisible ? `${(index + 2) * 150}ms` : '0ms' 
                }}
              >
                <div className="text-2xl md:text-3xl mb-3 md:mb-4 animate-bounce">{feature.icon}</div>
                <h3 className="text-base md:text-lg font-semibold text-purple-primary mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-xs md:text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
