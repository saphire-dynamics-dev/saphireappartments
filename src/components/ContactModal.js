'use client';

import { useState } from 'react';
import { X, Phone, Mail, MessageCircle, MapPin, Clock, Copy, Check } from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState({
    phone: false,
    email: false,
    whatsapp: false
  });

  const contactInfo = {
    phone: '+234 806 644 6777',
    email: 'saphireapartments2@gmail.com',
    whatsapp: '+2348066446777',
    address: 'Abuja, Nigeria',
    hours: 'Mon - Sun: 8:00 AM - 10:00 PM'
  };

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(prev => ({ ...prev, [field]: true }));
      setTimeout(() => {
        setCopied(prev => ({ ...prev, [field]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getEmailSubject = () => {
    return encodeURIComponent('Inquiry about Saphire Apartments');
  };

  const getEmailBody = () => {
    return encodeURIComponent(`Hello Saphire Apartments Team,

I hope this email finds you well. I am interested in learning more about your services and would like to get in touch.

[Please describe your inquiry here]

Best regards,
[Your Name]
[Your Phone Number]`);
  };

  const getWhatsAppMessage = () => {
    return encodeURIComponent(`Hello! I'm interested in Saphire Apartments and would like to know more about your properties and services. Thank you!`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl transform transition-all">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <MessageCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Contact Us
              </h2>
              <p className="text-sm text-gray-500">Get in touch with our team</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Phone */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Call Us</p>
                  <p className="text-sm text-gray-600">{contactInfo.phone}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => copyToClipboard(contactInfo.phone, 'phone')}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copy phone number"
                >
                  {copied.phone ? (
                    <Check size={16} className="text-green-600" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Call Now
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email Us</p>
                  <p className="text-sm text-gray-600">{contactInfo.email}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => copyToClipboard(contactInfo.email, 'email')}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copy email address"
                >
                  {copied.email ? (
                    <Check size={16} className="text-green-600" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
                <a
                  href={`mailto:${contactInfo.email}?subject=${getEmailSubject()}&body=${getEmailBody()}`}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Send Email
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">WhatsApp</p>
                  <p className="text-sm text-gray-600">Quick chat support</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => copyToClipboard(contactInfo.whatsapp, 'whatsapp')}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copy WhatsApp number"
                >
                  {copied.whatsapp ? (
                    <Check size={16} className="text-green-600" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
                <a
                  href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}?text=${getWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Chat Now
                </a>
              </div>
            </div>

            {/* Address & Hours */}
            <div className="grid grid-cols-1 gap-4 mt-6">
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <MapPin className="h-5 w-5 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">{contactInfo.address}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <Clock className="h-5 w-5 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Business Hours</p>
                  <p className="text-sm text-gray-600">{contactInfo.hours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-1">Need immediate assistance?</h3>
              <p className="text-sm text-gray-600 mb-3">
                Our team is available to help you find the perfect accommodation
              </p>
              <div className="flex gap-2 justify-center">
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="bg-purple-primary text-white px-4 py-2 rounded-lg hover:bg-purple-secondary transition-colors text-sm font-medium flex items-center space-x-2"
                >
                  <Phone size={16} />
                  <span>Call Now</span>
                </a>
                <a
                  href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}?text=${getWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center space-x-2"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
