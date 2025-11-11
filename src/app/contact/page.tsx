import ContactSection from '@/components/ContactSection';

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <section className="px-6 lg:px-16 pt-24 pb-10 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Contact Us</h1>
          <p className="text-gray-600">We'd love to hear from you</p>
        </div>
      </section>
      <ContactSection />
    </main>
  );
}



