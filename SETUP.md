# THC Plus - Setup Guide

This guide will help you complete the setup for your production-ready THC Plus website.

## ✅ Phase 1 & 2 Completed

The following has been implemented:
- ✅ Testing infrastructure (Vitest, Playwright, React Testing Library)
- ✅ Validation schemas with Zod
- ✅ Prisma ORM with database schema
- ✅ Server actions for contact form
- ✅ Resend email service integration
- ✅ React Hook Form with validation
- ✅ Toast notifications (Sonner)

## 🔧 Required Setup Steps

### 1. Set Up Vercel Postgres Database

1. **Create a Vercel account** (if you don't have one):
   - Go to https://vercel.com/signup
   - Sign up with GitHub, GitLab, or Bitbucket

2. **Create a Postgres database**:
   - Go to your Vercel dashboard
   - Navigate to Storage → Create Database
   - Select **Postgres**
   - Choose a name (e.g., "thcplus-db")
   - Select your region (closest to you)
   - Click **Create**

3. **Get connection strings**:
   - In your database settings, click on **.env.local** tab
   - Copy the following variables:
     ```
     POSTGRES_PRISMA_URL="..."
     POSTGRES_URL_NON_POOLING="..."
     ```

4. **Add to your `.env.local` file**:
   - Open `c:\Users\Somli\OneDrive\Desktop\Smoke Shop\3rdcoastsmokecompany\.env.local`
   - Uncomment and paste the database URLs

5. **Run database migrations**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

   This will create the following tables:
   - `age_verifications` - Legal compliance logs
   - `contact_submissions` - Contact form entries
   - `admins` - Admin users for dashboard

### 2. Set Up Resend Email Service

1. **Create a Resend account**:
   - Go to https://resend.com/signup
   - Sign up (free tier: 100 emails/day)

2. **Add your domain** (optional for production):
   - Go to Domains → Add Domain
   - Follow DNS setup instructions
   - Verify domain

   For development, you can skip this and use the default `@resend.dev` sending domain.

3. **Create an API key**:
   - Go to API Keys → Create API Key
   - Name it "THC Plus - Production"
   - Copy the API key (it starts with `re_`)

4. **Add to `.env.local`**:
   ```env
   RESEND_API_KEY="re_xxxxxxxxxxxxx"
   RESEND_FROM_EMAIL="info@thcplus.com"  # or onboarding@resend.dev for testing
   ```

5. **Set admin email**:
   ```env
   ADMIN_EMAIL="your-email@example.com"  # Where contact forms will be sent
   ```

### 3. Test the Contact Form

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to the contact section**:
   - Go to http://localhost:3000
   - Accept the age gate
   - Scroll to the contact section

3. **Submit a test form**:
   - Fill in name, email, and message
   - Click "Send Message"
   - You should see a success toast notification
   - Check your email (ADMIN_EMAIL) for the notification
   - The user should also receive a confirmation email

4. **Verify database entry**:
   ```bash
   npx prisma studio
   ```
   - Opens Prisma Studio at http://localhost:5555
   - Check the `contact_submissions` table
   - You should see your test submission

## 📝 Environment Variables Reference

Here's what your `.env.local` should look like:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_MEASUREMENT_ID=GA_MEASUREMENT_ID

# Database (Vercel Postgres)
POSTGRES_PRISMA_URL="postgres://default:xxxxx@xxxxx-pooler.xxxxx.vercel-storage.com/verceldb?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgres://default:xxxxx@xxxxx.xxxxx.vercel-storage.com/verceldb"

# Email Service (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxxx"
RESEND_FROM_EMAIL="info@thcplus.com"

# Admin Contact
ADMIN_EMAIL="your-email@example.com"
```

## 🚀 Deployment Checklist

Before deploying to production:

1. **Set up Vercel project**:
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Add environment variables to Vercel**:
   - Go to your Vercel project settings
   - Navigate to Environment Variables
   - Add all variables from `.env.local`
   - Make sure to use production URLs and keys

3. **Update site URL**:
   ```env
   NEXT_PUBLIC_SITE_URL=https://thcplus.com
   ```

4. **Run database migrations on production**:
   ```bash
   vercel env pull .env.production.local
   npx prisma generate
   npx prisma db push
   ```

5. **Test contact form in production**:
   - Submit a test contact form
   - Verify email delivery
   - Check database in Prisma Studio

## 🔍 Troubleshooting

### Database Connection Issues
- Ensure `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING` are correct
- Run `npx prisma generate` after changing connection strings
- Check Vercel database status

### Email Not Sending
- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for API logs
- For production, ensure domain is verified
- Check spam folder

### Form Validation Errors
- Open browser console to see detailed error messages
- Check network tab for server action responses
- Verify Zod schemas in `src/lib/validations/contact-form.ts`

## 📚 Next Steps

Now that Phase 2 is complete, you can:
- ✅ Move to **Phase 3**: Server-side age verification with middleware
- ✅ Continue to **Phase 4**: Error boundaries and Sentry integration
- ✅ Set up **Phase 5**: Security headers and rate limiting

See the implementation plan at `C:\Users\Somli\.claude\plans\fizzy-mixing-sprout.md` for details.

## 🆘 Support

If you encounter issues:
1. Check this SETUP.md file
2. Review `.env.example` for reference
3. Check Prisma documentation: https://www.prisma.io/docs
4. Check Resend documentation: https://resend.com/docs
5. Check Next.js documentation: https://nextjs.org/docs
