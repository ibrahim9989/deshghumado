import HeroSection from '@/components/HeroSection';
import PopularToursSection from '@/components/PopularToursSection';
import ToursSectionDB from '@/components/ToursSectionDB';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import MediaStrip from '@/components/MediaStrip';
import AuthCodeHandler from '@/components/AuthCodeHandler';

export default function Home() {
  return (
    <main className="min-h-screen">
      <AuthCodeHandler />
      <HeroSection />
      <MediaStrip />
      <PopularToursSection />
      <ToursSectionDB />
      <AboutSection />
      <ContactSection />
      <FloatingActions />
      <Footer />
    </main>
  );
}
