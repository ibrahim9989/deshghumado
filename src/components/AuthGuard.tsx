'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { getProfile } from '@/lib/supabase/queries';
import toast from 'react-hot-toast';
import { getSiteUrl } from '@/lib/auth-utils';

interface AuthGuardProps {
  children: React.ReactNode;
  requireProfile?: boolean;
  redirectTo?: string;
  loadingComponent?: React.ReactNode;
}

/**
 * AuthGuard - Protects components/pages that require authentication
 * 
 * Features:
 * - Checks if user is authenticated
 * - Optionally checks if profile is completed
 * - Preserves intended destination in sessionStorage
 * - Redirects to Google auth if not authenticated
 * - Redirects to profile page if profile not completed
 * 
 * @param children - The protected content to render
 * @param requireProfile - Whether to require profile completion (default: false)
 * @param redirectTo - Custom redirect path after auth (overrides current path)
 * @param loadingComponent - Custom loading component
 */
export default function AuthGuard({ 
  children, 
  requireProfile = false,
  redirectTo,
  loadingComponent 
}: AuthGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createSupabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      
      const currentPath = redirectTo || window.location.pathname;
      
      // Not authenticated - trigger Google sign in
      if (!user) {
        toast.error('Please sign in to continue');
        sessionStorage.setItem('intendedDestination', currentPath);
        
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${getSiteUrl()}/auth/callback`,
          },
        });
        
        if (error) {
          toast.error('Failed to sign in');
          router.push('/');
        }
        return;
      }
      
      // Authenticated - check profile if required
      if (requireProfile) {
        const profile = await getProfile(user.id);
        
        if (!profile?.profile_completed) {
          toast.error('Please complete your profile to continue');
          sessionStorage.setItem('intendedDestination', currentPath);
          router.push('/profile');
          return;
        }
      }
      
      // All checks passed
      setIsAuthorized(true);
      setIsLoading(false);
    }
    
    checkAuth();
  }, [router, requireProfile, redirectTo]);

  if (isLoading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-600 mx-auto mb-6"></div>
          <p className="text-gray-700 text-lg font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
