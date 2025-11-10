-- ============================================
-- SEED DATA FOR DESHGHUMADO
-- ============================================

-- ============================================
-- INSERT TOURS
-- ============================================

INSERT INTO tours (slug, destination, country, title, description, start_date, end_date, duration_days, price_inr, status, total_seats, seats_booked, min_group_size, max_group_size, difficulty_level, image_url, flag_emoji, color_gradient, highlights, inclusions, exclusions, dos, donts, featured)
VALUES
-- China Tour (Sold Out)
(
  'china-nov-14',
  'China',
  'China',
  'China Adventure - Beijing & Beyond',
  'Explore Beijing and beyond with immersive local experiences led by Vishnu. Walk the Great Wall, discover the Forbidden City, and dive into authentic Chinese culture.',
  '2025-11-14',
  '2025-11-24',
  10,
  179000,
  'sold_out',
  15,
  15,
  12,
  15,
  'moderate',
  'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=2070',
  '🇨🇳',
  'from-pink-500 to-purple-600',
  ARRAY['Great Wall', 'Forbidden City', 'Local Markets', 'Authentic Cuisine', 'Hutong Walks', 'Temple of Heaven'],
  ARRAY['Accommodation (9 nights)', 'Daily breakfast', 'Airport transfers', 'Entry tickets to monuments', 'Local guide', 'Group leader (Vishnu Saha)', 'Some lunches & dinners'],
  ARRAY['International flights', 'China visa fee', 'Travel insurance', 'Personal expenses', 'Tips & gratuities', 'Meals not mentioned'],
  ARRAY['Carry passport at all times', 'Respect local customs', 'Use VPN if needed for apps', 'Carry Type A/C adapter', 'Download offline maps', 'Learn basic Mandarin phrases'],
  ARRAY['Don''t litter at heritage sites', 'Don''t film in restricted areas', 'Don''t ignore group timings', 'Don''t discuss sensitive political topics', 'Avoid public displays of affection'],
  true
),

-- Philippines Tour
(
  'philippines-dec-28',
  'Philippines',
  'Philippines',
  'Philippines Island Paradise',
  'Blue waters, limestone cliffs, and island life the DeshGhumado way. Experience the best of Palawan, Cebu, and hidden gems.',
  '2025-12-28',
  '2026-01-05',
  8,
  150000,
  'coming_soon',
  15,
  0,
  12,
  15,
  'easy',
  'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=2074',
  '🇵🇭',
  'from-pink-500 to-purple-600',
  ARRAY['Island Hopping', 'Beach Paradise', 'Local Culture', 'Water Sports', 'Snorkeling', 'Sunset Views'],
  ARRAY['Accommodation (7 nights)', 'Daily breakfast', 'Island hopping tours', 'Boat transfers', 'Snorkeling gear', 'Group leader'],
  ARRAY['International flights', 'Visa fee (if applicable)', 'Travel insurance', 'Lunch & dinner (most days)', 'Water sports extras'],
  ARRAY['Carry reef-safe sunscreen', 'Stay hydrated', 'Respect marine life', 'Bring waterproof bag', 'Wear water shoes'],
  ARRAY['Don''t touch corals', 'Don''t ignore life jacket rules', 'Avoid single-use plastics', 'Don''t feed fish', 'Don''t litter on beaches'],
  true
),

-- Dubai Tour
(
  'dubai-dec-28',
  'Dubai',
  'UAE',
  'Dubai - Luxury Meets Culture',
  'Experience the best of Dubai - from towering skyscrapers to golden deserts. A perfect blend of modern luxury and traditional Arabian culture.',
  '2025-12-28',
  '2026-01-03',
  6,
  120000,
  'coming_soon',
  15,
  0,
  12,
  15,
  'easy',
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070',
  '🇦🇪',
  'from-pink-500 to-purple-600',
  ARRAY['Burj Khalifa', 'Desert Safari', 'Luxury & Culture', 'Modern Wonders', 'Gold Souk', 'Dubai Mall'],
  ARRAY['Accommodation (5 nights)', 'Daily breakfast', 'Desert safari with BBQ dinner', 'Burj Khalifa tickets', 'City tour', 'Airport transfers'],
  ARRAY['International flights', 'UAE visa fee', 'Travel insurance', 'Lunch & dinner (most days)', 'Optional activities'],
  ARRAY['Dress modestly in public spaces', 'Follow desert safety instructions', 'Carry sunscreen', 'Stay hydrated', 'Respect local customs'],
  ARRAY['Don''t eat/drink on Metro', 'Don''t take photos of people without consent', 'Don''t show affection in public', 'Don''t drink alcohol in public'],
  false
),

-- Japan Tour
(
  'japan-jan',
  'Japan',
  'Japan',
  'Japan - Land of the Rising Sun',
  'From Tokyo''s neon lights to Kyoto''s ancient temples, experience the perfect blend of tradition and modernity in Japan.',
  '2026-01-15',
  '2026-01-27',
  12,
  250000,
  'coming_soon',
  15,
  0,
  12,
  15,
  'moderate',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070',
  '🇯🇵',
  'from-pink-500 to-purple-600',
  ARRAY['Tokyo Nights', 'Mount Fuji', 'Traditional Culture', 'Cherry Blossoms', 'Kyoto Temples', 'Bullet Train'],
  ARRAY['Accommodation (11 nights)', 'Daily breakfast', 'JR Pass (7 days)', 'Entry tickets', 'Some lunches', 'Group leader'],
  ARRAY['International flights', 'Japan visa fee', 'Travel insurance', 'Most lunches & dinners', 'Personal shopping'],
  ARRAY['Carry cash for small shops', 'Be punctual', 'Remove shoes indoors', 'Bow when greeting', 'Follow queue etiquette'],
  ARRAY['Don''t speak loudly on trains', 'Don''t tip (usually not customary)', 'Don''t eat while walking', 'Don''t stick chopsticks upright in rice'],
  true
),

-- Kenya Tour
(
  'kenya-jan',
  'Kenya',
  'Kenya',
  'Kenya Safari Adventure',
  'Witness the Big Five, experience Maasai culture, and explore the stunning landscapes of Kenya on this unforgettable safari adventure.',
  '2026-01-20',
  '2026-01-29',
  9,
  200000,
  'coming_soon',
  15,
  0,
  12,
  15,
  'moderate',
  'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?q=80&w=2067',
  '🇰🇪',
  'from-pink-500 to-purple-600',
  ARRAY['Safari Adventure', 'Wildlife', 'Maasai Culture', 'National Parks', 'Big Five', 'Savanna Sunsets'],
  ARRAY['Accommodation (8 nights)', 'All meals during safari', 'Safari game drives', 'Park entry fees', '4x4 safari vehicle', 'Maasai village visit'],
  ARRAY['International flights', 'Kenya visa fee', 'Travel insurance', 'Drinks', 'Tips for guides', 'Optional activities'],
  ARRAY['Wear neutral colors on safari', 'Follow ranger guidance', 'Stay quiet during game drives', 'Bring binoculars', 'Carry sunscreen'],
  ARRAY['Don''t feed wildlife', 'Don''t stand in vehicles without instruction', 'Don''t wear bright colors', 'Don''t make sudden movements near animals'],
  false
),

-- Russia Tour
(
  'russia-feb',
  'Russia',
  'Russia',
  'Russia - Winter Wonderland',
  'Explore the grandeur of Moscow and St. Petersburg in winter. From the Kremlin to the Hermitage, experience Russia''s rich history and culture.',
  '2026-02-10',
  '2026-02-21',
  11,
  220000,
  'coming_soon',
  15,
  0,
  12,
  15,
  'challenging',
  'https://images.unsplash.com/photo-1513326738677-b964603b136d?q=80&w=2098',
  '🇷🇺',
  'from-pink-500 to-purple-600',
  ARRAY['Moscow & St. Petersburg', 'Winter Wonderland', 'Rich History', 'Architecture', 'Kremlin', 'Hermitage Museum'],
  ARRAY['Accommodation (10 nights)', 'Daily breakfast', 'High-speed train Moscow-St.Pete', 'Entry tickets', 'City tours', 'Group leader'],
  ARRAY['International flights', 'Russia visa fee', 'Travel insurance', 'Most lunches & dinners', 'Winter gear rental'],
  ARRAY['Carry warm layers in winter', 'Keep passport copies', 'Learn basic Russian phrases', 'Dress warmly (-10°C to -20°C)', 'Carry hand warmers'],
  ARRAY['Don''t photograph security areas', 'Avoid street currency exchange', 'Don''t drink tap water', 'Don''t ignore dress codes in religious sites'],
  false
),

-- Egypt Tour
(
  'egypt-feb',
  'Egypt',
  'Egypt',
  'Egypt - Ancient Wonders',
  'Walk among the pyramids, cruise the Nile, and explore 5000 years of history in the land of pharaohs.',
  '2026-02-15',
  '2026-02-25',
  10,
  180000,
  'coming_soon',
  15,
  0,
  12,
  15,
  'moderate',
  'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=2070',
  '🇪🇬',
  'from-pink-500 to-purple-600',
  ARRAY['Pyramids of Giza', 'Nile Cruise', 'Ancient History', 'Cairo Markets', 'Luxor Temples', 'Valley of the Kings'],
  ARRAY['Accommodation (9 nights)', 'Daily breakfast & dinner', 'Nile cruise (3 nights)', 'Entry tickets', 'Egyptologist guide', 'Domestic flights'],
  ARRAY['International flights', 'Egypt visa fee', 'Travel insurance', 'Lunches', 'Tips for guides', 'Optional activities'],
  ARRAY['Stay hydrated', 'Agree prices before shopping', 'Dress modestly at religious sites', 'Carry sunscreen', 'Haggle at markets'],
  ARRAY['Don''t climb restricted pyramids', 'Avoid tap water', 'Don''t take photos inside tombs', 'Don''t touch artifacts'],
  true
);

-- ============================================
-- INSERT ITINERARIES
-- ============================================

-- China Itinerary
INSERT INTO itinerary (tour_id, day_number, title, description, activities, meals_included, accommodation, notes)
SELECT id, 1, 'Arrival & Old Beijing Walk', 'Arrive in Beijing, meet the group, and take an evening walk through traditional hutongs (narrow alleys).', 
  ARRAY['Airport pickup', 'Group introduction', 'Hutong walk', 'Welcome dinner'], 
  ARRAY['Dinner'], 
  'Hotel in Beijing',
  'Acclimatise and evening walk through hutongs. Rest well for tomorrow!'
FROM tours WHERE slug = 'china-nov-14';

INSERT INTO itinerary (tour_id, day_number, title, description, activities, meals_included, accommodation, notes)
SELECT id, 2, 'Great Wall (Mutianyu)', 'Early morning departure to the Mutianyu section of the Great Wall. Less crowded and stunning views.',
  ARRAY['Breakfast at hotel', 'Private transfer to Great Wall', 'Cable car ride', 'Wall exploration', 'Local lunch'],
  ARRAY['Breakfast', 'Lunch'],
  'Hotel in Beijing',
  'Sunrise start for fewer crowds. Wear comfortable shoes!'
FROM tours WHERE slug = 'china-nov-14';

INSERT INTO itinerary (tour_id, day_number, title, description, activities, meals_included, accommodation, notes)
SELECT id, 3, 'Forbidden City & Tiananmen', 'Explore the Forbidden City, Tiananmen Square, and enjoy authentic Beijing cuisine.',
  ARRAY['Breakfast', 'Metro to Tiananmen', 'Forbidden City tour', 'Lunch at family diner', 'Temple of Heaven'],
  ARRAY['Breakfast', 'Lunch'],
  'Hotel in Beijing',
  'Authentic lunch at a family-run diner. Bring your camera!'
FROM tours WHERE slug = 'china-nov-14';

-- ============================================
-- INSERT VISA REQUIREMENTS
-- ============================================

-- China Visa
INSERT INTO visa_requirements (tour_id, visa_type, processing_days, validity_days, visa_fee_inr, service_fee_inr, total_fee_inr, requirements, inclusions, exclusions, notes, apply_before_days)
SELECT id, 'Tourist Visa (L)', 7, 90, 6500, 2500, 9000,
  ARRAY['Valid passport (min 6 months)', 'Passport size photos (2)', 'Confirmed flight tickets', 'Hotel bookings', 'Bank statement (last 3 months)', 'Covering letter'],
  ARRAY['Actual visa fees', 'Documentation assistance', 'Form filling and submission', 'Status tracking', 'E-visa copy via email'],
  ARRAY['Urgent/express processing charges', 'Air tickets', 'Travel insurance', 'Courier charges'],
  'Chinese visa requires physical submission at VFS. We will guide you through the process.',
  30
FROM tours WHERE slug = 'china-nov-14';

-- Philippines Visa
INSERT INTO visa_requirements (tour_id, visa_type, processing_days, validity_days, visa_fee_inr, service_fee_inr, total_fee_inr, requirements, inclusions, exclusions, notes, apply_before_days)
SELECT id, 'Visa on Arrival / E-Visa', 3, 30, 0, 1500, 1500,
  ARRAY['Valid passport (min 6 months)', 'Return flight tickets', 'Hotel bookings', 'Proof of funds'],
  ARRAY['Documentation assistance', 'Form filling guidance', 'Status tracking'],
  ARRAY['Visa fee (paid on arrival)', 'Air tickets', 'Travel insurance'],
  'Indian passport holders can get visa on arrival for 30 days. We recommend applying for e-visa in advance for smoother entry.',
  15
FROM tours WHERE slug = 'philippines-dec-28';

-- Dubai Visa
INSERT INTO visa_requirements (tour_id, visa_type, processing_days, validity_days, visa_fee_inr, service_fee_inr, total_fee_inr, requirements, inclusions, exclusions, notes, apply_before_days)
SELECT id, 'UAE Tourist Visa', 5, 60, 4500, 2000, 6500,
  ARRAY['Valid passport (min 6 months)', 'Passport size photo', 'Confirmed flight tickets', 'Hotel bookings'],
  ARRAY['Actual visa fees', 'Documentation assistance', 'Form filling', 'Status tracking', 'E-visa copy via email'],
  ARRAY['Urgent processing charges', 'Air tickets', 'Travel insurance'],
  'UAE visa is processed online. Processing takes 3-5 working days.',
  20
FROM tours WHERE slug = 'dubai-dec-28';

-- Japan Visa
INSERT INTO visa_requirements (tour_id, visa_type, processing_days, validity_days, visa_fee_inr, service_fee_inr, total_fee_inr, requirements, inclusions, exclusions, notes, apply_before_days)
SELECT id, 'Tourist Visa (Single Entry)', 7, 90, 0, 3000, 3000,
  ARRAY['Valid passport (min 6 months)', 'Passport photos (2)', 'ITR/Form 16', 'Bank statement (6 months)', 'Covering letter', 'Flight & hotel bookings'],
  ARRAY['Documentation assistance', 'Form filling', 'Submission at embassy', 'Status tracking'],
  ARRAY['Visa fee (free for Indians)', 'Air tickets', 'Travel insurance', 'Courier charges'],
  'Japan offers free tourist visa for Indian passport holders. Physical submission required at embassy.',
  30
FROM tours WHERE slug = 'japan-jan';

-- Kenya Visa
INSERT INTO visa_requirements (tour_id, visa_type, processing_days, validity_days, visa_fee_inr, service_fee_inr, total_fee_inr, requirements, inclusions, exclusions, notes, apply_before_days)
SELECT id, 'E-Visa (Single Entry)', 5, 90, 4300, 1500, 5800,
  ARRAY['Valid passport (min 6 months)', 'Passport photo', 'Yellow fever certificate', 'Flight tickets', 'Hotel bookings'],
  ARRAY['Actual visa fees', 'Documentation assistance', 'Form filling', 'Status tracking', 'E-visa copy via email'],
  ARRAY['Yellow fever vaccination cost', 'Air tickets', 'Travel insurance'],
  'Kenya e-visa is processed online. Yellow fever vaccination is mandatory.',
  20
FROM tours WHERE slug = 'kenya-jan';

-- Russia Visa
INSERT INTO visa_requirements (tour_id, visa_type, processing_days, validity_days, visa_fee_inr, service_fee_inr, total_fee_inr, requirements, inclusions, exclusions, notes, apply_before_days)
SELECT id, 'Tourist Visa (Single Entry)', 10, 30, 5500, 3000, 8500,
  ARRAY['Valid passport (min 6 months)', 'Passport photos (2)', 'Tourist invitation letter', 'Travel insurance', 'Hotel vouchers', 'Bank statement'],
  ARRAY['Actual visa fees', 'Tourist invitation letter', 'Documentation assistance', 'Form filling', 'Embassy submission'],
  ARRAY['Urgent processing', 'Air tickets', 'Travel insurance purchase', 'Courier charges'],
  'Russia visa requires tourist invitation letter (we provide). Physical submission at embassy required.',
  35
FROM tours WHERE slug = 'russia-feb';

-- Egypt Visa
INSERT INTO visa_requirements (tour_id, visa_type, processing_days, validity_days, visa_fee_inr, service_fee_inr, total_fee_inr, requirements, inclusions, exclusions, notes, apply_before_days)
SELECT id, 'E-Visa (Single Entry)', 5, 90, 2100, 1500, 3600,
  ARRAY['Valid passport (min 6 months)', 'Passport photo', 'Flight tickets', 'Hotel bookings'],
  ARRAY['Actual visa fees', 'Documentation assistance', 'Form filling', 'Status tracking', 'E-visa copy via email'],
  ARRAY['Urgent processing', 'Air tickets', 'Travel insurance'],
  'Egypt e-visa is processed online in 3-5 working days. Very straightforward process.',
  15
FROM tours WHERE slug = 'egypt-feb';

-- ============================================
-- INSERT INSURANCE PACKAGES
-- ============================================

INSERT INTO insurance_packages (name, coverage_amount_inr, base_price_inr, description, inclusions, exclusions, age_bands)
VALUES
(
  'Basic Travel Insurance',
  500000,
  3500,
  'Essential coverage for medical emergencies and trip cancellations.',
  ARRAY['Medical expenses up to ₹5L', 'Emergency evacuation', 'Trip cancellation', 'Baggage loss (up to ₹50K)', '24/7 assistance'],
  ARRAY['Pre-existing conditions', 'Adventure sports', 'Alcohol-related incidents'],
  '[
    {"min": 0, "max": 35, "price": 3500},
    {"min": 36, "max": 50, "price": 5000},
    {"min": 51, "max": 65, "price": 7000},
    {"min": 66, "max": 75, "price": 9500}
  ]'::jsonb
),
(
  'Comprehensive Travel Insurance',
  1000000,
  6500,
  'Complete protection including adventure sports and higher coverage.',
  ARRAY['Medical expenses up to ₹10L', 'Emergency evacuation', 'Trip cancellation', 'Baggage loss (up to ₹1L)', 'Adventure sports cover', 'COVID-19 coverage', '24/7 assistance'],
  ARRAY['Pre-existing conditions (unless declared)', 'War/terrorism', 'Illegal activities'],
  '[
    {"min": 0, "max": 35, "price": 6500},
    {"min": 36, "max": 50, "price": 9000},
    {"min": 51, "max": 65, "price": 12000},
    {"min": 66, "max": 75, "price": 16000}
  ]'::jsonb
);

-- ============================================
-- DONE!
-- ============================================

-- Verify data
SELECT 'Tours inserted:' as status, COUNT(*) as count FROM tours;
SELECT 'Itineraries inserted:' as status, COUNT(*) as count FROM itinerary;
SELECT 'Visa requirements inserted:' as status, COUNT(*) as count FROM visa_requirements;
SELECT 'Insurance packages inserted:' as status, COUNT(*) as count FROM insurance_packages;



