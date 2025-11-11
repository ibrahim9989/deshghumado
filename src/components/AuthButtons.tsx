"use client";

import { createSupabaseBrowser } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { buildOAuthCallbackUrl } from '@/lib/utils/url';

export default function AuthButtons() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    const supabase = createSupabaseBrowser();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: buildOAuthCallbackUrl(typeof window !== 'undefined' ? window.location.pathname : '/'),
        queryParams: { prompt: 'select_account' },
      },
    });

    if (error) {
      toast.error('Failed to sign in');
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="px-4 py-2 text-white/60 text-sm">
        Loading...
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        {profile?.full_name && (
          <Link 
            href="/profile"
            className="text-white/90 text-sm hidden md:inline hover:text-white transition-colors"
          >
            {profile.full_name}
          </Link>
        )}
        {!profile?.full_name && user.email && (
          <span className="text-white/90 text-sm hidden md:inline">
            {user.email.split('@')[0]}
          </span>
        )}
        <button 
          onClick={handleSignOut} 
          className="px-4 py-2 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={handleSignIn} 
      className="px-4 py-2 rounded-full bg-white text-gray-900 font-medium hover:shadow-lg transition-all"
    >
      Sign in with Google
    </button>
  );
}
