# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your Next.js application using Supabase.

## Prerequisites

1. A Supabase project (create one at [supabase.com](https://supabase.com))
2. A Google Cloud project (create one at [console.cloud.google.com](https://console.cloud.google.com))

## Step 1: Configure Google Cloud Project

### 1.1 Create OAuth Consent Screen

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** > **OAuth consent screen**
4. Choose **External** user type (unless you have a Google Workspace)
5. Fill in the required information:
   - App name
   - User support email
   - Developer contact email
6. Click **Save and Continue**

### 1.2 Configure Scopes

1. In the **Scopes** section, click **Add or Remove Scopes**
2. Add these scopes (if not already present):
   - `openid` (add manually)
   - `.../auth/userinfo.email` (added by default)
   - `.../auth/userinfo.profile` (added by default)
3. Click **Update** and **Save and Continue**

### 1.3 Add Test Users (for development)

1. In the **Test users** section, add your Google account email
2. Click **Save and Continue**

### 1.4 Create OAuth 2.0 Client ID

1. Navigate to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Choose **Web application** as the application type
4. Configure:
   - **Name**: Your app name (e.g., "DeshGhumado Web")
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000` (for local development)
     - `https://yourdomain.com` (for production)
   - **Authorized redirect URIs**:
     - Get this from your Supabase dashboard: **Authentication** > **Providers** > **Google**
     - It will look like: `https://your-project-ref.supabase.co/auth/v1/callback`
     - For local development: `http://localhost:3000/auth/callback`
5. Click **Create**
6. **Save the Client ID and Client Secret** - you'll need them in the next step

## Step 2: Configure Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** > **Providers**
4. Find **Google** in the list and click on it
5. Enable the Google provider
6. Enter your **Client ID** and **Client Secret** from Step 1.4
7. Click **Save**

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   You can find these in your Supabase dashboard:
   - **Project Settings** > **API** > **Project URL** (for SUPABASE_URL)
   - **Project Settings** > **API** > **anon/public key** (for SUPABASE_ANON_KEY)

3. Add Razorpay credentials (see [RAZORPAY_SETUP.md](./RAZORPAY_SETUP.md) for details):
   ```env
   RAZORPAY_KEY_ID=rzp_live_ReRt29vMOOk9Wj
   RAZORPAY_KEY_SECRET=R4krUJxoL2RsBVyUAqnkOu8l
   RAZORPAY_WEBHOOK_SECRET=bEgz_vpPSs9x3th
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_ReRt29vMOOk9Wj
   ```

## Step 4: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`
3. Click **Sign in with Google**
4. You should be redirected to Google's consent screen
5. After signing in, you should be redirected back to your app

## Troubleshooting

### "Redirect URI mismatch" error

- Make sure the redirect URI in Google Cloud Console matches exactly:
  - Production: `https://your-project-ref.supabase.co/auth/v1/callback`
  - Development: `http://localhost:3000/auth/callback`
- Check that there are no trailing slashes or extra characters

### "Access blocked" error

- Make sure you've added your email as a test user in Google Cloud Console
- Make sure your OAuth consent screen is properly configured
- If your app is in "Testing" mode, only test users can sign in

### Session not persisting

- Check that cookies are enabled in your browser
- Verify that `NEXT_PUBLIC_SITE_URL` matches your current domain
- Check browser console for any errors

### "Invalid client" error

- Verify that your Client ID and Client Secret are correct in Supabase dashboard
- Make sure you copied the Client ID (not the Client Secret) to the Client ID field

## Production Deployment

Before deploying to production:

1. **Update Google Cloud Console**:
   - Add your production domain to **Authorized JavaScript origins**
   - Add your production callback URL to **Authorized redirect URIs**

2. **Update Environment Variables**:
   - Set `NEXT_PUBLIC_SITE_URL` to your production domain
   - Update Supabase redirect URLs in the dashboard if needed

3. **Publish your OAuth App** (if ready):
   - In Google Cloud Console, go to **OAuth consent screen**
   - Click **Publish App** to make it available to all users
   - Note: This may require verification if you're using sensitive scopes

## Additional Resources

- [Supabase Google Auth Documentation](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Help](https://supabase.com/docs/guides/auth)

