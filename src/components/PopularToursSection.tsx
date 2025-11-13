'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, Users, ArrowRight } from 'lucide-react';

const popularTours = [
  {
    name: 'China',
    flag: '🇨🇳',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=1000',
    slug: 'china',
    description: 'Explore ancient traditions and modern marvels',
  },
  {
    name: 'Russia',
    flag: '🇷🇺',
    image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?q=80&w=1000',
    slug: 'russia',
    description: 'Discover the vast landscapes and rich culture',
  },
  {
    name: 'Japan',
    flag: '🇯🇵',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000',
    slug: 'japan',
    description: 'Experience the perfect blend of tradition and innovation',
  },
  {
    name: 'Egypt',
    flag: '🇪🇬',
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73aa6?q=80&w=1000',
    slug: 'egypt',
    description: 'Journey through ancient history and timeless wonders',
  },
  {
    name: 'Kenya',
    flag: '🇰🇪',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1000',
    slug: 'kenya',
    description: 'Witness the great migration and stunning wildlife',
  },
  {
    name: 'Philippines',
    flag: '🇵🇭',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1000',
    slug: 'philippines',
    description: 'Paradise islands and vibrant local culture',
  },
];

export default function PopularToursSection() {
  return (
    <section id="popular-tours" className="py-20 px-6 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Popular{' '}
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Destinations
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our most sought-after travel destinations, each offering unique experiences and unforgettable memories
          </p>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularTours.map((tour) => (
            <Link
              key={tour.slug}
              href={`/packages/${tour.slug}`}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={tour.image}
                  alt={tour.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Flag Badge */}
                <div className="absolute top-4 left-4 text-5xl drop-shadow-lg">
                  {tour.flag}
                </div>

                {/* Country Name Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">{tour.name}</h3>
                  <p className="text-white/90 text-sm">{tour.description}</p>
                </div>
              </div>

              {/* Hover Arrow */}
              <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            View All Tours
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

