# THC Plus - Architecture Documentation

## System Overview

THC Plus is a production-ready Next.js 14 application built for a premium hemp products smoke shop in Houston, TX. The application features server-side age verification, contact form management, admin dashboard, and comprehensive monitoring.

### Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript (strict mode)
- Tailwind CSS
- Framer Motion (animations)
- Radix UI (primitives)

**Backend:**
- Next.js Server Actions
- Prisma ORM
- Vercel Postgres (PostgreSQL)
- NextAuth.js v5 (authentication)

**Services:**
- Resend (email delivery)
- Upstash Redis (rate limiting)
- Sentry (error tracking & monitoring)
- Vercel Analytics (web analytics)

**Testing:**
- Vitest (unit tests)
- React Testing Library (component tests)
- Playwright (E2E tests)
- @axe-core/playwright (accessibility tests)

**DevOps:**
- GitHub Actions (CI/CD)
- Husky (pre-commit hooks)
- Lighthouse CI (performance monitoring)

## Architecture Principles

### 1. Server-First Architecture

The application follows Next.js 14 App Router conventions with a server-first approach:

- **Server Components** by default for optimal performance
- **Client Components** only when interactivity is needed (marked with `'use client'`)
- **Server Actions** for mutations instead of API routes
- **Middleware** for request interception (age verification)

### 2. Security by Design

Security is implemented at multiple layers:

- **Server-side age verification** with httpOnly cookies (cannot be bypassed)
- **Rate limiting** on all user-facing actions
- **IP hashing** for privacy-compliant logging
- **Security headers** (CSP, HSTS, X-Frame-Options, etc.)
- **Input validation** on both client and server
- **SQL injection prevention** via Prisma parameterized queries

### 3. Type Safety

TypeScript is configured in strict mode with:

- **Zod schemas** for runtime validation
- **Shared types** in `src/types/` for consistency
- **Prisma client** for type-safe database access
- **ApiResponse pattern** for consistent error handling

### 4. Observability

The application is fully instrumented for production:

- **Sentry** for error tracking, session replay, and performance monitoring
- **Vercel Analytics** for web vitals and page views
- **Database logging** for age verification compliance
- **Rate limit metrics** via Upstash Redis

## Data Flow

### Contact Form Submission

```
User fills form
    ↓
Client-side validation (Zod + React Hook Form)
    ↓
Submit to Server Action (src/app/actions/contact-form.ts)
    ↓
Rate limiting check (3/hour per IP)
    ↓
Server-side validation (Zod)
    ↓
Save to database (Prisma)
    ↓
Send emails (Resend)
    ├─→ Admin notification
    └─→ User confirmation
    ↓
Return success response
    ↓
Display toast notification (Sonner)
```

### Age Verification Flow

```
User visits site
    ↓
Middleware checks for age-verified cookie
    ↓
No cookie → Redirect to /age-verification
    ↓
User clicks "I am 21 or older"
    ↓
Submit to Server Action (src/app/actions/verify-age.ts)
    ↓
Rate limiting check (10/hour per IP)
    ↓
Generate secure session ID (UUID)
    ↓
Hash IP address (SHA-256)
    ↓
Save to database (compliance logging)
    ↓
Create httpOnly cookie (24-hour expiry)
    ↓
Redirect to homepage
    ↓
Middleware allows access (cookie present)
```

### Admin Authentication

```
Admin visits /admin
    ↓
Middleware redirects to /admin/login (no session)
    ↓
Admin enters credentials
    ↓
NextAuth.js Credentials provider
    ↓
Verify password hash (bcrypt)
    ↓
Create JWT session (24-hour expiry)
    ↓
Admin accesses protected routes
    ↓
Middleware validates session on each request
```

## Directory Structure

```
3rdcoastsmokecompany/
├── .github/
│   └── workflows/           # CI/CD pipelines
│       ├── ci.yml          # Lint, type-check, test, build
│       ├── playwright.yml  # E2E tests
│       └── lighthouse.yml  # Performance monitoring
│
├── docs/                    # Documentation
│   ├── ARCHITECTURE.md     # This file
│   ├── DEVELOPMENT.md      # Development guide
│   ├── DEPLOYMENT.md       # Deployment guide
│   ├── TESTING.md          # Testing guide
│   └── ADRs/               # Architecture Decision Records
│
├── e2e/                     # Playwright E2E tests
│   ├── age-verification.spec.ts
│   ├── navigation.spec.ts
│   └── accessibility.spec.ts
│
├── emails/                  # React Email templates
│   ├── contact-notification.tsx
│   └── contact-confirmation.tsx
│
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Database migrations
│   └── seed.ts             # Seed script (initial admin)
│
├── public/                  # Static assets
│
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (auth)/        # Auth route group
│   │   │   ├── age-verification/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── admin/         # Admin dashboard
│   │   │   ├── layout.tsx      # Protected layout
│   │   │   ├── login/
│   │   │   ├── page.tsx        # Dashboard home
│   │   │   ├── submissions/
│   │   │   ├── analytics/
│   │   │   ├── compliance/
│   │   │   └── settings/
│   │   │
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/  # NextAuth routes
│   │   │   └── admin/               # Admin API routes
│   │   │
│   │   ├── actions/        # Server Actions
│   │   │   ├── contact-form.ts
│   │   │   └── verify-age.ts
│   │   │
│   │   ├── components/
│   │   │   ├── ui/              # Base UI components
│   │   │   ├── sections/        # Page sections
│   │   │   ├── layout/          # Layout components
│   │   │   ├── admin/           # Admin components
│   │   │   ├── accessibility/   # Accessibility components
│   │   │   └── providers.tsx
│   │   │
│   │   ├── education/      # Education page
│   │   ├── visit-us/       # Visit Us page
│   │   │
│   │   ├── error.tsx       # Error boundary
│   │   ├── global-error.tsx
│   │   ├── not-found.tsx
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Homepage
│   │   ├── robots.ts       # Dynamic robots.txt
│   │   └── sitemap.ts      # Dynamic sitemap
│   │
│   ├── lib/                # Utilities & services
│   │   ├── db.ts           # Prisma client
│   │   ├── email.ts        # Resend service
│   │   ├── auth.ts         # NextAuth config
│   │   ├── session.ts      # Session management
│   │   ├── crypto.ts       # Cryptographic utilities
│   │   ├── rate-limit.ts   # Upstash Redis rate limiting
│   │   ├── env.ts          # Environment validation
│   │   ├── utils.ts        # Utility functions
│   │   └── validations/    # Zod schemas
│   │
│   ├── types/              # TypeScript types
│   │   ├── index.ts        # Shared types
│   │   ├── api.ts          # API types
│   │   └── next-auth.d.ts  # NextAuth type extensions
│   │
│   └── middleware.ts       # Next.js middleware
│
├── test/                    # Test setup & utilities
│   └── setup.ts
│
├── .env.example             # Environment variables template
├── .eslintrc.json
├── .prettierrc.js
├── lighthouserc.js
├── next.config.mjs
├── playwright.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── vitest.config.ts
```

## Database Schema

### Models

**AgeVerification** (compliance logging)
- `id` - Unique identifier (CUID)
- `sessionId` - Secure session ID (UUID)
- `ipAddress` - Hashed IP (SHA-256)
- `userAgent` - Browser/device information
- `verifiedAt` - Timestamp
- `expiresAt` - 24-hour expiry

**ContactSubmission**
- `id` - Unique identifier (CUID)
- `name` - User's name
- `email` - User's email
- `message` - Message content
- `ipAddress` - Client IP (unhashed for admin)
- `userAgent` - Browser/device information
- `submittedAt` - Timestamp
- `status` - new | read | replied
- `repliedAt` - Timestamp (optional)

**Admin**
- `id` - Unique identifier (CUID)
- `email` - Admin email (unique)
- `passwordHash` - Bcrypt hash
- `name` - Admin name
- `role` - admin (default)
- `lastLoginAt` - Last login timestamp

### Indexes

- `age_verifications.sessionId` - Fast session lookup
- `age_verifications.ipAddress` - Rate limiting queries
- `contact_submissions.status` - Filter by status
- `contact_submissions.submittedAt` - Time-based queries
- `admins.email` - Login queries

## Security Model

### Authentication

**Admin Authentication:**
- NextAuth.js v5 with Credentials provider
- Bcrypt password hashing (10 rounds)
- JWT session strategy (24-hour expiry)
- httpOnly cookies (XSS protection)
- CSRF protection (built into NextAuth)

**Age Verification:**
- Server-side only (middleware enforcement)
- httpOnly cookie (cannot be manipulated by JavaScript)
- Secure flag in production (HTTPS only)
- 24-hour expiry
- Database audit trail (2-year retention)

### Rate Limiting

Implemented using Upstash Redis with sliding window algorithm:

- **Contact form**: 3 submissions per hour per IP
- **Age verification**: 10 attempts per hour per IP
- **API routes**: 100 requests per 15 minutes per IP

Rate limits are enforced using hashed IP addresses for privacy.

### Input Validation

**Client-side:**
- React Hook Form for form state management
- Zod schemas for validation rules
- Inline error messages with ARIA attributes

**Server-side:**
- Zod schemas (same as client) for validation
- Prisma parameterized queries (SQL injection prevention)
- Type-safe database access

### Security Headers

Configured in `next.config.mjs`:

```
Content-Security-Policy (CSP)
Strict-Transport-Security (HSTS)
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: origin-when-cross-origin
Permissions-Policy (restrict camera, microphone, geolocation)
```

### Privacy

- IP addresses hashed (SHA-256) before database storage
- Session replay masks all text and media (Sentry)
- No cookies or headers logged to Sentry
- GDPR-compliant analytics (Vercel Analytics)

## Error Handling

### Client-side Errors

- **Error boundaries** wrap each major section
- **Global error boundary** as last resort
- **Toast notifications** for user feedback (Sonner)
- **Form validation errors** inline with ARIA announcements

### Server-side Errors

- **Try-catch blocks** in all Server Actions
- **Sentry logging** with context and tags
- **User-friendly error messages** (no stack traces exposed)
- **Fallback responses** for external service failures

### Monitoring

- **Sentry dashboards** for error tracking
- **Performance monitoring** (API response times, database queries)
- **Session replay** for debugging user issues
- **Lighthouse CI** for performance regression detection

## Deployment

### Production Checklist

Before deploying to production:

1. ✅ Run `npm run ci:lint` (lint + type-check)
2. ✅ Run `npm run ci:test` (unit + E2E tests)
3. ✅ Run `npm run ci:build` (production build)
4. ✅ Set all environment variables in Vercel
5. ✅ Run database migrations: `npx prisma migrate deploy`
6. ✅ Seed initial admin user: `npm run db:seed`
7. ✅ Test age verification on preview deployment
8. ✅ Test contact form email delivery
9. ✅ Test admin login and dashboard
10. ✅ Verify Sentry error tracking
11. ✅ Verify rate limiting
12. ✅ Check Lighthouse scores (95+ performance, 100 accessibility)

### Environment Variables

See `.env.example` for comprehensive list. Required variables:

- `DATABASE_URL` - Postgres connection string
- `RESEND_API_KEY` - Email service API key
- `NEXTAUTH_SECRET` - JWT signing secret
- `NEXTAUTH_URL` - Production URL
- `SENTRY_DSN` - Error tracking DSN
- `UPSTASH_REDIS_REST_URL` - Redis URL
- `UPSTASH_REDIS_REST_TOKEN` - Redis token

### Performance Targets

- Lighthouse Performance: 95+
- Lighthouse Accessibility: 100
- Lighthouse Best Practices: 100
- Lighthouse SEO: 100
- First Load JS: <100KB gzipped
- Time to First Byte: <600ms
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1

## Scalability

### Current Limits (Free Tiers)

- **Vercel Postgres**: 256MB storage, 60 hours compute/month
- **Resend**: 100 emails/day
- **Upstash Redis**: 10,000 commands/day
- **Sentry**: 5,000 errors/month
- **Vercel Analytics**: 2,500 events/month

### Scaling Strategy

As traffic grows:

1. **10,000 visitors/month**: Upgrade Vercel Postgres to Hobby ($5/month)
2. **50,000 visitors/month**: Upgrade Resend to Pro ($10/month), Upstash Pro ($10/month)
3. **100,000+ visitors/month**: Consider:
   - Dedicated PostgreSQL (Supabase, PlanetScale)
   - CDN for static assets
   - Database connection pooling
   - Caching layer (Redis)

### Performance Optimizations

Current optimizations:

- **Server Components** for zero client JS where possible
- **Dynamic imports** for heavy libraries (Framer Motion)
- **Image optimization** with Next.js Image component
- **Font optimization** with next/font
- **Lazy loading** for below-fold content
- **Parallel data fetching** with Promise.all()
- **Database indexes** on frequently queried fields

## Compliance

### Legal Requirements

**Age Verification:**
- Server-side enforcement (cannot be bypassed)
- Database audit trail (2-year retention)
- Logged information: Session ID, hashed IP, timestamp, user agent

**Privacy:**
- IP addresses hashed before storage
- No personally identifiable information (PII) in logs
- GDPR/CCPA compliant analytics
- Privacy policy and Terms of Service pages

**Content:**
- Legal disclaimer on all pages
- Age requirement: 21+ (displayed prominently)
- Hemp product regulations (Farm Bill compliance)

## Disaster Recovery

### Backups

- **Database**: Vercel Postgres daily automated backups
- **Code**: GitHub repository (version controlled)
- **Emails**: Resend stores sent emails for 30 days

### Rollback Procedure

1. Vercel dashboard → Deployments → Rollback to previous deployment
2. Database: `npx prisma migrate reset` + `npx prisma migrate deploy`
3. Monitor Sentry for errors after rollback

### Incident Response

1. **User reports issue** → Check Sentry for recent errors
2. **Service outage** → Check status pages (Vercel, Upstash, Resend)
3. **Performance degradation** → Check Vercel Analytics, Sentry performance
4. **Data loss** → Restore from Vercel Postgres backup (contact support)

## Future Enhancements

Planned improvements (Phase 10 optional):

- **Payload CMS** for content management (testimonials, education articles)
- **Storybook** for component library documentation
- **Advanced analytics** (conversion funnels, user sessions)
- **Performance budgets** in CI (fail build if bundle too large)
- **Automated accessibility testing** in CI (axe-core)

## Support & Maintenance

### Monitoring

- **Sentry alerts** configured for:
  - Error rate >5% (hourly)
  - Response time >3s (15min window)
  - Failed deployments
- **GitHub Actions** email notifications on CI failures
- **Lighthouse CI** fails PR if scores drop

### Dependencies

- **Automated updates**: Dependabot configured
- **Security audits**: `npm audit` in CI pipeline
- **Version pinning**: All dependencies pinned to specific versions

### Documentation

- **Code comments**: JSDoc for all utility functions
- **Architecture docs**: This file + ADRs
- **Development guides**: DEVELOPMENT.md
- **Testing guides**: TESTING.md

---

**Last Updated**: 2026-01-24
**Version**: 1.0.0
**Maintainer**: THC Plus Development Team
