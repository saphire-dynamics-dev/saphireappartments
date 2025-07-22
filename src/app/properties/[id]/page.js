"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import ImageGalleryModal from "../../../components/ImageGalleryModal";
import BookingModal from "../../../components/BookingModal";
import ScheduleViewingModal from "../../../components/ScheduleViewingModal";
import { ArrowLeft, Phone, Mail, MessageCircle, MapPin, Users, Bath, Home, ChevronDown, Minus, Plus } from "lucide-react";
import propertiesData from "../../../data/properties.json";

export default function PropertyDetails({ params }) {
  const [guestsDropdownOpen, setGuestsDropdownOpen] = useState(false);
  const [guests, setGuests] = useState(1);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [viewingModalOpen, setViewingModalOpen] = useState(false);

  // Properly unwrap params using React.use()
  const unwrappedParams = use(params);
  const propertyId = parseInt(unwrappedParams.id);
  const property = propertiesData.find(p => p.id === propertyId);

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-purple-primary mb-4">Property Not Found</h1>
            <p className="text-gray-600 mb-8">The property you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Link href="/properties" className="bg-purple-gradient text-white px-6 py-3 rounded-lg hover:bg-purple-secondary transition-colors">
              Back to Properties
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <Link href="/properties" className="inline-flex items-center space-x-2 text-purple-primary hover:text-purple-secondary transition-colors mb-6">
            <ArrowLeft size={20} />
            <span>Back to Properties</span>
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="mb-8">
                {/* Main Image */}
                <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-4 cursor-pointer" onClick={() => openModal(0)}>
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-purple-gradient text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                      {property.type}
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
                {property.images.length > 1 && (
                  <div className="relative">
                    <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                      {property.images.map((image, index) => (
                        <div 
                          key={index} 
                          className="relative h-20 w-28 md:h-24 md:w-32 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer border-2 border-transparent hover:border-purple-primary transition-colors"
                          onClick={() => openModal(index)}
                        >
                          <Image
                            src={image}
                            alt={`${property.title} ${index + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
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
                    className="inline-flex items-center px-4 py-2 border border-purple-primary rounded-lg text-purple-primary bg-white hover:bg-purple-primary hover:text-white transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    View all {property.images.length} photos
                  </button>
                </div>
              </div>

              {/* Property Info */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg mb-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-purple-primary mb-2">{property.title}</h1>
                    <div className="flex items-center space-x-2 text-gray-600 mb-4">
                      <MapPin size={18} />
                      <span>{property.location}</span>
                    </div>
                    <div className="text-3xl font-bold text-purple-secondary">{property.price}</div>
                  </div>
                </div>

                {/* Property Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-purple-lighter rounded-lg">
                    <Users className="mx-auto mb-2 text-purple-primary" size={24} />
                    <div className="text-lg font-semibold text-purple-primary">{property.bedrooms}</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                  <div className="text-center p-4 bg-purple-lighter rounded-lg">
                    <Bath className="mx-auto mb-2 text-purple-primary" size={24} />
                    <div className="text-lg font-semibold text-purple-primary">{property.bathrooms}</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                  <div className="text-center p-4 bg-purple-lighter rounded-lg">
                    <Home className="mx-auto mb-2 text-purple-primary" size={24} />
                    <div className="text-lg font-semibold text-purple-primary">{property.area}</div>
                    <div className="text-sm text-gray-600">Area</div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-purple-primary mb-4">Description</h2>
                  <p className="text-gray-600 leading-relaxed">{property.description}</p>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-purple-primary mb-4">Features & Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-purple-primary rounded-full"></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Estate Amenities */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-purple-primary mb-4">Estate Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="text-center p-3 bg-purple-lighter rounded-lg">
                        <span className="text-sm text-purple-primary font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* House Rules */}
                <div>
                  <h2 className="text-xl font-semibold text-purple-primary mb-4">House Rules</h2>
                  <div className="space-y-2">
                    {property.rules.map((rule, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-purple-secondary rounded-full mt-2"></div>
                        <span className="text-gray-600">{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
                <h3 className="text-xl font-semibold text-purple-primary mb-6">Book This Property</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                    <input 
                      type="date" 
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:border-purple-primary focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                    <input 
                      type="date" 
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      min={checkInDate || new Date().toISOString().split('T')[0]}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:border-purple-primary focus:outline-none" 
                    />
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
                    className="w-full bg-purple-gradient text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-secondary transition-colors shadow-md"
                  >
                    Book Now
                  </button>
                  <button 
                    onClick={() => setViewingModalOpen(true)}
                    className="w-full border-2 border-purple-primary text-purple-primary py-3 px-6 rounded-lg font-medium hover:bg-purple-primary hover:text-white transition-colors"
                  >
                    Schedule Viewing
                  </button>
                  <div className="text-center mt-2">
                    <p className="text-xs text-gray-500">
                      *Viewing fee: ₦2,000 (refundable with booking)
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-purple-primary mb-3">Contact Information</h4>
                  <div className="space-y-3">
                    <a href={`tel:${property.contact.phone}`} className="flex items-center space-x-3 p-3 bg-purple-lighter rounded-lg hover:bg-purple-light transition-colors">
                      <Phone size={18} className="text-purple-primary" />
                      <span className="text-purple-primary font-medium">{property.contact.phone}</span>
                    </a>
                    <a href={`mailto:${property.contact.email}`} className="flex items-center space-x-3 p-3 bg-purple-lighter rounded-lg hover:bg-purple-light transition-colors">
                      <Mail size={18} className="text-purple-primary" />
                      <span className="text-purple-primary font-medium">{property.contact.email}</span>
                    </a>
                    <a href={`https://wa.me/${property.contact.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 p-3 bg-purple-lighter rounded-lg hover:bg-purple-light transition-colors">
                      <MessageCircle size={18} className="text-purple-primary" />
                      <span className="text-purple-primary font-medium">WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        images={property.images}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialIndex={selectedImageIndex}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        property={property}
        bookingDetails={{
          checkInDate,
          checkOutDate,
          guests
        }}
      />

      {/* Schedule Viewing Modal */}
      <ScheduleViewingModal
        isOpen={viewingModalOpen}
        onClose={() => setViewingModalOpen(false)}
        property={property}
      />

      <Footer />
    </div>
  );
}
