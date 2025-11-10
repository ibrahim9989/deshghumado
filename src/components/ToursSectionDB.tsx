'use client';

import { Calendar, Users, MapPin, ArrowRight, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { getAllTours, Tour } from '@/lib/supabase/queries';
import Link from 'next/link';

export default function ToursSectionDB() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'soon'>('all');
  const [activeTour, setActiveTour] = useState<Tour | null>(null);

  // Fetch tours from Supabase
  useEffect(() => {
    async function fetchTours() {
      setLoading(true);
      const data = await getAllTours();
      setTours(data);
      setLoading(false);
    }
    fetchTours();
  }, []);

  const filtered = useMemo(() => {
    return tours.filter((t) => {
      const matchesQuery = t.destination.toLowerCase().includes(query.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'open' && t.status === 'booking_open') ||
        (statusFilter === 'soon' && t.status !== 'booking_open');
      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter, tours]);

  // Calculate seats left
  const getSeatsLeft = (tour: Tour) => tour.total_seats - tour.seats_booked;

  // Format price
  const formatPrice = (priceInr: number) => {
    return `₹${(priceInr / 1000).toFixed(0)}K`;
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Status badge
  const getStatusBadge = (status: Tour['status']) => {
    const badges = {
      booking_open: 'bg-green-500 text-white',
      coming_soon: 'bg-yellow-500 text-white',
      sold_out: 'bg-red-500 text-white',
      cancelled: 'bg-gray-500 text-white',
    };
    const labels = {
      booking_open: 'Booking Open',
      coming_soon: 'Coming Soon',
      sold_out: 'Sold Out',
      cancelled: 'Cancelled',
    };
    return { class: badges[status], label: labels[status] };
  };

  if (loading) {
    return (
      <section id="tours" className="py-20 px-6 lg:px-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="tours" className="py-20 px-6 lg:px-16 bg-gradient-to-b from-white to-gray-50">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          Current Tours with{' '}
          <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Wandering Maniac
          </span>
        </h2>
        <p className="text-gray-600 text-lg">
          Join Vishnu Saha on unforgettable journeys across the globe
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <input
            type="text"
            placeholder="Search destinations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                statusFilter === 'all'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-pink-500'
              }`}
            >
              All Tours
            </button>
            <button
              onClick={() => setStatusFilter('open')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                statusFilter === 'open'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-pink-500'
              }`}
            >
              Booking Open
            </button>
            <button
              onClick={() => setStatusFilter('soon')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                statusFilter === 'soon'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-pink-500'
              }`}
            >
              Coming Soon
            </button>
          </div>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((tour) => {
          const seatsLeft = getSeatsLeft(tour);
          const statusBadge = getStatusBadge(tour.status);

          return (
            <div
              key={tour.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-64">
                <Image
                  src={tour.image_url || '/placeholder.jpg'}
                  alt={tour.destination}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 text-5xl">{tour.flag_emoji}</div>
                <div className={`absolute top-4 right-4 px-4 py-2 rounded-full font-bold ${statusBadge.class}`}>
                  {statusBadge.label}
                </div>

                {/* Seats Meter for Sold Out */}
                {tour.status === 'sold_out' && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm font-medium">Seats</span>
                      <span className="text-red-400 text-sm font-bold">
                        {tour.seats_booked}/{tour.total_seats} SOLD OUT
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                )}

                {/* Seats Left for Booking Open */}
                {tour.status === 'booking_open' && seatsLeft <= 5 && (
                  <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                    Only {seatsLeft} seats left!
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tour.destination}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{tour.description || tour.title}</p>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-pink-500" />
                    <span className="text-sm">{formatDate(tour.start_date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4 text-pink-500" />
                    <span className="text-sm">{tour.duration_days} Days</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users className="w-4 h-4 text-pink-500" />
                    <span className="text-sm">
                      {tour.min_group_size}-{tour.max_group_size} People
                    </span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tour.highlights?.slice(0, 3).map((h, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs font-medium"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{formatPrice(tour.price_inr)}</p>
                    <p className="text-xs text-gray-500">per person</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTour(tour)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      Details
                    </button>
                    {tour.status === 'booking_open' ? (
                      <Link
                        href={`/packages/${tour.slug}`}
                        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        Book Now <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : tour.status === 'sold_out' ? (
                      <button
                        disabled
                        className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg font-medium cursor-not-allowed"
                      >
                        Sold Out
                      </button>
                    ) : (
                      <Link
                        href={`/packages/${tour.slug}`}
                        className="px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                      >
                        View Tour
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tours found. Try adjusting your filters.</p>
        </div>
      )}

      {/* Details Modal */}
      {activeTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 relative">
            <button
              onClick={() => setActiveTour(null)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-3xl font-bold mb-4">{activeTour.destination}</h3>
            <p className="text-gray-600 mb-6">{activeTour.description}</p>

            {/* Do's & Don'ts */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-green-600 mb-3 flex items-center gap-2">
                  <span className="text-2xl">✅</span> Do's
                </h4>
                <ul className="space-y-2">
                  {activeTour.dos?.map((item, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-red-600 mb-3 flex items-center gap-2">
                  <span className="text-2xl">❌</span> Don'ts
                </h4>
                <ul className="space-y-2">
                  {activeTour.donts?.map((item, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Link
              href={`/packages/${activeTour.slug}`}
              className="mt-6 w-full block text-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
            >
              View Full Details
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}



