'use client';

import { useState } from 'react';
import { X, Wrench, AlertTriangle, User, Phone, Mail } from 'lucide-react';
import CustomDropdown from './CustomDropdown';

export default function TenantMaintenanceRequestModal({ isOpen, onClose, property, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    requester: {
      name: '',
      phone: '',
      email: ''
    },
    issueCategory: '',
    priority: 'Medium',
    title: '',
    description: ''
  });

  const categoryOptions = [
    { value: 'Plumbing', label: 'Plumbing (Leaks, Blockages, Water Issues)' },
    { value: 'Electrical', label: 'Electrical (Power, Lighting, Outlets)' },
    { value: 'HVAC', label: 'Air Conditioning / Heating' },
    { value: 'Appliances', label: 'Appliances (Fridge, Stove, Washer)' },
    { value: 'Cleaning', label: 'Cleaning Services' },
    { value: 'Repairs', label: 'General Repairs' },
    { value: 'Painting', label: 'Painting & Touch-ups' },
    { value: 'Pest Control', label: 'Pest Control' },
    { value: 'Security', label: 'Security (Locks, Keys, Safety)' },
    { value: 'Other', label: 'Other Issues' }
  ];

  const priorityOptions = [
    { value: 'Low', label: 'Low - Not urgent, can wait', color: 'text-green-600' },
    { value: 'Medium', label: 'Medium - Normal priority', color: 'text-yellow-600' },
    { value: 'High', label: 'High - Needs quick attention', color: 'text-orange-600' },
    { value: 'Emergency', label: 'Emergency - Immediate attention needed', color: 'text-red-600' }
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestData = {
        apartment: property._id,
        apartmentTitle: property.title,
        apartmentLocation: property.location,
        requester: {
          type: 'Tenant',
          name: formData.requester.name,
          phone: formData.requester.phone,
          email: formData.requester.email
        },
        issueCategory: formData.issueCategory,
        priority: formData.priority,
        title: formData.title,
        description: formData.description,
        // Default access details for tenant requests
        accessDetails: {
          preferredTime: 'Anytime',
          contactForAccess: true,
          specialInstructions: 'Please contact tenant before accessing the property'
        }
      };

      const response = await fetch('/api/maintenance-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (data.success) {
        onSuccess?.(data.data);
        onClose();
        resetForm();
        alert('Maintenance request submitted successfully! We will contact you soon to schedule a visit.');
      } else {
        alert(data.error || 'Failed to submit maintenance request');
      }
    } catch (error) {
      console.error('Error submitting maintenance request:', error);
      alert('Error submitting maintenance request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      requester: {
        name: '',
        phone: '',
        email: ''
      },
      issueCategory: '',
      priority: 'Medium',
      title: '',
      description: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Wrench className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Submit Maintenance Request
              </h2>
              <p className="text-sm text-gray-500">{property.title}</p>
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-purple-600" />
                Your Contact Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.requester.name}
                      onChange={(e) => handleInputChange('requester.name', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="+234 801 234 5678"
                        value={formData.requester.phone}
                        onChange={(e) => handleInputChange('requester.phone', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.requester.email}
                        onChange={(e) => handleInputChange('requester.email', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Issue Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-purple-600" />
                Issue Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Category *
                  </label>
                  <CustomDropdown
                    options={categoryOptions}
                    value={formData.issueCategory}
                    onChange={(value) => handleInputChange('issueCategory', value)}
                    placeholder="Select issue category"
                    className="text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level *
                  </label>
                  <CustomDropdown
                    options={priorityOptions.map(option => ({
                      value: option.value,
                      label: `${option.value} - ${option.label.split(' - ')[1]}`
                    }))}
                    value={formData.priority}
                    onChange={(value) => handleInputChange('priority', value)}
                    placeholder="Select priority level"
                    className="text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Title *
                  </label>
                  <input
                    type="text"
                    placeholder="Brief description of the issue (e.g., 'Leaking faucet in kitchen')"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    required
                    maxLength="200"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.title.length}/200 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    placeholder="Please provide a detailed description of the issue. Include when it started, what seems to be causing it, and any other relevant details..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    rows="4"
                    required
                    maxLength="1000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.description.length}/1000 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-blue-800 mb-1">
                    What happens next?
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• We will review your request within 24 hours</li>
                    <li>• Our team will contact you to schedule a convenient time</li>
                    <li>• A qualified technician will be assigned to your issue</li>
                    <li>• You will receive updates on the progress</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-purple-gradient text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Wrench size={18} />
                    <span>Submit Request</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
