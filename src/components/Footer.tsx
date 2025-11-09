'use client';

import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Packages', href: '/packages' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms & Conditions', href: '/terms' },
  ];

  const mustVisit = [
    'Egypt',
    'Georgia',
    'Kenya',
    'Turkey',
    'Azerbaijan',
    'Tanzania',
  ];

  const popular = [
    'Thailand',
    'Singapore',
    'Malaysia',
    'Maldives',
    'Mauritius',
    'Vietnam',
    'Bhutan',
    'Jordan',
    'Sri Lanka',
    'Greece',
  ];

  const honeymoonPackages = [
    'Maldives Sea Adventure',
    'Sacred Sands Bali',
    'Greek Signature Escape',
    'Moonlit Mauritius',
    'Classic Thailand Highlights',
    'Singapore Uncovered',
    'Mystic Malaysia',
    'Timeless Vietnam Voyage',
    'Majestic Sights of Turkey',
    'Georgian Trails',
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">DeshGhumado</h3>
                <p className="text-pink-300 text-xs">by Wandering Maniac</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Holidays For Global Indians
            </p>
            <p className="text-gray-400 text-sm mb-6">
              Created by a Traveller, for Travellers. Experience the world beyond guidebooks with Vishnu Saha.
            </p>
            
            {/* Social Media */}
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-500 transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/vishnu.saha28"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-500 transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/@WanderingManiac"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-500 transition-all"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-pink-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Must Visit */}
          <div>
            <h4 className="text-lg font-bold mb-6">Must Visit</h4>
            <ul className="space-y-3">
              {mustVisit.map((destination) => (
                <li key={destination}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-pink-400 transition-colors"
                  >
                    {destination}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular */}
          <div>
            <h4 className="text-lg font-bold mb-6">Popular</h4>
            <ul className="space-y-3">
              {popular.map((destination) => (
                <li key={destination}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-pink-400 transition-colors"
                  >
                    {destination}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Honeymoon Packages */}
          <div>
            <h4 className="text-lg font-bold mb-6">Honeymoon Packages</h4>
            <ul className="space-y-3">
              {honeymoonPackages.slice(0, 6).map((pkg) => (
                <li key={pkg}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-pink-400 transition-colors text-sm"
                  >
                    {pkg}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-semibold mb-2">Email Us</h5>
                <a
                  href="mailto:info@deshghumado.com"
                  className="text-gray-400 hover:text-pink-400 transition-colors"
                >
                  info@deshghumado.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-semibold mb-2">Call Us</h5>
                <a
                  href="tel:+919014369788"
                  className="text-gray-400 hover:text-pink-400 transition-colors"
                >
                  +91 90143 69788
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-semibold mb-2">Visit Us</h5>
                <p className="text-gray-400">
                  Hyderabad, Telangana, India
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 DESHGHUMADO PRIVATE LIMITED. All Rights Reserved
            </p>
            <p className="text-gray-400 text-sm">
              Made with ❤️ for Global Indians
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

