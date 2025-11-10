import Image from 'next/image';

type Item = {
  day: number;
  title: string;
  photo?: string;
  inclusions?: string[];
  notes?: string;
};

export default function ItineraryTimeline({ title = 'Itinerary', subtitle, items = [] as Item[] }: { title?: string; subtitle?: string; items: Item[] }) {
  return (
    <section className="px-6 lg:px-16 py-10 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">{title}</h2>
        {subtitle && <p className="text-gray-600 mb-6">{subtitle}</p>}

        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          {/* header bar */}
          <div className="px-6 py-4 bg-gradient-to-r from-pink-50 to-purple-50 border-b border-gray-200">
            <p className="text-sm text-gray-600">Day-by-day plan curated by Vishnu</p>
          </div>

          {items.map((it, idx) => (
            <div key={idx} className={`grid grid-cols-[88px_1fr] gap-4 px-6 ${idx !== items.length - 1 ? 'border-b border-gray-100' : ''} bg-white`}>
              {/* day column */}
              <div className="py-6 flex flex-col items-center justify-center">
                <span className="text-xs text-gray-500">Day</span>
                <span className="text-3xl font-bold text-gray-900">{String(it.day).padStart(2, '0')}</span>
              </div>
              {/* card */}
              <div className="py-4">
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="p-5 flex gap-4 items-start">
                    {/* thumbnail or icon blob */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center overflow-hidden shrink-0">
                      {it.photo ? (
                        <Image src={it.photo} alt={it.title} width={56} height={56} className="object-cover w-14 h-14 rounded-xl" />
                      ) : (
                        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{it.title}</h3>
                      {it.notes && <p className="text-gray-600 text-sm leading-relaxed">{it.notes}</p>}
                      {it.inclusions && it.inclusions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {it.inclusions.map((inc, i) => (
                            <span key={i} className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-50 to-purple-50 text-pink-700 border border-pink-100 text-xs font-medium">
                              {inc}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


