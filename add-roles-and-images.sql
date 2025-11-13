-- ============================================
-- ADD USER ROLES & TOUR IMAGES
-- ============================================

-- Add role column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin'));

-- Create index on role for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Update RLS policies for admin access
-- Admin policy: Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Admin policy: Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Admin policies for tours
CREATE POLICY "Admins can insert tours" ON tours FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update tours" ON tours FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete tours" ON tours FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Admin policies for itinerary
CREATE POLICY "Admins can insert itinerary" ON itinerary FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update itinerary" ON itinerary FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete itinerary" ON itinerary FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Admin policies for tour_images
CREATE POLICY "Admins can insert tour images" ON tour_images FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update tour images" ON tour_images FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete tour images" ON tour_images FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Admin policies for visa requirements
CREATE POLICY "Admins can insert visa requirements" ON visa_requirements FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update visa requirements" ON visa_requirements FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete visa requirements" ON visa_requirements FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Admin policies for bookings (view all)
CREATE POLICY "Admins can view all bookings" ON bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all bookings" ON bookings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Admin policies for payments (view all)
CREATE POLICY "Admins can view all payments" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Admin policies for enquiries (view and manage all)
CREATE POLICY "Admins can view all enquiries" ON enquiries FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all enquiries" ON enquiries FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Admin policies for reviews (manage all)
CREATE POLICY "Admins can update all reviews" ON reviews FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete reviews" ON reviews FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================
-- POPULATE TOUR IMAGES
-- ============================================

-- China Tour Images
INSERT INTO tour_images (tour_id, image_url, caption, display_order)
SELECT id, 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=2070', 'The Great Wall of China', 1
FROM tours WHERE slug = 'china-nov-14';

INSERT INTO tour_images (tour_id, image_url, caption, display_order)
SELECT id, 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?q=80&w=2070', 'Forbidden City, Beijing', 2
FROM tours WHERE slug = 'china-nov-14';

INSERT INTO tour_images (tour_id, image_url, caption, display_order)
SELECT id, 'https://images.unsplash.com/photo-1537986904049-d6b4f3d9e93f?q=80&w=2070', 'Traditional Hutong Streets', 3
FROM tours WHERE slug = 'china-nov-14';

INSERT INTO tour_images (tour_id, image_url, caption, display_order)
SELECT id, 'https://images.unsplash.com/photo-1529415538773-0c30d1b0a9f8?q=80&w=2070', 'Temple of Heaven', 4
FROM tours WHERE slug = 'china-nov-14';

-- Philippines Tour Images
INSERT INTO tour_images (tour_id, image_url, caption, display_order)
SELECT id, 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=2074', 'El Nido, Palawan', 1
FROM tours WHERE slug = 'philippines-dec-28';

INSERT INTO tour_images (tour_id, image_url, caption, display_order)
SELECT id, 'https://images.unsplash.com/photo-1621277224630-81d9af65e40e?q=80&w=2070', 'Island Hopping Adventure', 2
FROM tours WHERE slug = 'philippines-dec-28';

INSERT INTO tour_images (tour_id, image_url, caption, display_order)
SELECT id, 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?q=80&w=2070', 'Crystal Clear Waters', 3
FROM tours WHERE slug = 'philippines-dec-28';

INSERT INTO tour_images (tour_id, image_url, caption, display_order)
SELECT id, 'https://images.unsplash.com/photo-1606991261089-7b8ab9d6d6a7?q=80&w=2070', 'Sunset at the Beach', 4
FROM tours WHERE slug = 'philippines-dec-28';

-- Dubai Tour Images
INSERT INTO tour_images (tour_id, image_url, caption, display_order)
SELECT id, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070', 'Burj Khalifa at Night', 1
FROM tours WHERE slug = 'dubai-dec-28';

INSERT INTO tour_images (tour_id, image_url, caption, display_order)
SELECT id, 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=2070', 'Desert Safari Experience', 2
FROM tours WHERE slug = 'dubai-dec-28';

INSERT INTO tour_images (tour_id, image_url, caption, display_order)
SELECT id, 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=2070', 'Dubai Marina Skyline', 3
FROM tours WHERE slug = 'dubai-dec-28';

INSERT INTO tour_images (tour_id, image_url, caption, display_order)
SELECT id, 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?q=80&w=2070', 'Traditional Gold Souk', 4
FROM tours WHERE slug = 'dubai-dec-28';

-- Japan Tour Images
INSERT INTO tour_images (tour_id, image_url, caption, display_order)
SELECT id, 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070', 'Mount Fuji View', 1
FROM tours WHERE slug = 'japan-jan';

INSERT INTO tour_images (tour_id, image_url, caption, display_order)
SELECT id, 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?q=80&w=2070', 'Tokyo Shibuya Crossing', 2
FROM tours WHERE slug = 'japan-jan';

INSERT INTO tour_images (tour_id, image_url, caption, display_order)
SELECT id, 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=2070', 'Kyoto Traditional Temple', 3
FROM tours WHERE slug = 'japan-jan';

INSERT INTO tour_images (tour_id, image_url, caption, display_order)
SELECT id, 'https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=2070', 'Cherry Blossom Season', 4
FROM tours WHERE slug = 'japan-jan';

-- Kenya Tour Images
INSERT INTO tour_images (tour_id, image_url, caption, display_order)
SELECT id, 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?q=80&w=2067', 'African Safari Wildlife', 1
FROM tours WHERE slug = 'kenya-jan';

INSERT INTO tour_images (tour_id, image_url, caption, display_order)
SELECT id, 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068', 'Maasai Mara National Park', 2
FROM tours WHERE slug = 'kenya-jan';

INSERT INTO tour_images (tour_id, image_url, caption, display_order)
SELECT id, 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?q=80&w=2074', 'Maasai Cultural Experience', 3
FROM tours WHERE slug = 'kenya-jan';

INSERT INTO tour_images (tour_id, image_url, caption, display_order)
SELECT id, 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?q=80&w=2065', 'Savanna Sunset', 4
FROM tours WHERE slug = 'kenya-jan';

-- Russia Tour Images
INSERT INTO tour_images (tour_id, image_url, caption, display_order)
SELECT id, 'https://images.unsplash.com/photo-1513326738677-b964603b136d?q=80&w=2098', 'St. Basil''s Cathedral, Moscow', 1
FROM tours WHERE slug = 'russia-feb';

INSERT INTO tour_images (tour_id, image_url, caption, display_order)
SELECT id, 'https://images.unsplash.com/photo-1520106212299-d99c443e4568?q=80&w=2074', 'Winter Palace, St. Petersburg', 2
FROM tours WHERE slug = 'russia-feb';

INSERT INTO tour_images (tour_id, image_url, caption, display_order)
SELECT id, 'https://images.unsplash.com/photo-1547448415-e9f5b28e570d?q=80&w=2070', 'Moscow Kremlin', 3
FROM tours WHERE slug = 'russia-feb';

INSERT INTO tour_images (tour_id, image_url, caption, display_order)
SELECT id, 'https://images.unsplash.com/photo-1548678967-f1aec58f6fb2?q=80&w=2070', 'Russian Winter Landscape', 4
FROM tours WHERE slug = 'russia-feb';

-- Egypt Tour Images
INSERT INTO tour_images (tour_id, image_url, caption, display_order)
SELECT id, 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=2070', 'Pyramids of Giza', 1
FROM tours WHERE slug = 'egypt-feb';

INSERT INTO tour_images (tour_id, image_url, caption, display_order)
SELECT id, 'https://images.unsplash.com/photo-1539768942893-daf53e448371?q=80&w=2071', 'Nile River Cruise', 2
FROM tours WHERE slug = 'egypt-feb';

INSERT INTO tour_images (tour_id, image_url, caption, display_order)
SELECT id, 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=2070', 'Luxor Temple', 3
FROM tours WHERE slug = 'egypt-feb';

INSERT INTO tour_images (tour_id, image_url, caption, display_order)
SELECT id, 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?q=80&w=2069', 'Cairo Markets', 4
FROM tours WHERE slug = 'egypt-feb';

-- ============================================
-- VERIFY DATA
-- ============================================

SELECT 'Tour images inserted:' as status, COUNT(*) as count FROM tour_images;
SELECT 'Profiles with roles:' as status, COUNT(*) as count FROM profiles;






