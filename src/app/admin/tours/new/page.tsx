'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { getProfile } from '@/lib/supabase/queries';
import { Save, Plus, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

type TourForm = {
  slug: string;
  destination: string;
  country: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  price_inr: number;
  status: 'booking_open' | 'coming_soon' | 'sold_out' | 'cancelled';
  total_seats: number;
  min_group_size: number;
  max_group_size: number;
  difficulty_level: 'easy' | 'moderate' | 'challenging' | 'extreme';
  image_url: string;
  flag_emoji: string;
  color_gradient: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  dos: string[];
  donts: string[];
  featured: boolean;
};

const initialForm: TourForm = {
  slug: '',
  destination: '',
  country: '',
  title: '',
  description: '',
  start_date: '',
  end_date: '',
  duration_days: 7,
  price_inr: 100000,
  status: 'coming_soon',
  total_seats: 15,
  min_group_size: 12,
  max_group_size: 15,
  difficulty_level: 'moderate',
  image_url: '',
  flag_emoji: '🌍',
  color_gradient: 'from-pink-500 to-purple-600',
  highlights: [''],
  inclusions: [''],
  exclusions: [''],
  dos: [''],
  donts: [''],
  featured: false,
};

export default function NewTourPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState<TourForm>(initialForm);

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

  const handleArrayAdd = (field: keyof Pick<TourForm, 'highlights' | 'inclusions' | 'exclusions' | 'dos' | 'donts'>) => {
    setForm({ ...form, [field]: [...form[field], ''] });
  };

  const handleArrayRemove = (field: keyof Pick<TourForm, 'highlights' | 'inclusions' | 'exclusions' | 'dos' | 'donts'>, index: number) => {
    const newArray = form[field].filter((_, i) => i !== index);
    setForm({ ...form, [field]: newArray });
  };

  const handleArrayChange = (field: keyof Pick<TourForm, 'highlights' | 'inclusions' | 'exclusions' | 'dos' | 'donts'>, index: number, value: string) => {
    const newArray = [...form[field]];
    newArray[index] = value;
    setForm({ ...form, [field]: newArray });
  };

  const generateSlug = () => {
    const slug = form.destination.toLowerCase().replace(/\s+/g, '-') + '-' + form.start_date.split('-').slice(1).join('-');
    setForm({ ...form, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Clean up empty array items
    const cleanedForm = {
      ...form,
      highlights: form.highlights.filter(h => h.trim()),
      inclusions: form.inclusions.filter(i => i.trim()),
      exclusions: form.exclusions.filter(e => e.trim()),
      dos: form.dos.filter(d => d.trim()),
      donts: form.donts.filter(d => d.trim()),
    };

    const supabase = createSupabaseBrowser();
    const { error } = await supabase.from('tours').insert([cleanedForm]);

    setSaving(false);

    if (error) {
      toast.error('Failed to create tour: ' + error.message);
    } else {
      toast.success('Tour created successfully!');
      router.push('/admin/tours');
    }
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
            <h1 className="text-4xl font-bold mb-2">Create New Tour</h1>
            <p className="text-gray-600">Fill in all the details for the new tour package</p>
          </div>
          <Link
            href="/admin/tours"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination *</label>
                <input
                  type="text"
                  value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., China"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., China"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., China Adventure - Beijing & Beyond"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Describe the tour..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    required
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., china-nov-14"
                  />
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Flag Emoji</label>
                <input
                  type="text"
                  value={form.flag_emoji}
                  onChange={(e) => setForm({ ...form, flag_emoji: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="🇨🇳"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL *</label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>
          </div>

          {/* Dates & Pricing */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold mb-6">Dates & Pricing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Days) *</label>
                <input
                  type="number"
                  value={form.duration_days}
                  onChange={(e) => setForm({ ...form, duration_days: parseInt(e.target.value) })}
                  required
                  min="1"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (INR) *</label>
                <input
                  type="number"
                  value={form.price_inr}
                  onChange={(e) => setForm({ ...form, price_inr: parseInt(e.target.value) })}
                  required
                  min="0"
                  step="1000"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="booking_open">Booking Open</option>
                  <option value="coming_soon">Coming Soon</option>
                  <option value="sold_out">Sold Out</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                <select
                  value={form.difficulty_level}
                  onChange={(e) => setForm({ ...form, difficulty_level: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="challenging">Challenging</option>
                  <option value="extreme">Extreme</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Seats *</label>
                <input
                  type="number"
                  value={form.total_seats}
                  onChange={(e) => setForm({ ...form, total_seats: parseInt(e.target.value) })}
                  required
                  min="1"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Group Size *</label>
                <input
                  type="number"
                  value={form.min_group_size}
                  onChange={(e) => setForm({ ...form, min_group_size: parseInt(e.target.value) })}
                  required
                  min="1"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Group Size *</label>
                <input
                  type="number"
                  value={form.max_group_size}
                  onChange={(e) => setForm({ ...form, max_group_size: parseInt(e.target.value) })}
                  required
                  min="1"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="w-5 h-5 text-pink-600"
                />
                <label className="text-sm font-medium text-gray-700">Featured Tour</label>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Highlights</h2>
              <button
                type="button"
                onClick={() => handleArrayAdd('highlights')}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="space-y-3">
              {form.highlights.map((highlight, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => handleArrayChange('highlights', index, e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., Great Wall"
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayRemove('highlights', index)}
                    className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">What's Included</h2>
              <button
                type="button"
                onClick={() => handleArrayAdd('inclusions')}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="space-y-3">
              {form.inclusions.map((inclusion, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={inclusion}
                    onChange={(e) => handleArrayChange('inclusions', index, e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., Accommodation (9 nights)"
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayRemove('inclusions', index)}
                    className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Exclusions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">What's Not Included</h2>
              <button
                type="button"
                onClick={() => handleArrayAdd('exclusions')}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="space-y-3">
              {form.exclusions.map((exclusion, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={exclusion}
                    onChange={(e) => handleArrayChange('exclusions', index, e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., International flights"
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayRemove('exclusions', index)}
                    className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Do's */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Do's</h2>
              <button
                type="button"
                onClick={() => handleArrayAdd('dos')}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="space-y-3">
              {form.dos.map((doItem, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={doItem}
                    onChange={(e) => handleArrayChange('dos', index, e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., Carry passport at all times"
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayRemove('dos', index)}
                    className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Don'ts */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Don'ts</h2>
              <button
                type="button"
                onClick={() => handleArrayAdd('donts')}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="space-y-3">
              {form.donts.map((dontItem, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={dontItem}
                    onChange={(e) => handleArrayChange('donts', index, e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., Don't litter at heritage sites"
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayRemove('donts', index)}
                    className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Link
              href="/admin/tours"
              className="px-8 py-4 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className={`flex-1 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 ${
                saving ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <Save className="w-5 h-5" />
              {saving ? 'Creating...' : 'Create Tour'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

