import { getTourBySlug, getTourItinerary, getTourImages, getVisaRequirements } from '@/lib/supabase/queries';
import Image from 'next/image';
import ItineraryTimeline from '@/components/ItineraryTimeline';
import { Calendar, Users, MapPin, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import BookNowButton from '@/components/BookNowButton';

export default async function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  
  if (!tour) {
    return (
      <div className="min-h-screen pt-28 px-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Tour not found</h1>
        <p className="text-gray-600 mb-6">The tour you're looking for doesn't exist or has been removed.</p>
        <Link href="/packages" className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-medium">
          View All Tours
        </Link>
      </div>
    );
  }

  const [itinerary, images, visa] = await Promise.all([
    getTourItinerary(tour.id),
    getTourImages(tour.id),
    getVisaRequirements(tour.id),
  ]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatPrice = (priceInr: number) => {
    return `₹${(priceInr / 1000).toFixed(0)}K`;
  };

  const seatsLeft = tour.total_seats - tour.seats_booked;

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh]">
        <Image 
          src={tour.image_url || '/placeholder.jpg'} 
          alt={tour.destination} 
          fill 
          className="object-cover" 
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-7xl mx-auto w-full px-6 lg:px-16 pb-12">
            <div className="flex items-center gap-4 text-white mb-3">
              <span className="text-6xl">{tour.flag_emoji}</span>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">{tour.destination}</h1>
                <p className="text-white/90 text-lg mt-1">{tour.country}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(tour.start_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{tour.duration_days} Days</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{tour.min_group_size}-{tour.max_group_size} People</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 lg:px-16 py-12 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          {/* Left Column - Details */}
          <div className="md:col-span-2 space-y-8">
            {/* Key Highlights - Moved to Top */}
            {tour.highlights && tour.highlights.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold mb-6">Key Highlights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tour.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 bg-gradient-to-br from-pink-50 to-purple-50 p-5 rounded-xl border border-pink-100 hover:shadow-md transition-shadow">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-800 font-medium">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* About */}
            <div>
              <h2 className="text-3xl font-bold mb-4">About this tour</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{tour.description || tour.title}</p>
            </div>

            {/* Do's & Don'ts */}
            <div className="grid md:grid-cols-2 gap-6">
              {tour.dos && tour.dos.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-3 text-green-600">✅ Do's</h3>
                  <ul className="space-y-2">
                    {tour.dos.map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tour.donts && tour.donts.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-3 text-red-600">❌ Don'ts</h3>
                  <ul className="space-y-2">
                    {tour.donts.map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Gallery */}
            {images.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-4">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img) => (
                    <div key={img.id} className="relative h-48 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                      <Image src={img.image_url} alt={img.caption || tour.destination} fill className="object-cover" />
                      {img.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                          <p className="text-white text-xs">{img.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions & Exclusions - Moved to Bottom */}
            <div className="grid md:grid-cols-2 gap-6 pt-8 border-t border-gray-200">
              {tour.inclusions && tour.inclusions.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-4 text-green-600 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6" />
                    What's Included
                  </h3>
                  <ul className="space-y-3">
                    {tour.inclusions.map((item, i) => (
                      <li key={i} className="text-gray-700 flex items-start gap-3 bg-green-50 p-3 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tour.exclusions && tour.exclusions.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-4 text-red-600 flex items-center gap-2">
                    <XCircle className="w-6 h-6" />
                    What's Not Included
                  </h3>
                  <ul className="space-y-3">
                    {tour.exclusions.map((item, i) => (
                      <li key={i} className="text-gray-700 flex items-start gap-3 bg-red-50 p-3 rounded-lg">
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <aside className="md:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray-200 p-6 bg-white shadow-lg">
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Starting from</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  {formatPrice(tour.price_inr)}
                </p>
                <p className="text-xs text-gray-500 mt-1">per person</p>
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                {tour.status === 'booking_open' && seatsLeft > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-700 font-medium text-sm">✅ Booking Open</p>
                    {seatsLeft <= 5 && (
                      <p className="text-green-600 text-xs mt-1">Only {seatsLeft} seats left!</p>
                    )}
                  </div>
                )}
                {tour.status === 'sold_out' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-700 font-medium text-sm">❌ Sold Out</p>
                  </div>
                )}
                {tour.status === 'coming_soon' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-yellow-700 font-medium text-sm">🔜 Coming Soon</p>
                  </div>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                {tour.status === 'booking_open' && (
                  <BookNowButton
                    slug={tour.slug}
                    tourStatus={tour.status}
                    className="block w-full text-center px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Book Now
                  </BookNowButton>
                )}
                <Link
                  href="/contact"
                  className="block w-full text-center px-6 py-3 rounded-full border-2 border-gray-300 text-gray-700 font-semibold hover:border-pink-500 hover:text-pink-600 transition-all"
                >
                  Enquire
                </Link>
                {visa && (
                  <a
                    href="#visa"
                    className="block w-full text-center px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all"
                  >
                    Visa & Insurance
                  </a>
                )}
              </div>

              {/* Tour Details */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Duration</span>
                  <span className="font-medium text-gray-900">{tour.duration_days} Days</span>
                </div>
                <div className="flex justify-between">
                  <span>Group Size</span>
                  <span className="font-medium text-gray-900">{tour.min_group_size}-{tour.max_group_size}</span>
                </div>
                <div className="flex justify-between">
                  <span>Difficulty</span>
                  <span className="font-medium text-gray-900 capitalize">{tour.difficulty_level || 'Moderate'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Seats Available</span>
                  <span className="font-medium text-gray-900">{seatsLeft}/{tour.total_seats}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Itinerary */}
      {itinerary.length > 0 && (
        <ItineraryTimeline 
          title="Day-by-Day Itinerary" 
          subtitle={`${tour.destination}, ${tour.country}`} 
          items={itinerary.map(day => ({
            day: day.day_number,
            title: day.title,
            photo: day.image_url,
            inclusions: day.activities,
            notes: day.notes,
          }))} 
        />
      )}

      {/* Visa & Insurance */}
      {visa && (
        <section id="visa" className="px-6 lg:px-16 py-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Visa & Insurance</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Visa */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 border border-pink-100">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{visa.visa_type}</h3>
                <p className="text-gray-700 mb-6">{visa.notes}</p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Time</span>
                    <span className="font-semibold">{visa.processing_days} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Validity</span>
                    <span className="font-semibold">{visa.validity_days} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Fee</span>
                    <span className="font-semibold text-pink-600">₹{visa.total_fee_inr?.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {visa.requirements && visa.requirements.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-bold mb-2">Requirements:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {visa.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-pink-500">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Insurance */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Travel Insurance</h3>
                <p className="text-gray-700 mb-6">Comprehensive coverage for your journey</p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coverage</span>
                    <span className="font-semibold">₹5L - ₹10L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Starting from</span>
                    <span className="font-semibold text-blue-600">₹3,500</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-bold mb-2">Covers:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li className="flex items-start gap-2"><span className="text-blue-500">•</span>Medical emergencies</li>
                    <li className="flex items-start gap-2"><span className="text-blue-500">•</span>Trip cancellation</li>
                    <li className="flex items-start gap-2"><span className="text-blue-500">•</span>Baggage loss</li>
                    <li className="flex items-start gap-2"><span className="text-blue-500">•</span>Emergency evacuation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
