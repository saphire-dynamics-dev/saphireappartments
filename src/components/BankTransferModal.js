'use client';

import { useState } from 'react';
import { X, Copy, Check, MessageCircle, CreditCard } from 'lucide-react';

export default function BankTransferModal({ isOpen, onClose, onPaymentConfirmed, totalAmount, propertyTitle }) {
  const [copied, setCopied] = useState({
    accountNumber: false,
    accountName: false,
    bankName: false
  });
  const [isConfirming, setIsConfirming] = useState(false);

  const bankDetails = {
    accountNumber: '1025737289',
    accountName: 'Saphire Dynamic 2',
    bankName: 'United Bank for Africa (UBA)'
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

  const handlePaymentConfirmation = () => {
    setIsConfirming(true);
    
    // Show confirmation message
    const confirmed = window.confirm(
      'Please confirm that you have completed the bank transfer. You will be redirected to WhatsApp to verify your payment with our agent and receive check-in details.'
    );
    
    if (confirmed) {
      onPaymentConfirmed();
      onClose();
    }
    
    setIsConfirming(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Bank Transfer Payment
              </h2>
              <p className="text-sm text-gray-500">{propertyTitle}</p>
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
          {/* Amount */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-purple-900 mb-1">
                Total Amount
              </h3>
              <div className="text-3xl font-bold text-purple-600">
                ₦{totalAmount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Transfer to this account:
            </h3>

            {/* Account Number */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    Account Number
                  </div>
                  <div className="text-lg font-mono font-bold text-gray-900">
                    {bankDetails.accountNumber}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(bankDetails.accountNumber, 'accountNumber')}
                  className="ml-3 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copy account number"
                >
                  {copied.accountNumber ? (
                    <Check size={18} className="text-green-600" />
                  ) : (
                    <Copy size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Account Name */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    Account Name
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {bankDetails.accountName}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(bankDetails.accountName, 'accountName')}
                  className="ml-3 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copy account name"
                >
                  {copied.accountName ? (
                    <Check size={18} className="text-green-600" />
                  ) : (
                    <Copy size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Bank Name */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    Bank Name
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {bankDetails.bankName}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(bankDetails.bankName, 'bankName')}
                  className="ml-3 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copy bank name"
                >
                  {copied.bankName ? (
                    <Check size={18} className="text-green-600" />
                  ) : (
                    <Copy size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">
              Payment Instructions:
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Transfer the exact amount: ₦{totalAmount.toLocaleString()}</li>
              <li>• Use your full name as the transfer reference</li>
              <li>• Keep your transfer receipt for verification</li>
              <li>• Click &quot;Yes, I have paid&quot; after completing the transfer</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handlePaymentConfirmation}
              disabled={isConfirming}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium transition-colors flex items-center justify-center space-x-2"
            >
              {isConfirming ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Check size={18} />
                  <span>Yes, I have paid</span>
                </>
              )}
            </button>
            
            <button
              onClick={onClose}
              className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* WhatsApp Notice */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <MessageCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Next Step:</p>
                <p>After confirming payment, you&apos;ll be redirected to WhatsApp to verify your transfer with our agent and receive your check-in details.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
