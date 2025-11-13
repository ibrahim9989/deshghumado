'use client';

import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Authentication Error
        </h1>
        <p className="text-gray-600 mb-6">
          We encountered an issue while signing you in. This could be due to:
        </p>
        <ul className="text-left text-gray-600 mb-6 space-y-2">
          <li>• The authentication link has expired</li>
          <li>• The link has already been used</li>
          <li>• There was a temporary server issue</li>
        </ul>
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            Go to Home
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="block w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

