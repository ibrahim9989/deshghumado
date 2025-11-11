# Testing Guide - Authentication & Profile Flow

## Prerequisites

1. **Environment Setup**
   - Node.js installed (v18 or later)
   - Supabase project configured
   - Environment variables set in `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     ```

2. **Google OAuth Configuration**
   - Google OAuth credentials configured in Supabase
   - Redirect URLs properly set:
     - Development: `http://localhost:3000/auth/callback`
     - Production: `https://yourdomain.com/auth/callback`

3. **Database Setup**
   - `profiles` table exists with required columns
   - RLS policies configured
   - Triggers set up for profile creation

## Running the Development Server

```bash
cd nextjs-app
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

## Test Scenarios

### Scenario 1: New User - Complete Happy Flow

**Objective**: Test the complete flow for a new user booking a tour

**Steps**:

1. **Start**: Open `http://localhost:3000` in an incognito/private browser window
   - ✅ Expected: Homepage loads, "Sign In" button visible in navbar

2. **Browse Tours**: Click "Packages" or scroll to tours section
   - ✅ Expected: See list of tours with "Book Now" buttons

3. **Attempt Booking**: Click "Book Now" on any tour
   - ✅ Expected: 
     - Toast notification: "Please sign in to book this tour"
     - Redirected to Google OAuth consent screen

4. **Complete Authentication**: Sign in with Google account
   - ✅ Expected:
     - OAuth completes successfully
     - Redirected to loading screen with message "Please complete your profile..."
     - Then redirected to `/profile` page

5. **View Profile Page**: Observe the profile form
   - ✅ Expected:
     - Pink banner visible: "One more step before booking!"
     - Header: "Complete your profile to book"
     - Progress bar showing 0% completion
     - All fields empty
     - Save button disabled

6. **Fill Profile Form**: Fill all mandatory fields:
   - Full name: `John Doe`
   - Phone: `+1234567890`
   - Passport: `A1234567`
   - Date of birth: Pick any date
   - Emergency contact name: `Jane Doe`
   - Emergency contact phone: `+1234567891`
   - Diet: Select any option
   
   - ✅ Expected:
     - Progress bar updates as you fill fields
     - When all mandatory fields filled, progress shows 100%
     - Save button becomes enabled

7. **Save Profile**: Click "Save profile"
   - ✅ Expected:
     - Toast: "Profile saved successfully!"
     - Automatically redirected back to booking page (`/book/tour-slug`)
     - Booking form loads successfully

8. **Complete Booking**: Fill the booking form
   - ✅ Expected:
     - Can fill number of travelers
     - Can add traveler names
     - Can select add-ons (visa, insurance)
     - Can submit booking
     - Booking created successfully

### Scenario 2: Authenticated User (No Profile) Books Tour

**Objective**: Test flow for user who is signed in but hasn't completed profile

**Preparation**:
- Have a Google account that you've used before
- Make sure the profile for this user is NOT completed in database

**Steps**:

1. **Start Authenticated**: Open `http://localhost:3000` and sign in manually
   - Click "Sign In" button
   - Complete Google OAuth
   - Should be redirected to profile page

2. **Navigate Away Without Completing Profile**: Click home/logo to go to homepage
   - ✅ Expected: Can browse the site normally

3. **Attempt to Book**: Go to any tour and click "Book Now"
   - ✅ Expected:
     - Toast: "Please complete your profile before booking"
     - Redirected to `/profile`
     - Pink banner shows booking context

4. **Complete Profile**: Fill and save profile
   - ✅ Expected:
     - Redirected back to booking page
     - Can proceed with booking

### Scenario 3: User Signs In First (No Booking Intent)

**Objective**: Test authentication flow when user signs in without trying to book

**Steps**:

1. **Start**: Open `http://localhost:3000` in incognito window
   
2. **Sign In**: Click "Sign In" in navbar
   - ✅ Expected: Redirected to Google OAuth

3. **Complete Auth**: Sign in with Google
   - ✅ Expected:
     - Redirected to profile page (no pink booking banner)
     - Header: "Complete your profile" (not booking-specific)

4. **Complete Profile**: Fill all fields and save
   - ✅ Expected:
     - Toast: "Profile saved successfully!"
     - Redirected to homepage (no booking destination stored)

5. **Book Tour**: Now click "Book Now" on any tour
   - ✅ Expected:
     - Directly go to booking page
     - No authentication or profile screens

### Scenario 4: Returning User (Profile Complete)

**Objective**: Test that returning users don't see profile screen

**Preparation**:
- Use an account that has already completed the profile

**Steps**:

1. **Start**: Open `http://localhost:3000` in incognito window

2. **Click Book Now**: Go to any tour and click "Book Now"
   - ✅ Expected: 
     - Redirected to Google OAuth
     - After auth, redirected to booking page DIRECTLY
     - No profile page shown

3. **Verify**: Check that you can complete booking
   - ✅ Expected: Booking form works normally

### Scenario 5: Profile Already Completed - Visit Profile Page

**Objective**: Test that users with completed profiles are redirected appropriately

**Preparation**:
- Signed in user with completed profile
- Have an intended destination in sessionStorage

**Steps**:

1. **Setup**: Manually navigate to `/profile`
   - ✅ Expected:
     - Toast: "Profile already completed!"
     - Redirected to home or intended destination

2. **Verify Booking**: Try booking a tour
   - ✅ Expected: Direct access to booking page

### Scenario 6: Session Preservation Edge Cases

**Objective**: Test that session state is properly preserved

**Test Case 6.1: Multiple Tab Interruption**

1. Open booking page in Tab 1
2. Start authentication flow
3. Open new Tab 2, complete some other actions
4. Complete authentication in Tab 1
5. ✅ Expected: Still redirected to original booking page

**Test Case 6.2: Browser Refresh During Auth**

1. Click "Book Now"
2. During OAuth consent screen, try to refresh or navigate back
3. Complete OAuth
4. ✅ Expected: Still redirected to booking page (sessionStorage preserved)

**Test Case 6.3: Clear Session and Try to Book**

1. Open DevTools → Application → Session Storage
2. Clear all session storage
3. Try to book a tour
4. ✅ Expected: 
   - Authentication flow works
   - After profile completion, redirected to booking page (new session created)

## Manual Testing with Browser DevTools

### Check SessionStorage

1. Open DevTools (F12)
2. Go to Application tab → Storage → Session Storage
3. Look for key: `intendedDestination`
4. Value should be: `/book/tour-slug`

### Check Authentication State

1. Open DevTools Console
2. Run:
   ```javascript
   const { createClient } = require('@supabase/supabase-js');
   const supabase = createClient('YOUR_URL', 'YOUR_KEY');
   const { data } = await supabase.auth.getUser();
   console.log(data.user);
   ```

### Check Profile Completion in Database

Using Supabase Dashboard:

1. Go to Table Editor
2. Open `profiles` table
3. Find your user by email
4. Check `profile_completed` column
5. Should be `true` after completing profile form

## Automated Testing (Future)

### Suggested Tests to Write

```typescript
// Example test structure (using Playwright or Cypress)

describe('Authentication Flow', () => {
  it('should redirect unauthenticated user through full flow', async () => {
    // Navigate to tour page
    // Click Book Now
    // Mock Google OAuth
    // Fill profile form
    // Verify redirect to booking page
  });

  it('should preserve state through authentication', async () => {
    // Store test data in sessionStorage
    // Trigger auth flow
    // Verify data still present after auth
  });

  it('should not show profile page to users with completed profiles', async () => {
    // Sign in with completed profile user
    // Navigate to /profile
    // Verify immediate redirect
  });
});
```

## Common Issues and Solutions

### Issue 1: Redirect Loop

**Symptoms**: Page keeps redirecting between profile and auth

**Solutions**:
- Clear sessionStorage: `sessionStorage.clear()`
- Check database: Verify `profile_completed` is actually set to `true`
- Check Supabase auth session is valid

**Debug**:
```javascript
// In browser console
console.log('Session:', sessionStorage.getItem('intendedDestination'));
// Should be cleared after successful completion
```

### Issue 2: OAuth Redirect Not Working

**Symptoms**: After Google sign in, shows error or doesn't redirect

**Solutions**:
- Verify redirect URL in Supabase dashboard matches exactly
- Check that `/auth/callback` route exists and is not cached
- Clear browser cache and cookies

**Debug**:
- Check Network tab for 302 redirects
- Look for error messages in callback route

### Issue 3: Profile Not Saving

**Symptoms**: Click save, but profile_completed remains false

**Solutions**:
- Check database trigger for profiles table
- Verify RLS policies allow update
- Check that all mandatory fields are actually filled

**Debug**:
```sql
-- Run in Supabase SQL Editor
SELECT * FROM profiles WHERE email = 'your-email@example.com';
```

### Issue 4: Intended Destination Not Preserved

**Symptoms**: After auth, redirected to home instead of booking page

**Solutions**:
- Check if sessionStorage is being cleared too early
- Verify callback route isn't clearing the key
- Make sure third-party cookies are enabled (for OAuth)

**Debug**:
```javascript
// Before auth
console.log('Before:', sessionStorage.getItem('intendedDestination'));
// After auth (in profile page or redirect page)
console.log('After:', sessionStorage.getItem('intendedDestination'));
```

## Performance Checks

### Loading Times

- Initial page load: < 2s
- OAuth redirect: < 1s
- Profile save: < 1s
- Redirect after profile: < 500ms

### User Experience Metrics

- Time to complete profile: < 2 minutes
- Number of clicks to book (new user): ~8-10
- Number of clicks to book (returning user): ~3-4

## Browser Compatibility

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Safari (iOS)
- ✅ Mobile Chrome (Android)

## Accessibility Checks

- ✅ Keyboard navigation works through entire flow
- ✅ Screen readers can understand form fields
- ✅ Error messages are clear and actionable
- ✅ Loading states are announced
- ✅ Focus management during redirects

## Security Checks

- ✅ OAuth tokens not exposed in URLs
- ✅ Profile data only accessible by owner
- ✅ RLS policies enforced
- ✅ HTTPS in production
- ✅ No sensitive data in sessionStorage
- ✅ XSS protection enabled

## Conclusion

After completing all tests, verify:

1. ✅ New users can book tours successfully
2. ✅ Authenticated users without profiles are prompted
3. ✅ Users with completed profiles have instant access
4. ✅ State is preserved throughout the flow
5. ✅ Error cases are handled gracefully
6. ✅ User experience is smooth and intuitive

If all checks pass, the authentication flow is working correctly! 🎉


