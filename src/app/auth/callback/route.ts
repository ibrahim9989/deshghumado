import { createSupabaseServer } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const returnTo = searchParams.get('returnTo') || '/';

  if (code) {
    const supabase = createSupabaseServer();
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (e) {
      console.error('Auth callback error:', e);
      return new Response(null, {
        status: 302,
        headers: { Location: `${origin}/?error=auth_failed` },
      });
    }
  }

  // Redirect to auth/redirect handler with returnTo parameter
  return new Response(null, {
    status: 302,
    headers: { 
      Location: `${origin}/auth/redirect?returnTo=${encodeURIComponent(returnTo)}` 
    },
  });
}

