import { createSupabaseServer } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/';

  if (code) {
    const supabase = createSupabaseServer();
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (e) {
      // ignore to avoid leaking details in response
    }
  }

  return new Response(null, { status: 302, headers: { Location: next } });
}
