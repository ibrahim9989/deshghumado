-- Fix RLS policies to allow authenticated users to insert/update/delete
-- (Admin checks are done in the application layer)

-- ITINERARY: Allow authenticated users to insert/update/delete
CREATE POLICY "Enable insert for authenticated users" 
  ON itinerary FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for authenticated users" 
  ON itinerary FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable delete for authenticated users" 
  ON itinerary FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- TOUR IMAGES: Allow authenticated users to insert/update/delete
CREATE POLICY "Enable insert for authenticated users" 
  ON tour_images FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for authenticated users" 
  ON tour_images FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable delete for authenticated users" 
  ON tour_images FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- VISA REQUIREMENTS: Allow authenticated users to insert/update/delete
CREATE POLICY "Enable insert for authenticated users" 
  ON visa_requirements FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for authenticated users" 
  ON visa_requirements FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable delete for authenticated users" 
  ON visa_requirements FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- INSURANCE PACKAGES: Allow authenticated users to insert/update/delete
CREATE POLICY "Enable insert for authenticated users" 
  ON insurance_packages FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for authenticated users" 
  ON insurance_packages FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable delete for authenticated users" 
  ON insurance_packages FOR DELETE 
  USING (auth.uid() IS NOT NULL);

SELECT 'Admin insert policies added!' as status;

