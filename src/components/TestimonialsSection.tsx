'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Aarav Mehta',
    text:
      'China with Vishnu felt raw and real. Local markets, street food, hidden alleys — nothing like typical package tours.',
    avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=400',
    tour: 'China — Nov',
    rating: 5,
  },
  {
    name: 'Sara Thomas',
    text:
      'The group vibe was amazing. I loved how Vishnu connected us with locals and culture in a respectful way.',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400',
    tour: 'Dubai — Dec',
    rating: 5,
  },
  {
    name: 'Rohan Gupta',
    text:
      'Authentic, immersive, and safe. If you want to go beyond guidebooks, DeshGhumado is it.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400',
    tour: 'Egypt — Feb',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const go = (dir: -1 | 1) => setIndex((prev) => (prev + dir + testimonials.length) % testimonials.length);

  return (
    <section id="reviews" className="py-20 px-6 lg:px-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold">
          Travellers on{' '}
          <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">DeshGhumado</span>
        </h2>
        <p className="text-gray-600 mt-3">Real stories from journeys led by Vishnu Saha</p>
      </div>

      <div className="relative max-w-4xl mx-auto h-[420px] md:h-[460px]">
        {testimonials.map((t, i) => (
          <div
            key={t.name}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 flex flex-col items-center gap-6">
              <div className="relative w-20 h-20">
                <Image src={t.avatar} alt={t.name} fill className="rounded-full object-cover" />
              </div>
              <div className="flex gap-1 text-yellow-400">
                {Array.from({ length: t.rating }).map((_, k) => (
                  <Star key={k} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-lg text-gray-700 max-w-2xl">“{t.text}”</p>
              <p className="font-semibold">{t.name}</p>
              <p className="text-sm text-gray-500">{t.tour}</p>
            </div>
          </div>
        ))}

        <button onClick={() => go(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow">
          <ChevronLeft />
        </button>
        <button onClick={() => go(1)} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow">
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}
