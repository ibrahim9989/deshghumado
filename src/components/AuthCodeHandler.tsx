'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Handles auth code parameter if Supabase redirects to root instead of /auth/callback
 * This is a fallback in case Supabase configuration redirects to the wrong URL
 */
export default function AuthCodeHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    
    if (code) {
      // If we have a code but we're on the root page, redirect to callback
      const returnTo = searchParams.get('returnTo') || '/';
      const callbackUrl = `/auth/callback?code=${encodeURIComponent(code)}&returnTo=${encodeURIComponent(returnTo)}`;
      console.log('[AuthCodeHandler] Redirecting code to callback:', callbackUrl);
      router.replace(callbackUrl);
    } else if (error) {
      // Handle error case
      console.error('[AuthCodeHandler] Auth error:', error);
      const errorMessage = searchParams.get('message');
      if (errorMessage) {
        console.error('[AuthCodeHandler] Error message:', errorMessage);
      }
    }
  }, [searchParams, router]);

  return null; // This component doesn't render anything
}

