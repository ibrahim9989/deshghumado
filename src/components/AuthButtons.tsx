"use client";

import { createSupabaseBrowser } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

export default function AuthButtons() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowser();
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async () => {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        queryParams: { prompt: 'select_account' },
      },
    });
  };

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    window.location.href = '/';
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
        <span className="text-white/90 text-sm hidden md:inline">
          {user.email}
        </span>
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
