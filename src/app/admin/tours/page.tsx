'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { getAllTours, getProfile, Tour } from '@/lib/supabase/queries';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminToursPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState<Tour[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdminAndFetch() {
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

      const toursData = await getAllTours();
      setTours(toursData);
      setLoading(false);
    }
    checkAdminAndFetch();
  }, [router]);

  const handleDelete = async (tourId: string, tourName: string) => {
    if (!confirm(`Are you sure you want to delete "${tourName}"? This will also delete all itineraries, images, and visa requirements.`)) {
      return;
    }

    const supabase = createSupabaseBrowser();
    const { error } = await supabase.from('tours').delete().eq('id', tourId);

    if (error) {
      toast.error('Failed to delete tour: ' + error.message);
    } else {
      toast.success('Tour deleted successfully');
      setTours(tours.filter(t => t.id !== tourId));
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-24 px-6 lg:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  if (!isAdmin) return null;

  const formatPrice = (priceInr: number) => `₹${(priceInr / 1000).toFixed(0)}K`;
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <main className="min-h-screen pt-24 px-6 lg:px-16 pb-20 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Manage Tours</h1>
            <p className="text-gray-600">Create, edit, and delete tour packages</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/admin/tours/new"
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Tour
            </Link>
          </div>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => {
            const seatsLeft = tour.total_seats - tour.seats_booked;
            
            return (
              <div key={tour.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Tour Image */}
                <div className="relative h-48 bg-gray-200">
                  {tour.image_url && (
                    <img src={tour.image_url} alt={tour.destination} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute top-3 left-3 text-4xl">{tour.flag_emoji}</div>
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
                    tour.status === 'booking_open' ? 'bg-green-500 text-white' :
                    tour.status === 'sold_out' ? 'bg-red-500 text-white' :
                    tour.status === 'coming_soon' ? 'bg-yellow-500 text-white' :
                    'bg-gray-500 text-white'
                  }`}>
                    {tour.status.replace('_', ' ').toUpperCase()}
                  </div>
                </div>

                {/* Tour Info */}
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-2">{tour.destination}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tour.description || tour.title}</p>

                  <div className="space-y-2 mb-4 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>Start Date:</span>
                      <span className="font-medium">{formatDate(tour.start_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{tour.duration_days} Days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price:</span>
                      <span className="font-bold text-pink-600">{formatPrice(tour.price_inr)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Seats:</span>
                      <span className={`font-medium ${seatsLeft === 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {seatsLeft}/{tour.total_seats}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/packages/${tour.slug}`}
                      target="_blank"
                      className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                    <Link
                      href={`/admin/tours/edit/${tour.id}`}
                      className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(tour.id, tour.destination)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {tours.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">No tours yet</p>
            <Link
              href="/admin/tours/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Your First Tour
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

