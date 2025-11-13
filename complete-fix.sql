-- COMPLETE FIX FOR RLS AND PROFILE ISSUES
-- Run this single file to fix everything

-- ============================================
-- STEP 1: Drop ALL existing RLS policies to start fresh
-- ============================================

-- Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Service role can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Service role can update all profiles" ON profiles;

-- Tours
DROP POLICY IF EXISTS "Anyone can view tours" ON tours;
DROP POLICY IF EXISTS "Admins can insert tours" ON tours;
DROP POLICY IF EXISTS "Admins can update tours" ON tours;
DROP POLICY IF EXISTS "Admins can delete tours" ON tours;

-- Itinerary
DROP POLICY IF EXISTS "Anyone can view itinerary" ON itinerary;
DROP POLICY IF EXISTS "Admins can insert itinerary" ON itinerary;
DROP POLICY IF EXISTS "Admins can update itinerary" ON itinerary;
DROP POLICY IF EXISTS "Admins can delete itinerary" ON itinerary;

-- Tour images
DROP POLICY IF EXISTS "Anyone can view tour images" ON tour_images;
DROP POLICY IF EXISTS "Admins can insert tour images" ON tour_images;
DROP POLICY IF EXISTS "Admins can update tour images" ON tour_images;
DROP POLICY IF EXISTS "Admins can delete tour images" ON tour_images;

-- Visa requirements
DROP POLICY IF EXISTS "Anyone can view visa requirements" ON visa_requirements;
DROP POLICY IF EXISTS "Admins can insert visa requirements" ON visa_requirements;
DROP POLICY IF EXISTS "Admins can update visa requirements" ON visa_requirements;
DROP POLICY IF EXISTS "Admins can delete visa requirements" ON visa_requirements;

-- Insurance packages
DROP POLICY IF EXISTS "Anyone can view insurance packages" ON insurance_packages;

-- Bookings
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can update all bookings" ON bookings;

-- Payments
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
DROP POLICY IF EXISTS "Users can create payments" ON payments;
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;

-- Enquiries
DROP POLICY IF EXISTS "Users can view own enquiries" ON enquiries;
DROP POLICY IF EXISTS "Anyone can create enquiries" ON enquiries;
DROP POLICY IF EXISTS "Admins can view all enquiries" ON enquiries;
DROP POLICY IF EXISTS "Admins can update all enquiries" ON enquiries;

-- Reviews
DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can update all reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can delete reviews" ON reviews;

-- Notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;

-- ============================================
-- STEP 2: Create SIMPLE policies without recursion
-- ============================================

-- PROFILES: Simple policies - users can only access their own
CREATE POLICY "Enable read for users own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Enable insert for users own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- TOURS: Public read, no write restrictions (handle in app)
CREATE POLICY "Enable read access for all users"
  ON tours FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON tours FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for authenticated users"
  ON tours FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- ITINERARY: Public read
CREATE POLICY "Enable read access for all users"
  ON itinerary FOR SELECT
  USING (true);

-- TOUR IMAGES: Public read
CREATE POLICY "Enable read access for all users"
  ON tour_images FOR SELECT
  USING (true);

-- VISA REQUIREMENTS: Public read
CREATE POLICY "Enable read access for all users"
  ON visa_requirements FOR SELECT
  USING (true);

-- INSURANCE PACKAGES: Public read
CREATE POLICY "Enable read access for all users"
  ON insurance_packages FOR SELECT
  USING (true);

-- BOOKINGS: Users can only see their own
CREATE POLICY "Enable read for users own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- PAYMENTS: Users can only see their own
CREATE POLICY "Enable read for users own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ENQUIRIES: Users can see their own, anyone can create
CREATE POLICY "Enable read for users own enquiries"
  ON enquiries FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Enable insert for all users"
  ON enquiries FOR INSERT
  WITH CHECK (true);

-- REVIEWS: Public read, users can create/update their own
CREATE POLICY "Enable read access for all users"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- NOTIFICATIONS: Users can only see their own
CREATE POLICY "Enable read for users own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Enable update for users own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- STEP 3: Fix profile creation trigger
-- ============================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    'customer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- STEP 4: Create profiles for existing users
-- ============================================

INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', email),
  COALESCE(raw_user_meta_data->>'avatar_url', raw_user_meta_data->>'picture', ''),
  'customer'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 5: Verify everything
-- ============================================

SELECT 'Setup complete!' as status;
SELECT 'Total profiles:' as info, COUNT(*) as count FROM profiles;
SELECT 'Total tours:' as info, COUNT(*) as count FROM tours;






