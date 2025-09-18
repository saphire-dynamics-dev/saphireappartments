"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

function PaymentCallbackContent() {
  const [status, setStatus] = useState('verifying');
  const [transactionData, setTransactionData] = useState(null);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [retryMessage, setRetryMessage] = useState('');
  
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  const MAX_RETRIES = 3;
  const RETRY_DELAYS = [0, 3000, 7000]; // 0s, 3s, 7s (total 10s)

  useEffect(() => {
    if (!reference) {
      setStatus('error');
      setError('No transaction reference found');
      return;
    }

    verifyPaymentWithRetries(reference);
  }, [reference]);

  const verifyPaymentWithRetries = async (ref) => {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        // Wait for the specified delay before each attempt
        if (RETRY_DELAYS[attempt] > 0) {
          setRetryMessage(`Retrying verification in ${RETRY_DELAYS[attempt] / 1000} seconds... (Attempt ${attempt + 1}/${MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS[attempt]));
        }

        setRetryMessage(attempt > 0 ? `Verifying payment... (Attempt ${attempt + 1}/${MAX_RETRIES})` : '');
        
        const result = await verifyPayment(ref);

        if (result.success && result.data.status === 'success') {
          setStatus('success');
          setTransactionData(result.data);
          setRetryMessage('');
          return; // Success, exit retry loop
        } else if (result.success && result.data.status === 'failed') {
          // Payment genuinely failed, don't retry
          setStatus('failed');
          setError(result.data?.message || 'Payment verification failed');
          setRetryMessage('');
          return;
        }

        // If it's not success or failed, it might be pending or network error
        if (attempt === MAX_RETRIES - 1) {
          // Last attempt failed
          setStatus('failed');
          setError(result.data?.message || result.error || 'Payment verification failed after multiple attempts');
          setRetryMessage('');
        }

      } catch (error) {
        console.error(`Payment verification attempt ${attempt + 1} error:`, error);
        
        if (attempt === MAX_RETRIES - 1) {
          // Last attempt failed
          setStatus('error');
          setError('Failed to verify payment after multiple attempts. Please contact support.');
          setRetryMessage('');
        }
      }
      
      setRetryCount(attempt + 1);
    }
  };

  const verifyPayment = async (ref) => {
    const response = await fetch('/api/payments/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reference: ref }),
    });

    return await response.json();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="text-center py-20">
            <Loader size={64} className="mx-auto mb-6 text-purple-primary animate-spin" />
            <h2 className="text-2xl font-bold text-purple-primary mb-4">Verifying Payment</h2>
            <p className="text-gray-600 mb-2">Please wait while we confirm your payment...</p>
            {retryMessage && (
              <p className="text-sm text-yellow-600 font-medium">{retryMessage}</p>
            )}
            {retryCount > 0 && (
              <div className="mt-4">
                <div className="w-64 mx-auto bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-primary h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(retryCount / MAX_RETRIES) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Verification Progress</p>
              </div>
            )}
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-20">
            <CheckCircle size={64} className="mx-auto mb-6 text-green-600" />
            <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your booking payment has been processed successfully.
            </p>
            
            {transactionData?.transaction && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 max-w-md mx-auto">
                <h3 className="font-semibold text-green-800 mb-3">Transaction Details</h3>
                <div className="text-sm text-green-700 space-y-2">
                  <p><strong>Reference:</strong> {transactionData.transaction.reference}</p>
                  <p><strong>Property:</strong> {transactionData.transaction.metadata?.propertyTitle}</p>
                </div>
              </div>
            )}

            {/* Next Steps Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 max-w-md mx-auto">
              <h3 className="font-semibold text-blue-800 mb-3">Next Steps</h3>
              <div className="text-sm text-blue-700 space-y-3 text-left">
                <p>
                  <strong>📞 Contact Your Agent:</strong><br />
                  Please reach out to your agent at{" "}
                  <a 
                    href="tel:+2348066446777" 
                    className="font-bold text-blue-800 hover:underline"
                  >
                    +234 806 644 6777
                  </a>{" "}
                  to confirm your apartment entry code and ask any questions.
                </p>
                <p>
                  <strong>📧 Agent Contact:</strong><br />
                  Our agent will also reach out to you within 24 hours to provide check-in details and answer any questions you may have.
                </p>
                <p>
                  <strong>📋 What to Expect:</strong><br />
                  • Apartment entry code<br />
                  • Check-in instructions<br />
                  • Property guidelines<br />
                  • Contact information for assistance
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                A confirmation email has been sent to your email address.
              </p>
              <div className="flex justify-center space-x-4">
                <a
                  href="tel:+2348066446777"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  📞 Call Agent Now
                </a>
                <Link
                  href="/properties"
                  className="bg-purple-primary text-white px-6 py-3 rounded-lg hover:bg-purple-secondary transition-colors"
                >
                  Browse More Properties
                </Link>
              </div>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-block border border-purple-primary text-purple-primary px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        );

      case 'failed':
      case 'error':
        return (
          <div className="text-center py-20">
            <XCircle size={64} className="mx-auto mb-6 text-red-600" />
            <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h2>
            <p className="text-gray-600 mb-6">
              {error || 'Your payment could not be processed.'}
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6 max-w-md mx-auto">
              <p className="text-sm text-red-700">
                If you were charged, please contact our support team with your transaction reference.
              </p>
              {reference && (
                <p className="text-sm text-red-700 mt-2">
                  <strong>Reference:</strong> {reference}
                </p>
              )}
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
              <Link
                href="/contact"
                className="border border-red-600 text-red-600 px-6 py-3 rounded-lg hover:bg-red-50 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderContent();
}

function PaymentCallbackLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full">
        <div className="text-center py-20">
          <Loader size={64} className="mx-auto mb-6 text-purple-primary animate-spin" />
          <h2 className="text-2xl font-bold text-purple-primary mb-4">Loading Payment Details</h2>
          <p className="text-gray-600">Please wait while we load your payment information...</p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCallback() {
  return (
    <Suspense fallback={<PaymentCallbackLoading />}>
      <PaymentCallbackContent />
    </Suspense>
  );
}
