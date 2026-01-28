# Sentry Error Monitoring Setup Guide

This guide explains how to set up and configure Sentry for real-time error tracking and performance monitoring in THC Plus.

## Overview

Sentry provides real-time error tracking, performance monitoring, and session replay to help you identify and fix issues quickly.

## Features Implemented

### Error Tracking

- ✅ **Client-side error tracking** with session replay
- ✅ **Server-side error tracking** for API routes and server actions
- ✅ **Edge runtime tracking** for middleware
- ✅ **Error boundaries** at root and component levels
- ✅ **Custom 404 page** for better user experience
- ✅ **Global error handler** for critical errors

### Privacy & Security

- ✅ **Data scrubbing** - Removes cookies, headers, and sensitive data before sending
- ✅ **Session replay masking** - Masks all text and input content by default
- ✅ **Development-only logging** - Errors not sent to Sentry in development mode
- ✅ **IP address hashing** - User privacy protection

### Performance Monitoring

- ✅ **Trace sampling** - 10% of transactions in production, 100% in development
- ✅ **Performance profiling** for slow API routes
- ✅ **Database query tracking** (Prisma integration)

---

## Setup Instructions

### Step 1: Create Sentry Account

1. Go to [https://sentry.io/signup/](https://sentry.io/signup/)
2. Sign up with GitHub or email (it's free!)
3. Verify your email if prompted

### Step 2: Create Sentry Project

1. Click **"Create Project"**
2. Select platform: **Next.js**
3. Configure:
   - **Project name**: `thcplus` (or any name you prefer)
   - **Alert frequency**: Default
4. Click **"Create Project"**

### Step 3: Get Project Credentials

After project creation, you'll see:

```
Data Source Name (DSN)
https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxx@xxxxx.ingest.sentry.io/xxxxxxxxxxxxx
```

Also note:

- **Organization slug**: Found in Settings → General Settings
- **Project name**: The name you chose in Step 2

### Step 4: Generate Auth Token

1. Go to [https://sentry.io/settings/account/api/auth-tokens/](https://sentry.io/settings/account/api/auth-tokens/)
2. Click **"Create New Token"**
3. Configure:
   - **Name**: `thcplus-source-maps` (or any name)
   - **Scopes**: Select these:
     - `project:releases`
     - `project:read`
     - `org:read`
4. Click **"Create Token"**
5. Copy the token (you won't see it again!)

### Step 5: Add to Environment Variables

#### Local Development (.env.local)

Add these to your `.env.local` file:

```bash
# Sentry Error Tracking
SENTRY_DSN="https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxx@xxxxx.ingest.sentry.io/xxxxxxxxxxxxx"
SENTRY_ORG="your-org-slug"
SENTRY_PROJECT="thcplus"
SENTRY_AUTH_TOKEN="sntrys_xxxxxxxxxxxxxxxxxxxx"

# Make DSN available to client-side code
NEXT_PUBLIC_SENTRY_DSN="https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxx@xxxxx.ingest.sentry.io/xxxxxxxxxxxxx"
```

#### Vercel Production

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add all five variables:
   - `SENTRY_DSN`
   - `NEXT_PUBLIC_SENTRY_DSN`
   - `SENTRY_ORG`
   - `SENTRY_PROJECT`
   - `SENTRY_AUTH_TOKEN`
5. For each variable:
   - Environment: **Production**, **Preview**, **Development** (check all)
   - Click **Save**

6. **Redeploy** your application:
   - Go to **Deployments** tab
   - Click **...** on latest deployment
   - Select **Redeploy**

---

## How It Works

### 1. Client-Side Error Tracking

**File**: [sentry.client.config.ts](../sentry.client.config.ts)

Tracks errors in the browser:

- React component errors
- JavaScript runtime errors
- Unhandled promise rejections
- Network failures

**Features**:

- Session replay for debugging (privacy-safe, text masked)
- Performance monitoring for page loads
- Breadcrumb tracking for user actions

### 2. Server-Side Error Tracking

**File**: [sentry.server.config.ts](../sentry.server.config.ts)

Tracks errors in server-side code:

- Server actions (contact form, age verification)
- API routes
- Database queries
- Server component errors

**Features**:

- Data scrubbing (removes sensitive info)
- Error context with request details
- Performance tracking for slow queries

### 3. Edge Runtime Tracking

**File**: [sentry.edge.config.ts](../sentry.edge.config.ts)

Tracks errors in Edge runtime:

- Middleware (age verification check)
- Edge API routes
- Edge functions

### 4. Error Boundaries

**Root Error Boundary** ([src/app/error.tsx](../src/app/error.tsx:1-106))

- Catches errors in the app directory
- Displays user-friendly fallback UI
- Automatically logs to Sentry

**Global Error Handler** ([src/app/global-error.tsx](../src/app/global-error.tsx:1-206))

- Last-resort error boundary
- Wraps entire application
- Catches errors in root layout

**Reusable Error Boundary** ([src/components/error-boundary.tsx](../src/components/error-boundary.tsx:1-156))

- Wrap specific sections for granular error handling
- Custom fallback UI support
- Optional error callbacks

### 5. Instrumentation

**File**: [instrumentation.ts](../instrumentation.ts:1-41)

Initializes Sentry when the server starts:

- Validates environment variables
- Loads appropriate Sentry config (server or edge)
- Runs before any routes are handled

---

## Error Monitoring in Action

### Automatic Error Capture

Sentry automatically captures:

1. **Unhandled Exceptions**

   ```typescript
   // This will be captured automatically
   throw new Error('Something went wrong!')
   ```

2. **Promise Rejections**

   ```typescript
   // This will be captured automatically
   Promise.reject(new Error('Async error'))
   ```

3. **React Component Errors**
   ```typescript
   // Caught by error boundaries
   function MyComponent() {
     throw new Error('Component error')
   }
   ```

### Manual Error Reporting

For custom error tracking:

```typescript
import * as Sentry from '@sentry/nextjs'

// Capture an error manually
try {
  riskyOperation()
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      feature: 'contact-form',
    },
    contexts: {
      user: {
        action: 'submit',
      },
    },
  })
}

// Capture a message
Sentry.captureMessage('Important event occurred', {
  level: 'warning',
  tags: {
    feature: 'age-verification',
  },
})
```

### Custom Context

Add user context for better debugging:

```typescript
import * as Sentry from '@sentry/nextjs'

// Set user context
Sentry.setUser({
  id: 'user-123',
  email: 'user@example.com',
})

// Set custom tags
Sentry.setTag('page', 'contact')
Sentry.setTag('feature', 'form-submission')

// Set extra context
Sentry.setContext('order', {
  id: 'order-456',
  total: 99.99,
})
```

---

## Monitoring in Sentry Dashboard

### View Errors

1. Go to [https://sentry.io/](https://sentry.io/)
2. Select your project
3. Go to **Issues** tab
4. You'll see:
   - Error frequency and trends
   - Stack traces with source maps
   - User affected count
   - Release information

### Alerts

Set up alerts for critical errors:

1. Go to **Alerts** tab
2. Click **"Create Alert"**
3. Configure:
   - **Alert name**: "Critical Errors"
   - **Conditions**: Error rate > 5 errors per minute
   - **Actions**: Email, Slack, or PagerDuty
4. Click **"Save"**

### Performance Monitoring

1. Go to **Performance** tab
2. View:
   - Page load times
   - API response times
   - Database query performance
   - Slow transactions

### Session Replay

1. Go to **Replays** tab
2. Filter by:
   - Errors only
   - Slow sessions
   - Specific pages
3. Watch recordings to see exactly what users experienced

---

## Testing Error Reporting

### Test in Development

Create a test page to trigger errors:

**File**: `src/app/test-sentry/page.tsx`

```typescript
'use client'

import * as Sentry from '@sentry/nextjs'
import { Button } from '@/app/components/ui/button'

export default function TestSentryPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Sentry Error Testing</h1>

      <div className="space-y-4">
        <Button
          onClick={() => {
            throw new Error('Test client-side error')
          }}
        >
          Trigger Client Error
        </Button>

        <Button
          onClick={() => {
            Sentry.captureMessage('Test message', 'info')
          }}
        >
          Send Test Message
        </Button>

        <Button
          onClick={async () => {
            await fetch('/api/test-sentry-error')
          }}
        >
          Trigger Server Error
        </Button>
      </div>
    </div>
  )
}
```

**Test API Route**: `src/app/api/test-sentry-error/route.ts`

```typescript
import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'

export async function GET() {
  // This error will be captured by Sentry
  Sentry.captureException(new Error('Test server-side error'), {
    tags: {
      test: true,
    },
  })

  return NextResponse.json({ error: 'Test error triggered' }, { status: 500 })
}
```

### Verify in Sentry Dashboard

1. Visit `http://localhost:3000/test-sentry`
2. Click each button
3. Go to Sentry dashboard
4. Check **Issues** tab - you should see new errors appear within 30 seconds

---

## Troubleshooting

### Errors not appearing in Sentry

**Symptoms**: Click buttons but no errors in dashboard

**Solutions**:

1. Check environment variables are set:

   ```bash
   echo $SENTRY_DSN
   echo $NEXT_PUBLIC_SENTRY_DSN
   ```

2. Check browser console for Sentry initialization:

   ```javascript
   // Should see: "Sentry initialized" or similar
   ```

3. Verify DSN is correct (check for typos)

4. Check Sentry status: [https://status.sentry.io/](https://status.sentry.io/)

5. Look for Sentry warnings in build output:
   ```bash
   npm run build
   # Should NOT see: "Sentry DSN not configured"
   ```

### Source maps not uploading

**Symptoms**: Stack traces show minified code

**Solutions**:

1. Verify `SENTRY_AUTH_TOKEN` is set correctly

2. Check token has correct scopes:
   - `project:releases`
   - `project:read`
   - `org:read`

3. Verify `SENTRY_ORG` and `SENTRY_PROJECT` match your Sentry project

4. Check build output for upload errors:

   ```bash
   npm run build
   # Look for: "Uploading source maps to Sentry"
   ```

5. Ensure source maps are enabled in production:
   ```javascript
   // next.config.mjs
   hideSourceMaps: true, // Hides from client, but uploads to Sentry
   ```

### Too many errors / quota exceeded

**Symptoms**: Approaching 5,000 errors/month limit on free tier

**Solutions**:

1. Reduce sample rate in `sentry.client.config.ts`:

   ```typescript
   tracesSampleRate: 0.05, // Reduce from 0.1 to 0.05 (5%)
   ```

2. Filter out noisy errors:

   ```typescript
   ignoreErrors: [
     'NetworkError',
     'Failed to fetch',
     // Add more patterns
   ],
   ```

3. Set up alert thresholds to catch issues early

4. Upgrade to paid tier ($26/month for 50k errors)

### Development errors sent to Sentry

**Symptoms**: Sentry dashboard full of development errors

**Solutions**:

This shouldn't happen - check `beforeSend` hook:

```typescript
// sentry.client.config.ts
beforeSend(event) {
  if (process.env.NODE_ENV === 'development') {
    console.error('Sentry event (dev mode, not sent):', event)
    return null // Don't send in development
  }
  return event
}
```

---

## Privacy & Compliance

### GDPR/CCPA Compliance

Sentry is configured to be privacy-friendly:

1. **IP Address Anonymization**
   - Enabled by default in Sentry
   - IP addresses are hashed before storage

2. **PII Scrubbing**
   - Cookies removed in `beforeSend` hook
   - Headers removed
   - Email addresses scrubbed from extra context

3. **Session Replay Masking**
   - All text masked by default
   - All media blocked
   - No network request details captured

### Data Retention

- **Errors**: 90 days (free tier)
- **Performance data**: 30 days
- **Session replays**: 30 days

### User Rights

Users can request:

- **Data access**: Contact Sentry support
- **Data deletion**: Contact Sentry support

---

## Cost Analysis

### Free Tier (Current)

- **Price**: $0/month
- **Errors**: 5,000 events/month
- **Performance**: 10,000 transactions/month
- **Session replays**: 50/month
- **Estimated usage**: ~500-1,000 errors/month
- **Headroom**: 80-90%

### Expected Usage

| Event Type               | Monthly Estimate |
| ------------------------ | ---------------- |
| Client errors            | 200-400          |
| Server errors            | 100-200          |
| Performance transactions | 5,000-8,000      |
| Session replays          | 20-30            |

**Conclusion**: Free tier is sufficient for ~1,000 daily visitors

### When to Upgrade

Upgrade to **Team ($26/month)** when:

- Monthly errors exceed 4,000 consistently
- You need advanced features (data forwarding, custom retention)
- You want higher support SLA

---

## Files Reference

All Sentry configuration files:

- [next.config.mjs](../next.config.mjs#L93-L122) - Sentry webpack plugin options
- [instrumentation.ts](../instrumentation.ts) - Server initialization
- [sentry.client.config.ts](../sentry.client.config.ts) - Client-side config
- [sentry.server.config.ts](../sentry.server.config.ts) - Server-side config
- [sentry.edge.config.ts](../sentry.edge.config.ts) - Edge runtime config
- [src/app/error.tsx](../src/app/error.tsx) - Root error boundary
- [src/app/global-error.tsx](../src/app/global-error.tsx) - Global error handler
- [src/app/not-found.tsx](../src/app/not-found.tsx) - Custom 404 page
- [src/components/error-boundary.tsx](../src/components/error-boundary.tsx) - Reusable error boundary

---

## Additional Resources

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Error Boundaries in React](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Sentry Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Session Replay Documentation](https://docs.sentry.io/product/session-replay/)

---

## Support

If you encounter issues:

1. Check Sentry status: [https://status.sentry.io/](https://status.sentry.io/)
2. Review server logs in Vercel dashboard
3. Check browser console for Sentry warnings
4. Contact Sentry support: [https://sentry.io/support/](https://sentry.io/support/)

---

## Summary

**Phase 4: Error Monitoring - COMPLETED ✅**

**Implemented:**

- ✅ Comprehensive Sentry configuration (client, server, edge)
- ✅ Error boundaries at all levels (root, global, component)
- ✅ Custom 404 page
- ✅ Privacy-safe session replay
- ✅ Data scrubbing and PII protection
- ✅ Performance monitoring
- ✅ Fixed deprecation warning in next.config.mjs
- ✅ Complete documentation

**Ready for:**

- Production deployment
- Real-time error tracking
- Performance monitoring
- Session replay debugging
- Alert configuration

**Next Phase:** Analytics & Conversion Tracking (GA4)
