'use client';

import { Calendar, Users, MapPin, ArrowRight, X } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { tours as toursData, Tour } from '@/data/tours';

const tours = toursData;

export default function ToursSection() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | 'open' | 'soon'>('all');
  const [activeTour, setActiveTour] = useState<Tour | null>(null);
  const [chinaCountdown, setChinaCountdown] = useState('');

  const filtered = useMemo(() => {
    return tours.filter((t) => {
      const matchesQuery = t.destination.toLowerCase().includes(query.toLowerCase());
      const matchesStatus =
        status === 'all' || (status === 'open' && t.status === 'Booking Open') || (status === 'soon' && t.status !== 'Booking Open');
      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  // Countdown for China
  useMemo(() => {
    const china = tours.find((t) => t.destination === 'China' && t.startISO);
    if (!china?.startISO) return;
    const update = () => {
      const diff = new Date(china.startISO as string).getTime() - Date.now();
      if (diff <= 0) {
        setChinaCountdown('Departing now');
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      setChinaCountdown(`${d}d ${h}h ${m}m`);
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="tours" className="py-20 px-6 lg:px-16 bg-gradient-to-b from-white to-gray-50">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          Current Tours with{' '}
          <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Vishnu Saha
          </span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Join the Wandering Maniac on authentic, immersive journeys to the world's most fascinating destinations. 
          Every tour is personally led by Vishnu, ensuring raw and real travel experiences.
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 bg-gray-100 rounded-full p-1">
          <button onClick={() => setStatus('all')} className={`px-4 py-2 rounded-full text-sm font-medium ${status==='all'?'bg-white shadow':''}`}>All</button>
          <button onClick={() => setStatus('open')} className={`px-4 py-2 rounded-full text-sm font-medium ${status==='open'?'bg-white shadow':''}`}>Booking Open</button>
          <button onClick={() => setStatus('soon')} className={`px-4 py-2 rounded-full text-sm font-medium ${status==='soon'?'bg-white shadow':''}`}>Coming Soon</button>
        </div>
        <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search destination..." className="w-full md:w-72 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500" />
      </div>

      {/* Tours Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((tour) => (
          <div
            key={tour.id}
            className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            {/* Tour Image */}
            <div className="relative h-64 overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-t ${tour.color} opacity-20 group-hover:opacity-30 transition-opacity z-10`} />
              <Image
                src={tour.image}
                alt={tour.destination}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-20">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  tour.status === 'Booking Open'
                    ? 'bg-green-500 text-white'
                    : tour.status === 'Sold Out'
                      ? 'bg-red-600 text-white'
                      : 'bg-yellow-500 text-gray-900'
                }`}>
                  {tour.status}
                </span>
              </div>
              {/* Flag */}
              <div className="absolute top-4 left-4 z-20 text-5xl">
                {tour.flag}
              </div>
              {/* Limited Seats & Countdown */}
              {tour.destination === 'China' && (
                <>
                  <div className="absolute bottom-14 left-4 right-4 z-20">
                    <div className="bg-white/80 backdrop-blur-sm rounded-full h-2 overflow-hidden shadow">
                      <div
                        className={`h-full bg-gradient-to-r from-pink-500 to-purple-600`}
                        style={{ width: `${Math.max(0, Math.min(100, (((tour as any).totalSeats - (tour as any).seatsLeft) / ((tour as any).totalSeats || 1)) * 100))}%` }}
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-2">
                    {(tour as any).seatsLeft > 0 ? (
                      <span className="px-3 py-1 rounded-full bg-white/90 text-red-600 font-semibold shadow animate-pulse">
                        Only {(tour as any).seatsLeft} left
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-red-600 text-white font-semibold shadow">
                        Sold Out
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-full bg-black/60 text-white text-sm shadow">
                      Starts in {chinaCountdown}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Tour Details */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{tour.destination}</h3>
              
              {/* Date & Info */}
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">{tour.date}</span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{tour.groupSize}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{tour.duration}</span>
                </div>
              </div>

              {/* Highlights */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {tour.highlights.slice(0, 3).map((highlight, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">
                    {tour.priceStatus === 'confirmed' ? 'Starting from' : 'Price'}
                  </p>
                  <p className={`text-2xl font-bold ${
                    tour.priceStatus === 'confirmed' 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent'
                      : 'text-gray-400'
                  }`}>
                    {tour.price}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/packages/${tour.slug}`}
                    className={`px-5 py-3 rounded-full border border-gray-200 font-semibold hover:bg-gray-50`}
                  >
                    Details
                  </a>
                  <button
                  onClick={() => ((tour as any).seatsLeft === 0 || tour.status === 'Sold Out') ? null : setActiveTour(tour)}
                  disabled={(tour as any).seatsLeft === 0 || tour.status === 'Sold Out'}
                  className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${tour.color} text-white rounded-full font-semibold transition-all ${
                    (tour as any).seatsLeft === 0 || tour.status === 'Sold Out'
                      ? 'opacity-60 cursor-not-allowed'
                      : 'hover:shadow-lg hover:scale-105'
                  } ${tour.priceStatus === 'tbd' ? 'opacity-75' : ''}`}
                >
                  {(tour as any).seatsLeft === 0 || tour.status === 'Sold Out' ? 'Sold Out' : tour.priceStatus === 'confirmed' ? 'Book Now' : 'Notify Me'}
                  <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {activeTour && (
        <div className="fixed inset-0 z-40 flex items-end md:items-center justify-center bg-black/60 p-4" onClick={()=>setActiveTour(null)}>
          <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl" onClick={(e)=>e.stopPropagation()}>
            <div className="relative h-56">
              <Image src={activeTour.image} alt={activeTour.destination} fill className="object-cover" />
              <button className="absolute top-3 right-3 w-10 h-10 bg-black/60 rounded-full flex items-center justify-center" onClick={()=>setActiveTour(null)}>
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{activeTour.destination}</h3>
              <p className="text-gray-600 mb-4">{activeTour.date} • {activeTour.duration} • {activeTour.groupSize}</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Highlights</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {activeTour.highlights.map((h,i)=>(<li key={i}>{h}</li>))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Do's</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {(activeTour as any).dos?.map((d:string, i:number)=>(<li key={i}>{d}</li>))}
                  </ul>
                  <h4 className="font-semibold mt-4 mb-2">Don'ts</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {(activeTour as any).donts?.map((d:string, i:number)=>(<li key={i} className="marker:text-red-500">{d}</li>))}
                  </ul>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-xl font-bold">{activeTour.price}</p>
                </div>
                <button className={`px-6 py-3 rounded-full text-white font-semibold bg-gradient-to-r ${activeTour.color}`}>Proceed</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="max-w-4xl mx-auto mt-16 text-center bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-12 text-white">
        <h3 className="text-3xl md:text-4xl font-bold mb-4">
          Ready for an Adventure of a Lifetime?
        </h3>
        <p className="text-lg mb-8 text-white/90">
          Travel beyond the guidebooks with Vishnu Saha. Experience authentic cultures, 
          meet locals, and create memories that last forever.
        </p>
        <button className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all">
          Book Your Journey Now
        </button>
      </div>
    </section>
  );
}

