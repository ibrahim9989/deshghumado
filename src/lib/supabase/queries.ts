// Supabase query functions for tours, bookings, profiles, etc.

import { createSupabaseBrowser } from './client';

// ============================================
// TYPES
// ============================================

export type Tour = {
  id: string;
  slug: string;
  destination: string;
  country: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  duration_days: number;
  price_inr: number;
  currency: string;
  status: 'booking_open' | 'coming_soon' | 'sold_out' | 'cancelled';
  total_seats: number;
  seats_booked: number;
  min_group_size: number;
  max_group_size: number;
  difficulty_level: string | null;
  image_url: string | null;
  flag_emoji: string | null;
  color_gradient: string | null;
  highlights: string[] | null;
  inclusions: string[] | null;
  exclusions: string[] | null;
  dos: string[] | null;
  donts: string[] | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type Itinerary = {
  id: string;
  tour_id: string;
  day_number: number;
  title: string;
  description: string | null;
  activities: string[] | null;
  meals_included: string[] | null;
  accommodation: string | null;
  image_url: string | null;
  notes: string | null;
  created_at: string;
};

export type TourImage = {
  id: string;
  tour_id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
  created_at: string;
};

export type VisaRequirement = {
  id: string;
  tour_id: string;
  visa_type: string;
  processing_days: number | null;
  validity_days: number | null;
  visa_fee_inr: number | null;
  service_fee_inr: number | null;
  total_fee_inr: number | null;
  requirements: string[] | null;
  inclusions: string[] | null;
  exclusions: string[] | null;
  notes: string | null;
  apply_before_days: number;
  created_at: string;
};

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  passport_number: string | null;
  passport_expiry: string | null;
  date_of_birth: string | null;
  nationality: string;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  emergency_contact_relation: string | null;
  dietary_preferences: string | null;
  medical_conditions: string | null;
  profile_completed: boolean;
  avatar_url: string | null;
  role: 'customer' | 'admin';
  created_at: string;
  updated_at: string;
};

export type Booking = {
  id: string;
  booking_reference: string;
  user_id: string;
  tour_id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
  num_travelers: number;
  traveler_names: string[] | null;
  tour_price_inr: number;
  visa_fee_inr: number;
  insurance_fee_inr: number;
  total_amount_inr: number;
  deposit_paid_inr: number;
  balance_due_inr: number;
  balance_due_date: string | null;
  payment_status: 'pending' | 'partial' | 'paid' | 'refunded';
  visa_applied: boolean;
  insurance_applied: boolean;
  insurance_package_id: string | null;
  special_requests: string | null;
  dietary_requirements: string | null;
  booking_date: string;
  payment_due_date: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
  tours?: {
    id: string;
    destination: string;
    country: string;
    title: string;
    slug: string;
    start_date: string;
    end_date: string;
    image_url: string;
  };
};

export type Enquiry = {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  tour_id: string | null;
  subject: string | null;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  assigned_to: string | null;
  response: string | null;
  responded_at: string | null;
  created_at: string;
  updated_at: string;
};

// ============================================
// TOURS
// ============================================

export async function getAllTours(): Promise<Tour[]> {
  const supabase = createSupabaseBrowser();
  const { data, error } = await supabase
    .from('tours')
    .select('*')
    .order('start_date', { ascending: true });

  if (error) {
    console.error('Error fetching tours:', error);
    return [];
  }

  return data || [];
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  const supabase = createSupabaseBrowser();
  const { data, error } = await supabase
    .from('tours')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching tour:', error);
    return null;
  }

  return data;
}

export async function getTourItinerary(tourId: string): Promise<Itinerary[]> {
  const supabase = createSupabaseBrowser();
  const { data, error } = await supabase
    .from('itinerary')
    .select('*')
    .eq('tour_id', tourId)
    .order('day_number', { ascending: true });

  if (error) {
    console.error('Error fetching itinerary:', error);
    return [];
  }

  return data || [];
}

export async function getTourImages(tourId: string): Promise<TourImage[]> {
  const supabase = createSupabaseBrowser();
  const { data, error } = await supabase
    .from('tour_images')
    .select('*')
    .eq('tour_id', tourId)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching tour images:', error);
    return [];
  }

  return data || [];
}

export async function getVisaRequirements(tourId: string): Promise<VisaRequirement | null> {
  const supabase = createSupabaseBrowser();
  const { data, error } = await supabase
    .from('visa_requirements')
    .select('*')
    .eq('tour_id', tourId)
    .maybeSingle(); // Use maybeSingle() instead of single() to handle 0 results

  if (error) {
    console.error('Error fetching visa requirements:', error);
    return null;
  }

  return data;
}

// ============================================
// PROFILE
// ============================================

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createSupabaseBrowser();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<boolean> {
  const supabase = createSupabaseBrowser();
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) {
    console.error('Error updating profile:', error);
    return false;
  }

  return true;
}

// ============================================
// BOOKINGS
// ============================================

export async function createBooking(booking: Partial<Booking>): Promise<string | null> {
  const supabase = createSupabaseBrowser();
  const { data, error } = await supabase
    .from('bookings')
    .insert([booking])
    .select('id')
    .single();

  if (error) {
    console.error('Error creating booking:', error);
    return null;
  }

  return data?.id || null;
}

export async function getUserBookings(userId: string): Promise<Booking[]> {
  const supabase = createSupabaseBrowser();
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      tours (
        id,
        destination,
        country,
        title,
        slug,
        start_date,
        end_date,
        image_url
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }

  return data || [];
}

export async function getBookingById(bookingId: string): Promise<Booking | null> {
  const supabase = createSupabaseBrowser();
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();

  if (error) {
    console.error('Error fetching booking:', error);
    return null;
  }

  return data;
}

// ============================================
// ENQUIRIES
// ============================================

export async function createEnquiry(enquiry: Partial<Enquiry>): Promise<boolean> {
  const supabase = createSupabaseBrowser();
  const { error } = await supabase
    .from('enquiries')
    .insert([enquiry]);

  if (error) {
    console.error('Error creating enquiry:', error);
    return false;
  }

  return true;
}

export async function getUserEnquiries(userId: string): Promise<Enquiry[]> {
  const supabase = createSupabaseBrowser();
  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching enquiries:', error);
    return [];
  }

  return data || [];
}

// ============================================
// ADMIN FUNCTIONS
// ============================================

export async function getAllBookings(): Promise<Booking[]> {
  const supabase = createSupabaseBrowser();
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all bookings:', error);
    return [];
  }

  return data || [];
}

export async function getAllEnquiries(): Promise<Enquiry[]> {
  const supabase = createSupabaseBrowser();
  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all enquiries:', error);
    return [];
  }

  return data || [];
}

export async function updateBookingStatus(
  bookingId: string,
  status: Booking['status']
): Promise<boolean> {
  const supabase = createSupabaseBrowser();
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId);

  if (error) {
    console.error('Error updating booking status:', error);
    return false;
  }

  return true;
}

export async function updateEnquiryStatus(
  enquiryId: string,
  status: Enquiry['status'],
  response?: string
): Promise<boolean> {
  const supabase = createSupabaseBrowser();
  const updates: Partial<Enquiry> = { status };
  if (response) {
    updates.response = response;
    updates.responded_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('enquiries')
    .update(updates)
    .eq('id', enquiryId);

  if (error) {
    console.error('Error updating enquiry status:', error);
    return false;
  }

  return true;
}

