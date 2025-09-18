"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ScheduleViewingModal from "../../components/ScheduleViewingModal";

export default function Properties() {
  const [viewingModalOpen, setViewingModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);

  const handleScheduleViewing = (property) => {
    setSelectedProperty(property);
    setViewingModalOpen(true);
  };

  // Fetch apartments from API
  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/apartments');
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch apartments');
        }

        setApartments(data.data);
      } catch (err) {
        console.error('Error fetching apartments:', err);
        setError(err.message);
        setApartments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  // Intersection Observer for animations
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
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
          <div className="h-40 md:h-48 lg:h-56 bg-gray-300"></div>
          <div className="p-4 md:p-6">
            <div className="h-6 bg-gray-300 rounded mb-3"></div>
            <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-16 bg-gray-300 rounded mb-4"></div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="h-12 bg-gray-300 rounded"></div>
              <div className="h-12 bg-gray-300 rounded"></div>
            </div>
            <div className="h-20 bg-gray-300 rounded mb-4"></div>
            <div className="flex flex-col gap-2">
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error component
  const ErrorDisplay = () => (
    <div className="text-center py-20">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
        <div className="text-red-600 mb-6">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-xl font-semibold mb-2">Unable to load properties</h3>
          <p className="text-sm">{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-300 font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-20">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 max-w-lg mx-auto">
        <div className="text-gray-400 mb-6">
          <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">No Properties Available</h3>
        <p className="text-gray-500 mb-6">We're currently updating our listings. Please check back soon for new properties.</p>
        <Link 
          href="/"
          className="inline-flex items-center px-6 py-3 bg-purple-gradient text-white rounded-lg hover:bg-purple-secondary transition-all duration-300 font-medium transform hover:scale-105"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-96 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Apartments"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-slide-in-left">
              Premium <span className="text-purple-light animate-text-glow">Shortlets</span>
            </h1>
            <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto animate-fade-in-up animation-delay-500">
              Experience luxury living in our fully furnished apartments across Abuja
            </p>
          </div>
        </div>
      </div>

      {/* Properties Section */}
      <div ref={sectionRef} className="py-8 md:py-16">
        <div className="w-[98vw] max-w-[98vw] mx-auto px-4 md:px-6">
          {/* Properties Count Header */}
          {!loading && !error && apartments.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-purple-primary mb-2">
                Available Properties
              </h2>
              <p className="text-gray-600">
                Showing {apartments.length} propert{apartments.length === 1 ? 'y' : 'ies'}
              </p>
            </div>
          )}

          {/* Handle different states: loading, error, empty, or success */}
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorDisplay />
          ) : apartments.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {apartments.map((apartment, index) => (
                <article 
                  key={apartment._id} 
                  className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-700 transform ${
                    isVisible 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-10 scale-95'
                  }`}
                  style={{ 
                    transitionDelay: isVisible ? `${index * 150}ms` : '0ms' 
                  }}
                >
                  <div className="relative h-40 md:h-48 lg:h-56 overflow-hidden">
                    <Image
                      src={apartment.images?.[0] || '/placeholder-apartment.jpg'}
                      alt={apartment.title}
                      fill
                      className="object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-purple-gradient text-white px-3 py-1 rounded-full text-xs font-medium shadow-md animate-pulse">
                        {apartment.type}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="p-4 md:p-6">
                    <div className="flex items-start justify-between mb-3 md:mb-4">
                      <div>
                        <h2 className="text-lg md:text-xl font-bold text-purple-primary mb-1 md:mb-2 hover:text-purple-secondary transition-colors">
                          {apartment.title}
                        </h2>
                        <p className="text-gray-600 text-xs md:text-sm mb-1 md:mb-2">{apartment.location}</p>
                        <div className="text-xl md:text-2xl font-bold text-purple-secondary">{apartment.price}</div>
                      </div>
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-4 md:mb-6 text-xs md:text-sm line-clamp-3">
                      {apartment.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-4 md:mb-6">
                      <div className="text-center p-2 bg-gray-50 rounded-lg hover:bg-purple-lighter transition-colors duration-300">
                        <div className="text-sm font-semibold text-black">{apartment.bedrooms}</div>
                        <div className="text-xs text-gray-600">Bedrooms</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg hover:bg-purple-lighter transition-colors duration-300">
                        <div className="text-sm font-semibold text-black">{apartment.bathrooms}</div>
                        <div className="text-xs text-gray-600">Bathrooms</div>
                      </div>
                    </div>

                    {apartment.features && apartment.features.length > 0 && (
                      <div className="mb-4 md:mb-6">
                        <h3 className="text-sm font-semibold text-black mb-2">Key Features</h3>
                        <div className="flex flex-wrap gap-1">
                          {apartment.features.slice(0, 4).map((feature, idx) => (
                            <span 
                              key={idx} 
                              className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs hover:bg-purple-lighter hover:text-purple-primary transition-colors duration-300"
                            >
                              {feature}
                            </span>
                          ))}
                          {apartment.features.length > 4 && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs hover:bg-purple-lighter hover:text-purple-primary transition-colors duration-300">
                              +{apartment.features.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      <Link 
                        href={`/properties/${apartment._id}`} 
                        className="w-full bg-purple-gradient text-white py-2 px-4 rounded-lg hover:bg-purple-secondary transition-all duration-300 font-medium text-sm shadow-md text-center transform hover:scale-105"
                      >
                        Book Now
                      </Link>
                      <button 
                        onClick={() => handleScheduleViewing(apartment)}
                        className="w-full border-2 border-purple-primary text-purple-primary py-2 px-4 rounded-lg hover:bg-purple-primary hover:text-white transition-all duration-300 font-medium text-sm transform hover:scale-105"
                      >
                        Schedule Viewing
                      </button>
                      <p className="text-xs text-gray-500 text-center mt-1 animate-fade-in-up" style={{ animationDelay: `${index * 150 + 500}ms` }}>
                        *Viewing fee: ₦2,000 (refundable)
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Schedule Viewing Modal */}
      {selectedProperty && (
        <ScheduleViewingModal
          isOpen={viewingModalOpen}
          onClose={() => {
            setViewingModalOpen(false);
            setSelectedProperty(null);
          }}
          property={selectedProperty}
        />
      )}

      <Footer />
    </div>
  );
}