# Admin Panel Guide - DeshGhumado

## 🎯 Overview

The admin panel allows administrators to manage all aspects of the DeshGhumado platform, including tours, bookings, and enquiries.

---

## 🔐 Access

### Making Yourself Admin:

1. Sign in with Google
2. Run this SQL in Supabase:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

3. Refresh your browser
4. Navigate to `/admin`

---

## 📍 Admin Routes

### Main Dashboard
**URL:** `/admin`

**Features:**
- View statistics (total bookings, revenue, pending bookings, new enquiries)
- Manage bookings (view all, update status)
- Manage enquiries (view all, update status)
- Quick access to tour management

**Booking Statuses:**
- `pending` - Awaiting confirmation
- `confirmed` - Booking confirmed
- `cancelled` - Booking cancelled
- `completed` - Tour completed
- `refunded` - Payment refunded

**Enquiry Statuses:**
- `new` - New enquiry
- `in_progress` - Being handled
- `resolved` - Issue resolved
- `closed` - Enquiry closed

---

### Tour Management
**URL:** `/admin/tours`

**Features:**
- View all tours in a grid
- See tour status, seats, pricing at a glance
- Quick actions: View, Edit, Delete
- Create new tours

**Tour Card Shows:**
- Destination & country
- Start date & duration
- Price
- Seats available/total
- Status badge (Booking Open, Sold Out, Coming Soon, Cancelled)

---

### Create New Tour
**URL:** `/admin/tours/new`

**Sections:**

1. **Basic Information**
   - Destination *
   - Country *
   - Title *
   - Description *
   - Slug * (can auto-generate)
   - Flag Emoji
   - Image URL *

2. **Dates & Pricing**
   - Start Date *
   - End Date *
   - Duration (Days) *
   - Price (INR) *
   - Status * (booking_open, coming_soon, sold_out, cancelled)
   - Difficulty Level (easy, moderate, challenging, extreme)
   - Total Seats *
   - Min/Max Group Size *
   - Featured Tour (checkbox)

3. **Highlights**
   - Add multiple highlights
   - Remove individual items
   - Dynamic array management

4. **What's Included**
   - Add inclusions
   - Remove items
   - Dynamic list

5. **What's Not Included**
   - Add exclusions
   - Remove items
   - Dynamic list

6. **Do's**
   - Add travel tips
   - Remove items
   - Dynamic list

7. **Don'ts**
   - Add warnings
   - Remove items
   - Dynamic list

**Actions:**
- Cancel (go back without saving)
- Create Tour (save to database)

---

### Edit Tour
**URL:** `/admin/tours/edit/[id]`

**Features:**
- Same form as Create Tour
- Pre-filled with existing data
- Update all tour details
- Update seats booked count
- Links to manage:
  - 📅 Itinerary (coming soon)
  - 🖼️ Gallery (coming soon)
  - 📋 Visa Info (coming soon)

**Actions:**
- Cancel (discard changes)
- Update Tour (save changes)

---

## 🎨 UI Features

### Tour Management Grid
- **Responsive:** 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
- **Hover Effects:** Cards lift on hover
- **Status Badges:** Color-coded (green, red, yellow, gray)
- **Quick Stats:** Seats left shown in real-time

### Forms
- **Validation:** Required fields marked with *
- **Auto-slug:** Generate slug from destination + date
- **Dynamic Arrays:** Add/remove items with + and X buttons
- **Responsive:** 1 column (mobile) → 2 columns (desktop)

### Actions
- **View:** Opens tour page in new tab
- **Edit:** Navigate to edit form
- **Delete:** Confirmation dialog before deletion

---

## 🗄️ Database Operations

### Creating a Tour
1. Fill all required fields
2. Add at least one item to each array (highlights, inclusions, etc.)
3. Click "Create Tour"
4. Redirects to `/admin/tours` on success

### Updating a Tour
1. Edit any fields
2. Add/remove array items
3. Click "Update Tour"
4. Redirects to `/admin/tours` on success

### Deleting a Tour
1. Click trash icon
2. Confirm deletion
3. **Cascades:** Also deletes itinerary, images, visa requirements

---

## 🔒 Security

### Row Level Security (RLS)
- Users can only see their own bookings/enquiries
- Tours are publicly readable
- Admin operations handled in app layer

### Admin Checks
- Every admin page checks `profile.role === 'admin'`
- Redirects non-admins to homepage
- Shows alert: "Access denied. Admin only."

---

## 📊 Future Enhancements

### Itinerary Management
**URL:** `/admin/tours/[id]/itinerary` (to be built)

**Features:**
- Add/edit/delete itinerary days
- Day number, title, description
- Activities, meals, accommodation
- Image URL per day
- Notes

### Gallery Management
**URL:** `/admin/tours/[id]/gallery` (to be built)

**Features:**
- Upload/add tour images
- Set captions
- Reorder images (display_order)
- Delete images

### Visa Management
**URL:** `/admin/tours/[id]/visa` (to be built)

**Features:**
- Set visa type
- Processing days, validity
- Fees (visa + service)
- Requirements list
- Inclusions/exclusions
- Notes

---

## 🎯 Quick Tips

### Creating Your First Tour
1. Go to `/admin/tours`
2. Click "Add New Tour"
3. Fill basic info (destination, country, title, description)
4. Click "Generate" next to slug
5. Set dates and pricing
6. Add at least 3-4 highlights
7. Add inclusions (accommodation, meals, transfers, etc.)
8. Add exclusions (flights, visa, insurance, etc.)
9. Add do's and don'ts
10. Click "Create Tour"

### Editing Existing Tours
1. Go to `/admin/tours`
2. Find your tour
3. Click "Edit"
4. Make changes
5. Click "Update Tour"

### Managing Bookings
1. Go to `/admin`
2. View "Bookings" tab
3. Change status dropdown to update booking
4. Status updates automatically

### Managing Enquiries
1. Go to `/admin`
2. View "Enquiries" tab
3. Change status dropdown to update enquiry
4. Mark as resolved when done

---

## 🚨 Important Notes

1. **Slug Must Be Unique:** Each tour needs a unique slug
2. **Dates Must Be Valid:** End date must be after start date
3. **Arrays Can't Be Empty:** Add at least one item to highlights, inclusions, etc.
4. **Delete is Permanent:** Deleting a tour also deletes all related data
5. **Seats Booked:** Updated automatically when bookings are created

---

## 📞 Support

If you encounter any issues:
1. Check browser console for errors
2. Verify you're logged in as admin
3. Check Supabase logs for database errors
4. Ensure all required fields are filled

---

*Admin Panel v1.0 - Built for DeshGhumado by Wandering Maniac* 🚀




