'use client';

import { ArrowUp, MessageCircle } from 'lucide-react';

export default function FloatingActions() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const whatsapp = () => window.open('https://wa.me/919014369788?text=Hi%20DeshGhumado%2C%20I%20want%20to%20know%20more%20about%20the%20tours.', '_blank');

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <button onClick={whatsapp} className="w-12 h-12 rounded-full bg-green-500 text-white shadow-lg hover:scale-105 transition flex items-center justify-center">
        <MessageCircle className="w-6 h-6" />
      </button>
      <button onClick={scrollTop} className="w-12 h-12 rounded-full bg-gray-900 text-white shadow-lg hover:scale-105 transition flex items-center justify-center">
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  );
}
