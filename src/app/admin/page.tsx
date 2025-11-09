'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { getAllBookings, getAllEnquiries, getProfile, updateBookingStatus, updateEnquiryStatus, Booking, Enquiry } from '@/lib/supabase/queries';
import { Calendar, Mail, DollarSign, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [activeTab, setActiveTab] = useState<'bookings' | 'enquiries'>('bookings');

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

      // Fetch data
      const [bookingsData, enquiriesData] = await Promise.all([
        getAllBookings(),
        getAllEnquiries(),
      ]);

      setBookings(bookingsData);
      setEnquiries(enquiriesData);
      setLoading(false);
    }
    checkAdminAndFetch();
  }, [router]);

  const handleBookingStatusChange = async (bookingId: string, status: Booking['status']) => {
    const success = await updateBookingStatus(bookingId, status);
    if (success) {
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status } : b));
      toast.success('Booking status updated');
    } else {
      toast.error('Failed to update booking status');
    }
  };

  const handleEnquiryStatusChange = async (enquiryId: string, status: Enquiry['status']) => {
    const success = await updateEnquiryStatus(enquiryId, status);
    if (success) {
      setEnquiries(enquiries.map(e => e.id === enquiryId ? { ...e, status } : e));
      toast.success('Enquiry status updated');
    } else {
      toast.error('Failed to update enquiry status');
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

  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
    totalRevenue: bookings
      .filter(b => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum, b) => sum + b.total_amount_inr, 0),
    newEnquiries: enquiries.filter(e => e.status === 'new').length,
  };

  return (
    <main className="min-h-screen pt-24 px-6 lg:px-16 pb-20 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage bookings and enquiries</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-pink-600" />
              <p className="text-sm text-gray-600">Total Bookings</p>
            </div>
            <p className="text-3xl font-bold">{stats.totalBookings}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingBookings}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm text-gray-600">Confirmed</p>
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.confirmedBookings}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <p className="text-sm text-gray-600">Revenue</p>
            </div>
            <p className="text-2xl font-bold text-purple-600">₹{(stats.totalRevenue / 100000).toFixed(1)}L</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-gray-600">New Enquiries</p>
            </div>
            <p className="text-3xl font-bold text-blue-600">{stats.newEnquiries}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link
            href="/admin/tours"
            className="p-6 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <h3 className="text-xl font-bold mb-2">Manage Tours</h3>
            <p className="text-white/90 text-sm">Create, edit, and delete tour packages</p>
          </Link>
          <Link
            href="/admin"
            className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <h3 className="text-xl font-bold mb-2">View Bookings</h3>
            <p className="text-white/90 text-sm">Manage customer bookings</p>
          </Link>
          <Link
            href="/admin"
            className="p-6 bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <h3 className="text-xl font-bold mb-2">View Enquiries</h3>
            <p className="text-white/90 text-sm">Respond to customer enquiries</p>
          </Link>
          <Link
            href="/admin/settings"
            className="p-6 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <h3 className="text-xl font-bold mb-2">Settings</h3>
            <p className="text-white/90 text-sm">Configure add-on pricing</p>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'bookings'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-pink-500'
            }`}
          >
            Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'enquiries'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-pink-500'
            }`}
          >
            Enquiries ({enquiries.length})
          </button>
        </div>

        {/* Bookings Table */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Ref</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">User ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Travelers</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Payment</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono">{booking.booking_reference}</td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">{booking.user_id.slice(0, 8)}...</td>
                      <td className="px-6 py-4 text-sm">{booking.num_travelers}</td>
                      <td className="px-6 py-4 text-sm font-semibold">₹{booking.total_amount_inr.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.payment_status === 'fully_paid' ? 'bg-green-100 text-green-700' :
                          booking.payment_status === 'deposit_paid' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {booking.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <select
                          value={booking.status}
                          onChange={(e) => handleBookingStatusChange(booking.id, e.target.value as Booking['status'])}
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="completed">Completed</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {bookings.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No bookings yet
              </div>
            )}
          </div>
        )}

        {/* Enquiries Table */}
        {activeTab === 'enquiries' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Phone</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Subject</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {enquiries.map((enquiry) => (
                    <tr key={enquiry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium">{enquiry.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{enquiry.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{enquiry.phone || '-'}</td>
                      <td className="px-6 py-4 text-sm">{enquiry.subject || 'General'}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          enquiry.status === 'new' ? 'bg-blue-100 text-blue-700' :
                          enquiry.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                          enquiry.status === 'resolved' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {enquiry.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(enquiry.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <select
                          value={enquiry.status}
                          onChange={(e) => handleEnquiryStatusChange(enquiry.id, e.target.value as Enquiry['status'])}
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                        >
                          <option value="new">New</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {enquiries.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No enquiries yet
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

