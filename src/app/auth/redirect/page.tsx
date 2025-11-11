'use client';

import { useEffect, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

function RedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile, loading, refreshProfile } = useAuth();
  const returnTo = searchParams.get('returnTo') || '/';
  const [hasAttemptedRefresh, setHasAttemptedRefresh] = useState(false);
  const [redirectAttempted, setRedirectAttempted] = useState(false);

  // Log current state whenever it changes
  useEffect(() => {
    console.log('[Auth Redirect] ===== STATE UPDATE =====');
    console.log('[Auth Redirect] Current state:', {
      loading,
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      hasProfile: !!profile,
      profileCompleted: profile?.profile_completed,
      profileEmail: profile?.email,
      returnTo,
      hasAttemptedRefresh,
      redirectAttempted
    });
    console.log('[Auth Redirect] ========================');
  }, [user, profile, loading, returnTo, hasAttemptedRefresh, redirectAttempted]);

  // Timeout to prevent infinite loading
  useEffect(() => {
    console.log('[Auth Redirect] Setting up timeout (15s)');
    const timeout = setTimeout(() => {
      console.error('[Auth Redirect] ===== TIMEOUT TRIGGERED =====');
      console.error('[Auth Redirect] Timeout state:', {
        loading,
        hasUser: !!user,
        hasProfile: !!profile
      });
      if (loading && !user) {
        console.error('[Auth Redirect] Timeout waiting for auth, redirecting to home');
        toast.error('Authentication is taking too long. Please try again.');
        router.push('/');
      } else {
        console.warn('[Auth Redirect] Timeout triggered but conditions not met');
      }
    }, 15000); // 15 second timeout (increased to allow for retries)

    return () => {
      console.log('[Auth Redirect] Cleaning up timeout');
      clearTimeout(timeout);
    };
  }, [loading, user, router, profile]);

  // Initial delay to let cookies sync from server
  useEffect(() => {
    console.log('[Auth Redirect] Component mounted, setting up initial delay');
    // Give the page a moment to load and cookies to sync
    const initialDelay = setTimeout(() => {
      console.log('[Auth Redirect] ===== INITIAL DELAY COMPLETE =====');
      console.log('[Auth Redirect] Checking cookies and auth state');
      
      // Debug: Check if we can see any Supabase cookies
      const allCookies = document.cookie;
      const cookies = allCookies.split(';').filter(c => c.trim());
      const supabaseCookies = cookies.filter(c => 
        c.includes('sb-') || c.includes('supabase')
      );
      
      console.log('[Auth Redirect] Cookie analysis:', {
        totalCookies: cookies.length,
        supabaseCookies: supabaseCookies.length,
        cookieNames: cookies.map(c => c.split('=')[0].trim()),
        supabaseCookieNames: supabaseCookies.map(c => c.split('=')[0].trim())
      });
      
      console.log('[Auth Redirect] Current auth state:', {
        loading,
        hasUser: !!user,
        hasProfile: !!profile
      });
      console.log('[Auth Redirect] =================================');
    }, 300);

    return () => {
      console.log('[Auth Redirect] Cleaning up initial delay');
      clearTimeout(initialDelay);
    };
  }, []);

  useEffect(() => {
    // Force refresh session if we don't have a user yet
    // Wait a bit first to let cookies sync
    if (!loading && !user && !hasAttemptedRefresh) {
      const checkSession = async () => {
        // Wait a moment for cookies to sync
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setHasAttemptedRefresh(true);
        const supabase = createSupabaseBrowser();
        
        // Try multiple times to get session
        let attempts = 0;
        const maxAttempts = 3;
        
        while (attempts < maxAttempts) {
          const { data: { session }, error } = await supabase.auth.getSession();
          
          console.log(`[Auth Redirect] Session check attempt ${attempts + 1}:`, { 
            hasSession: !!session, 
            error: error?.message,
            userId: session?.user?.id 
          });
          
          if (session?.user && !error) {
            // Session exists, trigger auth state change by doing a hard refresh
            console.log('[Auth Redirect] Session found, reloading page');
            window.location.reload();
            return;
          }
          
          attempts++;
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
        
        // No session after all attempts
        console.error('[Auth Redirect] No session found after all attempts');
        toast.error('Authentication failed. Please try again.');
        router.push('/');
      };
      
      checkSession();
      return;
    }

    // Wait for auth to finish loading
    if (loading) {
      console.log('[Auth Redirect] Still loading, waiting...', {
        loading,
        hasUser: !!user,
        hasProfile: !!profile
      });
      return;
    }

    const handleRedirect = async () => {
      console.log('[Auth Redirect] ===== HANDLE REDIRECT START =====');
      
      // Prevent multiple redirect attempts
      if (redirectAttempted) {
        console.log('[Auth Redirect] Redirect already attempted, skipping');
        return;
      }

      console.log('[Auth Redirect] Starting redirect logic:', { 
        hasUser: !!user, 
        userId: user?.id,
        userEmail: user?.email,
        hasProfile: !!profile,
        profileCompleted: profile?.profile_completed,
        profileEmail: profile?.email,
        returnTo,
        timestamp: new Date().toISOString()
      });

      // Give a small delay to ensure session is fully established
      console.log('[Auth Redirect] Waiting 200ms for session to stabilize...');
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log('[Auth Redirect] Wait complete');

      if (!user) {
        console.error('[Auth Redirect] ===== NO USER FOUND =====');
        console.error('[Auth Redirect] Authentication failed - no user in context');
        setRedirectAttempted(true);
        toast.error('Authentication failed');
        router.push('/');
        return;
      }

      console.log('[Auth Redirect] User found:', {
        userId: user.id,
        email: user.email
      });

      // If we have a user but no profile, try to fetch it
      if (user && !profile) {
        console.log('[Auth Redirect] ===== USER EXISTS BUT NO PROFILE =====');
        console.log('[Auth Redirect] Attempting to fetch profile...');
        try {
          const profileStartTime = Date.now();
          await refreshProfile();
          const profileElapsed = Date.now() - profileStartTime;
          console.log('[Auth Redirect] Profile refresh completed in', profileElapsed, 'ms');
          
          // Wait a bit for profile to update in state
          console.log('[Auth Redirect] Waiting 500ms for profile state to update...');
          await new Promise(resolve => setTimeout(resolve, 500));
          console.log('[Auth Redirect] Profile state wait complete');
          
          // Don't set redirectAttempted here, let it retry
          console.log('[Auth Redirect] Returning to let effect re-run with updated profile');
          return;
        } catch (error) {
          console.error('[Auth Redirect] ===== PROFILE FETCH ERROR =====');
          console.error('[Auth Redirect] Error details:', {
            error,
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
          });
          // Continue anyway - profile might not exist yet
        }
      }

      setRedirectAttempted(true);
      console.log('[Auth Redirect] Redirect attempt flag set');

      // Check if profile is complete
      if (!profile?.profile_completed) {
        console.log('[Auth Redirect] ===== PROFILE INCOMPLETE =====');
        console.log('[Auth Redirect] Redirecting to profile page');
        toast.success('Welcome! Please complete your profile');
        router.push(`/profile?returnTo=${encodeURIComponent(returnTo)}`);
        return;
      }

      // Profile is complete, redirect to intended destination
      console.log('[Auth Redirect] ===== ALL CHECKS PASSED =====');
      console.log('[Auth Redirect] Redirecting to:', returnTo);
      toast.success('Welcome back!');
      router.push(returnTo);
      console.log('[Auth Redirect] ===== HANDLE REDIRECT COMPLETE =====');
    };

    handleRedirect();
  }, [user, profile, loading, router, returnTo, hasAttemptedRefresh, refreshProfile, redirectAttempted]);

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
