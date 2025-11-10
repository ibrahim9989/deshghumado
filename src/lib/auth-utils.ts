import { createSupabaseBrowser } from './supabase/client';
import { getProfile } from './supabase/queries';

export interface AuthCheckResult {
  isAuthenticated: boolean;
  profileComplete: boolean;
  userId?: string;
  needsAuth: boolean;
  needsProfile: boolean;
}

/**
 * Check if user is authenticated and has completed their profile
 */
export async function checkAuthAndProfile(): Promise<AuthCheckResult> {
  const supabase = createSupabaseBrowser();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return {
      isAuthenticated: false,
      profileComplete: false,
      needsAuth: true,
      needsProfile: false,
    };
  }

  // User is authenticated, check profile
  const profile = await getProfile(user.id);
  
  const profileComplete = profile ? profile.profile_completed === true : false;

  return {
    isAuthenticated: true,
    profileComplete,
    userId: user.id,
    needsAuth: false,
    needsProfile: !profileComplete,
  };
}

/**
 * Build redirect URL with return path
 */
export function buildRedirectUrl(targetPath: string, returnTo?: string): string {
  if (!returnTo) return targetPath;
  
  const url = new URL(targetPath, window.location.origin);
  url.searchParams.set('returnTo', returnTo);
  return url.pathname + url.search;
}

/**
 * Get return path from URL params or default
 */
export function getReturnPath(defaultPath: string = '/'): string {
  if (typeof window === 'undefined') return defaultPath;
  
  const params = new URLSearchParams(window.location.search);
  return params.get('returnTo') || defaultPath;
}

/**
 * Store intended destination in sessionStorage
 */
export function storeIntendedDestination(path: string) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('intendedDestination', path);
  }
}

/**
 * Get and clear intended destination from sessionStorage
 */
export function getAndClearIntendedDestination(defaultPath: string = '/'): string {
  if (typeof window === 'undefined') return defaultPath;
  
  const intended = sessionStorage.getItem('intendedDestination');
  if (intended) {
    sessionStorage.removeItem('intendedDestination');
    return intended;
  }
  return defaultPath;
}

/**
 * Initiate Google OAuth sign-in with state preservation
 */
export async function initiateGoogleSignIn(intendedDestination?: string) {
  const supabase = createSupabaseBrowser();
  
  // Store intended destination
  if (intendedDestination) {
    storeIntendedDestination(intendedDestination);
  } else if (typeof window !== 'undefined') {
    storeIntendedDestination(window.location.pathname);
  }
  
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  if (error) {
    throw error;
  }
}

/**
 * Check if user needs to complete authentication flow before accessing a resource
 * Returns an object indicating what action is needed
 */
export interface AuthFlowCheck {
  canProceed: boolean;
  needsAuth: boolean;
  needsProfile: boolean;
  userId?: string;
  message?: string;
}

export async function checkAuthFlow(): Promise<AuthFlowCheck> {
  const result = await checkAuthAndProfile();
  
  if (!result.isAuthenticated) {
    return {
      canProceed: false,
      needsAuth: true,
      needsProfile: false,
      message: 'Please sign in to continue',
    };
  }
  
  if (!result.profileComplete) {
    return {
      canProceed: false,
      needsAuth: false,
      needsProfile: true,
      userId: result.userId,
      message: 'Please complete your profile to continue',
    };
  }
  
  return {
    canProceed: true,
    needsAuth: false,
    needsProfile: false,
    userId: result.userId,
    message: 'Ready to proceed',
  };
}

