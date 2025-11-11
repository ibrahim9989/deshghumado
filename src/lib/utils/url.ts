/**
 * Get the site URL for OAuth redirects
 * Uses NEXT_PUBLIC_SITE_URL environment variable if available,
 * otherwise falls back to window.location.origin (client-side) or request origin (server-side)
 */
export function getSiteUrl(): string {
  // Check for environment variable first (useful for production)
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Client-side fallback
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // Server-side fallback (should not happen in OAuth flows, but just in case)
  return 'http://localhost:3000';
}

/**
 * Build OAuth callback URL with return path
 */
export function buildOAuthCallbackUrl(returnTo?: string): string {
  const siteUrl = getSiteUrl();
  const callbackUrl = `${siteUrl}/auth/callback`;
  
  if (returnTo) {
    return `${callbackUrl}?returnTo=${encodeURIComponent(returnTo)}`;
  }
  
  return callbackUrl;
}

