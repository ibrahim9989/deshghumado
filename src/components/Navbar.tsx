'use client';

import { Sparkles, Luggage, User, Menu } from 'lucide-react';
import AuthButtons from './AuthButtons';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 lg:px-16 py-4 backdrop-blur-md bg-black/20">
      <a href="/" className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">D</span>
        </div>
        <div>
          <h1 className="text-white font-bold text-xl tracking-tight">DeshGhumado</h1>
          <p className="text-pink-200 text-xs">by Wandering Maniac</p>
        </div>
      </a>

      <div className="hidden md:flex items-center gap-6">
        <a href="/packages" className="text-white/90 hover:text-white font-medium">Tours</a>
        <a href="/about" className="text-white/90 hover:text-white font-medium">About</a>
        <a href="/contact" className="text-white/90 hover:text-white font-medium">Contact</a>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all">
          <Sparkles className="w-4 h-4" />
          Plan with AI
        </button>
        <a href="/my-bookings" className="flex items-center gap-2 px-6 py-2.5 bg-white text-gray-800 rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all">
          <Luggage className="w-4 h-4" />
          My Bookings
        </a>
        <AuthButtons />
      </div>

      <button className="md:hidden w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"><Menu className="w-5 h-5 text-white" /></button>
    </nav>
  );
}
