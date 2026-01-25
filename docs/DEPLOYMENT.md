# THC Plus - Deployment Guide

## Pre-Deployment Checklist

### Code Quality ✅

- [ ] All tests passing: `npm run ci:test`
- [ ] Type checking passes: `npm run type-check`
- [ ] Linting passes: `npm run lint`
- [ ] Formatting correct: `npm run format:check`
- [ ] Production build succeeds: `npm run build`
- [ ] No console errors in build output
- [ ] Coverage ≥ 85%

### Environment Setup 🔧

- [ ] Create Vercel Postgres database
- [ ] Create Resend account and verify sender email
- [ ] Create Upstash Redis instance
- [ ] Create Sentry project
- [ ] Generate `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- [ ] All environment variables documented in `.env.example`

### Database 🗄️

- [ ] Prisma schema reviewed and approved
- [ ] Migrations created: `npx prisma migrate dev`
- [ ] Seed script tested: `npm run db:seed`
- [ ] Database indexes verified
- [ ] Backup strategy in place

### Security 🔒

- [ ] Security headers configured in `next.config.mjs`
- [ ] Rate limiting tested
- [ ] Age verification cannot be bypassed
- [ ] Admin routes protected
- [ ] IP hashing working correctly
- [ ] Environment variables not committed to Git
- [ ] `.env.example` updated but contains no secrets
- [ ] HTTPS enforced in production

### Monitoring 📊

- [ ] Sentry DSN configured
- [ ] Test error logging to Sentry
- [ ] Sentry alerts configured (error rate, response time)
- [ ] Vercel Analytics enabled
- [ ] Database query logging configured
- [ ] Performance targets set

### Legal & Compliance ⚖️

- [ ] Age verification logging working
- [ ] Privacy policy page exists
- [ ] Terms of service page exists
- [ ] Legal disclaimers present
- [ ] Farm Bill compliance statements
- [ ] IP hashing for GDPR/CCPA compliance

---

## Vercel Deployment

### Step 1: Prepare Repository

```bash
# Ensure all changes are committed
git status

# Create production branch (optional)
git checkout -b production
git push origin production
```

### Step 2: Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### Step 3: Configure Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```env
# Database
POSTGRES_PRISMA_URL=vercel_postgres_connection_string
POSTGRES_URL_NON_POOLING=vercel_postgres_direct_connection

# Email
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=info@thcplus.com

# Site
NEXT_PUBLIC_SITE_URL=https://thcplus.com
NODE_ENV=production

# Authentication
NEXTAUTH_SECRET=<your-generated-secret>
NEXTAUTH_URL=https://thcplus.com

# Rate Limiting
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxx

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_AUTH_TOKEN=sntrys_xxxxx
SENTRY_ORG=your-org
SENTRY_PROJECT=thcplus

# Admin (Initial)
ADMIN_EMAIL=admin@thcplus.com
ADMIN_PASSWORD=<secure-password>
```

### Step 4: Create Database

1. In Vercel dashboard → Storage → Create Database
2. Select "Postgres"
3. Choose region (same as deployment)
4. Database credentials auto-populate in environment variables

### Step 5: Run Migrations

After first deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Link to project
vercel link

# Run migrations in production
vercel env pull .env.production.local
npx prisma migrate deploy

# Seed admin user
npx tsx prisma/seed.ts
```

### Step 6: Deploy

```bash
# Deploy to production
git push origin main  # or production branch

# Or manual deploy
vercel --prod
```

### Step 7: Post-Deployment Verification

- [ ] Visit site: `https://thcplus.com`
- [ ] Age verification page loads
- [ ] Accept age verification
- [ ] Homepage loads correctly
- [ ] Contact form submission works
- [ ] Email received (admin + user)
- [ ] Visit `/admin/login`
- [ ] Login with admin credentials
- [ ] Dashboard loads with data
- [ ] Check Sentry for errors
- [ ] Run Lighthouse audit (95+ performance)

---

## Custom Domain Setup

### Step 1: Add Domain in Vercel

1. Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., `thcplus.com`)
3. Add www subdomain if needed

### Step 2: Configure DNS

Add these records in your DNS provider:

**For root domain (`thcplus.com`):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 3: Wait for Propagation

- DNS propagation takes 24-48 hours
- Check status: `dig thcplus.com`
- Vercel auto-provisions SSL certificate

### Step 4: Update Environment Variables

```env
NEXT_PUBLIC_SITE_URL=https://thcplus.com
NEXTAUTH_URL=https://thcplus.com
```

Redeploy after updating.

---

## Database Migrations in Production

### Creating a Migration

```bash
# Develop locally first
npm run db:push  # Test schema changes

# Create migration
npx prisma migrate dev --name your_migration_name

# Commit migration files
git add prisma/migrations
git commit -m "feat: add new migration"
```

### Applying in Production

```bash
# After deployment, migrations run automatically via build script
# Or manually:
vercel env pull .env.production.local
npx prisma migrate deploy
```

### Rollback (Emergency)

```bash
# Revert migration
npx prisma migrate resolve --rolled-back migration_name

# Deploy previous version in Vercel dashboard
# Vercel → Deployments → ... → Promote to Production
```

---

## Monitoring Setup

### Sentry Configuration

1. **Create Sentry Project**:
   - Go to [sentry.io](https://sentry.io)
   - Create new project (Next.js)
   - Copy DSN

2. **Configure Alerts**:
   - Error rate >5% in 1 hour → Email
   - Response time >3s for 15 minutes → Email
   - New issue assigned → Email

3. **Enable Features**:
   - Session Replay (privacy-safe mode)
   - Performance Monitoring (10% sample rate)
   - Source Maps Upload (automatic via SENTRY_AUTH_TOKEN)

### Vercel Analytics

1. Enable in Vercel Dashboard → Analytics
2. Free tier: 2,500 events/month
3. Tracks Web Vitals automatically

### Uptime Monitoring

Use [UptimeRobot](https://uptimerobot.com) (free):
- Monitor: `https://thcplus.com`
- Interval: 5 minutes
- Alert: Email when down

---

## Performance Optimization

### Pre-Launch Checklist

- [ ] Run Lighthouse audit (target 95+ performance)
- [ ] Check bundle size: `npm run build` (First Load JS < 100KB)
- [ ] Verify image optimization (Next.js Image component)
- [ ] Test on slow 3G connection
- [ ] Test on mobile devices
- [ ] Check Core Web Vitals (LCP <2.5s, CLS <0.1)

### Bundle Analysis

```bash
# Install analyzer
npm install -D @next/bundle-analyzer

# Add to next.config.mjs
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // ... existing config
})

# Analyze
ANALYZE=true npm run build
```

### Performance Improvements

1. **Dynamic Imports** (if needed):
```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'))
```

2. **Image Optimization**:
```typescript
import Image from 'next/image'

<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="Description"
  loading="lazy"  // or "eager" for above-fold
/>
```

3. **Font Optimization** (already implemented):
```typescript
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
```

---

## Backup & Disaster Recovery

### Database Backups

**Vercel Postgres** (automatic):
- Daily backups (7-day retention)
- Point-in-time recovery available on paid plans
- Manual backup: Export via Prisma Studio

**Manual Backup**:
```bash
# Export all data
npx prisma db pull
npx prisma generate
npx prisma db seed  # Creates backup seed script
```

### Code Backups

- **Git repository** (primary backup)
- **GitHub** (remote backup)
- **Vercel deployments** (deployment history)

### Rollback Procedure

1. **Identify issue**:
   - Check Sentry for errors
   - Check Vercel deployment logs
   - Check database query logs

2. **Rollback deployment**:
   - Vercel Dashboard → Deployments
   - Find previous working deployment
   - Click "..." → "Promote to Production"

3. **Rollback database** (if needed):
   ```bash
   npx prisma migrate resolve --rolled-back migration_name
   ```

4. **Verify**:
   - Test age verification
   - Test contact form
   - Test admin dashboard
   - Check Sentry for new errors

---

## Scaling Strategy

### Traffic Thresholds

| Visitors/Month | Action Required |
|----------------|-----------------|
| 0 - 10,000 | Free tier sufficient |
| 10,000 - 50,000 | Upgrade Vercel Postgres to Hobby ($5/month) |
| 50,000 - 100,000 | Upgrade Resend to Pro ($10/month), Upstash Pro ($10/month) |
| 100,000+ | Consider dedicated database, CDN, read replicas |

### Database Scaling

1. **Optimize queries** (add indexes):
```prisma
@@index([status])
@@index([submittedAt])
```

2. **Connection pooling** (already configured via Prisma)

3. **Read replicas** (Vercel Postgres Pro plan)

4. **Archive old data**:
```sql
-- Archive submissions older than 2 years
DELETE FROM contact_submissions WHERE submitted_at < NOW() - INTERVAL '2 years';
```

### Caching Strategy

1. **Static Generation** (already implemented for most pages)

2. **API Route Caching**:
```typescript
export const revalidate = 3600  // 1 hour
```

3. **Redis Caching** (if needed):
```typescript
const cached = await redis.get(`key:${id}`)
if (cached) return JSON.parse(cached)

// ... fetch data
await redis.setex(`key:${id}`, 3600, JSON.stringify(data))
```

---

## SSL Certificate

### Automatic (Vercel)

- Vercel auto-provisions Let's Encrypt SSL
- Auto-renewal every 90 days
- No manual configuration needed

### Verification

```bash
# Check SSL certificate
openssl s_client -connect thcplus.com:443 -servername thcplus.com

# Or use online tool:
# https://www.ssllabs.com/ssltest/
```

---

## Environment-Specific Configuration

### Development

```env
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
# Use test credentials for services
```

### Staging (Optional)

```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://staging.thcplus.com
NEXTAUTH_URL=https://staging.thcplus.com
# Use separate database/services
```

### Production

```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://thcplus.com
NEXTAUTH_URL=https://thcplus.com
# Use production credentials
```

---

## Troubleshooting

### Deployment Fails

**Error: "Build failed"**
- Check build logs in Vercel dashboard
- Run `npm run build` locally to reproduce
- Check for TypeScript errors: `npm run type-check`

**Error: "Prisma client not found"**
```bash
# Add to package.json scripts
"postinstall": "prisma generate"
```

**Error: "Environment variable missing"**
- Verify all variables in Vercel dashboard
- Check spelling and capitalization
- Ensure no trailing spaces

### Database Connection Issues

**Error: "Can't reach database server"**
- Check `POSTGRES_PRISMA_URL` is correct
- Verify database is in same region as deployment
- Check Vercel Postgres status page

**Error: "Too many connections"**
- Using connection pooling? (should be via `POSTGRES_PRISMA_URL`)
- Increase connection limit in Vercel Postgres settings
- Reduce concurrent deployments

### Email Delivery Issues

**Emails not sending**
- Verify sender email in Resend dashboard
- Check Resend API key is correct
- Check Resend logs for errors
- Verify DNS records (SPF, DKIM) if using custom domain

**Emails going to spam**
- Add SPF record: `v=spf1 include:_spf.resend.com ~all`
- Add DKIM record (provided by Resend)
- Add DMARC record: `v=DMARC1; p=none; rua=mailto:admin@thcplus.com`

### Performance Issues

**Slow page loads**
- Check Vercel Analytics for slow pages
- Run Lighthouse audit
- Check database query performance (Prisma logs)
- Enable Edge Middleware caching

**High database usage**
- Check for N+1 queries (use Prisma `include`)
- Add database indexes
- Archive old data
- Use pagination

---

## Post-Launch Checklist

### Week 1

- [ ] Monitor Sentry daily for errors
- [ ] Check Vercel Analytics for traffic patterns
- [ ] Verify contact form submissions working
- [ ] Test admin dashboard daily
- [ ] Check email delivery rate
- [ ] Monitor database size
- [ ] Review Lighthouse scores

### Week 2-4

- [ ] Weekly Sentry error review
- [ ] Weekly analytics review
- [ ] Database backup verification
- [ ] Security header verification (securityheaders.com)
- [ ] Dependency updates (Dependabot PRs)

### Monthly

- [ ] Review and optimize database indexes
- [ ] Archive old submission data (>2 years)
- [ ] Review and update legal disclaimers
- [ ] Security audit (npm audit)
- [ ] Performance audit (Lighthouse)
- [ ] Cost review (Vercel, services)

---

## Support & Maintenance

### Emergency Contacts

- **Vercel Support**: support@vercel.com
- **Sentry Support**: support@sentry.io
- **Resend Support**: support@resend.com
- **Upstash Support**: support@upstash.com

### Maintenance Windows

- Database migrations: Deploy during low-traffic hours (2-4 AM CT)
- Major updates: Announce 24 hours in advance
- Emergency fixes: Deploy immediately, document after

### Change Management

1. **Minor changes** (bug fixes): Deploy to production after tests pass
2. **Major changes** (new features): Deploy to staging first, test 24 hours, then production
3. **Breaking changes**: Announce 1 week in advance, provide migration guide

---

**Last Updated**: 2026-01-24

**Version**: 1.0.0

**Deployment Status**: Ready for Production
