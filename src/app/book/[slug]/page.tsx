'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTourBySlug, Tour, createBooking, getProfile } from '@/lib/supabase/queries';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { Calendar, Users, CreditCard, FileText } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function BookTourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileComplete, setProfileComplete] = useState(false);
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
      // Check auth
      const supabase = createSupabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please sign in to book a tour');
        router.push('/');
        return;
      }

      setUserId(user.id);

      // Check profile completion
      const profile = await getProfile(user.id);
      if (!profile?.profile_completed) {
        toast.error('Please complete your profile before booking');
        router.push('/profile');
        return;
      }
      setProfileComplete(true);

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
  }, [slug, router]);

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
    if (!userId || !tour) return;

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
      user_id: userId,
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

    if (bookingId) {
      toast.success(
        `Booking created! ID: ${bookingId}. Deposit: ₹${depositAmount.toLocaleString('en-IN')}. We'll contact you shortly with payment details.`,
        { duration: 6000 }
      );
      router.push('/');
    } else {
      toast.error('Failed to create booking. Please try again or contact us.');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-24 px-6 lg:px-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  if (!tour) return null;

  const totalAmount = calculateTotal();
  const depositAmount = Math.round(totalAmount * 0.3);

  return (
    <main className="min-h-screen pt-24 px-6 lg:px-16 pb-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/packages/${tour.slug}`} className="text-pink-600 hover:underline mb-2 inline-block">
            ← Back to tour details
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Book Your Tour</h1>
          <p className="text-gray-600 text-lg">{tour.destination}, {tour.country}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
            {/* Number of Travelers */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-pink-600" />
                <h2 className="text-xl font-bold">Number of Travelers</h2>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleTravelerCountChange(form.numTravelers - 1)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 font-bold"
                >
                  -
                </button>
                <span className="text-2xl font-bold w-12 text-center">{form.numTravelers}</span>
                <button
                  type="button"
                  onClick={() => handleTravelerCountChange(form.numTravelers + 1)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 font-bold"
                >
                  +
                </button>
                <span className="text-gray-600 text-sm ml-4">
                  (Max: {tour.max_group_size})
                </span>
              </div>
            </div>

            {/* Traveler Names */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-pink-600" />
                <h2 className="text-xl font-bold">Traveler Details</h2>
              </div>
              <div className="space-y-3">
                {form.travelerNames.map((name, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Traveler {index + 1} (Full Name as per Passport)
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handleTravelerNameChange(index, e.target.value)}
                      placeholder="e.g., Vishnu Saha"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold mb-4">Add-ons</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.visaApplied}
                    onChange={(e) => setForm({ ...form, visaApplied: e.target.checked })}
                    className="w-5 h-5 text-pink-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Visa Assistance</p>
                    <p className="text-sm text-gray-600">We'll help you with visa application</p>
                  </div>
                  <p className="font-bold text-pink-600">+₹{visaFee.toLocaleString('en-IN')}/person</p>
                </label>

                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.insuranceApplied}
                    onChange={(e) => setForm({ ...form, insuranceApplied: e.target.checked })}
                    className="w-5 h-5 text-pink-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Travel Insurance</p>
                    <p className="text-sm text-gray-600">Comprehensive coverage up to ₹5L</p>
                  </div>
                  <p className="font-bold text-pink-600">+₹{insuranceFee.toLocaleString('en-IN')}/person</p>
                </label>
              </div>
            </div>

            {/* Special Requests */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold mb-4">Additional Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dietary Requirements
                  </label>
                  <input
                    type="text"
                    value={form.dietaryRequirements}
                    onChange={(e) => setForm({ ...form, dietaryRequirements: e.target.value })}
                    placeholder="e.g., Vegetarian, Vegan, Allergies"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={form.specialRequests}
                    onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                    placeholder="Any special requirements or requests..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full px-8 py-4 rounded-full text-white font-bold text-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-xl transition-all ${
                submitting ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Processing...' : 'Confirm Booking'}
            </button>
          </form>

          {/* Price Summary */}
          <aside className="md:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-4">Price Summary</h3>
              
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Tour Price × {form.numTravelers}</span>
                  <span>₹{(tour.price_inr * form.numTravelers).toLocaleString('en-IN')}</span>
                </div>
                {form.visaApplied && (
                  <div className="flex justify-between text-gray-700">
                    <span>Visa × {form.numTravelers}</span>
                    <span>₹{(visaFee * form.numTravelers).toLocaleString('en-IN')}</span>
                  </div>
                )}
                {form.insuranceApplied && (
                  <div className="flex justify-between text-gray-700">
                    <span>Insurance × {form.numTravelers}</span>
                    <span>₹{(insuranceFee * form.numTravelers).toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-pink-600">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Deposit (30%)</span>
                  <span className="font-semibold">₹{depositAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="bg-pink-50 rounded-xl p-4 text-sm text-gray-700">
                <p className="font-medium mb-2">📌 Payment Terms:</p>
                <ul className="space-y-1 text-xs">
                  <li>• 30% deposit required to confirm</li>
                  <li>• Balance due 15 days before departure</li>
                  <li>• Secure payment link will be sent via email</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

