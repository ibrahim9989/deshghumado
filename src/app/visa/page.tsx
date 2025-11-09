import VisaAndInsurance from '@/components/VisaAndInsurance';

export default function VisaPage() {
  return (
    <main className="min-h-screen">
      <section className="px-6 lg:px-16 pt-24 pb-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Visa & Insurance</h1>
          <p className="text-gray-600">E-Visa guidance and insurance illustration for Singapore</p>
        </div>
      </section>
      <VisaAndInsurance country="Singapore" />
    </main>
  );
}
