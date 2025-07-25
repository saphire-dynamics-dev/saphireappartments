"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function About() {
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});

  const stats = [
    { number: "500+", label: "Properties Sold" },
    { number: "8+", label: "Years Experience" },
    { number: "95%", label: "Client Satisfaction" },
    { number: "15+", label: "Cities Covered" }
  ];

  // Intersection Observer for animations
  useEffect(() => {
    const observers = [];
    
    Object.keys(sectionRefs.current).forEach(key => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({ ...prev, [key]: true }));
          }
        },
        { threshold: 0.1 }
      );

      if (sectionRefs.current[key]) {
        observer.observe(sectionRefs.current[key]);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  const setSectionRef = (key) => (ref) => {
    sectionRefs.current[key] = ref;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Real Estate"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-slide-in-left">
              About <span className="text-purple-light animate-text-glow">Saphire Apartments</span>
            </h1>
            <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto animate-fade-in-up animation-delay-500">
              Your trusted partner in finding the perfect home in Nigeria
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div ref={setSectionRef('story')} className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className={`text-center lg:text-left transition-all duration-1000 ${
              visibleSections.story ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-primary mb-4 md:mb-6">
                Our <span className="text-purple-secondary">Story</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Founded in 2023, Saphire Apartments began with a simple mission: to help people 
                find their perfect home in Nigeria&apos;s rapidly growing real estate market. What started 
                as a small team of passionate real estate professionals has grown into one of 
                Nigeria&apos;s most trusted property companies.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                We believe that finding a home is more than just a transaction—it&apos;s about 
                discovering a place where dreams come to life, families grow, and memories 
                are made. Our commitment to excellence and personalized service has helped 
                hundreds of families across Lagos, Abuja, and other major Nigerian cities find their ideal properties.
              </p>
              <button className="bg-purple-gradient text-white px-6 md:px-8 py-2 md:py-3 rounded-lg hover:bg-purple-secondary transition-all duration-300 shadow-md text-sm md:text-base transform hover:scale-105">
                Contact Our Team
              </button>
            </div>
            <div className={`relative h-64 md:h-96 mt-8 lg:mt-0 transition-all duration-1000 ${
              visibleSections.story ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`} style={{ transitionDelay: visibleSections.story ? '300ms' : '0ms' }}>
              <Image
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Lagos Business District"
                fill
                className="object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div ref={setSectionRef('stats')} className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`text-center transition-all duration-800 transform ${
                  visibleSections.stats 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-10 scale-95'
                }`}
                style={{ 
                  transitionDelay: visibleSections.stats ? `${index * 150}ms` : '0ms' 
                }}
              >
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-primary mb-2 animate-pulse">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm md:text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div ref={setSectionRef('mission')} className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
            visibleSections.mission ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-primary mb-4">
              Mission & <span className="text-purple-secondary">Vision</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            <div className={`text-center p-8 bg-purple-lighter rounded-2xl transition-all duration-800 transform hover:scale-105 ${
              visibleSections.mission 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-10'
            }`} style={{ transitionDelay: visibleSections.mission ? '300ms' : '0ms' }}>
              <div className="text-4xl mb-6 animate-bounce">🎯</div>
              <h3 className="text-2xl font-semibold text-purple-primary mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To provide exceptional real estate services that help Nigerians find their dream homes 
                while building lasting relationships through transparency, professionalism, and unmatched 
                customer service across all major Nigerian cities.
              </p>
            </div>
            <div className={`text-center p-8 bg-purple-lighter rounded-2xl transition-all duration-800 transform hover:scale-105 ${
              visibleSections.mission 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-10'
            }`} style={{ transitionDelay: visibleSections.mission ? '600ms' : '0ms' }}>
              <div className="text-4xl mb-6 animate-bounce" style={{ animationDelay: '0.5s' }}>🌟</div>
              <h3 className="text-2xl font-semibold text-purple-primary mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To become Nigeria&apos;s leading real estate company, recognized for innovation, integrity, 
                and excellence in property services, while contributing to the growth and development 
                of Nigeria&apos;s real estate sector.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div ref={setSectionRef('values')} className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
            visibleSections.values ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-primary mb-4">
              Our <span className="text-purple-secondary">Values</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: "🏠", title: "Excellence", description: "We strive for excellence in every aspect of our service, from property selection to client relationships across Nigeria." },
              { icon: "🤝", title: "Trust", description: "Building lasting relationships through transparency, honesty, and professional integrity in the Nigerian market." },
              { icon: "💡", title: "Innovation", description: "Embracing new technologies and approaches to provide the best real estate experience in Nigeria." }
            ].map((value, index) => (
              <div 
                key={index}
                className={`text-center p-8 bg-white rounded-2xl border-2 border-purple-lighter hover:border-purple-light transition-all duration-500 shadow-sm transform hover:scale-105 ${
                  visibleSections.values 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ 
                  transitionDelay: visibleSections.values ? `${index * 200}ms` : '0ms' 
                }}
              >
                <div className="text-4xl mb-4 animate-pulse" style={{ animationDelay: `${index * 0.5}s` }}>{value.icon}</div>
                <h3 className="text-xl font-semibold text-purple-primary mb-4">{value.title}</h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
