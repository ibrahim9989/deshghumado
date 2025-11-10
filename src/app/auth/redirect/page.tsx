'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

function RedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile, loading } = useAuth();
  const returnTo = searchParams.get('returnTo') || '/';

  useEffect(() => {
    if (loading) return;

    const handleRedirect = async () => {
      if (!user) {
        toast.error('Authentication failed');
        router.push('/');
        return;
      }

      // Check if profile is complete
      if (!profile?.profile_completed) {
        toast.success('Welcome! Please complete your profile');
        router.push(`/profile?returnTo=${encodeURIComponent(returnTo)}`);
        return;
      }

      // Profile is complete, redirect to intended destination
      toast.success('Welcome back!');
      router.push(returnTo);
    };

    handleRedirect();
  }, [user, profile, loading, router, returnTo]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
        <p className="text-gray-600 font-medium">Setting up your account...</p>
      </div>
    </div>
  );
}

export default function AuthRedirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <RedirectContent />
    </Suspense>
  );
}
