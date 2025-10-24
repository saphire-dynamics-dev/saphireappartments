"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Users, Phone, Mail, User, AlertCircle, Upload, Image as ImageIcon } from "lucide-react";
import BankTransferModal from "./BankTransferModal";

export default function BookingModal({ isOpen, onClose, property, bookingDetails }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    nin: '',
    ninImage: null,
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [dateConflict, setDateConflict] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [bookingRequestId, setBookingRequestId] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [bankTransferModalOpen, setBankTransferModalOpen] = useState(false);
  const [showWhatsAppFallback, setShowWhatsAppFallback] = useState(false);
  const [whatsAppMessage, setWhatsAppMessage] = useState('');
  
  // Discount code state
  const [discountCode, setDiscountCode] = useState('');
  const [validatingDiscount, setValidatingDiscount] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountError, setDiscountError] = useState('');

  // Check if selected dates conflict with existing bookings
  const checkDateConflict = (unavailableDates) => {
    if (!bookingDetails.checkInDate || !bookingDetails.checkOutDate) {
      setDateConflict(false);
      return;
    }

    const checkIn = new Date(bookingDetails.checkInDate);
    const checkOut = new Date(bookingDetails.checkOutDate);

    const hasConflict = unavailableDates.some(range => {
      const rangeStart = new Date(range.startDate);
      const rangeEnd = new Date(range.endDate);
      
      // Check if any part of the selected range overlaps with booked range
      // Overlap occurs if: checkIn < rangeEnd AND checkOut > rangeStart
      return (checkIn < rangeEnd && checkOut > rangeStart);
    });

    setDateConflict(hasConflict);
  };

  // Fetch unavailable dates when modal opens
  useEffect(() => {
    const fetchUnavailableDates = async () => {
      if (!isOpen || !property?._id) return;

      try {
        setLoadingAvailability(true);
        const response = await fetch(`/api/apartments/${property._id}/bookings`);
        const data = await response.json();

        if (data.success) {
          setUnavailableDates(data.data);
          checkDateConflict(data.data);
        }
      } catch (error) {
        console.error('Error fetching unavailable dates:', error);
      } finally {
        setLoadingAvailability(false);
      }
    };

    fetchUnavailableDates();
  }, [isOpen, property?._id]);

  // Re-check conflicts when booking details change
  useEffect(() => {
    if (unavailableDates.length > 0) {
      checkDateConflict(unavailableDates);
    }
  }, [bookingDetails.checkInDate, bookingDetails.checkOutDate, unavailableDates]);

  // Early return after all hooks
  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('emergencyContact.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Validate file type and size
    const isValidType = file.type.startsWith('image/');
    const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
    
    if (!isValidType) {
      alert('Please select a valid image file');
      return;
    }
    if (!isValidSize) {
      alert('Image size should be less than 5MB');
      return;
    }

    setFormData(prev => ({
      ...prev,
      ninImage: file
    }));
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      ninImage: null
    }));
  };

  const calculateNights = () => {
    if (!bookingDetails.checkInDate || !bookingDetails.checkOutDate) return 0;
    const checkIn = new Date(bookingDetails.checkInDate);
    const checkOut = new Date(bookingDetails.checkOutDate);
    const diffTime = Math.abs(checkOut - checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const pricePerNight = parseInt(property.price.replace(/[^\d]/g, ''));
    return nights * pricePerNight;
  };

  const calculateFinalAmount = () => {
    const baseTotal = calculateTotal();
    if (appliedDiscount) {
      return appliedDiscount.finalAmount;
    }
    return baseTotal;
  };

  // Validate discount code
  const validateDiscountCode = async (code) => {
    if (!code || code.trim().length === 0) {
      setAppliedDiscount(null);
      setDiscountError('');
      return;
    }

    if (code.length !== 6) {
      setDiscountError('Discount code must be exactly 6 characters');
      setAppliedDiscount(null);
      return;
    }

    setValidatingDiscount(true);
    setDiscountError('');

    try {
      const response = await fetch('/api/discount-codes/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          totalAmount: calculateTotal(),
          numberOfDays: calculateNights(),
          userId: formData.email || formData.phone, // Use email or phone as user identifier
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAppliedDiscount(data.discount);
        setDiscountError('');
      } else {
        setAppliedDiscount(null);
        setDiscountError(data.message);
      }
    } catch (error) {
      console.error('Error validating discount code:', error);
      setDiscountError('Error validating discount code. Please try again.');
      setAppliedDiscount(null);
    } finally {
      setValidatingDiscount(false);
    }
  };

  // Handle discount code input change
  const handleDiscountCodeChange = (e) => {
    const value = e.target.value.toUpperCase();
    setDiscountCode(value);
    
    // Clear previous validation results
    setAppliedDiscount(null);
    setDiscountError('');
  };

  // Apply discount code
  const applyDiscountCode = () => {
    if (discountCode.trim().length === 6) {
      validateDiscountCode(discountCode.trim());
    }
  };

  // Remove discount code
  const removeDiscountCode = () => {
    setDiscountCode('');
    setAppliedDiscount(null);
    setDiscountError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent submission if there's a date conflict
    if (dateConflict) {
      alert('The selected dates are not available. Please choose different dates.');
      return;
    }

    // Verify dates one more time before submission
    if (loadingAvailability) {
      alert('Please wait while we verify date availability.');
      return;
    }

    // Validate NIN requirements
    if (!formData.nin || formData.nin.trim().length === 0) {
      alert('Please provide your NIN (National Identification Number) to proceed with booking.');
      document.querySelector('input[name="nin"]').focus();
      return;
    }

    if (formData.nin.length !== 11) {
      alert('NIN must be exactly 11 digits. Please check and enter your complete NIN.');
      document.querySelector('input[name="nin"]').focus();
      return;
    }

    if (!formData.ninImage) {
      alert('Please upload an image of your NIN document to proceed with booking.');
      document.getElementById('nin-image-upload').focus();
      return;
    }

    // Validate emergency contact
    if (!formData.emergencyContact.name || !formData.emergencyContact.phone || !formData.emergencyContact.relationship) {
      alert('Please provide complete emergency contact information to proceed with booking.');
      document.querySelector('input[name="emergencyContact.name"]').focus();
      return;
    }

    setIsSubmitting(true);

    try {
      // Final availability check using Tenant model's checkDateConflict method
      const response = await fetch(`/api/apartments/${property._id}/check-availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkInDate: bookingDetails.checkInDate,
          checkOutDate: bookingDetails.checkOutDate
        }),
      });

      const availabilityData = await response.json();

      if (!availabilityData.success) {
        setIsSubmitting(false);
        alert('Error checking availability. Please try again.');
        return;
      }

      if (!availabilityData.available) {
        setIsSubmitting(false);
        alert(`Sorry, these dates conflict with an existing booking: ${availabilityData.conflictDetails}`);
        return;
      }

      // Create booking request with FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('property', JSON.stringify(property));
      formDataToSend.append('bookingDetails', JSON.stringify(bookingDetails));
      formDataToSend.append('personalDetails', JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        nin: formData.nin
      }));
      formDataToSend.append('emergencyContact', JSON.stringify(formData.emergencyContact));

      // Append NIN image if provided
      if (formData.ninImage) {
        formDataToSend.append('ninImage', formData.ninImage);
      }

      const bookingResponse = await fetch('/api/booking', {
        method: 'POST',
        body: formDataToSend, // Send FormData instead of JSON
      });

      const bookingResult = await bookingResponse.json();

      if (!bookingResult.success) {
        throw new Error(bookingResult.error || 'Failed to create booking request');
      }

      // Initialize payment with Paystack
      const paymentResponse = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingRequestId: bookingResult.data.bookingId,
          paymentType: 'booking_payment'
        }),
      });

      const paymentResult = await paymentResponse.json();

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Failed to initialize payment');
      }

      // Redirect to Paystack payment page
      window.location.href = paymentResult.data.authorizationUrl;

    } catch (error) {
      console.error('Booking submission error:', error);
      setIsSubmitting(false);
      alert('Failed to process booking. Please try again or contact us directly.');
    }
  };

  const handleBookNow = (e) => {
    e.preventDefault();
    
    // Prevent submission if there's a date conflict
    if (dateConflict) {
      alert('The selected dates are not available. Please choose different dates.');
      return;
    }

    // Verify dates one more time before submission
    if (loadingAvailability) {
      alert('Please wait while we verify date availability.');
      return;
    }

    // Validate NIN requirements
    if (!formData.nin || formData.nin.trim().length === 0) {
      alert('Please provide your NIN (National Identification Number) to proceed with booking.');
      document.querySelector('input[name="nin"]').focus();
      return;
    }

    if (formData.nin.length !== 11) {
      alert('NIN must be exactly 11 digits. Please check and enter your complete NIN.');
      document.querySelector('input[name="nin"]').focus();
      return;
    }

    if (!formData.ninImage) {
      alert('Please upload an image of your NIN document to proceed with booking.');
      document.getElementById('nin-image-upload').focus();
      return;
    }

    // Validate emergency contact
    if (!formData.emergencyContact.name || !formData.emergencyContact.phone || !formData.emergencyContact.relationship) {
      alert('Please provide complete emergency contact information to proceed with booking.');
      document.querySelector('input[name="emergencyContact.name"]').focus();
      return;
    }

    setShowPaymentOptions(true);
  };

  const handlePayStackPayment = async () => {
    setShowPaymentOptions(false);
    setIsSubmitting(true);

    try {
      // Final availability check using Tenant model's checkDateConflict method
      const response = await fetch(`/api/apartments/${property._id}/check-availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkInDate: bookingDetails.checkInDate,
          checkOutDate: bookingDetails.checkOutDate
        }),
      });

      const availabilityData = await response.json();

      if (!availabilityData.success) {
        alert(availabilityData.error || 'Failed to verify availability');
        return;
      }

      if (!availabilityData.available) {
        alert('Sorry, the selected dates are no longer available. Please choose different dates.');
        return;
      }

      // Create booking request with FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('property', JSON.stringify(property));
      formDataToSend.append('bookingDetails', JSON.stringify(bookingDetails));
      formDataToSend.append('personalDetails', JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        nin: formData.nin
      }));
      formDataToSend.append('emergencyContact', JSON.stringify(formData.emergencyContact));
      
      // Append discount code if applied
      if (appliedDiscount) {
        formDataToSend.append('discountCode', JSON.stringify({
          code: appliedDiscount.code,
          originalAmount: appliedDiscount.originalAmount,
          discountAmount: appliedDiscount.savings,
          finalAmount: appliedDiscount.finalAmount,
          discountType: appliedDiscount.discountType,
          discountValue: appliedDiscount.discountValue
        }));
      }

      // Append NIN image if provided
      if (formData.ninImage) {
        formDataToSend.append('ninImage', formData.ninImage);
      }

      const bookingResponse = await fetch('/api/booking', {
        method: 'POST',
        body: formDataToSend, // Send FormData instead of JSON
      });

      const bookingResult = await bookingResponse.json();

      if (!bookingResult.success) {
        throw new Error(bookingResult.error || 'Failed to create booking request');
      }

      // Initialize payment with Paystack
      const paymentResponse = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingRequestId: bookingResult.data.bookingId,
          paymentType: 'booking_payment'
        }),
      });

      const paymentResult = await paymentResponse.json();

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Failed to initialize payment');
      }

      // Redirect to Paystack payment page
      window.location.href = paymentResult.data.authorizationUrl;

    } catch (error) {
      console.error('Booking submission error:', error);
      setIsSubmitting(false);
      alert('Failed to process booking. Please try again or contact us directly.');
    }
  };

  const handleBankTransferPayment = () => {
    setShowPaymentOptions(false);
    setBankTransferModalOpen(true);
  };

  const handleBankTransferConfirmed = async () => {
    setIsSubmitting(true);

    try {
      // Create booking request without payment initialization
      const formDataToSend = new FormData();
      formDataToSend.append('property', JSON.stringify(property));
      formDataToSend.append('bookingDetails', JSON.stringify(bookingDetails));
      formDataToSend.append('personalDetails', JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        nin: formData.nin
      }));
      formDataToSend.append('paymentMethod', 'bank_transfer');
      formDataToSend.append('emergencyContact', JSON.stringify(formData.emergencyContact));
      
      // Append discount code if applied
      if (appliedDiscount) {
        formDataToSend.append('discountCode', JSON.stringify({
          code: appliedDiscount.code,
          originalAmount: appliedDiscount.originalAmount,
          discountAmount: appliedDiscount.savings,
          finalAmount: appliedDiscount.finalAmount,
          discountType: appliedDiscount.discountType,
          discountValue: appliedDiscount.discountValue
        }));
      }

      // Append NIN image if provided
      if (formData.ninImage) {
        formDataToSend.append('ninImage', formData.ninImage);
      }
      console.log('Submitting booking with nin:', formData.ninImage);

      const bookingResponse = await fetch('/api/booking', {
        method: 'POST',
        body: formDataToSend,
      });

      const bookingResult = await bookingResponse.json();

      if (!bookingResult.success) {
        throw new Error(bookingResult.error || 'Failed to create booking request');
      }

      // Prepare WhatsApp message
      const message = encodeURIComponent(
        `Hi! I just made a bank transfer payment for my booking at ${property.title}. ` +
        `Booking Reference: ${bookingResult.data.bookingId}. ` +
        `Amount: ₦${calculateFinalAmount().toLocaleString()}. ` +
        `Check-in: ${new Date(bookingDetails.checkInDate).toLocaleDateString()}, ` +
        `Check-out: ${new Date(bookingDetails.checkOutDate).toLocaleDateString()}. ` +
        `Please confirm my payment and provide check-in details. Thank you!`
      );
      
      const whatsappUrl = `https://wa.me/2348066446777?text=${message}`;
      
      // Store the message for fallback
      setWhatsAppMessage(message);
      
      // Try to redirect to WhatsApp
      window.open(whatsappUrl, '_blank');
      
      // Close bank transfer modal and show fallback
      setBankTransferModalOpen(false);
      setShowWhatsAppFallback(true);
      
      // Close main modal
      // onClose();

    } catch (error) {
      console.error('Bank transfer booking error:', error);
      alert('Failed to process booking. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppFallback = () => {
    const whatsappUrl = `https://wa.me/2348066446777?text=${whatsAppMessage}`;
    window.open(whatsappUrl, '_blank');
    setShowWhatsAppFallback(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {showSuccess ? (
            // Success Message
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-purple-primary mb-2">Booking Request Sent!</h3>
              <p className="text-gray-600 mb-4">
                Your booking request has been sent successfully. An agent will contact you shortly to confirm your reservation.
              </p>
              <div className="text-sm text-gray-500">
                This window will close automatically...
              </div>
            </div>
          ) : showPaymentOptions ? (
            // Payment Options Screen
            <>
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-purple-primary">Choose Payment Method</h2>
                <button
                  onClick={() => setShowPaymentOptions(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {/* PayStack Option - Disabled with Coming Soon */}
                  <div className="relative">
                    <button
                      disabled={true}
                      className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 opacity-75 cursor-not-allowed transition-all duration-300 text-left"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-gray-200 p-3 rounded-lg">
                          <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-600">Pay with Card/Online</h3>
                          <p className="text-sm text-gray-500">Secure payment with Paystack (Instant confirmation)</p>
                        </div>
                        <div className="text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                    {/* Coming Soon Badge */}
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      Coming Soon
                    </div>
                  </div>

                  {/* Bank Transfer Option - Active */}
                  <button
                    onClick={handleBankTransferPayment}
                    disabled={isSubmitting}
                    className="w-full p-4 border border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all duration-300 text-left disabled:opacity-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">Pay with Bank Transfer</h3>
                        <p className="text-sm text-gray-600">Transfer to our account and confirm on WhatsApp</p>
                      </div>
                      <div className="text-blue-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Payment Method Notice */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">Payment Options:</p>
                      <p>Currently, we accept bank transfers. Online card payments will be available soon!</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Booking Form
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-purple-primary">Complete Your Booking</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Date Conflict Warning */}
              {(dateConflict || loadingAvailability) && (
                <div className={`p-4 mx-6 mt-6 rounded-lg border ${
                  dateConflict 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    <AlertCircle 
                      size={20} 
                      className={dateConflict ? 'text-red-600 mt-0.5' : 'text-yellow-600 mt-0.5'} 
                    />
                    <div>
                      {loadingAvailability ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-yellow-800 font-medium">Checking availability...</span>
                        </div>
                      ) : dateConflict ? (
                        <>
                          <h4 className="text-red-800 font-medium mb-1">Dates Not Available</h4>
                          <p className="text-red-700 text-sm">
                            The selected dates overlap with existing bookings. Please choose different dates from the calendar.
                          </p>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}

              {/* Booking Summary */}
              <div className="p-6 bg-purple-lighter">
                <h3 className="font-semibold text-purple-primary mb-3">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-purple-secondary" />
                    <span className={`${dateConflict ? 'text-red-600 line-through' : 'text-gray-700'}`}>
                      {formatDate(bookingDetails.checkInDate)} - {formatDate(bookingDetails.checkOutDate)}
                    </span>
                    {dateConflict && (
                      <span className="text-red-600 text-xs font-medium">(Unavailable)</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users size={16} className="text-purple-secondary" />
                    <span className="text-gray-700">{bookingDetails.guests} Guest{bookingDetails.guests > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-secondary">📍</span>
                    <span className="text-gray-700">{property.location}</span>
                  </div>
                  {calculateNights() > 0 && (
                    <div className="mt-3 pt-3 border-t border-purple-light">
                      <div className="flex justify-between">
                        <span className="text-gray-700">{property.price} x {calculateNights()} nights</span>
                        <span className="text-gray-700">₦{calculateTotal().toLocaleString()}</span>
                      </div>
                      
                      {/* Discount Information */}
                      {appliedDiscount && (
                        <>
                          <div className="flex justify-between text-green-600 mt-1">
                            <span className="text-sm">
                              Discount ({appliedDiscount.code})
                              {appliedDiscount.discountType === 'percentage' 
                                ? ` - ${appliedDiscount.discountValue}% off` 
                                : ' - Fixed discount'
                              }
                            </span>
                            <span className="text-sm">-₦{appliedDiscount.savings.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between font-semibold text-purple-primary mt-2">
                            <span>Total (After Discount)</span>
                            <span>₦{appliedDiscount.finalAmount.toLocaleString()}</span>
                          </div>
                        </>
                      )}
                      
                      {/* Original Total (when no discount) */}
                      {!appliedDiscount && (
                        <div className="flex justify-between font-semibold text-purple-primary mt-2">
                          <span>Total</span>
                          <span>₦{calculateTotal().toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Personal Details Form */}
              <form onSubmit={handleBookNow} className="p-6">
                <h3 className="font-semibold text-purple-primary mb-4">Personal Details</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border text-gray-700 border-gray-200 rounded-lg focus:border-purple-primary focus:outline-none"
                        placeholder="John"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border text-gray-700 border-gray-200 rounded-lg focus:border-purple-primary focus:outline-none"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border text-gray-700 border-gray-200 rounded-lg focus:border-purple-primary focus:outline-none"
                      placeholder="+234 801 234 5678"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border text-gray-700 border-gray-200 rounded-lg focus:border-purple-primary focus:outline-none"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIN (National Identification Number) *
                  </label>
                  <input
                    type="text"
                    name="nin"
                    value={formData.nin}
                    onChange={handleInputChange}
                    maxLength="11"
                    required
                    className={`w-full px-4 py-3 border text-gray-900 border-gray-200 rounded-lg focus:border-purple-primary focus:outline-none placeholder-gray-500 ${
                      formData.nin && formData.nin.length !== 11 ? 'border-red-300 bg-red-50' : ''
                    }`}
                    placeholder="Enter your 11-digit NIN"
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">
                      Required: Your National Identification Number for verification
                    </p>
                    <p className={`text-xs ${
                      formData.nin.length === 11 ? 'text-green-600' : 
                      formData.nin.length > 0 ? 'text-orange-600' : 'text-gray-400'
                    }`}>
                      {formData.nin.length}/11
                    </p>
                  </div>
                  {formData.nin && formData.nin.length > 0 && formData.nin.length !== 11 && (
                    <p className="text-xs text-red-600 mt-1">
                      NIN must be exactly 11 digits
                    </p>
                  )}
                </div>

                {/* NIN Image Upload Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload NIN Document *
                  </label>
                  <div className="space-y-3">
                    {/* Upload Input */}
                    <div className="relative">
                      <input
                        type="file"
                        id="nin-image-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        required
                        className="hidden"
                      />
                      <label
                        htmlFor="nin-image-upload"
                        className={`w-full flex flex-col items-center justify-center py-4 px-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                          !formData.ninImage 
                            ? 'border-gray-300 hover:border-purple-primary hover:bg-purple-50' 
                            : 'border-green-300 bg-green-50'
                        }`}
                      >
                        <Upload size={24} className={`mb-2 ${!formData.ninImage ? 'text-gray-400' : 'text-green-600'}`} />
                        <span className={`text-sm text-center ${!formData.ninImage ? 'text-gray-600' : 'text-green-700'}`}>
                          {!formData.ninImage ? 'Click to upload NIN document image' : 'NIN document uploaded successfully'}
                        </span>
                        <span className="text-gray-400 text-xs mt-1">
                          PNG, JPG, JPEG up to 5MB
                        </span>
                      </label>
                    </div>

                    {/* Image Preview */}
                    {formData.ninImage && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-green-600">
                          <ImageIcon size={16} />
                          <span>NIN document uploaded</span>
                        </div>
                        <div className="relative group w-32 h-32">
                          <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={URL.createObjectURL(formData.ninImage)}
                              alt="NIN Document"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                          <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
                            {(formData.ninImage.size / 1024 / 1024).toFixed(1)}MB
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          Clear image of your NIN document for verification
                        </div>
                      </div>
                    )}
                    
                    {!formData.ninImage && (
                      <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
                        <strong>Required:</strong> Please upload a clear image of your NIN document to proceed with booking.
                      </div>
                    )}
                  </div>
                </div>

                

                {/* Emergency Contact Section */}
                <div className="mb-6">
                  <h4 className="font-semibold text-purple-primary mb-4">Emergency Contact Information</h4>
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact Name *
                      </label>
                      <div className="relative">
                        <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="emergencyContact.name"
                          value={formData.emergencyContact.name}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border text-gray-700 border-gray-200 rounded-lg focus:border-purple-primary focus:outline-none"
                          placeholder="Full name of emergency contact"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact Phone *
                      </label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          name="emergencyContact.phone"
                          value={formData.emergencyContact.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border text-gray-700 border-gray-200 rounded-lg focus:border-purple-primary focus:outline-none"
                          placeholder="+234 801 234 5678"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relationship *
                      </label>
                      <select
                        name="emergencyContact.relationship"
                        value={formData.emergencyContact.relationship}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border text-gray-700 border-gray-200 rounded-lg focus:border-purple-primary focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="">Select relationship</option>
                        <option value="Parent">Parent</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Partner">Partner</option>
                        <option value="Child">Child</option>
                        <option value="Friend">Friend</option>
                        <option value="Colleague">Colleague</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded p-2">
                      <strong>Note:</strong> This contact will be used only in case of emergencies during your stay. Please ensure the information is accurate and that this person is aware they may be contacted if needed.
                    </div>
                  </div>
                </div>

                {/* Discount Code Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Code (Optional)
                  </label>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={discountCode}
                          onChange={handleDiscountCodeChange}
                          maxLength="6"
                          placeholder="Enter 6-digit code"
                          className={`w-full px-4 py-3 border text-gray-900 border-gray-200 rounded-lg focus:border-purple-primary focus:outline-none placeholder-gray-500 uppercase font-mono tracking-widest ${
                            appliedDiscount ? 'border-green-300 bg-green-50' : 
                            discountError ? 'border-red-300 bg-red-50' : ''
                          }`}
                        />
                        {validatingDiscount && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="w-4 h-4 border-2 border-purple-primary border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={applyDiscountCode}
                        disabled={discountCode.length !== 6 || validatingDiscount}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                          discountCode.length === 6 && !validatingDiscount
                            ? 'bg-purple-primary text-white hover:bg-purple-secondary'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {validatingDiscount ? 'Checking...' : 'Apply'}
                      </button>
                    </div>

                    {/* Discount Status */}
                    {appliedDiscount && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="text-green-800 font-medium">Code Applied: {appliedDiscount.code}</span>
                            </div>
                            <p className="text-green-700 text-sm">{appliedDiscount.description}</p>
                            <p className="text-green-600 text-sm font-medium">
                              You save ₦{appliedDiscount.savings.toLocaleString()}
                              {appliedDiscount.discountType === 'percentage' 
                                ? ` (${appliedDiscount.discountValue}% off)` 
                                : ' (Fixed discount)'
                            }
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={removeDiscountCode}
                            className="text-green-600 hover:text-green-800 p-1"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Discount Error */}
                    {discountError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <span className="text-red-700 text-sm">{discountError}</span>
                        </div>
                      </div>
                    )}

                    {/* Discount Code Info */}
                    {!appliedDiscount && !discountError && (
                      <div className="text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded p-2">
                        <strong>Info:</strong> Enter a 6-character alphanumeric discount code to get savings on your booking. Discount codes may have minimum stay requirements and usage limits.
                      </div>
                    )}
                  </div>
                </div>

                {/* Terms and Submit */}
                <div className="mb-6">
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 w-4 h-4 text-purple-primary border-gray-300 rounded focus:ring-purple-primary"
                    />
                    <span className="text-sm text-gray-600">
                      I agree to the{" "}
                      <a href="#" className="text-purple-primary hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-purple-primary hover:underline">
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || dateConflict || loadingAvailability || !formData.nin || formData.nin.length !== 11 || !formData.ninImage || !formData.emergencyContact.name || !formData.emergencyContact.phone || !formData.emergencyContact.relationship}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                    dateConflict || !formData.nin || formData.nin.length !== 11 || !formData.ninImage || !formData.emergencyContact.name || !formData.emergencyContact.phone || !formData.emergencyContact.relationship
                      ? 'bg-gray-400 text-gray-600' 
                      : 'bg-purple-gradient text-white hover:bg-purple-secondary'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : loadingAvailability ? (
                    'Checking Availability...'
                  ) : dateConflict ? (
                    'Dates Not Available'
                  ) : !formData.nin || formData.nin.length !== 11 ? (
                    'Please Complete NIN Details'
                  ) : !formData.ninImage ? (
                    'Please Upload NIN Document'
                  ) : !formData.emergencyContact.name || !formData.emergencyContact.phone || !formData.emergencyContact.relationship ? (
                    'Please Complete Emergency Contact'
                  ) : (
                    'Continue to Payment'
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  {dateConflict 
                    ? 'Please select different dates to continue with your booking.'
                    : !formData.nin || formData.nin.length !== 11 || !formData.ninImage || !formData.emergencyContact.name || !formData.emergencyContact.phone || !formData.emergencyContact.relationship
                    ? 'All fields including NIN details and emergency contact information are required for booking verification.'
                    : 'By clicking "Continue to Payment", you will be redirected to choose your payment method.'
                  }
                </p>
              </form>
            </>
          )}

          {/* Bank Transfer Modal */}
          <BankTransferModal
            isOpen={bankTransferModalOpen}
            onClose={() => setBankTransferModalOpen(false)}
            onPaymentConfirmed={handleBankTransferConfirmed}
            totalAmount={calculateFinalAmount()}
            propertyTitle={property.title}
            property={property}
          />

          {/* WhatsApp Fallback Modal */}
          {showWhatsAppFallback && (
            <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-purple-primary">WhatsApp Confirmation</h2>
                  <button
                    onClick={() => setShowWhatsAppFallback(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-purple-primary mb-2">Booking Request Submitted!</h3>
                    <p className="text-gray-600 mb-4">
                      Your booking request has been created successfully. We attempted to redirect you to WhatsApp to confirm your payment.
                    </p>
                  </div>

                  {/* WhatsApp Instructions */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <svg className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.507"/>
                      </svg>
                      <div className="flex-1">
                        <h4 className="font-medium text-green-800 mb-2">Next Steps:</h4>
                        <ol className="text-sm text-green-700 space-y-1">
                          <li>1. Complete your bank transfer payment</li>
                          <li>2. Message us on WhatsApp with your booking reference</li>
                          <li>3. We'll confirm your payment and send check-in details</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleWhatsAppFallback}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.507"/>
                      </svg>
                      <span>Open WhatsApp</span>
                    </button>

                    <button
                      onClick={() => setShowWhatsAppFallback(false)}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                      I'll Contact You Later
                    </button>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="text-sm text-blue-700">
                        <p className="font-medium mb-1">Alternative Contact:</p>
                        <p>If WhatsApp doesn't work, call us at +234 806 644 6777 or email saphireapartments2@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
