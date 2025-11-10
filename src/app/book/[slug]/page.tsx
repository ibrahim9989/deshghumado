'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTourBySlug, Tour, createBooking } from '@/lib/supabase/queries';
import { Users, FileText } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AuthGuard from '@/components/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';

function BookTourContent({ slug }: { slug: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [visaFee, setVisaFee] = useState(9000);
  const [insuranceFee, setInsuranceFee] = useState(5000);

  const [form, setForm] = useState({
    numTravelers: 1,
    travelerNames: [''],
    specialRequests: '',
    dietaryRequirements: '',
    visaApplied: false,
    insuranceApplied: false,
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('deshghumado_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setVisaFee(settings.default_visa_fee || 9000);
      setInsuranceFee(settings.default_insurance_fee || 5000);
    }
  }, []);

  useEffect(() => {
    async function init() {
      if (!user) return;

      // Fetch tour
      const tourData = await getTourBySlug(slug);
      if (!tourData) {
        toast.error('Tour not found');
        router.push('/packages');
        return;
      }

      if (tourData.status !== 'booking_open') {
        toast.error('This tour is not available for booking');
        router.push(`/packages/${slug}`);
        return;
      }

      setTour(tourData);
      setLoading(false);
    }
    init();
  }, [slug, router, user]);

  const handleTravelerCountChange = (count: number) => {
    const newCount = Math.max(1, Math.min(count, tour?.max_group_size || 15));
    setForm({
      ...form,
      numTravelers: newCount,
      travelerNames: Array(newCount).fill('').map((_, i) => form.travelerNames[i] || ''),
    });
  };

  const handleTravelerNameChange = (index: number, name: string) => {
    const newNames = [...form.travelerNames];
    newNames[index] = name;
    setForm({ ...form, travelerNames: newNames });
  };

  const calculateTotal = () => {
    if (!tour) return 0;
    let total = tour.price_inr * form.numTravelers;
    if (form.visaApplied) total += visaFee * form.numTravelers;
    if (form.insuranceApplied) total += insuranceFee * form.numTravelers;
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !tour) return;

    // Validate traveler names
    const allNamesFilled = form.travelerNames.every(name => name.trim().length > 0);
    if (!allNamesFilled) {
      toast.error('Please enter names for all travelers');
      return;
    }

    setSubmitting(true);

    const totalAmount = calculateTotal();
    const depositAmount = Math.round(totalAmount * 0.3); // 30% deposit

    const bookingId = await createBooking({
      user_id: user.id,
      tour_id: tour.id,
      num_travelers: form.numTravelers,
      traveler_names: form.travelerNames,
      tour_price_inr: tour.price_inr * form.numTravelers,
      visa_fee_inr: form.visaApplied ? visaFee * form.numTravelers : 0,
      insurance_fee_inr: form.insuranceApplied ? insuranceFee * form.numTravelers : 0,
      total_amount_inr: totalAmount,
      deposit_paid_inr: 0,
      balance_due_inr: totalAmount,
      payment_status: 'pending',
      visa_applied: form.visaApplied,
      insurance_applied: form.insuranceApplied,
      special_requests: form.specialRequests || null,
      dietary_requirements: form.dietaryRequirements || null,
      status: 'pending',
    });

    setSubmitting(false);

    if (!bookingId) {
      toast.error('Failed to create booking. Please try again.');
      return;
    }

    toast.success('Booking created! Redirecting to payment...');
    
    // In a real app, redirect to payment gateway
    setTimeout(() => {
      router.push(`/my-bookings`);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading tour details...</p>
        </div>
      </div>
    );
  }

  if (!tour) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/packages/${slug}`} className="text-orange-600 hover:underline mb-4 inline-block">
            ← Back to Tour Details
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Book Your Adventure</h1>
          <p className="text-xl text-gray-700">{tour.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Number of Travelers */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Users className="inline w-5 h-5 mr-2" />
                  Number of Travelers
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleTravelerCountChange(form.numTravelers - 1)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-bold"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold w-12 text-center">{form.numTravelers}</span>
                  <button
                    type="button"
                    onClick={() => handleTravelerCountChange(form.numTravelers + 1)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-bold"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-500 ml-4">
                    (Max: {tour.max_group_size})
                  </span>
                </div>
              </div>

              {/* Traveler Names */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Traveler Details
                </label>
                <div className="space-y-3">
                  {form.travelerNames.map((name, index) => (
                    <input
                      key={index}
                      type="text"
                      placeholder={`Traveler ${index + 1} Full Name (as per passport)`}
                      value={name}
                      onChange={(e) => handleTravelerNameChange(index, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  ))}
                </div>
              </div>

              {/* Add-Ons */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Optional Add-Ons
                </label>
                <div className="space-y-3">
                  <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={form.visaApplied}
                      onChange={(e) => setForm({ ...form, visaApplied: e.target.checked })}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Visa Assistance</div>
                      <div className="text-sm text-gray-600">
                        We will handle your visa application and documentation
                      </div>
                      <div className="text-orange-600 font-bold mt-1">
                        ₹{visaFee.toLocaleString()} per person
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={form.insuranceApplied}
                      onChange={(e) => setForm({ ...form, insuranceApplied: e.target.checked })}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Travel Insurance</div>
                      <div className="text-sm text-gray-600">
                        Comprehensive coverage for medical emergencies and trip cancellations
                      </div>
                      <div className="text-orange-600 font-bold mt-1">
                        ₹{insuranceFee.toLocaleString()} per person
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Dietary Requirements */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Dietary Requirements (Optional)
                </label>
                <textarea
                  value={form.dietaryRequirements}
                  onChange={(e) => setForm({ ...form, dietaryRequirements: e.target.value })}
                  placeholder="Any food allergies or special dietary needs?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <FileText className="inline w-5 h-5 mr-2" />
                  Special Requests (Optional)
                </label>
                <textarea
                  value={form.specialRequests}
                  onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                  placeholder="Any special requests or requirements for your trip?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={4}
                />
              </div>

              {/* Terms */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  By proceeding, you agree to our{' '}
                  <Link href="/terms" className="text-orange-600 hover:underline font-semibold">
                    Terms & Conditions
                  </Link>
                  . A 30% deposit is required to confirm your booking.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </form>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Tour Price (×{form.numTravelers})</span>
                  <span>₹{(tour.price_inr * form.numTravelers).toLocaleString()}</span>
                </div>
                
                {form.visaApplied && (
                  <div className="flex justify-between text-gray-700">
                    <span>Visa (×{form.numTravelers})</span>
                    <span>₹{(visaFee * form.numTravelers).toLocaleString()}</span>
                  </div>
                )}
                
                {form.insuranceApplied && (
                  <div className="flex justify-between text-gray-700">
                    <span>Insurance (×{form.numTravelers})</span>
                    <span>₹{(insuranceFee * form.numTravelers).toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-gray-900 mb-2">
                  <span>Total Amount</span>
                  <span>₹{calculateTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-orange-600 font-semibold">
                  <span>Deposit (30%)</span>
                  <span>₹{Math.round(calculateTotal() * 0.3).toLocaleString()}</span>
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p>✓ Secure payment processing</p>
                <p>✓ Instant booking confirmation</p>
                <p>✓ 24/7 customer support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookTourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  
  return (
    <AuthGuard requireAuth={true} requireProfile={true}>
      <BookTourContent slug={slug} />
    </AuthGuard>
  );
}
