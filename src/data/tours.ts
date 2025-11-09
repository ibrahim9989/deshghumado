export type Tour = {
  id: number;
  slug: string;
  destination: string;
  country: string;
  date: string;
  status: 'Booking Open' | 'Coming Soon' | 'Sold Out';
  image: string;
  flag: string;
  duration: string;
  groupSize: string;
  highlights: string[];
  price: string;
  priceStatus: 'confirmed' | 'tbd';
  color: string; // tailwind gradient from-to
  seatsLeft?: number;
  totalSeats?: number;
  startISO?: string;
  dos?: string[];
  donts?: string[];
  description?: string;
  gallery?: string[];
  itinerary?: Array<{ day: number; title: string; photo?: string; inclusions?: string[]; notes?: string }>;
};

export const tours: Tour[] = [
  {
    id: 1,
    slug: 'china-nov-14',
    destination: 'China',
    country: 'China',
    date: '14th November 2025',
    status: 'Sold Out',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=2070',
    flag: '🇨🇳',
    duration: '10 Days',
    groupSize: '12-15 People',
    highlights: ['Great Wall', 'Forbidden City', 'Local Markets', 'Authentic Cuisine'],
    price: '₹1,79,000',
    priceStatus: 'confirmed',
    seatsLeft: 0,
    totalSeats: 15,
    startISO: '2025-11-14T00:00:00+05:30',
    dos: ['Carry passport at all times', 'Respect local customs', 'Use VPN if needed for apps', 'Carry Type A/C adapter'],
    donts: ["Don't litter at heritage sites", "Don't film in restricted areas", "Don't ignore group timings"],
    color: 'from-pink-500 to-purple-600',
    description: 'Explore Beijing and beyond with immersive local experiences led by Vishnu.',
    itinerary: [
      { day: 1, title: 'Arrival & Old Beijing Walk', inclusions: ['Airport pickup', 'Local dinner'], notes: 'Acclimatise and evening walk through hutongs.' },
      { day: 2, title: 'Great Wall (Mutianyu)', inclusions: ['Breakfast', 'Transfers', 'Entry'], notes: 'Sunrise start for fewer crowds.' },
      { day: 3, title: 'Forbidden City & Tiananmen', inclusions: ['Breakfast', 'Metro day pass'], notes: 'Authentic lunch at a family-run diner.' },
    ],
  },
  {
    id: 2,
    slug: 'philippines-dec-28',
    destination: 'Philippines',
    country: 'Philippines',
    date: '28th December 2025',
    status: 'Coming Soon',
    image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=2074',
    flag: '🇵🇭',
    duration: '8 Days',
    groupSize: '12-15 People',
    highlights: ['Island Hopping', 'Beach Paradise', 'Local Culture', 'Water Sports'],
    price: 'TBD',
    priceStatus: 'tbd',
    color: 'from-pink-500 to-purple-600',
    dos: ['Carry reef-safe sunscreen', 'Stay hydrated', 'Respect marine life'],
    donts: ["Don't touch corals", "Don't ignore life jacket rules", 'Avoid single-use plastics'],
    description: 'Blue waters, limestone cliffs, and island life the DeshGhumado way.',
  },
  {
    id: 3,
    slug: 'dubai-dec-28',
    destination: 'Dubai',
    country: 'UAE',
    date: '28th December 2025',
    status: 'Coming Soon',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070',
    flag: '🇦🇪',
    duration: '6 Days',
    groupSize: '12-15 People',
    highlights: ['Burj Khalifa', 'Desert Safari', 'Luxury & Culture', 'Modern Wonders'],
    price: 'TBD',
    priceStatus: 'tbd',
    color: 'from-pink-500 to-purple-600',
    dos: ['Dress modestly in public spaces', 'Follow desert safety instructions'],
    donts: ["Don't eat/drink on Metro", "Don't take photos of people without consent"],
  },
  {
    id: 4,
    slug: 'japan-jan',
    destination: 'Japan',
    country: 'Japan',
    date: 'January 2026 (TBD)',
    status: 'Coming Soon',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070',
    flag: '🇯🇵',
    duration: '12 Days',
    groupSize: '12-15 People',
    highlights: ['Tokyo Nights', 'Mount Fuji', 'Traditional Culture', 'Cherry Blossoms'],
    price: 'TBD',
    priceStatus: 'tbd',
    color: 'from-pink-500 to-purple-600',
    dos: ['Carry cash for small shops', 'Be punctual'],
    donts: ["Don't speak loudly on trains", "Don't tip (usually not customary)"],
  },
  {
    id: 5,
    slug: 'kenya-jan',
    destination: 'Kenya',
    country: 'Kenya',
    date: 'January 2026 (TBD)',
    status: 'Coming Soon',
    image: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?q=80&w=2067',
    flag: '🇰🇪',
    duration: '9 Days',
    groupSize: '12-15 People',
    highlights: ['Safari Adventure', 'Wildlife', 'Maasai Culture', 'National Parks'],
    price: 'TBD',
    priceStatus: 'tbd',
    color: 'from-pink-500 to-purple-600',
    dos: ['Wear neutral colors on safari', 'Follow ranger guidance'],
    donts: ["Don't feed wildlife", "Don't stand in vehicles without instruction"],
  },
  {
    id: 6,
    slug: 'russia-feb',
    destination: 'Russia',
    country: 'Russia',
    date: 'February 2026 (TBD)',
    status: 'Coming Soon',
    image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?q=80&w=2098',
    flag: '🇷🇺',
    duration: '11 Days',
    groupSize: '12-15 People',
    highlights: ['Moscow & St. Petersburg', 'Winter Wonderland', 'Rich History', 'Architecture'],
    price: 'TBD',
    priceStatus: 'tbd',
    color: 'from-pink-500 to-purple-600',
    dos: ['Carry warm layers in winter', 'Keep passport copies'],
    donts: ["Don't photograph security areas", 'Avoid street currency exchange'],
  },
  {
    id: 7,
    slug: 'egypt-feb',
    destination: 'Egypt',
    country: 'Egypt',
    date: 'February 2026 (TBD)',
    status: 'Coming Soon',
    image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=2070',
    flag: '🇪🇬',
    duration: '10 Days',
    groupSize: '12-15 People',
    highlights: ['Pyramids of Giza', 'Nile Cruise', 'Ancient History', 'Cairo Markets'],
    price: 'TBD',
    priceStatus: 'tbd',
    color: 'from-pink-500 to-purple-600',
    dos: ['Stay hydrated', 'Agree prices before shopping'],
    donts: ["Don't climb restricted pyramids", 'Avoid tap water'],
  },
];

export function getTourBySlug(slug: string): Tour | undefined {
  return tours.find((t) => t.slug === slug);
}
