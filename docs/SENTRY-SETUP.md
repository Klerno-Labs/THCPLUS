# Sentry Setup Guide

Complete guide for setting up Sentry error tracking and monitoring for THC Plus.

## Overview

Sentry provides:
- Real-time error tracking and alerts
- Performance monitoring (transaction traces)
- Session replay (privacy-safe with masking)
- Source maps for readable stack traces
- Release tracking across deployments

**Free Tier:** 5,000 errors/month, 10,000 performance transactions/month

---

## Step 1: Create Sentry Account

1. Go to [https://sentry.io](https://sentry.io)
2. Click "Start Free" and sign up
3. Choose "React" as your platform (Next.js is React-based)
4. Create a new project named **"thc-plus"**

---

## Step 2: Get Your DSN

After creating the project:

1. Navigate to **Settings → Projects → thc-plus → Client Keys (DSN)**
2. Copy the DSN URL (looks like: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`)
3. This is the same DSN for both client and server

---

## Step 3: Generate Auth Token

For uploading source maps during builds:

1. Go to **Settings → Account → Auth Tokens**
2. Click "Create New Token"
3. Set scopes:
   - ✅ `project:read`
   - ✅ `project:releases`
   - ✅ `org:read`
4. Name it: "thc-plus-build-token"
5. Copy the token (starts with `sntrys_`)

---

## Step 4: Update Environment Variables

Add these to your `.env.local` file:

```bash
# Error Tracking (Sentry)
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_AUTH_TOKEN=sntrys_xxxxxxxxxxxxxxxxxxxxx
SENTRY_PROJECT=thc-plus
SENTRY_ORG=your-organization-slug
```

**Where to find your organization slug:**
- Go to **Settings → General Settings**
- Look for "Organization Slug" (usually your username or company name in lowercase)

---

## Step 5: Configure Vercel Environment Variables

For production deployments on Vercel:

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings → Environment Variables**
4. Add the following variables:

| Variable Name | Value | Environments |
|---------------|-------|--------------|
| `SENTRY_DSN` | Your DSN URL | Production, Preview |
| `NEXT_PUBLIC_SENTRY_DSN` | Your DSN URL | Production, Preview |
| `SENTRY_AUTH_TOKEN` | Your auth token | Production, Preview |
| `SENTRY_PROJECT` | `thc-plus` | Production, Preview |
| `SENTRY_ORG` | Your org slug | Production, Preview |

5. Redeploy your application for changes to take effect

---

## Step 6: Test Error Tracking

### Test in Development (Local)

Errors in development are logged to console but NOT sent to Sentry (this is by design to save quota).

To test in development:
1. Temporarily remove the `beforeSend` filter in `sentry.client.config.ts`:
```typescript
// Comment out this section temporarily
// beforeSend(event, hint) {
//   if (process.env.NODE_ENV === 'development') {
//     console.error('Sentry event (dev mode, not sent):', event, hint)
//     return null
//   }
//   return event
// },
```

2. Trigger a test error in your app (create a button that throws)
3. Check Sentry dashboard → Issues
4. Re-enable the filter after testing

### Test in Production

1. Deploy to Vercel (or staging environment)
2. Create a test error:
   - Option A: Navigate to a non-existent page (404 - won't trigger Sentry)
   - Option B: Add a test button that throws an error
3. Go to Sentry dashboard → Issues
4. You should see the error appear within seconds

---

## Step 7: Configure Alerts

Set up alerts to get notified of errors:

1. Go to **Settings → Projects → thc-plus → Alerts**
2. Create a new alert rule:
   - **When:** Error occurs
   - **If:** Error count is more than 5 in 1 minute
   - **Then:** Send a notification to your email/Slack
3. Save the alert

---

## Features Enabled

### ✅ Client-Side Error Tracking
- React component errors
- Unhandled promise rejections
- Network failures
- JavaScript errors

### ✅ Server-Side Error Tracking
- Server action failures
- API route errors
- Database connection issues
- Email sending failures

### ✅ Performance Monitoring
- Page load times
- API response times
- Database query performance
- Server action execution time

### ✅ Session Replay (Privacy-Safe)
- Only captures sessions with errors
- All text and inputs are masked
- Media content is blocked
- No personally identifiable information (PII) captured

### ✅ Source Maps
- Readable stack traces (not minified)
- Exact line and column numbers
- Original source code snippets

---

## Privacy & Security

Sentry is configured with privacy-first settings:

1. **Data Scrubbing:**
   - Cookies are removed before sending
   - Headers are stripped
   - IP addresses are not logged
   - Query parameters are removed

2. **Session Replay:**
   - `maskAllText: true` - All text content is hidden
   - `blockAllMedia: true` - Images/videos not captured
   - Only UI interactions and errors are recorded

3. **Development Mode:**
   - Events are logged to console only
   - Nothing sent to Sentry servers
   - Saves quota and prevents noise

---

## Monitoring & Maintenance

### Check Error Rate
1. Go to Sentry dashboard
2. View "Issues" tab
3. Look for patterns:
   - Same error affecting many users → high priority
   - Errors from specific browsers/devices → compatibility issue
   - Errors in specific routes → localized problem

### Set Performance Budgets
1. Go to **Performance → Settings**
2. Set thresholds:
   - LCP (Largest Contentful Paint): < 2.5s
   - FID (First Input Delay): < 100ms
   - CLS (Cumulative Layout Shift): < 0.1
3. Get alerts when budgets are exceeded

### Review Releases
1. Go to **Releases** tab
2. Compare error rates between deployments
3. Identify regressions (errors introduced in new releases)

---

## Troubleshooting

### Issue: No errors appearing in Sentry

**Check:**
1. DSN is correctly set in `.env.local`
2. `NEXT_PUBLIC_SENTRY_DSN` is set (public prefix is required for client)
3. Application is running in production mode (not development)
4. Sentry service is not blocked by ad blockers

**Solution:**
```bash
# Verify env vars are loaded
npm run dev
# In browser console:
console.log(process.env.NEXT_PUBLIC_SENTRY_DSN) // Should show your DSN
```

### Issue: Source maps not uploading

**Check:**
1. `SENTRY_AUTH_TOKEN` is set correctly
2. `SENTRY_ORG` matches your organization slug
3. `SENTRY_PROJECT` matches your project name
4. Auth token has `project:releases` scope

**Solution:**
```bash
# Test upload manually
npx @sentry/wizard@latest --integration nextjs
```

### Issue: Too many errors consuming quota

**Solutions:**
1. Increase `ignoreErrors` array in `sentry.client.config.ts`
2. Add `denyUrls` to ignore third-party scripts
3. Lower `tracesSampleRate` to reduce performance events
4. Set up release health thresholds

---

## Cost Management

Sentry free tier includes:
- 5,000 errors/month
- 10,000 performance transactions/month
- 50 session replays/month

**To stay within free tier:**

1. **Sample Wisely:**
   - Set `tracesSampleRate: 0.1` (10% of transactions)
   - Set `replaysOnErrorSampleRate: 1.0` (only error sessions)

2. **Filter Noise:**
   - Add common false positives to `ignoreErrors`
   - Use `beforeSend` to filter non-actionable errors

3. **Monitor Usage:**
   - Go to **Settings → Usage & Billing**
   - Set up quota alerts at 80% usage
   - Review top error sources and consider ignoring

4. **Upgrade if Needed:**
   - Developer plan: $26/month (50k errors, 100k transactions)
   - Team plan: $80/month (unlimited errors, 300k transactions)

---

## Best Practices

### 1. Add Context to Errors
```typescript
Sentry.captureException(error, {
  tags: {
    section: 'contact-form',
    action: 'submission',
  },
  extra: {
    userId: user?.id,
    formData: { name, email }, // Don't log sensitive data!
  },
})
```

### 2. Use Breadcrumbs
```typescript
Sentry.addBreadcrumb({
  message: 'User clicked submit button',
  category: 'user-action',
  level: 'info',
})
```

### 3. Set User Context (if logged in)
```typescript
Sentry.setUser({
  id: user.id,
  email: user.email, // Optional, consider privacy
})
```

### 4. Track Custom Events
```typescript
Sentry.captureMessage('Payment processed successfully', {
  level: 'info',
  tags: {
    paymentMethod: 'stripe',
  },
})
```

---

## Next Steps

1. ✅ Sentry is installed and configured
2. ✅ Error boundaries report to Sentry
3. ✅ Server actions log errors to Sentry
4. ⏳ Set up Sentry account and get DSN
5. ⏳ Add environment variables
6. ⏳ Deploy to production and test
7. ⏳ Configure alerts and notifications
8. ⏳ Monitor error rates and performance

---

## Resources

- [Sentry Next.js Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Session Replay](https://docs.sentry.io/product/session-replay/)
- [Source Maps](https://docs.sentry.io/platforms/javascript/sourcemaps/)
- [Sentry Dashboard](https://sentry.io/organizations/your-org/issues/)

---

**Status:** ✅ Sentry integration complete - waiting for account setup and DSN configuration
