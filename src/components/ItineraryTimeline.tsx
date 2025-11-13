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

        <div className="space-y-6">
          {items.map((it, idx) => (
            <div key={idx} className="relative">
              {/* Timeline Line */}
              {idx !== items.length - 1 && (
                <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-gradient-to-b from-pink-300 to-purple-300"></div>
              )}
              
              <div className="relative flex gap-6">
                {/* Day Number Circle */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg border-4 border-white relative z-10">
                    <span className="text-white font-bold text-xl">{it.day}</span>
                  </div>
                </div>

                {/* Content Card */}
                <div className="flex-1 pb-6">
                  <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all overflow-hidden group">
                    {/* Image Section */}
                    {it.photo ? (
                      <div className="relative h-64 overflow-hidden">
                        <Image 
                          src={it.photo} 
                          alt={it.title} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-2xl font-bold mb-2">{it.title}</h3>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 border-b border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-900">{it.title}</h3>
                      </div>
                    )}

                    {/* Details Section */}
                    <div className="p-6">
                      {it.notes && (
                        <p className="text-gray-700 leading-relaxed mb-4">{it.notes}</p>
                      )}
                      {it.inclusions && it.inclusions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {it.inclusions.map((inc, i) => (
                            <span 
                              key={i} 
                              className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-50 to-purple-50 text-pink-700 border border-pink-200 text-sm font-medium hover:from-pink-100 hover:to-purple-100 transition-colors"
                            >
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





