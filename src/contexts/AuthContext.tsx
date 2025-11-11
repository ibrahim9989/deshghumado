'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { getProfile } from '@/lib/supabase/queries';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  passport_number: string | null;
  passport_expiry: string | null;
  date_of_birth: string | null;
  nationality: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  emergency_contact_relation: string | null;
  dietary_preferences: string | null;
  medical_conditions: string | null;
  profile_completed: boolean;
  role: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAuthenticated: false,
  isProfileComplete: false,
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    console.log('[AuthContext] fetchProfile called for userId:', userId);
    try {
      const profileData = await getProfile(userId);
      console.log('[AuthContext] Profile fetched:', {
        hasProfile: !!profileData,
        profileCompleted: profileData?.profile_completed,
        email: profileData?.email,
        fullName: profileData?.full_name
      });
      setProfile(profileData);
      return profileData;
    } catch (error) {
      console.error('[AuthContext] Error fetching profile:', error);
      setProfile(null);
      throw error;
    }
  };

  const refreshProfile = async () => {
    console.log('[AuthContext] refreshProfile called', { hasUser: !!user, userId: user?.id });
    if (user) {
      await fetchProfile(user.id);
    } else {
      console.warn('[AuthContext] refreshProfile called but no user');
    }
  };

  useEffect(() => {
    console.log('[AuthContext] useEffect triggered - setting up auth');
    const supabase = createSupabaseBrowser();
    console.log('[AuthContext] Supabase client created');

    // Get initial session
    const initAuth = async () => {
      const startTime = Date.now();
      try {
        console.log('[AuthContext] ===== INIT AUTH START =====');
        console.log('[AuthContext] Calling getSession()...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        const elapsed = Date.now() - startTime;
        
        console.log('[AuthContext] getSession() completed in', elapsed, 'ms');
        
        if (error) {
          console.error('[AuthContext] Get session error:', {
            message: error.message,
            status: error.status,
            name: error.name
          });
        }
        
        console.log('[AuthContext] Session data:', { 
          hasSession: !!session, 
          userId: session?.user?.id,
          userEmail: session?.user?.email,
          expiresAt: session?.expires_at,
          accessToken: session?.access_token ? 'present' : 'missing'
        });
        
        // Check cookies
        if (typeof document !== 'undefined') {
          const allCookies = document.cookie;
          const supabaseCookies = allCookies.split(';').filter(c => 
            c.trim().startsWith('sb-') || c.includes('supabase')
          );
          console.log('[AuthContext] Browser cookies:', {
            totalCookies: allCookies.split(';').length,
            supabaseCookies: supabaseCookies.length,
            cookieNames: supabaseCookies.map(c => c.split('=')[0].trim())
          });
        }
        
        setUser(session?.user ?? null);
        console.log('[AuthContext] User state set:', { 
          hasUser: !!session?.user,
          userId: session?.user?.id 
        });
        
        if (session?.user) {
          console.log('[AuthContext] User found, fetching profile for:', session.user.id);
          const profileStartTime = Date.now();
          try {
            await fetchProfile(session.user.id);
            const profileElapsed = Date.now() - profileStartTime;
            console.log('[AuthContext] Profile fetch completed in', profileElapsed, 'ms');
          } catch (error) {
            const profileElapsed = Date.now() - profileStartTime;
            console.error('[AuthContext] Profile fetch failed after', profileElapsed, 'ms:', error);
            // Continue anyway - profile might not exist yet
            setProfile(null);
          }
        } else {
          console.log('[AuthContext] No user in session');
        }
      } catch (error) {
        console.error('[AuthContext] Auth initialization error:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
      } finally {
        setLoading(false);
        console.log('[AuthContext] ===== INIT AUTH COMPLETE =====');
        console.log('[AuthContext] Final state:', {
          loading: false,
          hasUser: !!user,
          hasProfile: !!profile
        });
      }
    };

    initAuth();

    // Listen for auth changes
    console.log('[AuthContext] Setting up onAuthStateChange listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AuthContext] ===== AUTH STATE CHANGE =====');
        console.log('[AuthContext] Event:', event);
        console.log('[AuthContext] Session:', { 
          hasSession: !!session,
          userId: session?.user?.id,
          userEmail: session?.user?.email
        });
        
        setUser(session?.user ?? null);
        console.log('[AuthContext] User state updated');
        
        if (session?.user) {
          console.log('[AuthContext] User authenticated, fetching profile:', session.user.id);
          try {
            const profileStartTime = Date.now();
            await fetchProfile(session.user.id);
            const profileElapsed = Date.now() - profileStartTime;
            console.log('[AuthContext] Profile fetch completed after state change in', profileElapsed, 'ms');
          } catch (error) {
            console.error('[AuthContext] Error fetching profile after state change:', error);
            // Set profile to null if fetch fails
            setProfile(null);
          }
        } else {
          console.log('[AuthContext] User signed out, clearing profile');
          setProfile(null);
        }
        
        // Always set loading to false, even if profile fetch fails
        setLoading(false);
        console.log('[AuthContext] Loading set to false after state change');
        console.log('[AuthContext] ===== AUTH STATE CHANGE COMPLETE =====');
      }
    );

    return () => {
      console.log('[AuthContext] Cleaning up - unsubscribing from auth changes');
      subscription.unsubscribe();
    };
  }, []);

  const isAuthenticated = !!user;
  const isProfileComplete = profile?.profile_completed ?? false;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthenticated,
        isProfileComplete,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};



