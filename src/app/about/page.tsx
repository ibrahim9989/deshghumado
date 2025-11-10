import AboutSection from '@/components/AboutSection';

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <section className="px-6 lg:px-16 pt-24 pb-10 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">About DeshGhumado</h1>
          <p className="text-gray-600">Founded and led by Vishnu Saha (Wandering Maniac)</p>
        </div>
      </section>
      <AboutSection />
    </main>
  );
}


