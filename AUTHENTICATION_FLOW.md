# Authentication & Profile Completion Flow

## Overview

This document describes the complete authentication and profile completion flow implemented in the Desh Ghumado application. The flow ensures that users are authenticated and have completed their mandatory profile before accessing protected resources like booking tours.

## Key Features

1. **State Preservation**: User's intended destination is preserved throughout the authentication and profile completion journey
2. **Google OAuth**: Seamless Google authentication integration
3. **Mandatory Profile**: Profile completion is required before booking tours
4. **Smart Redirects**: After authentication and profile completion, users are redirected back to their intended destination

## Flow Diagrams

### Scenario 1: Unauthenticated User Tries to Book

```
User clicks "Book Now"
    ↓
Check: Is user authenticated?
    ↓ NO
Store intended destination (/book/tour-slug) in sessionStorage
    ↓
Redirect to Google OAuth
    ↓
User completes authentication
    ↓
Redirect to /auth/callback
    ↓
Check: Is profile completed?
    ↓ NO
Redirect to /auth/redirect?needsProfile=true
    ↓
Redirect to /profile (sessionStorage preserved)
    ↓
User fills mandatory profile form
    ↓
Profile saved with profile_completed = true
    ↓
Retrieve intended destination from sessionStorage
    ↓
Redirect to /book/tour-slug
    ↓
✅ User proceeds with booking
```

### Scenario 2: Authenticated User (Profile Incomplete) Tries to Book

```
User clicks "Book Now"
    ↓
Check: Is user authenticated?
    ↓ YES
Check: Is profile completed?
    ↓ NO
Store intended destination (/book/tour-slug) in sessionStorage
    ↓
Redirect to /profile
    ↓
User fills mandatory profile form
    ↓
Profile saved with profile_completed = true
    ↓
Retrieve intended destination from sessionStorage
    ↓
Redirect to /book/tour-slug
    ↓
✅ User proceeds with booking
```

### Scenario 3: User Authenticates First (No Booking Intent)

```
User clicks "Sign In"
    ↓
Redirect to Google OAuth
    ↓
User completes authentication
    ↓
Redirect to /auth/callback
    ↓
Check: Is profile completed?
    ↓ NO
Redirect to /auth/redirect?needsProfile=true
    ↓
Redirect to /profile
    ↓
User fills mandatory profile form
    ↓
Profile saved with profile_completed = true
    ↓
Check sessionStorage for intended destination
    ↓ NONE
Redirect to home page (/)
    ↓
✅ User is now fully set up
```

### Scenario 4: Fully Authenticated User Books (Happy Path)

```
User clicks "Book Now"
    ↓
Check: Is user authenticated?
    ↓ YES
Check: Is profile completed?
    ↓ YES
✅ Proceed directly to /book/tour-slug
    ↓
User completes booking form
    ↓
✅ Booking confirmed
```

## Technical Implementation

### Files Modified/Created

1. **`/src/app/auth/callback/route.ts`**
   - Handles OAuth callback
   - Checks profile completion status
   - Redirects to `/auth/redirect` with appropriate query params

2. **`/src/app/auth/redirect/page.tsx`**
   - Client-side redirect handler
   - Accesses sessionStorage for intended destination
   - Routes users based on profile completion status
   - Shows appropriate loading messages

3. **`/src/app/profile/page.tsx`**
   - Mandatory profile form
   - Validates required fields
   - Shows contextual messages for booking flows
   - Handles redirect after profile completion

4. **`/src/app/book/[slug]/page.tsx`**
   - Protected booking page
   - Checks authentication and profile completion
   - Stores intended destination before redirecting

5. **`/src/components/BookNowButton.tsx`**
   - Smart booking button component
   - Handles authentication checks
   - Triggers Google OAuth if needed
   - Redirects to profile if needed

6. **`/src/components/AuthGuard.tsx`** *(NEW)*
   - Reusable authentication guard component
   - Can be wrapped around any protected content
   - Handles auth checks and redirects automatically

7. **`/src/lib/auth-utils.ts`**
   - Enhanced with new utility functions
   - `initiateGoogleSignIn()` - Start OAuth flow
   - `checkAuthFlow()` - Complete auth status check
   - Session storage management helpers

8. **`/src/hooks/useAuth.ts`**
   - Authentication hook
   - Real-time auth state management
   - Helper functions for sign in/out

## State Management

### SessionStorage Keys

- **`intendedDestination`**: Stores the URL path where the user intended to go before being interrupted for authentication/profile completion

### Query Parameters

- **`needsProfile`**: Added to `/auth/redirect` URL to indicate profile completion is required
- **`returnTo`**: URL parameter for explicit return destinations

## Component Usage

### Using AuthGuard

```tsx
import AuthGuard from '@/components/AuthGuard';

export default function ProtectedPage() {
  return (
    <AuthGuard requireProfile={true}>
      <div>Protected content here</div>
    </AuthGuard>
  );
}
```

### Using auth-utils

```tsx
import { checkAuthFlow, initiateGoogleSignIn } from '@/lib/auth-utils';

async function handleAction() {
  const authStatus = await checkAuthFlow();
  
  if (!authStatus.canProceed) {
    if (authStatus.needsAuth) {
      await initiateGoogleSignIn('/intended-destination');
    } else if (authStatus.needsProfile) {
      router.push('/profile');
    }
    return;
  }
  
  // Proceed with action
}
```

### Using useAuth hook

```tsx
import { useAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  const { 
    isAuthenticated, 
    profileComplete, 
    isLoading,
    signInWithGoogle,
    requireAuth 
  } = useAuth();
  
  const handleBooking = async () => {
    const canProceed = await requireAuth('/book/tour-slug');
    if (!canProceed) return;
    
    // Proceed with booking
  };
}
```

## Profile Form Requirements

### Mandatory Fields (Must be filled)

1. Full name (as per passport)
2. Phone number (with country code)
3. Passport number
4. Date of birth
5. Emergency contact name
6. Emergency contact phone
7. Diet preference

### Optional Fields

1. Medical conditions

### Validation

- All mandatory fields must be filled before saving
- Progress indicator shows completion percentage
- Save button is disabled until all required fields are complete

## User Experience Enhancements

1. **Contextual Messages**: 
   - Different header messages based on booking flow
   - Pink banner shown when user is in a booking flow
   - Clear progress indicators

2. **Loading States**:
   - Spinner with contextual messages during redirects
   - "Checking authentication...", "Please complete your profile...", "Resuming your journey..."

3. **Toast Notifications**:
   - Success/error messages at key points
   - Clear feedback on authentication status

4. **Auto-redirect**:
   - If profile already completed, automatically redirect to intended destination
   - No unnecessary form displays

## Security Considerations

1. All authentication checks happen server-side first (callback route)
2. Profile completion status is verified from database
3. SessionStorage is used only for UX (not security)
4. Protected routes re-verify authentication on load
5. OAuth tokens handled by Supabase Auth

## Testing Checklist

### Test Scenario 1: New User Books Tour
- [ ] Click "Book Now" on tour page
- [ ] Redirected to Google OAuth
- [ ] After auth, redirected to profile page
- [ ] Pink banner shows "One more step before booking!"
- [ ] Fill all mandatory fields
- [ ] Click "Save profile"
- [ ] Automatically redirected back to booking page
- [ ] Can complete booking

### Test Scenario 2: Authenticated User (No Profile) Books Tour
- [ ] Already signed in
- [ ] Click "Book Now"
- [ ] Directly redirected to profile page
- [ ] Complete profile
- [ ] Redirected back to booking page

### Test Scenario 3: New User Signs In First
- [ ] Click "Sign In" button
- [ ] Complete Google OAuth
- [ ] Redirected to profile page
- [ ] Complete profile
- [ ] Redirected to home page
- [ ] Can now book tours directly

### Test Scenario 4: Fully Set Up User
- [ ] Signed in with completed profile
- [ ] Click "Book Now"
- [ ] Directly go to booking page
- [ ] No intermediate steps

### Test Scenario 5: User Already Has Completed Profile
- [ ] Sign in with existing account (profile completed)
- [ ] Should not see profile form
- [ ] Can immediately book tours

## Future Enhancements

1. **Profile Edit**: Allow users to edit their profile after completion
2. **Social Profiles**: Additional OAuth providers (Facebook, Apple)
3. **Profile Photos**: Upload avatar/passport photo
4. **Document Upload**: Upload passport/visa documents
5. **Email Verification**: Require email verification
6. **Phone OTP**: Two-factor authentication
7. **Progress Save**: Auto-save profile form progress
8. **Partial Profile**: Allow partial profile completion for browsing, require full for booking

## Troubleshooting

### User Stuck in Redirect Loop
- Clear sessionStorage: `sessionStorage.clear()`
- Check if profile_completed flag is set correctly in database
- Verify Supabase auth session is valid

### Intended Destination Not Preserved
- Check browser's sessionStorage in DevTools
- Ensure OAuth redirect URL is correctly configured in Supabase
- Verify callback route is not clearing sessionStorage prematurely

### Profile Form Not Redirecting After Save
- Check that updateProfile function is setting profile_completed = true
- Verify sessionStorage has intendedDestination key
- Check browser console for errors

## Support

For issues or questions, refer to:
- Supabase Auth Documentation: https://supabase.com/docs/guides/auth
- Next.js App Router: https://nextjs.org/docs/app
- React Hook Form (if using): https://react-hook-form.com/




