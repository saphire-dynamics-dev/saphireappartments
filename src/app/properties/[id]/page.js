"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import ImageGalleryModal from "../../../components/ImageGalleryModal";
import BookingModal from "../../../components/BookingModal";
import ScheduleViewingModal from "../../../components/ScheduleViewingModal";
import DateRangePicker from "../../../components/DateRangePicker";
import TenantMaintenanceRequestModal from "../../../components/TenantMaintenanceRequestModal";
import { ArrowLeft, Phone, Mail, MessageCircle, MapPin, Users, Bath, Home, ChevronDown, Minus, Plus, Calendar, Wrench } from "lucide-react";

export default function PropertyDetails({ params }) {
  const [guestsDropdownOpen, setGuestsDropdownOpen] = useState(false);
  const [guests, setGuests] = useState(1);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [viewingModalOpen, setViewingModalOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [loadingDates, setLoadingDates] = useState(false);
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const sectionRefs = useRef({});

  // Properly unwrap params using React.use()
  const unwrappedParams = use(params);
  const apartmentId = unwrappedParams.id;

  // Fetch apartment from API
  useEffect(() => {
    const fetchApartment = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/apartments/${apartmentId}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch apartment');
        }

        setApartment(data.data);
      } catch (err) {
        console.error('Error fetching apartment:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (apartmentId) {
      fetchApartment();
    }
  }, [apartmentId]);

  // Fetch unavailable dates when apartment is loaded
  useEffect(() => {
    const fetchUnavailableDates = async () => {
      if (!apartmentId) return;

      try {
        setLoadingDates(true);
        const response = await fetch(`/api/apartments/${apartmentId}/bookings`);
        const data = await response.json();

        if (data.success) {
          setUnavailableDates(data.data);
        } else {
          console.error('Error fetching unavailable dates:', data.error);
        }
      } catch (error) {
        console.error('Error fetching unavailable dates:', error);
      } finally {
        setLoadingDates(false);
      }
    };

    fetchUnavailableDates();
  }, [apartmentId]);

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
  }, [apartment]);

  const setSectionRef = (key) => (ref) => {
    sectionRefs.current[key] = ref;
  };

  const handleGuestChange = (increment) => {
    if (increment && guests < 2) {
      setGuests(guests + 1);
    } else if (!increment && guests > 1) {
      setGuests(guests - 1);
    }
  };

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setModalOpen(true);
  };

  const handleBookNow = () => {
    if (!checkInDate || !checkOutDate) {
      alert('Please select check-in and check-out dates');
      return;
    }
    
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      alert('Check-out date must be after check-in date');
      return;
    }

    setBookingModalOpen(true);
  };

  const handleDateChange = (startDate, endDate) => {
    setCheckInDate(startDate || '');
    setCheckOutDate(endDate || '');
    
    // Close date picker if both dates are selected
    if (startDate && endDate) {
      setShowDatePicker(false);
    }
  };

  const handleMaintenanceSuccess = (maintenanceRequest) => {
    console.log('Maintenance request submitted:', maintenanceRequest);
    // You can add additional success handling here if needed
  };

  // Loading component
  const LoadingDisplay = () => (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-32 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-64 md:h-96 bg-gray-300 rounded-2xl mb-4"></div>
                <div className="flex space-x-3 mb-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 w-28 bg-gray-300 rounded-lg"></div>
                  ))}
                </div>
                <div className="bg-white rounded-2xl p-6 md:p-8">
                  <div className="h-8 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2 w-2/3"></div>
                  <div className="h-6 bg-gray-300 rounded mb-8 w-1/3"></div>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 bg-gray-300 rounded-lg"></div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6">
                  <div className="h-6 bg-gray-300 rounded mb-6"></div>
                  <div className="space-y-4 mb-6">
                    <div className="h-12 bg-gray-300 rounded"></div>
                    <div className="h-12 bg-gray-300 rounded"></div>
                    <div className="h-12 bg-gray-300 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-10 bg-gray-300 rounded"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  // Error component
  const ErrorDisplay = () => (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <Link href="/properties" className="inline-flex items-center space-x-2 text-purple-primary hover:text-purple-secondary transition-colors mb-6">
            <ArrowLeft size={20} />
            <span>Back to Properties</span>
          </Link>
          <div className="text-center py-20">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-red-600 mb-6">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">Property Not Found</h3>
                <p className="text-sm">{error}</p>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => window.location.reload()} 
                  className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-300 font-medium"
                >
                  Try Again
                </button>
                <Link 
                  href="/properties"
                  className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-medium text-center"
                >
                  Browse All Properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  // Show loading state
  if (loading) {
    return <LoadingDisplay />;
  }

  // Show error state
  if (error || !apartment) {
    return <ErrorDisplay />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="animate-fade-in-up">
            <Link href="/properties" className="inline-flex items-center space-x-2 text-purple-primary hover:text-purple-secondary transition-colors mb-6">
              <ArrowLeft size={20} />
              <span>Back to Properties</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              {apartment.images && apartment.images.length > 0 && (
                <div ref={setSectionRef('gallery')} className={`mb-8 transition-all duration-1000 ${
                  visibleSections.gallery ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                  {/* Main Image */}
                  <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-4 cursor-pointer transform hover:scale-105 transition-transform duration-300" onClick={() => openModal(0)}>
                    <Image
                      src={apartment.images[0] || '/placeholder-apartment.jpg'}
                      alt={apartment.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-purple-gradient text-white px-3 py-1 rounded-full text-sm font-medium shadow-md animate-pulse">
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
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Horizontal Scrolling Thumbnails */}
                  {apartment.images.length > 1 && (
                    <div className="relative">
                      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                        {apartment.images.map((image, index) => (
                          <div 
                            key={index} 
                            className="relative h-20 w-28 md:h-24 md:w-32 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer border-2 border-transparent hover:border-purple-primary transition-all duration-300 transform hover:scale-105"
                            onClick={() => openModal(index)}
                          >
                            <Image
                              src={image}
                              alt={`${apartment.title} ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300"></div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Scroll indicator for mobile */}
                      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none md:hidden"></div>
                    </div>
                  )}

                  {/* View All Photos Button */}
                  <div className="mt-4 text-center">
                    <button 
                      onClick={() => openModal(0)}
                      className="inline-flex items-center px-4 py-2 border border-purple-primary rounded-lg text-purple-primary bg-white hover:bg-purple-primary hover:text-white transition-all duration-300 text-sm font-medium transform hover:scale-105"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      View all {apartment.images.length} photos
                    </button>
                  </div>
                </div>
              )}

              {/* Property Info */}
              <div ref={setSectionRef('info')} className={`bg-white rounded-2xl p-6 md:p-8 shadow-lg mb-8 transition-all duration-1000 ${
                visibleSections.info ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-purple-primary mb-2">{apartment.title}</h1>
                    <div className="flex items-center space-x-2 text-gray-600 mb-4">
                      <MapPin size={18} />
                      <span>{apartment.location}</span>
                    </div>
                    <div className="text-3xl font-bold text-purple-secondary">{apartment.price}</div>
                  </div>
                </div>

                {/* Property Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: Users, value: apartment.bedrooms, label: 'Bedrooms' },
                    { icon: Bath, value: apartment.bathrooms, label: 'Bathrooms' },
                    { icon: Home, value: apartment.area, label: 'Area' }
                  ].map((stat, index) => (
                    <div 
                      key={index}
                      className={`text-center p-4 bg-purple-lighter rounded-lg hover:bg-purple-light hover:scale-105 transition-all duration-300 ${
                        visibleSections.info ? 'animate-fade-in-up' : ''
                      }`}
                      style={{ animationDelay: visibleSections.info ? `${index * 150}ms` : '0ms' }}
                    >
                      <stat.icon className="mx-auto mb-2 text-purple-primary" size={24} />
                      <div className="text-lg font-semibold text-purple-primary">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <div className={`mb-8 transition-all duration-800 ${
                  visibleSections.info ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'
                }`} style={{ transitionDelay: visibleSections.info ? '300ms' : '0ms' }}>
                  <h2 className="text-xl font-semibold text-purple-primary mb-4">Description</h2>
                  <p className="text-gray-600 leading-relaxed">{apartment.description}</p>
                </div>

                {/* Features */}
                {apartment.features && apartment.features.length > 0 && (
                  <div className={`mb-8 transition-all duration-800 ${
                    visibleSections.info ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'
                  }`} style={{ transitionDelay: visibleSections.info ? '500ms' : '0ms' }}>
                    <h2 className="text-xl font-semibold text-purple-primary mb-4">Features & Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {apartment.features.map((feature, index) => (
                        <div 
                          key={index} 
                          className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-purple-lighter hover:scale-105 transition-all duration-300"
                          style={{ transitionDelay: `${index * 50}ms` }}
                        >
                          <div className="w-2 h-2 bg-purple-primary rounded-full animate-pulse"></div>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Estate Amenities */}
                {apartment.amenities && apartment.amenities.length > 0 && (
                  <div className={`mb-8 transition-all duration-800 ${
                    visibleSections.info ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                  }`} style={{ transitionDelay: visibleSections.info ? '700ms' : '0ms' }}>
                    <h2 className="text-xl font-semibold text-purple-primary mb-4">Estate Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {apartment.amenities.map((amenity, index) => (
                        <div 
                          key={index} 
                          className="text-center p-3 bg-purple-lighter rounded-lg hover:bg-purple-light hover:text-white hover:scale-105 transition-all duration-300"
                          style={{ transitionDelay: `${index * 100}ms` }}
                        >
                          <span className="text-sm text-purple-primary font-medium">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* House Rules */}
                {apartment.rules && apartment.rules.length > 0 && (
                  <div className={`transition-all duration-800 ${
                    visibleSections.info ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                  }`} style={{ transitionDelay: visibleSections.info ? '900ms' : '0ms' }}>
                    <h2 className="text-xl font-semibold text-purple-primary mb-4">House Rules</h2>
                    <div className="space-y-2">
                      {apartment.rules.map((rule, index) => (
                        <div 
                          key={index} 
                          className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded transition-colors duration-300"
                          style={{ transitionDelay: `${index * 100}ms` }}
                        >
                          <div className="w-2 h-2 bg-purple-secondary rounded-full mt-2 animate-pulse"></div>
                          <span className="text-gray-600">{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div ref={setSectionRef('sidebar')} className={`bg-white rounded-2xl p-6 shadow-lg sticky top-24 transition-all duration-1000 ${
                visibleSections.sidebar ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}>
                <h3 className="text-xl font-semibold text-purple-primary mb-6">Book This Property</h3>
                
                <div className="space-y-4 mb-6">
                  {/* Custom Date Range Picker */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Dates</label>
                    <button
                      type="button"
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:border-purple-primary focus:outline-none flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <Calendar size={18} className="text-gray-400" />
                        <span className="text-gray-700">
                          {checkInDate && checkOutDate 
                            ? `${new Date(checkInDate).toLocaleDateString()} - ${new Date(checkOutDate).toLocaleDateString()}`
                            : checkInDate 
                            ? `${new Date(checkInDate).toLocaleDateString()} - Select end date`
                            : 'Select check-in and check-out dates'
                          }
                        </span>
                      </div>
                      <ChevronDown 
                        size={20} 
                        className={`text-gray-400 transition-transform duration-200 ${showDatePicker ? 'rotate-180' : ''}`} 
                      />
                    </button>

                    {/* Date Picker Modal - Properly centered */}
                    {showDatePicker && (
                      <>
                        <div 
                          className="fixed inset-0 z-40 bg-black/20"
                          onClick={() => setShowDatePicker(false)}
                        />
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                          <div className="w-full max-w-4xl">
                            <DateRangePicker
                              startDate={checkInDate}
                              endDate={checkOutDate}
                              onDateChange={handleDateChange}
                              unavailableDates={unavailableDates}
                              apartmentId={apartmentId}
                              minDate={new Date()}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Loading indicator for dates */}
                    {loadingDates && (
                      <div className="mt-2 text-sm text-gray-500 flex items-center space-x-2">
                        <div className="animate-spin w-4 h-4 border-2 border-purple-primary border-t-transparent rounded-full"></div>
                        <span>Loading availability...</span>
                      </div>
                    )}

                    {/* Show unavailable dates count */}
                    {unavailableDates.length > 0 && !loadingDates && (
                      <div className="mt-2 text-xs text-gray-500">
                        {unavailableDates.length} booking period{unavailableDates.length > 1 ? 's' : ''} unavailable
                      </div>
                    )}
                  </div>
                  
                  {/* Custom Guests Dropdown */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                    <button
                      type="button"
                      onClick={() => setGuestsDropdownOpen(!guestsDropdownOpen)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:border-purple-primary focus:outline-none flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-700">
                        {guests} Guest{guests > 1 ? 's' : ''}
                      </span>
                      <ChevronDown 
                        size={20} 
                        className={`text-gray-400 transition-transform duration-200 ${guestsDropdownOpen ? 'rotate-180' : ''}`} 
                      />
                    </button>

                    {/* Custom Dropdown Content */}
                    {guestsDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">Guests</div>
                            <div className="text-sm text-gray-500">Maximum 2 guests allowed</div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button
                              type="button"
                              onClick={() => handleGuestChange(false)}
                              disabled={guests <= 1}
                              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                                guests <= 1 
                                  ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                                  : 'border-purple-primary text-purple-primary hover:bg-purple-primary hover:text-white'
                              }`}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center font-medium text-gray-900">{guests}</span>
                            <button
                              type="button"
                              onClick={() => handleGuestChange(true)}
                              disabled={guests >= 2}
                              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                                guests >= 2 
                                  ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                                  : 'border-purple-primary text-purple-primary hover:bg-purple-primary hover:text-white'
                              }`}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <button
                            type="button"
                            onClick={() => setGuestsDropdownOpen(false)}
                            className="w-full bg-purple-gradient text-white py-2 px-4 rounded-lg hover:bg-purple-secondary transition-colors text-sm font-medium"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Overlay to close dropdown when clicking outside */}
                    {guestsDropdownOpen && (
                      <div 
                        className="fixed inset-0 z-5"
                        onClick={() => setGuestsDropdownOpen(false)}
                      />
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                  <button 
                    onClick={handleBookNow}
                    // disabled={apartment.status !== 'Available'}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 shadow-md transform hover:scale-105 
                        bg-purple-gradient text-white hover:bg-purple-secondary`}
                  >
                    {apartment.status === 'Available' ? 'Book Now' : 'Book Now'}
                  </button>
                  <button 
                    onClick={() => setViewingModalOpen(true)}
                    className="w-full border-2 border-purple-primary text-purple-primary py-3 px-6 rounded-lg font-medium hover:bg-purple-primary hover:text-white transition-all duration-300 transform hover:scale-105"
                  >
                    Schedule Viewing
                  </button>
                  <div className="text-center mt-2">
                    <p className="text-xs text-gray-500 animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
                      *Viewing fee: ₦2,000 (refundable with booking)
                    </p>
                  </div>
                </div>

                {apartment.contact && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-purple-primary mb-3">Contact Information</h4>
                    <div className="space-y-3">
                      {[
                        { icon: Phone, href: `tel:${apartment.contact.phone}`, label: apartment.contact.phone },
                        { icon: Mail, href: `mailto:${apartment.contact.email}`, label: apartment.contact.email },
                        { icon: MessageCircle, href: `https://wa.me/${apartment.contact.whatsapp?.replace(/\D/g, '')}`, label: 'WhatsApp' }
                      ].filter(contact => contact.href !== 'tel:' && contact.href !== 'mailto:' && contact.href !== 'https://wa.me/').map((contact, index) => (
                        <a 
                          key={index}
                          href={contact.href} 
                          target={contact.icon === MessageCircle ? "_blank" : undefined}
                          rel={contact.icon === MessageCircle ? "noopener noreferrer" : undefined}
                          className="flex items-center space-x-3 p-3 bg-purple-lighter rounded-lg hover:bg-purple-light transition-all duration-300 transform hover:scale-105"
                          style={{ transitionDelay: `${index * 150}ms` }}
                        >
                          <contact.icon size={18} className="text-purple-primary" />
                          <span className="text-purple-primary font-medium">{contact.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Maintenance Button */}
      <button
        onClick={() => setMaintenanceModalOpen(true)}
        className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 z-40 group"
        title="Report Maintenance Issue"
      >
        <Wrench size={24} />
        <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Report Maintenance Issue
        </span>
      </button>

      {/* Modals */}
      {apartment.images && apartment.images.length > 0 && (
        <ImageGalleryModal
          images={apartment.images}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          initialIndex={selectedImageIndex}
        />
      )}

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        property={apartment}
        bookingDetails={{
          checkInDate,
          checkOutDate,
          guests
        }}
      />

      <ScheduleViewingModal
        isOpen={viewingModalOpen}
        onClose={() => setViewingModalOpen(false)}
        property={apartment}
      />

      <TenantMaintenanceRequestModal
        isOpen={maintenanceModalOpen}
        onClose={() => setMaintenanceModalOpen(false)}
        property={apartment}
        onSuccess={handleMaintenanceSuccess}
      />

      <Footer />
    </div>
  );
}