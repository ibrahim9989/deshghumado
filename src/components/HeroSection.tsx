'use client';

import { useState } from 'react';
import { Search, Sparkles, Luggage, User, Menu } from 'lucide-react';

const destinations = [
  { name: 'China', flag: '🇨🇳', color: 'bg-red-50 hover:bg-red-100' },
  { name: 'Philippines', flag: '🇵🇭', color: 'bg-blue-50 hover:bg-blue-100' },
  { name: 'Dubai', flag: '🇦🇪', color: 'bg-green-50 hover:bg-green-100' },
  { name: 'Japan', flag: '🇯🇵', color: 'bg-pink-50 hover:bg-pink-100' },
  { name: 'Kenya', flag: '🇰🇪', color: 'bg-yellow-50 hover:bg-yellow-100' },
  { name: 'Russia', flag: '🇷🇺', color: 'bg-indigo-50 hover:bg-indigo-100' },
];

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="relative min-h-screen overflow-hidden" id="home">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 w-full h-full" style={{ transform: 'scale(1.5)' }}>
          <iframe
            className="absolute top-1/2 left-1/2 w-[177.77vh] h-[56.25vw] min-h-full min-w-full pointer-events-none"
            style={{ transform: 'translate(-50%, -50%)' }}
            src="https://www.youtube.com/embed/umVm3QXFE18?autoplay=1&mute=1&loop=1&playlist=umVm3QXFE18&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&disablekb=1"
            title="Background video"
            allow="autoplay; encrypted-media"
            frameBorder="0"
          />
        </div>
        {/* Video-only overlay (solid shade across entire hero) */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-20">
        {/* Hero Content */}
        <div className="flex flex-col items-center justify-center px-6 pt-28 pb-32">

          {/* Main Headline */}
          <div className="text-center max-w-4xl">
            <h2 className="text-white text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
              Explore the World with
              <br />
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                DeshGhumado
              </span>
            </h2>
            <p className="text-white/90 text-xl md:text-2xl font-light mb-4">
              Authentic Travel Experiences
            </p>
            <p className="text-white/80 text-lg md:text-xl font-light mb-6">
              80+ Countries Explored | 849K+ Subscribers
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/packages" className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition">
                Explore tours
              </a>
              <a href="/contact" className="px-8 py-4 rounded-full bg-white text-gray-900 font-semibold shadow-lg hover:scale-105 transition">
                Enquire
              </a>
            </div>
          </div>

          {/* Scroll Down Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
