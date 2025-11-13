'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { XCircle, ArrowRight, RefreshCw } from 'lucide-react';

function PaymentFailureContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get('bookingId');
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-600 text-lg">
            We couldn't process your payment. Please try again.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800">{decodeURIComponent(error)}</p>
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">What to do next?</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-gray-600 mt-0.5">•</span>
              <span>Check your payment method and try again</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-600 mt-0.5">•</span>
              <span>Ensure you have sufficient balance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-600 mt-0.5">•</span>
              <span>Contact support if the issue persists</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {bookingId && (
            <Link
              href="/my-bookings"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              View Booking & Retry
            </Link>
          )}
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-all"
          >
            Contact Support
          </Link>
          <Link
            href="/packages"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-all"
          >
            Browse Tours
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <PaymentFailureContent />
    </Suspense>
  );
}

