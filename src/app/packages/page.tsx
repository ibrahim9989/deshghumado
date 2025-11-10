import ToursSection from '@/components/ToursSection';

export default function PackagesPage() {
  return (
    <main className="min-h-screen">
      <section className="px-6 lg:px-16 pt-24 pb-10 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Group Tours</h1>
          <p className="text-gray-600">Curated and led by Vishnu Saha</p>
        </div>
      </section>
      <ToursSection />
    </main>
  );
}


