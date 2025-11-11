# DeshGhumado - Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Supabase Project**: Your Supabase project should be fully set up with all tables, RLS policies, and functions
3. **GitHub Repository**: Push your code to GitHub (recommended) or use Vercel CLI

## Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure your `.gitignore` is properly configured (already done):
```bash
# Check that .env.local is ignored
cat .gitignore | grep .env
```

### 2. Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - DeshGhumado"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/deshghumado.git

# Push to GitHub
git push -u origin main
```

### 3. Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `nextjs-app`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

4. **Add Environment Variables** (CRITICAL):
   Click "Environment Variables" and add:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://ekognpwosomaizvucvdo.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrb2ducHdvc29tYWl6dnVjdmRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MDM1MjUsImV4cCI6MjA3ODE3OTUyNX0.fQHhA5BwEUJI9-0v5kqYSSYRymdJlaS4wcX33T8JOlM
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrb2ducHdvc29tYWl6dnVjdmRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjYwMzUyNSwiZXhwIjoyMDc4MTc5NTI1fQ.e-wbFWrK3HI-5M5gF26opGIyPSidb05Yy9TyIGzbGpc
   NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
   ```

   **Important**: 
   - Add these to all environments (Production, Preview, Development)
   - Replace `https://your-app.vercel.app` with your actual Vercel domain
   - The `NEXT_PUBLIC_SITE_URL` ensures OAuth redirects work correctly in production

5. Click **Deploy**

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from the nextjs-app directory)
cd nextjs-app
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? deshghumado
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_SITE_URL

# Deploy to production
vercel --prod
```

### 4. Configure Supabase for Production

Update your Supabase project settings:

1. Go to **Authentication > URL Configuration**
2. Add your Vercel domain to **Site URL**:
   ```
   https://your-app.vercel.app
   ```

3. Add to **Redirect URLs**:
   ```
   https://your-app.vercel.app/auth/callback
   https://your-app.vercel.app/**
   ```

### 5. Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services > Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add to **Authorized JavaScript origins**:
   ```
   https://your-app.vercel.app
   ```

5. Add to **Authorized redirect URIs**:
   ```
   https://ekognpwosomaizvucvdo.supabase.co/auth/v1/callback
   ```

### 6. Post-Deployment Checklist

- [ ] Test Google Sign-in on production
- [ ] Test profile creation and completion
- [ ] Test tour booking flow
- [ ] Test admin panel access
- [ ] Test contact form submission
- [ ] Verify all images load correctly
- [ ] Test on mobile devices
- [ ] Check all environment variables are set
- [ ] Verify RLS policies are working
- [ ] Test payment flow (when integrated)

### 7. Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to **Domains**
3. Add your custom domain (e.g., `deshghumado.com`)
4. Update DNS records as instructed
5. Update Supabase and Google OAuth URLs with your custom domain

### 8. Monitoring and Analytics

1. **Vercel Analytics**: Automatically enabled
2. **Vercel Speed Insights**: Enable in project settings
3. **Error Tracking**: Consider adding Sentry
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard@latest -i nextjs
   ```

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (public) | ✅ Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (secret) | ✅ Yes |
| `NEXT_PUBLIC_SITE_URL` | Your production site URL (e.g., https://your-app.vercel.app) | ✅ Yes |

**⚠️ SECURITY WARNING**: 
- Never commit `.env.local` to Git
- Never share your `SUPABASE_SERVICE_ROLE_KEY` publicly
- The service role key bypasses RLS - use with extreme caution

## Troubleshooting

### Build Fails

**Issue**: Build fails with module not found
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

### Environment Variables Not Working

**Issue**: App can't connect to Supabase
- Verify all environment variables are set in Vercel dashboard
- Check variable names are exactly correct (case-sensitive)
- Redeploy after adding variables

### Google Sign-in Not Working / Redirects to localhost

**Issue**: OAuth redirect fails or redirects to localhost:3000
- **CRITICAL**: Set `NEXT_PUBLIC_SITE_URL` environment variable to your production URL
- Verify Supabase redirect URLs include your Vercel domain
- Check Supabase Site URL is set to your production domain (not localhost)
- Check Google OAuth authorized redirect URIs
- Ensure `auth/callback` route exists
- Redeploy after updating environment variables

### Images Not Loading

**Issue**: Next.js Image optimization fails
- Verify `next.config.ts` has all remote image domains
- Check image URLs are accessible
- Consider using Vercel Image Optimization

### RLS Policies Blocking Requests

**Issue**: "new row violates row-level security policy"
- Run all SQL migration files in Supabase SQL Editor
- Verify policies allow authenticated users
- Check user roles are set correctly

## Continuous Deployment

Vercel automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: When you create a pull request
- **Development**: When you push to other branches

To disable auto-deployment:
1. Go to Project Settings > Git
2. Configure deployment branches

## Performance Optimization

### 1. Enable Edge Runtime (Optional)
For faster global performance, add to API routes:
```typescript
export const runtime = 'edge';
```

### 2. Image Optimization
Already configured in `next.config.ts`

### 3. Caching
Consider adding ISR (Incremental Static Regeneration) for tour pages:
```typescript
export const revalidate = 3600; // Revalidate every hour
```

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)

## Quick Commands

```bash
# Local development
npm run dev

# Build locally
npm run build

# Start production build locally
npm run start

# Deploy to Vercel
vercel --prod

# View deployment logs
vercel logs

# Open project in Vercel dashboard
vercel open
```

---

**Ready to Deploy?** 🚀

Your DeshGhumado app is configured and ready for Vercel deployment!

