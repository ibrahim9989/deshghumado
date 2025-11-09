'use client';

import { Youtube, Instagram, Facebook, Megaphone, Newspaper } from 'lucide-react';

export default function MediaStrip() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-10">
        <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
          <div className="flex items-center gap-2 text-gray-700">
            <Megaphone className="w-5 h-5 text-pink-500" />
            <span className="text-sm uppercase tracking-wide">As seen on</span>
          </div>
          <div className="flex items-center gap-2 text-gray-800">
            <Youtube className="w-6 h-6 text-red-600" />
            <span className="font-semibold">YouTube</span>
          </div>
          <div className="flex items-center gap-2 text-gray-800">
            <Instagram className="w-6 h-6 text-pink-500" />
            <span className="font-semibold">Instagram</span>
          </div>
          <div className="flex items-center gap-2 text-gray-800">
            <Facebook className="w-6 h-6 text-blue-600" />
            <span className="font-semibold">Facebook</span>
          </div>
          <div className="flex items-center gap-2 text-gray-800">
            <Newspaper className="w-6 h-6 text-gray-600" />
            <span className="font-semibold">Travel Blogs</span>
          </div>
        </div>
      </div>
    </section>
  );
}
