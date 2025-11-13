'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { getProfile, updateProfile } from '@/lib/supabase/queries';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

type Profile = {
  fullName: string;
  phone: string;
  passportNumber: string;
  dob: string;
  emergencyName: string;
  emergencyPhone: string;
  diet: string;
  medical: string;
};

const initial: Profile = {
  fullName: '',
  phone: '',
  passportNumber: '',
  dob: '',
  emergencyName: '',
  emergencyPhone: '',
  diet: '',
  medical: '',
};

function ProfilePageContent() {
  const [form, setForm] = useState<Profile>(initial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const requiredKeys: (keyof Profile)[] = [
    'fullName',
    'phone',
    'passportNumber',
    'dob',
    'emergencyName',
    'emergencyPhone',
    'diet',
  ];

  const completed = useMemo(() => {
    let done = 0;
    requiredKeys.forEach((k) => {
      if (String(form[k]).trim().length > 0) done += 1;
    });
    return { done, total: requiredKeys.length, pct: Math.round((done / requiredKeys.length) * 100) };
  }, [form]);

  // Fetch user profile on mount
  useEffect(() => {
    async function fetchProfile() {
      const supabase = createSupabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please sign in to continue');
        router.push('/');
        return;
      }

      setUserId(user.id);
      const profile = await getProfile(user.id);
      
      if (profile) {
        setForm({
          fullName: profile.full_name || '',
          phone: profile.phone || '',
          passportNumber: profile.passport_number || '',
          dob: profile.date_of_birth || '',
          emergencyName: profile.emergency_contact_name || '',
          emergencyPhone: profile.emergency_contact_phone || '',
          diet: profile.dietary_preferences || '',
          medical: profile.medical_conditions || '',
        });
        
        // If profile is already completed, check if we should redirect
        if (profile.profile_completed) {
          const urlParams = new URLSearchParams(window.location.search);
          const returnTo = urlParams.get('returnTo');
          const intendedDestination = sessionStorage.getItem('intendedDestination');
          
          // User already has a completed profile, redirect them appropriately
          if (returnTo) {
            sessionStorage.removeItem('intendedDestination');
            toast.success('Profile already completed!');
            router.push(returnTo);
            return;
          } else if (intendedDestination) {
            sessionStorage.removeItem('intendedDestination');
            toast.success('Profile already completed!');
            router.push(intendedDestination);
            return;
          }
        }
      }
      
      setLoading(false);
    }
    fetchProfile();
  }, [router]);

  const set = (k: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    if (!userId || completed.done !== completed.total) return;

    setSaving(true);
    const success = await updateProfile(userId, {
      full_name: form.fullName,
      phone: form.phone,
      passport_number: form.passportNumber,
      date_of_birth: form.dob,
      emergency_contact_name: form.emergencyName,
      emergency_contact_phone: form.emergencyPhone,
      dietary_preferences: form.diet,
      medical_conditions: form.medical,
      profile_completed: true,
    });

    setSaving(false);

    if (success) {
      toast.success('Profile saved successfully!');
      
      // Check for returnTo parameter or sessionStorage
      const urlParams = new URLSearchParams(window.location.search);
      const returnTo = urlParams.get('returnTo');
      const intendedDestination = sessionStorage.getItem('intendedDestination');
      
      if (returnTo) {
        sessionStorage.removeItem('intendedDestination');
        router.push(returnTo);
      } else if (intendedDestination) {
        sessionStorage.removeItem('intendedDestination');
        router.push(intendedDestination);
      } else {
        router.push('/');
      }
    } else {
      toast.error('Failed to save profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen px-6 lg:px-16 pt-24 pb-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  // Check if user is in a booking flow
  const isInBookingFlow = typeof window !== 'undefined' && (
    sessionStorage.getItem('intendedDestination')?.includes('/book/') ||
    new URLSearchParams(window.location.search).get('returnTo')?.includes('/book/')
  );

  return (
    <main className="min-h-screen px-6 lg:px-16 pt-24 pb-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-5xl mx-auto">
        {isInBookingFlow && (
          <div className="mb-6 bg-pink-50 border border-pink-200 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-2xl">📝</span>
            <div>
              <h3 className="font-bold text-pink-900 mb-1">One more step before booking!</h3>
              <p className="text-pink-800 text-sm">We need some essential information to ensure your journey is safe and comfortable. This is a one-time process.</p>
            </div>
          </div>
        )}
        
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold">
            {isInBookingFlow ? 'Complete your profile to book' : 'Complete your profile'}
          </h1>
          <p className="text-gray-600 mt-2">Share essential details so we can plan safe, comfortable journeys for you. All fields marked with <span className="text-red-500">*</span> are required.</p>
        </header>

        {/* Progress card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600">Profile completion</p>
            <p className="text-sm font-medium text-gray-900">{completed.done}/{completed.total} fields • {completed.pct}%</p>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-600"
              style={{ width: `${completed.pct}%` }}
            />
          </div>
        </div>

        {/* Form card */}
        <form className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full name (as per passport) <span className="text-red-500">*</span>
            </label>
            <input
              value={form.fullName}
              onChange={set('fullName')}
              placeholder="e.g., Vishnu Saha"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={set('phone')}
              placeholder="+91 90143 69788"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <p className="text-xs text-gray-500 mt-1">Include country code (e.g., +91 for India)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passport number <span className="text-red-500">*</span>
            </label>
            <input
              value={form.passportNumber}
              onChange={set('passportNumber')}
              placeholder="A1234567"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.dob}
              onChange={set('dob')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emergency contact name <span className="text-red-500">*</span>
            </label>
            <input
              value={form.emergencyName}
              onChange={set('emergencyName')}
              placeholder="Contact person"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emergency contact phone <span className="text-red-500">*</span>
            </label>
            <input
              value={form.emergencyPhone}
              onChange={set('emergencyPhone')}
              placeholder="+91 90143 69788"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diet preference <span className="text-red-500">*</span>
            </label>
            <select
              value={form.diet}
              onChange={set('diet')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Select</option>
              <option>None</option>
              <option>Vegetarian</option>
              <option>Vegan</option>
              <option>Jain</option>
              <option>Halal</option>
              <option>Other</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Medical conditions (if any)</label>
            <textarea
              value={form.medical}
              onChange={set('medical')}
              placeholder="Allergies, medication, conditions"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setForm(initial)}
              className="px-5 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 font-semibold"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={completed.done !== completed.total || saving}
              className={`px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-pink-500 to-purple-600 shadow ${
                completed.done !== completed.total || saving ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {saving ? 'Saving...' : 'Save profile'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen px-6 lg:px-16 pt-24 pb-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </main>
    }>
      <ProfilePageContent />
    </Suspense>
  );
}
