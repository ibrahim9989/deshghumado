'use client';

import { useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSiteUrl } from '@/lib/auth-utils';

interface BookNowButtonProps {
  slug: string;
  tourStatus: string;
  className?: string;
  children?: React.ReactNode;
}

export default function BookNowButton({ slug, tourStatus, className, children }: BookNowButtonProps) {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleBookNow = async () => {
    if (tourStatus !== 'booking_open') {
      toast.error('This tour is not available for booking');
      return;
    }

    setLoading(true);

    try {
      if (!user) {
        toast('Please sign in to book this tour', { icon: '🔐' });
        
        // Trigger Google sign in with return URL
        const supabase = createSupabaseBrowser();
        const returnTo = `/book/${slug}`;
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${getSiteUrl()}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`,
            queryParams: { prompt: 'select_account' },
          },
        });
        
        if (error) {
          toast.error('Failed to sign in');
          setLoading(false);
        }
        return;
      }

      // Check profile completion
      if (!profile?.profile_completed) {
        toast('Complete your profile to proceed', { icon: '📋' });
        router.push(`/profile?returnTo=${encodeURIComponent(`/book/${slug}`)}`);
        return;
      }

      // All checks passed, proceed to booking
      router.push(`/book/${slug}`);
    } catch (error) {
      console.error('Book now error:', error);
      toast.error('Something went wrong');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBookNow}
      disabled={loading || tourStatus !== 'booking_open'}
      className={className}
    >
      {loading ? (
        <>
          <span className="inline-block animate-spin mr-2">⏳</span>
          Processing...
        </>
      ) : (
        children || 'Book Now'
      )}
    </button>
  );
}

