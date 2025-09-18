"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FeaturedProperties() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [sectionTop, setSectionTop] = useState(0);
  const [sectionHeight, setSectionHeight] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Fetch apartments from API
  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/apartments?limit=6&status=Available');
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch apartments');
        }

        setApartments(data.data);
      } catch (err) {
        console.error('Error fetching apartments:', err);
        setError(err.message);
        // Fallback to empty array on error
        setApartments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

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

  // Check scroll position to update arrow states
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
    }
  };

  // Handle scroll navigation
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const cardWidth = 400; // Approximate card width including gap
      const scrollAmount = cardWidth;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  // Initialize scroll position check
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && apartments.length > 0) {
      checkScrollPosition();
      container.addEventListener('scroll', checkScrollPosition);
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, [apartments]);

  // Calculate opacity based on scroll position
  const getScrollOpacity = () => {
    if (typeof window === 'undefined' || sectionTop === 0) return 1;
    
    const sectionEnd = sectionTop + sectionHeight;
    const fadeStart = sectionEnd - (sectionHeight * 0.3);
    const fadeEnd = sectionEnd + (window.innerHeight * 0.2);
    
    if (scrollY <= fadeStart) return 1;
    if (scrollY >= fadeEnd) return 0;
    return 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart);
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="relative">
      <div className="flex gap-6 px-12 md:px-16">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg flex-shrink-0 w-80 md:w-96 animate-pulse">
            <div className="h-48 md:h-64 bg-gray-300"></div>
            <div className="p-4 md:p-6">
              <div className="h-6 bg-gray-300 rounded mb-3"></div>
              <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
              <div className="h-8 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-4"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Error component
  const ErrorDisplay = () => (
    <div className="text-center py-12">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-lg font-semibold">Unable to load properties</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Properties Available</h3>
        <p className="text-gray-500 text-sm">Check back later for new listings.</p>
      </div>
    </div>
  );

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
            Experience luxury living in our premium shortlet apartments across Abuja.
          </p>
        </div>

        {/* Handle different states: loading, error, empty, or success */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorDisplay />
        ) : apartments.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="relative">
            {/* Left Arrow */}
            {apartments.length > 3 && (
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2 md:p-3 shadow-lg transition-all duration-300 ${
                  canScrollLeft 
                    ? 'opacity-100 cursor-pointer hover:scale-110' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <ChevronLeft size={20} className="text-purple-primary" />
              </button>
            )}

            {/* Right Arrow */}
            {apartments.length > 3 && (
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2 md:p-3 shadow-lg transition-all duration-300 ${
                  canScrollRight 
                    ? 'opacity-100 cursor-pointer hover:scale-110' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <ChevronRight size={20} className="text-purple-primary" />
              </button>
            )}

            {/* Properties Scroll Container */}
            <div 
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide px-12 md:px-16"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {apartments.map((apartment, index) => (
                <div 
                  key={apartment._id} 
                  className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform flex-shrink-0 w-80 md:w-96 ${
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
                      src={apartment.images?.[0] || '/placeholder-apartment.jpg'}
                      alt={apartment.title}
                      fill
                      className="object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 md:top-4 md:left-4">
                      <span className="bg-purple-gradient text-white px-2 md:px-3 py-1 rounded-full text-xs font-medium shadow-md animate-pulse">
                        {apartment.type}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 md:top-4 md:right-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        apartment.status === 'Available' 
                          ? 'bg-green-100 text-green-800' 
                          : apartment.status === 'Occupied'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {apartment.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-semibold text-purple-primary mb-2 hover:text-purple-secondary transition-colors cursor-default">
                      {apartment.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 md:mb-4">{apartment.location}</p>
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <span className="text-xl md:text-2xl font-bold text-purple-secondary">
                        {apartment.price}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3 md:mb-4">
                      <span>{apartment.bedrooms} bed</span>
                      <span>{apartment.bathrooms} bath</span>
                      <span>{apartment.area}</span>
                    </div>
                    <Link 
                      href={`/properties/${apartment._id}`} 
                      className="w-full bg-purple-gradient text-white py-2 px-4 rounded-lg hover:bg-purple-secondary transition-all duration-300 font-medium text-sm shadow-md block text-center transform hover:scale-105"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll Indicator for Mobile */}
            {apartments.length > 1 && (
              <div className="md:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
            )}
          </div>
        )}

        {/* View All Properties Link - Only show if there are apartments */}
        {!loading && !error && apartments.length > 0 && (
          <div className={`text-center mt-8 md:mt-12 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`} style={{ transitionDelay: isVisible ? '800ms' : '0ms' }}>
            <Link 
              href="/properties"
              className="inline-flex items-center px-6 py-3 border-2 border-purple-primary text-purple-primary bg-white hover:bg-purple-primary hover:text-white transition-all duration-300 rounded-lg font-medium transform hover:scale-105"
            >
              View All Properties
              <ChevronRight size={18} className="ml-2" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}