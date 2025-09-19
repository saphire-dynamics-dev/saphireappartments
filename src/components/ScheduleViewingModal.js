"use client";

import { useState } from "react";
import { X, Calendar, Clock, Phone, Mail, User, MapPin } from "lucide-react";

export default function ScheduleViewingModal({ isOpen, onClose, property }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const viewingData = {
        property,
        viewingDetails: formData
      };

      const response = await fetch('/api/schedule-viewing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(viewingData),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitting(false);
        setShowSuccess(true);

        // Remove auto close - now manually closed
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          preferredDate: '',
          preferredTime: '',
          message: ''
        });
      } else {
        throw new Error(result.error || 'Failed to schedule viewing');
      }
    } catch (error) {
      console.error('Viewing scheduling error:', error);
      setIsSubmitting(false);
      alert('Failed to schedule viewing. Please try again or contact us directly.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
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
            <h3 className="text-2xl font-bold text-purple-primary mb-2">Viewing Scheduled!</h3>
            <p className="text-gray-600 mb-6">
              Your viewing request has been sent successfully. Our agent will reach out to you shortly to discuss further details about your viewing, terms of payment, and your preferences for the appointment.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">What to expect:</h4>
              <ul className="text-sm text-blue-700 text-left space-y-1">
                <li>• Discussion of viewing fee payment (₦2,000)</li>
                <li>• Confirmation of your preferred date and time</li>
                <li>• Property access and meeting location details</li>
                <li>• Answer any questions you may have about the property</li>
              </ul>
            </div>

            <button
              onClick={() => {
                setShowSuccess(false);
                onClose();
              }}
              className="w-full bg-purple-gradient text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-secondary transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          // Viewing Form
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-purple-primary">Schedule Property Viewing</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Property Summary */}
            <div className="p-6 bg-purple-lighter">
              <h3 className="font-semibold text-purple-primary mb-3">Property Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin size={16} className="text-purple-secondary" />
                  <span className="text-gray-700">{property.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-purple-secondary">📍</span>
                  <span className="text-gray-700">{property.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-purple-secondary">💰</span>
                  <span className="text-gray-700">{property.price}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-purple-light">
                  <div className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-600">👁️</span>
                      <span className="text-yellow-800 font-medium">Viewing Fee:</span>
                    </div>
                    <span className="text-yellow-800 font-bold">₦2,000</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    *Viewing fee is refundable if you proceed with booking
                  </p>
                </div>
              </div>
            </div>

            {/* Schedule Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <h3 className="font-semibold text-purple-primary mb-4">Your Information</h3>
              
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

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date *
                  </label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-3 border text-gray-700 border-gray-200 rounded-lg focus:border-purple-primary focus:outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time *
                  </label>
                  <div className="relative">
                    <Clock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border text-gray-700 border-gray-200 rounded-lg focus:border-purple-primary focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="">Select Time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                      <option value="17:00">5:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Message (Optional)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border text-gray-700 border-gray-200 rounded-lg focus:border-purple-primary focus:outline-none resize-none"
                  placeholder="Any specific requirements or questions about the viewing..."
                />
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
                    I understand that a viewing fee of ₦2,000 applies and agree to the{" "}
                    <a href="#" className="text-purple-primary hover:underline">
                      Terms of Service
                    </a>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-gradient text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-secondary transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Scheduling...</span>
                  </div>
                ) : (
                  'Schedule Viewing'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                By scheduling a viewing, an agent will contact you to confirm the appointment details.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
