import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');
  const returnTo = searchParams.get('returnTo') || next || '/';

  // Use environment variable for site URL if available, otherwise use request origin
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin;

  if (code) {
    const supabase = createSupabaseServer();
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('[Auth Callback] Exchange error:', error);
        return NextResponse.redirect(`${siteUrl}/auth/auth-code-error`);
      }

      // Successfully exchanged code for session
      // The session is now stored in cookies
      // Redirect to the return URL or next parameter
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${siteUrl}${returnTo}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${returnTo}`);
      } else {
        return NextResponse.redirect(`${siteUrl}${returnTo}`);
      }
    } catch (e) {
      console.error('[Auth Callback] Exception:', e);
      return NextResponse.redirect(`${siteUrl}/auth/auth-code-error`);
    }
  }

  // No code parameter - redirect to error page
  return NextResponse.redirect(`${siteUrl}/auth/auth-code-error`);
}

