'use client';

import { useState, useEffect } from 'react';
import { Luggage, User, Menu, X } from 'lucide-react';
import AuthButtons from './AuthButtons';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, loading } = useAuth();
  const pathname = usePathname();

  // Close menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('.mobile-menu') && !target.closest('.menu-button')) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (isMenuOpen && event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleSignIn = async () => {
    if (typeof window === 'undefined') return;
    
    const supabase = createSupabaseBrowser();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(window.location.pathname)}`,
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
    setIsMenuOpen(false);
    window.location.href = '/';
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 lg:px-16 py-4 backdrop-blur-md bg-black/20">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">D</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-xl tracking-tight">DeshGhumado</h1>
            <p className="text-pink-200 text-xs">by Wandering Maniac</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/packages" className="text-white/90 hover:text-white font-medium">Tours</Link>
          <Link href="/about" className="text-white/90 hover:text-white font-medium">About</Link>
          <Link href="/contact" className="text-white/90 hover:text-white font-medium">Contact</Link>
          <Link href="/my-bookings" className="flex items-center gap-2 px-6 py-2.5 bg-white text-gray-800 rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all">
            <Luggage className="w-4 h-4" />
            My Bookings
          </Link>
          <AuthButtons />
        </div>

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="menu-button md:hidden w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <Menu className="w-5 h-5 text-white" />
          )}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="mobile-menu absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">D</span>
                  </div>
                  <span className="text-white font-bold text-lg">Menu</span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 p-6 space-y-4">
                <Link
                  href="/packages"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                  <Luggage className="w-5 h-5" />
                  <span className="font-medium">Tours</span>
                </Link>

                <Link
                  href="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">About</span>
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                  <span className="w-5 h-5 text-center">📧</span>
                  <span className="font-medium">Contact</span>
                </Link>

                <Link
                  href="/my-bookings"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors"
                >
                  <Luggage className="w-5 h-5" />
                  <span>My Bookings</span>
                </Link>

                {/* Auth Section */}
                <div className="pt-4 border-t border-white/10">
                  {loading ? (
                    <div className="px-4 py-3 text-white/60 text-sm text-center">
                      Loading...
                    </div>
                  ) : user ? (
                    <div className="space-y-3">
                      {profile?.full_name && (
                        <Link
                          href="/profile"
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                        >
                          <div className="text-sm text-white/60 mb-1">Signed in as</div>
                          <div className="font-medium">{profile.full_name}</div>
                        </Link>
                      )}
                      {!profile?.full_name && user.email && (
                        <div className="px-4 py-3">
                          <div className="text-sm text-white/60 mb-1">Signed in as</div>
                          <div className="font-medium text-white/90">{user.email.split('@')[0]}</div>
                        </div>
                      )}
                      <Link
                        href="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="block w-full px-4 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors text-center"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-3 bg-red-500/20 text-red-300 rounded-xl font-medium hover:bg-red-500/30 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleSignIn}
                      className="w-full px-4 py-3 bg-white text-gray-900 rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                      Sign in with Google
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
