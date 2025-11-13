'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { getUserBookings, Booking } from '@/lib/supabase/queries';
import { Calendar, Users, MapPin, CreditCard, CheckCircle, Clock, XCircle, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function MyBookingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookings() {
      const supabase = createSupabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('Please sign in to view your bookings');
        router.push('/');
        return;
      }

      setUserId(user.id);

      const userBookings = await getUserBookings(user.id);
      setBookings(userBookings);
      setLoading(false);
    }
    fetchBookings();
  }, [router]);

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5" />;
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
      case 'completed':
        return <Package className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getPaymentStatusColor = (status: Booking['payment_status']) => {
    switch (status) {
      case 'paid':
        return 'text-green-600';
      case 'partial':
        return 'text-yellow-600';
      case 'pending':
        return 'text-orange-600';
      case 'refunded':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-24 px-6 lg:px-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 px-6 lg:px-16 pb-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            My{' '}
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Bookings
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Track your upcoming adventures and booking history
          </p>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold mb-3">No Bookings Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't booked any tours yet. Start exploring our amazing destinations!
            </p>
            <Link
              href="/packages"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-bold hover:shadow-xl transition-all"
            >
              Explore Tours
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="md:flex">
                  {/* Tour Image */}
                  <div className="md:w-80 h-64 md:h-auto relative">
                    <Image
                      src={booking.tours?.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'}
                      alt={booking.tours?.destination || 'Tour'}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <div className={`px-4 py-2 rounded-full border-2 font-bold text-sm flex items-center gap-2 backdrop-blur-sm ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 p-6 md:p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">
                          {booking.tours?.destination || 'Tour'}, {booking.tours?.country || ''}
                        </h3>
                        <p className="text-gray-600">{booking.tours?.title || ''}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">Booking ID</p>
                        <p className="font-mono text-sm font-bold text-gray-900">
                          {booking.booking_reference || booking.id.slice(0, 8).toUpperCase()}
                        </p>
                      </div>
                    </div>

                    {/* Tour Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Calendar className="w-5 h-5 text-pink-600" />
                        <div>
                          <p className="text-xs text-gray-500">Tour Date</p>
                          <p className="font-semibold">
                            {booking.tours?.start_date ? new Date(booking.tours.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Users className="w-5 h-5 text-pink-600" />
                        <div>
                          <p className="text-xs text-gray-500">Travelers</p>
                          <p className="font-semibold">{booking.num_travelers} {booking.num_travelers === 1 ? 'Person' : 'People'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <CreditCard className="w-5 h-5 text-pink-600" />
                        <div>
                          <p className="text-xs text-gray-500">Payment Status</p>
                          <p className={`font-semibold ${getPaymentStatusColor(booking.payment_status)}`}>
                            {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pricing Breakdown */}
                    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4 mb-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 mb-1">Tour Price</p>
                          <p className="font-bold text-gray-900">₹{booking.tour_price_inr?.toLocaleString('en-IN') || 0}</p>
                        </div>
                        {booking.visa_fee_inr > 0 && (
                          <div>
                            <p className="text-gray-600 mb-1">Visa Fee</p>
                            <p className="font-bold text-gray-900">₹{booking.visa_fee_inr.toLocaleString('en-IN')}</p>
                          </div>
                        )}
                        {booking.insurance_fee_inr > 0 && (
                          <div>
                            <p className="text-gray-600 mb-1">Insurance</p>
                            <p className="font-bold text-gray-900">₹{booking.insurance_fee_inr.toLocaleString('en-IN')}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-gray-600 mb-1">Total Amount</p>
                          <p className="font-bold text-pink-600 text-lg">₹{booking.total_amount_inr?.toLocaleString('en-IN') || 0}</p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Info */}
                    {booking.payment_status !== 'paid' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-semibold text-yellow-900 mb-1">Payment Pending</p>
                            <div className="text-sm text-yellow-800 space-y-1">
                              <p>Deposit Paid: ₹{booking.deposit_paid_inr?.toLocaleString('en-IN') || 0}</p>
                              <p>Balance Due: ₹{booking.balance_due_inr?.toLocaleString('en-IN') || 0}</p>
                              {booking.balance_due_date && (
                                <p className="font-medium">
                                  Due by: {new Date(booking.balance_due_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Add-ons */}
                    {(booking.visa_applied || booking.insurance_applied) && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Add-ons Selected:</p>
                        <div className="flex flex-wrap gap-2">
                          {booking.visa_applied && (
                            <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                              ✓ Visa Assistance
                            </span>
                          )}
                          {booking.insurance_applied && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                              ✓ Travel Insurance
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/packages/${booking.tours?.slug || ''}`}
                        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                      >
                        View Tour Details
                      </Link>
                      {booking.status === 'pending' && (
                        <a
                          href={`https://wa.me/919014369788?text=Hi, I have a question about my booking ${booking.booking_reference || booking.id.slice(0, 8).toUpperCase()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                        >
                          Contact Support
                        </a>
                      )}
                    </div>

                    {/* Booking Date */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Booked on {new Date(booking.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        {bookings.length > 0 && (
          <div className="mt-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200">
            <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
            <p className="text-gray-700 mb-6">
              Have questions about your booking or need to make changes? Our team is here to help!
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/919014369788"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                WhatsApp Support
              </a>
              <Link
                href="/contact"
                className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold border-2 border-gray-200 hover:shadow-lg transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}






