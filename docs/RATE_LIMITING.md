# Rate Limiting Setup Guide

This guide explains how to set up and configure rate limiting for THC Plus using Upstash Redis.

## Overview

Rate limiting protects your application from abuse by limiting how many requests a user can make within a time window. This prevents:

- **Spam submissions** on contact forms
- **Automated attacks** on age verification
- **DDoS attempts** on API endpoints
- **Resource exhaustion** from malicious bots

## Implementation Details

### Current Rate Limits

| Endpoint             | Limit        | Window     | Purpose                           |
| -------------------- | ------------ | ---------- | --------------------------------- |
| **Contact Form**     | 3 requests   | 1 hour     | Prevent spam submissions          |
| **Age Verification** | 10 requests  | 1 hour     | Prevent automated bypass attempts |
| **API Routes**       | 100 requests | 15 minutes | General API protection            |

### Technology Stack

- **Upstash Redis**: Serverless Redis database for rate limit storage
- **@upstash/ratelimit**: Official rate limiting library with sliding window algorithm
- **@upstash/redis**: Upstash Redis client for Next.js

### Key Features

✅ **Sliding Window Algorithm**: More accurate than fixed windows, prevents burst attacks
✅ **IP-based Tracking**: Identifies users by IP address (hashed for privacy)
✅ **Fail-Open Design**: If Redis is unavailable, requests are allowed (better UX)
✅ **Analytics Enabled**: Track rate limit hits in Upstash dashboard
✅ **Privacy-Focused**: IP addresses are hashed before storage

---

## Setup Instructions

### Step 1: Create Upstash Account

1. Go to [https://console.upstash.com/](https://console.upstash.com/)
2. Sign up with GitHub or email (it's free!)
3. Verify your email if prompted

### Step 2: Create Redis Database

1. Click **"Create Database"**
2. Configure:
   - **Name**: `thcplus-ratelimit` (or any name you prefer)
   - **Region**: Choose closest to your Vercel deployment region
     - For US deployments: `us-east-1` (Virginia) or `us-west-1` (California)
     - For EU deployments: `eu-west-1` (Ireland)
   - **Type**: Select **"Free"** (10,000 commands/day)
3. Click **"Create"**

### Step 3: Get Credentials

After database creation, you'll see:

```
REST API Configuration
URL: https://xxxxxx.upstash.io
Token: AYYYYYYyyyyyyyyyyyyyyyyyYYYYYYY
```

### Step 4: Add to Environment Variables

#### Local Development (.env.local)

Add these to your `.env.local` file:

```bash
UPSTASH_REDIS_REST_URL="https://xxxxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AYYYYYYyyyyyyyyyyyyyyyyyYYYYYYY"
```

#### Vercel Production

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add both variables:
   - Key: `UPSTASH_REDIS_REST_URL`
   - Value: Your Upstash URL
   - Environment: **Production**, **Preview**, **Development** (check all)
   - Click **Save**
   - Repeat for `UPSTASH_REDIS_REST_TOKEN`

5. **Redeploy** your application for changes to take effect:
   - Go to **Deployments** tab
   - Click **...** on latest deployment
   - Select **Redeploy**

---

## Testing Rate Limiting

### Test Contact Form Rate Limit

1. Go to your website contact form
2. Submit 3 messages quickly
3. On the 4th submission, you should see:
   ```
   "Too many submissions. Please try again in 60 minutes."
   ```

### Test Age Verification Rate Limit

1. Open your site in Incognito mode
2. Accept age gate 10 times (refresh page each time)
3. On the 11th attempt, you should see:
   ```
   "Too many verification attempts. Please try again in XX minutes."
   ```

### Monitor in Upstash Dashboard

1. Go to [https://console.upstash.com/](https://console.upstash.com/)
2. Click on your database
3. Go to **Analytics** tab
4. You'll see:
   - Total commands executed
   - Rate limit hits
   - Command distribution graph
   - Peak usage times

---

## How It Works

### 1. Request Received

```typescript
// User submits contact form
POST / api / contact
```

### 2. IP Address Extraction

```typescript
// Extract from headers (handles proxies)
const ip = headers.get('x-forwarded-for') || headers.get('x-real-ip') || 'unknown'
```

### 3. IP Hashing (Privacy)

```typescript
// Hash IP before storing (irreversible)
import { createHash } from 'crypto'
const hashedIp = createHash('sha256').update(ip).digest('hex')
```

### 4. Rate Limit Check

```typescript
import { checkRateLimit, contactFormRateLimit } from '@/lib/rate-limit'

const result = await checkRateLimit(hashedIp, contactFormRateLimit)

if (!result.success) {
  return {
    error: `Too many requests. Try again in ${getTimeUntilReset(result.reset)}`,
  }
}
```

### 5. Sliding Window Algorithm

```
Hour 1: ■■■ (3 requests) ← BLOCKED
        └─┬─┘
          60 minutes

Hour 2:  ■  (1 request) ← ALLOWED
         ↑
      Old requests
      expired
```

---

## Troubleshooting

### Rate limiting not working

**Symptoms**: Can submit unlimited requests

**Solutions**:

1. Check environment variables are set:
   ```bash
   echo $UPSTASH_REDIS_REST_URL
   echo $UPSTASH_REDIS_REST_TOKEN
   ```
2. Check Vercel deployment logs for warnings:
   ```
   Rate limiting disabled: UPSTASH_REDIS_REST_URL not configured
   ```
3. Verify Redis database is active in Upstash console
4. Ensure you redeployed after adding env vars

### Too strict / too lenient

**Adjust limits** in `src/lib/rate-limit.ts`:

```typescript
// More lenient (5 per hour)
contactFormRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  //                                 ^
  //                              Change this
})

// Stricter (1 per hour)
contactFormRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1, '1 h'),
})

// Different window (5 per day)
contactFormRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 d'),
  //                                      ^
  //                              Change window
})
```

### Legitimate users blocked

**Symptoms**: Users behind corporate VPN/NAT blocked together

**Solution**: Consider user session-based limiting instead of IP:

```typescript
// Instead of IP
const identifier = hashedIp

// Use session ID
const identifier = sessionId // from cookies
```

### High Redis usage

**Symptoms**: Approaching 10,000 commands/day limit

**Solutions**:

1. Increase Upstash tier (paid plans start at $10/month)
2. Increase rate limit windows (less frequent checks)
3. Monitor analytics to identify abuse patterns

---

## Security Best Practices

### ✅ DO

- **Hash IP addresses** before storing (already implemented)
- **Fail open** if Redis is down (already implemented)
- **Monitor analytics** regularly for abuse patterns
- **Adjust limits** based on real usage patterns
- **Set alerts** in Upstash for high usage

### ❌ DON'T

- Don't store raw IP addresses (GDPR/CCPA violation)
- Don't fail closed (blocks users if Redis down)
- Don't set limits too strict (frustrates legitimate users)
- Don't use rate limiting as your only security measure
- Don't forget to enable analytics

---

## Cost Analysis

### Free Tier (Current)

- **Price**: $0/month
- **Commands**: 10,000/day
- **Estimated usage**: ~500-1,000/day
- **Headroom**: 90-95%

### Expected Usage

| Action                  | Commands per Request | Daily Estimates |
| ----------------------- | -------------------- | --------------- |
| Contact form submission | 1                    | 50-100          |
| Age verification        | 1                    | 200-400         |
| API requests            | 1                    | 100-300         |
| **Total**               | -                    | **350-800/day** |

**Conclusion**: Free tier is sufficient for ~1,000 daily visitors

### When to Upgrade

Upgrade to **Pro ($10/month)** when:

- Daily visitors exceed 2,000
- Commands exceed 8,000/day consistently
- You need higher performance SLA
- You want advanced analytics

---

## Additional Resources

- [Upstash Documentation](https://docs.upstash.com/redis)
- [Ratelimit Library Docs](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [GDPR IP Hashing Guidelines](https://gdpr.eu/data-protection-impact-assessment-template/)

---

## Files Modified

- `src/lib/rate-limit.ts` - Rate limiting utilities
- `src/app/actions/contact-form.ts` - Contact form with rate limiting
- `src/app/actions/verify-age.ts` - Age verification with rate limiting
- `.env.example` - Environment variable template
- `docs/RATE_LIMITING.md` - This documentation

---

## Support

If you encounter issues:

1. Check Upstash status: [https://status.upstash.com/](https://status.upstash.com/)
2. Review server logs in Vercel dashboard
3. Test locally with `npm run dev`
4. Check Redis connection in Upstash console (Data Browser)
