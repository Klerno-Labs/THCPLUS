# Production Deployment Checklist

**Use this checklist to ensure your website is 100% ready for production deployment.**

---

## 🔴 CRITICAL - Must Complete Before Launch

### 1. Environment Variables Configuration

**Status**: ⚠️ Needs Configuration

All environment variables must be set in your production environment (Vercel Dashboard → Settings → Environment Variables).

#### Database (Vercel Postgres)

- [ ] `POSTGRES_PRISMA_URL` - Set from Vercel Postgres dashboard
- [ ] `POSTGRES_URL_NON_POOLING` - Set from Vercel Postgres dashboard
- [ ] Run Prisma migrations: `npx prisma migrate deploy`
- [ ] Verify database connection works

#### Email (Resend)

- [ ] Create Resend account at https://resend.com
- [ ] Verify your sending domain
- [ ] `RESEND_API_KEY` - Get from Resend API keys
- [ ] `RESEND_FROM_EMAIL` - Use verified domain email
- [ ] Test email delivery with contact form

#### Rate Limiting (Upstash Redis)

- [ ] Create Upstash Redis database (free tier)
- [ ] `UPSTASH_REDIS_REST_URL` - Get from Upstash console
- [ ] `UPSTASH_REDIS_REST_TOKEN` - Get from Upstash console
- [ ] Test rate limiting works (submit form multiple times)

#### reCAPTCHA (Google reCAPTCHA v3)

- [ ] Create reCAPTCHA site at https://www.google.com/recaptcha/admin
- [ ] `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - Public key
- [ ] `RECAPTCHA_SECRET_KEY` - Secret key
- [ ] Test reCAPTCHA on contact form

#### Authentication (NextAuth.js)

- [ ] Generate secret: `openssl rand -base64 32`
- [ ] `NEXTAUTH_SECRET` - Set generated secret
- [ ] `NEXTAUTH_URL` - Set to production URL
- [ ] `ADMIN_EMAIL` - Set admin email
- [ ] `ADMIN_PASSWORD` - Set strong initial password
- [ ] **Change admin password after first login**

#### Error Tracking (Sentry)

- [ ] Create Sentry project at https://sentry.io
- [ ] `SENTRY_DSN` - Get from Sentry project settings
- [ ] `SENTRY_AUTH_TOKEN` - Get from Sentry for source maps
- [ ] `SENTRY_ORG` - Your Sentry organization name
- [ ] `SENTRY_PROJECT` - Your Sentry project name
- [ ] Trigger test error to verify Sentry captures it

#### Analytics

- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics 4 ID
- [ ] Verify Analytics tracking on site

#### Site Configuration

- [ ] `NEXT_PUBLIC_SITE_URL` - Set to production domain
- [ ] `NODE_ENV=production`

### 2. Content Updates

**Status**: ⚠️ Needs Real Content

#### Business Information (`src/app/components/seo/structured-data.tsx`)

Update the LocalBusinessStructuredData component:

- [ ] `telephone` - Replace `+1-XXX-XXX-XXXX` with real phone number
- [ ] `streetAddress` - Replace `123 Main Street` with real address
- [ ] `addressLocality` - Replace `City` with real city
- [ ] `addressRegion` - Replace `State` with real state
- [ ] `postalCode` - Replace `12345` with real ZIP code
- [ ] `latitude` - Replace `0.0` with real latitude
- [ ] `longitude` - Replace `0.0` with real longitude
- [ ] `sameAs` - Add social media URLs (Facebook, Instagram, Twitter)

#### Product Images (`public/images/products/`)

Add real product images (see `public/images/products/README.md`):

- [ ] vape-delta8.jpg
- [ ] vape-thca.jpg
- [ ] vape-hhc.jpg
- [ ] gummies-delta9.jpg
- [ ] gummies-cbd-sleep.jpg
- [ ] gummies-thcp.jpg
- [ ] flower-purple-haze.jpg
- [ ] flower-cbd.jpg
- [ ] flower-indica.jpg
- [ ] wax-delta8.jpg
- [ ] live-resin.jpg
- [ ] prerolls.jpg
- [ ] prerolls-cbd.jpg
- [ ] tincture-cbd.jpg
- [ ] tincture-delta8.jpg
- [ ] glass-pipe.jpg
- [ ] grinder.jpg
- [ ] storage-jars.jpg

**Image Requirements**:

- Format: JPG, PNG, or WebP
- Dimensions: 800x800px minimum (square)
- File size: < 500KB each (optimize with TinyPNG or Squoosh)
- Ensure you have rights to use all images

#### Product Data (`src/data/products.ts`)

- [ ] Review all 20 products for accuracy
- [ ] Update product descriptions if needed
- [ ] Verify cannabinoid types are correct
- [ ] Update brands to match actual products
- [ ] Set correct in-stock status
- [ ] Add more products if desired

---

## 🟡 HIGH PRIORITY - Complete Before Launch

### 3. Database Setup & Seeding

**Status**: ⚠️ Needs Completion

```bash
# Run these commands in production environment

# 1. Generate Prisma client
npx prisma generate

# 2. Run migrations
npx prisma migrate deploy

# 3. Seed initial admin user (if needed)
npm run db:seed
```

- [ ] Database migrations applied
- [ ] Admin user created and verified
- [ ] Database connection tested from production
- [ ] Backup strategy configured (Vercel automatic backups)

### 4. Email Delivery Testing

**Status**: ⚠️ Needs Testing

- [ ] Submit contact form and verify admin receives notification
- [ ] Verify user receives confirmation email
- [ ] Check emails don't go to spam folder
- [ ] Test email formatting on mobile devices
- [ ] Verify "Reply-To" works correctly

### 5. Security Verification

**Status**: ✅ Implemented, Needs Testing

- [ ] Age verification creates secure httpOnly cookie
- [ ] Age verification logs to database
- [ ] Contact form rate limiting works (3 per hour per IP)
- [ ] Age verification rate limiting works (10 per hour per IP)
- [ ] reCAPTCHA blocks bot submissions
- [ ] Admin dashboard requires authentication
- [ ] Security headers present (check with securityheaders.com)
- [ ] HTTPS enforced
- [ ] No sensitive data in client-side code

### 6. Performance Testing

**Status**: ⚠️ Needs Testing

Run Lighthouse audit on production URL:

```bash
npm run lighthouse
```

**Target Scores**:

- [ ] Performance: 95+
- [ ] Accessibility: 100
- [ ] Best Practices: 100
- [ ] SEO: 100

**Core Web Vitals**:

- [ ] LCP (Largest Contentful Paint): < 2.5s
- [ ] FID (First Input Delay): < 100ms
- [ ] CLS (Cumulative Layout Shift): < 0.1

If scores are below target:

- [ ] Optimize images further
- [ ] Check bundle size with `npm run analyze`
- [ ] Review lazy loading implementation
- [ ] Check for render-blocking resources

---

## 🟢 RECOMMENDED - Complete Shortly After Launch

### 7. Legal & Compliance

**Status**: ⚠️ Needs Legal Review

- [ ] Privacy Policy page created
- [ ] Terms of Service page created
- [ ] Cookie consent implemented (if needed for your jurisdiction)
- [ ] Age verification complies with state/local laws
- [ ] Product descriptions comply with hemp/CBD regulations
- [ ] Lab test results available for products (if required)
- [ ] **Consult with lawyer familiar with hemp/CBD laws**

### 8. Monitoring & Alerts

**Status**: ⚠️ Needs Configuration

#### Sentry Alerts

- [ ] Configure email alerts for errors
- [ ] Set up Slack notifications (optional)
- [ ] Define error thresholds (e.g., alert if error rate > 5%)

#### Uptime Monitoring

- [ ] Set up UptimeRobot or similar (free tier available)
- [ ] Monitor homepage availability
- [ ] Monitor API endpoints
- [ ] Configure downtime alerts

#### Analytics

- [ ] Set up Google Analytics goals/conversions
- [ ] Track contact form submissions
- [ ] Track age verification acceptance rate
- [ ] Monitor product page views

### 9. Social Media & Marketing

**Status**: ⚠️ Needs Setup

- [ ] Create/update Facebook page
- [ ] Create/update Instagram profile
- [ ] Create/update Twitter account
- [ ] Add social links to structured data (see #2 above)
- [ ] Add social share meta tags
- [ ] Create social media graphics with product photos

### 10. SEO Verification

**Status**: ✅ Technical SEO Implemented, Needs Submission

- [ ] Submit sitemap to Google Search Console
- [ ] Submit site to Bing Webmaster Tools
- [ ] Verify Google Business Profile is claimed and accurate
- [ ] Check robots.txt is accessible: `yourdomain.com/robots.txt`
- [ ] Check sitemap is accessible: `yourdomain.com/sitemap.xml`
- [ ] Verify structured data with Google Rich Results Test
- [ ] Test social share previews (Twitter Card Validator, Facebook Debugger)

---

## 🔵 OPTIONAL - Nice to Have

### 11. Additional Testing

**Status**: ⚠️ Incomplete

- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile device testing (iOS Safari, Android Chrome)
- [ ] Screen reader testing (NVDA, JAWS, VoiceOver)
- [ ] Keyboard navigation testing
- [ ] Test on slow 3G connection
- [ ] Load testing (can it handle traffic spikes?)

### 12. Backup & Recovery

**Status**: ⚠️ Needs Planning

- [ ] Database backup strategy documented
- [ ] Know how to restore from Vercel Postgres backup
- [ ] `.env` variables backed up securely (encrypted)
- [ ] Disaster recovery plan documented
- [ ] Test database restore process

### 13. Documentation

**Status**: ✅ Comprehensive Docs Exist

- [ ] Review `docs/PROGRESS_SUMMARY.md`
- [ ] Review `public/images/products/README.md`
- [ ] Document any custom workflows
- [ ] Create admin user guide (how to view submissions)
- [ ] Document product update process

---

## 📋 Pre-Launch Command Checklist

Run these commands before deploying to production:

```bash
# 1. Install dependencies
npm ci

# 2. Run linter
npm run lint

# 3. Run type check
npm run type-check

# 4. Run unit tests
npm run test

# 5. Run E2E tests
npm run test:e2e

# 6. Build production
npm run build

# 7. Test production build locally
npm run start

# 8. Run Lighthouse audit
npm run lighthouse
```

**All commands must pass before deployment.**

---

## 🚀 Deployment Steps (Vercel)

### Initial Deployment

1. [ ] Connect GitHub repository to Vercel
2. [ ] Configure build settings:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. [ ] Add all environment variables (see #1 above)
4. [ ] Deploy to production
5. [ ] Verify deployment URL works
6. [ ] Configure custom domain (if applicable)
7. [ ] Force HTTPS redirect
8. [ ] Test age verification on production
9. [ ] Submit test contact form on production
10. [ ] Login to admin dashboard on production

### Post-Deployment Verification

- [ ] Visit `yourdomain.com` - Should redirect to age verification
- [ ] Accept age verification - Should create session and redirect to home
- [ ] Navigate to `/products` - Should show all products with images
- [ ] Submit contact form - Should receive emails
- [ ] Login to admin dashboard - Should show submissions
- [ ] Check Sentry - Should be receiving events
- [ ] Check Analytics - Should be tracking pageviews
- [ ] Check mobile responsiveness
- [ ] Run Lighthouse on production URL

---

## ✅ Launch Complete!

After completing all CRITICAL and HIGH PRIORITY items:

- [ ] **Site is live and fully functional**
- [ ] **All systems monitoring green**
- [ ] **Email notifications working**
- [ ] **Age verification logging properly**
- [ ] **Performance meets targets**
- [ ] **Security verified**

### Ongoing Maintenance

**Weekly**:

- [ ] Check Sentry for new errors
- [ ] Review contact form submissions in admin dashboard
- [ ] Monitor uptime status

**Monthly**:

- [ ] Review Analytics data
- [ ] Check age verification logs for compliance
- [ ] Update product inventory
- [ ] Review and clean up old contact submissions

**Quarterly**:

- [ ] Run full Lighthouse audit
- [ ] Review and update dependencies (`npm outdated`)
- [ ] Security audit (`npm audit`)
- [ ] Test disaster recovery process

---

## 📞 Need Help?

If you encounter issues during deployment:

1. Check the logs in Vercel dashboard
2. Check Sentry for error reports
3. Review environment variables are set correctly
4. Verify database connection string
5. Check [Next.js documentation](https://nextjs.org/docs)
6. Check [Vercel documentation](https://vercel.com/docs)

---

**Last Updated**: January 2026
**Version**: 1.0
