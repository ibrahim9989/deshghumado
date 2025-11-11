import { createSupabaseServer } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const returnTo = searchParams.get('returnTo') || '/';

  // Use environment variable for site URL if available, otherwise use request origin
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin;

  console.log('[Auth Callback] Received request:', {
    code: code ? 'present' : 'missing',
    returnTo,
    origin,
    siteUrl,
    fullUrl: request.url
  });

  if (code) {
    console.log('[Auth Callback] ===== CODE EXCHANGE START =====');
    const supabase = createSupabaseServer();
    console.log('[Auth Callback] Supabase server client created');
    
    try {
      console.log('[Auth Callback] Exchanging code for session...');
      const exchangeStartTime = Date.now();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      const exchangeElapsed = Date.now() - exchangeStartTime;
      console.log('[Auth Callback] Exchange completed in', exchangeElapsed, 'ms');
      
      if (error) {
        console.error('[Auth Callback] ===== EXCHANGE ERROR =====');
        console.error('[Auth Callback] Error details:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        return new Response(null, {
          status: 302,
          headers: { Location: `${siteUrl}/?error=auth_failed&message=${encodeURIComponent(error.message)}` },
        });
      }
      
      console.log('[Auth Callback] Exchange successful, verifying session...');
      
      // Verify session was created
      const sessionStartTime = Date.now();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      const sessionElapsed = Date.now() - sessionStartTime;
      console.log('[Auth Callback] getSession() completed in', sessionElapsed, 'ms');
      
      if (sessionError) {
        console.error('[Auth Callback] getSession() error:', sessionError);
      }
      
      console.log('[Auth Callback] Session verification:', {
        hasSession: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        expiresAt: session?.expires_at,
        accessToken: session?.access_token ? 'present' : 'missing'
      });
      
      if (!session) {
        console.error('[Auth Callback] ===== SESSION NOT FOUND =====');
        console.error('[Auth Callback] Session not found after exchange');
        return new Response(null, {
          status: 302,
          headers: { Location: `${siteUrl}/?error=auth_failed&message=Session not created` },
        });
      }
      
      console.log('[Auth Callback] ===== CODE EXCHANGE SUCCESS =====');
    } catch (e) {
      console.error('[Auth Callback] ===== EXCEPTION =====');
      console.error('[Auth Callback] Exception details:', {
        error: e,
        message: e instanceof Error ? e.message : 'Unknown error',
        stack: e instanceof Error ? e.stack : undefined
      });
      return new Response(null, {
        status: 302,
        headers: { Location: `${siteUrl}/?error=auth_failed` },
      });
    }
  } else {
    console.warn('[Auth Callback] ===== NO CODE PARAMETER =====');
    console.warn('[Auth Callback] No code parameter found in request');
  }

  // Redirect to auth/redirect handler with returnTo parameter
  const redirectUrl = `${siteUrl}/auth/redirect?returnTo=${encodeURIComponent(returnTo)}`;
  console.log('[Auth Callback] Redirecting to:', redirectUrl);
  
  return new Response(null, {
    status: 302,
    headers: { 
      Location: redirectUrl
    },
  });
}

