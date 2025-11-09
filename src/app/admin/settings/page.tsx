'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { getProfile } from '@/lib/supabase/queries';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

type Settings = {
  default_visa_fee: number;
  default_insurance_fee: number;
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    default_visa_fee: 9000,
    default_insurance_fee: 5000,
  });

  useEffect(() => {
    async function checkAdmin() {
      const supabase = createSupabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('Please sign in');
        router.push('/');
        return;
      }

      const profile = await getProfile(user.id);
      if (profile?.role !== 'admin') {
        toast.error('Access denied. Admin only.');
        router.push('/');
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    }
    checkAdmin();
  }, [router]);

  const handleSave = () => {
    setSaving(true);
    
    // Store in localStorage for now (you can create a settings table later)
    localStorage.setItem('deshghumado_settings', JSON.stringify(settings));
    
    setSaving(false);
    toast.success('Settings saved successfully!');
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-24 px-6 lg:px-16 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  if (!isAdmin) return null;

  return (
    <main className="min-h-screen pt-24 px-6 lg:px-16 pb-20 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Settings</h1>
            <p className="text-gray-600">Configure default pricing for add-ons</p>
          </div>
          <Link
            href="/admin"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>

        {/* Settings Form */}
        <div className="space-y-6">
          {/* Add-on Pricing */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold mb-6">Add-on Pricing</h2>
            <p className="text-gray-600 mb-6">
              Set default prices for visa assistance and travel insurance. These will be used in the booking form.
            </p>

            <div className="space-y-6">
              {/* Visa Assistance */}
              <div className="p-6 bg-pink-50 rounded-xl border border-pink-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Visa Assistance</h3>
                    <p className="text-gray-600 text-sm">We'll help you with visa application</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Price per person</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-pink-600">₹</span>
                      <input
                        type="number"
                        value={settings.default_visa_fee}
                        onChange={(e) => setSettings({ ...settings, default_visa_fee: parseInt(e.target.value) || 0 })}
                        className="w-32 px-4 py-2 text-2xl font-bold text-pink-600 rounded-lg border-2 border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        min="0"
                        step="100"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-2">Includes:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Documentation assistance</li>
                    <li>Form filling and submission</li>
                    <li>Status tracking</li>
                    <li>E-visa copy via email</li>
                  </ul>
                </div>
              </div>

              {/* Travel Insurance */}
              <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Travel Insurance</h3>
                    <p className="text-gray-600 text-sm">Comprehensive coverage up to ₹5L</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Price per person</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-blue-600">₹</span>
                      <input
                        type="number"
                        value={settings.default_insurance_fee}
                        onChange={(e) => setSettings({ ...settings, default_insurance_fee: parseInt(e.target.value) || 0 })}
                        className="w-32 px-4 py-2 text-2xl font-bold text-blue-600 rounded-lg border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="100"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-2">Covers:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Medical emergencies</li>
                    <li>Trip cancellation</li>
                    <li>Baggage loss</li>
                    <li>Emergency evacuation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200">
            <h3 className="text-xl font-bold mb-4">Preview - Booking Form Add-ons</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 text-pink-600" />
                <div className="flex-1">
                  <p className="font-medium">Visa Assistance</p>
                  <p className="text-sm text-gray-600">We'll help you with visa application</p>
                </div>
                <p className="font-bold text-pink-600">+₹{settings.default_visa_fee.toLocaleString('en-IN')}/person</p>
              </label>

              <label className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 text-pink-600" />
                <div className="flex-1">
                  <p className="font-medium">Travel Insurance</p>
                  <p className="text-sm text-gray-600">Comprehensive coverage up to ₹5L</p>
                </div>
                <p className="font-bold text-pink-600">+₹{settings.default_insurance_fee.toLocaleString('en-IN')}/person</p>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-4">
            <Link
              href="/admin"
              className="px-8 py-4 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex-1 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 ${
                saving ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

