-- Fix infinite recursion in RLS policies

-- Drop all existing policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Recreate policies WITHOUT recursive checks
-- Users can always view and update their own profile
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- For admin access, we'll use a simpler approach
-- Admins can view all profiles (but we check role in the app, not in RLS)
CREATE POLICY "Service role can view all profiles"
  ON profiles FOR SELECT
  USING (
    auth.jwt()->>'role' = 'service_role' OR
    auth.uid() = id
  );

CREATE POLICY "Service role can update all profiles"
  ON profiles FOR UPDATE
  USING (
    auth.jwt()->>'role' = 'service_role' OR
    auth.uid() = id
  );

-- Similarly fix other tables that had recursive admin checks
-- Tours
DROP POLICY IF EXISTS "Admins can insert tours" ON tours;
DROP POLICY IF EXISTS "Admins can update tours" ON tours;
DROP POLICY IF EXISTS "Admins can delete tours" ON tours;

-- Itinerary
DROP POLICY IF EXISTS "Admins can insert itinerary" ON itinerary;
DROP POLICY IF EXISTS "Admins can update itinerary" ON itinerary;
DROP POLICY IF EXISTS "Admins can delete itinerary" ON itinerary;

-- Tour images
DROP POLICY IF EXISTS "Admins can insert tour images" ON tour_images;
DROP POLICY IF EXISTS "Admins can update tour images" ON tour_images;
DROP POLICY IF EXISTS "Admins can delete tour images" ON tour_images;

-- Visa requirements
DROP POLICY IF EXISTS "Admins can insert visa requirements" ON visa_requirements;
DROP POLICY IF EXISTS "Admins can update visa requirements" ON visa_requirements;
DROP POLICY IF EXISTS "Admins can delete visa requirements" ON visa_requirements;

-- Bookings
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can update all bookings" ON bookings;

-- Payments
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;

-- Enquiries
DROP POLICY IF EXISTS "Admins can view all enquiries" ON enquiries;
DROP POLICY IF EXISTS "Admins can update all enquiries" ON enquiries;

-- Reviews
DROP POLICY IF EXISTS "Admins can update all reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can delete reviews" ON reviews;

-- For now, we'll handle admin permissions in the application layer
-- The RLS policies will only protect user data, not admin operations

SELECT 'RLS policies fixed!' as status;

