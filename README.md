This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase project (create one at [supabase.com](https://supabase.com))
- Google OAuth credentials (see [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) for detailed instructions)

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Create a `.env.local` file in the root directory
   - Add your Supabase credentials:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     NEXT_PUBLIC_SITE_URL=http://localhost:3000
     ```
   - Add Razorpay credentials:
     ```env
     RAZORPAY_KEY_ID=rzp_live_ReRt29vMOOk9Wj
     RAZORPAY_KEY_SECRET=R4krUJxoL2RsBVyUAqnkOu8l
     RAZORPAY_WEBHOOK_SECRET=bEgz_vpPSs9x3th
     NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_ReRt29vMOOk9Wj
     ```
   - See [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) for complete setup instructions
   - See [RAZORPAY_SETUP.md](./RAZORPAY_SETUP.md) for payment integration details

3. **Configure Google OAuth:**
   - Follow the detailed guide in [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)
   - This includes setting up Google Cloud Console and configuring Supabase

4. **Run the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
