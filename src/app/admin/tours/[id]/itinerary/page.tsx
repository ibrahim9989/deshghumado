'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { getProfile, getTourBySlug } from '@/lib/supabase/queries';
import { Save, Plus, X, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

type ItineraryDay = {
  id?: string;
  day_number: number;
  title: string;
  description: string;
  activities: string[];
  meals_included: string[];
  accommodation: string;
  image_url: string;
  notes: string;
};

export default function ManageItineraryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: tourId } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tourName, setTourName] = useState('');
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);

  useEffect(() => {
    async function init() {
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

      // Fetch tour
      const { data: tour } = await supabase.from('tours').select('destination').eq('id', tourId).single();
      if (tour) setTourName(tour.destination);

      // Fetch itinerary
      const { data: itineraryData } = await supabase
        .from('itinerary')
        .select('*')
        .eq('tour_id', tourId)
        .order('day_number', { ascending: true });

      if (itineraryData && itineraryData.length > 0) {
        setItinerary(itineraryData);
      }

      setLoading(false);
    }
    init();
  }, [tourId, router]);

  const addDay = () => {
    const newDay: ItineraryDay = {
      day_number: itinerary.length + 1,
      title: '',
      description: '',
      activities: [''],
      meals_included: [],
      accommodation: '',
      image_url: '',
      notes: '',
    };
    setItinerary([...itinerary, newDay]);
  };

  const removeDay = async (index: number) => {
    const day = itinerary[index];
    if (day.id) {
      // Delete from database
      const supabase = createSupabaseBrowser();
      await supabase.from('itinerary').delete().eq('id', day.id);
    }
    setItinerary(itinerary.filter((_, i) => i !== index));
  };

  const updateDay = (index: number, field: keyof ItineraryDay, value: any) => {
    const newItinerary = [...itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setItinerary(newItinerary);
  };

  const addActivity = (dayIndex: number) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].activities.push('');
    setItinerary(newItinerary);
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].activities = newItinerary[dayIndex].activities.filter((_, i) => i !== activityIndex);
    setItinerary(newItinerary);
  };

  const updateActivity = (dayIndex: number, activityIndex: number, value: string) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].activities[activityIndex] = value;
    setItinerary(newItinerary);
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createSupabaseBrowser();

    // Delete all existing itinerary for this tour
    await supabase.from('itinerary').delete().eq('tour_id', tourId);

    // Insert new itinerary
    const itineraryToSave = itinerary.map((day, index) => ({
      tour_id: tourId,
      day_number: index + 1,
      title: day.title,
      description: day.description,
      activities: day.activities.filter(a => a.trim()),
      meals_included: day.meals_included,
      accommodation: day.accommodation,
      image_url: day.image_url || null,
      notes: day.notes,
    }));

    const { error } = await supabase.from('itinerary').insert(itineraryToSave);

    setSaving(false);

    if (error) {
      toast.error('Failed to save itinerary: ' + error.message);
    } else {
      toast.success('Itinerary saved successfully!');
      router.push(`/admin/tours/edit/${tourId}`);
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
            <h1 className="text-4xl font-bold mb-2">Manage Itinerary: {tourName}</h1>
            <p className="text-gray-600">Add day-by-day tour schedule</p>
          </div>
          <Link
            href={`/admin/tours/edit/${tourId}`}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
        </div>

        {/* Itinerary Days */}
        <div className="space-y-6">
          {itinerary.map((day, dayIndex) => (
            <div key={dayIndex} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Day {dayIndex + 1}</h2>
                <button
                  type="button"
                  onClick={() => removeDay(dayIndex)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove Day
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={day.title}
                    onChange={(e) => updateDay(dayIndex, 'title', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., Arrival & Old Beijing Walk"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={day.description}
                    onChange={(e) => updateDay(dayIndex, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Describe what happens on this day..."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Activities</label>
                    <button
                      type="button"
                      onClick={() => addActivity(dayIndex)}
                      className="px-3 py-1 bg-pink-500 text-white rounded-lg text-sm hover:bg-pink-600 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {day.activities.map((activity, actIndex) => (
                      <div key={actIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={activity}
                          onChange={(e) => updateActivity(dayIndex, actIndex, e.target.value)}
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                          placeholder="e.g., Airport pickup"
                        />
                        <button
                          type="button"
                          onClick={() => removeActivity(dayIndex, actIndex)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Accommodation</label>
                    <input
                      type="text"
                      value={day.accommodation}
                      onChange={(e) => updateDay(dayIndex, 'accommodation', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="e.g., Hotel in Beijing"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                    <input
                      type="url"
                      value={day.image_url}
                      onChange={(e) => updateDay(dayIndex, 'image_url', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <input
                    type="text"
                    value={day.notes}
                    onChange={(e) => updateDay(dayIndex, 'notes', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., Acclimatise and evening walk through hutongs"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add Day Button */}
          <button
            type="button"
            onClick={addDay}
            className="w-full px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-pink-500 hover:text-pink-600 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Day {itinerary.length + 1}
          </button>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex gap-4">
          <Link
            href={`/admin/tours/edit/${tourId}`}
            className="px-8 py-4 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={saving || itinerary.length === 0}
            className={`flex-1 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 ${
              saving || itinerary.length === 0 ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Itinerary'}
          </button>
        </div>
      </div>
    </main>
  );
}

