'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { getProfile } from '@/lib/supabase/queries';
import toast from 'react-hot-toast';
import { getSiteUrl } from '@/lib/auth-utils';

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  profileComplete: boolean;
  userId: string | null;
  userEmail: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    profileComplete: false,
    userId: null,
    userEmail: null,
  });

  useEffect(() => {
    const supabase = createSupabaseBrowser();
    
    // Check initial auth state
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          profileComplete: false,
          userId: null,
          userEmail: null,
        });
        return;
      }

      // Check profile completion
      const profile = await getProfile(user.id);
      const profileComplete = profile?.profile_completed === true;

      setAuthState({
        isLoading: false,
        isAuthenticated: true,
        profileComplete,
        userId: user.id,
        userEmail: user.email || null,
      });
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await getProfile(session.user.id);
        const profileComplete = profile?.profile_completed === true;

        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          profileComplete,
          userId: session.user.id,
          userEmail: session.user.email || null,
        });
      } else if (event === 'SIGNED_OUT') {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          profileComplete: false,
          userId: null,
          userEmail: null,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async (returnTo?: string) => {
    const supabase = createSupabaseBrowser();
    
    // Store return destination
    if (returnTo && typeof window !== 'undefined') {
      sessionStorage.setItem('intendedDestination', returnTo);
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${getSiteUrl()}/auth/callback`,
      },
    });

    if (error) {
      toast.error('Failed to sign in with Google');
      console.error('Sign in error:', error);
    }
  };

  const signOut = async () => {
    const supabase = createSupabaseBrowser();
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error('Failed to sign out');
      console.error('Sign out error:', error);
    } else {
      toast.success('Signed out successfully');
      router.push('/');
    }
  };

  const requireAuth = async (returnTo?: string): Promise<boolean> => {
    if (authState.isLoading) return false;

    if (!authState.isAuthenticated) {
      toast.error('Please sign in to continue');
      await signInWithGoogle(returnTo || window.location.pathname);
      return false;
    }

    if (!authState.profileComplete) {
      toast.error('Please complete your profile to continue');
      const profileUrl = `/profile?returnTo=${encodeURIComponent(returnTo || window.location.pathname)}`;
      router.push(profileUrl);
      return false;
    }

    return true;
  };

  const refreshAuthState = async () => {
    const supabase = createSupabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const profile = await getProfile(user.id);
      const profileComplete = profile?.profile_completed === true;

      setAuthState({
        isLoading: false,
        isAuthenticated: true,
        profileComplete,
        userId: user.id,
        userEmail: user.email || null,
      });
    }
  };

  return {
    ...authState,
    signInWithGoogle,
    signOut,
    requireAuth,
    refreshAuthState,
  };
}

