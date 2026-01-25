# Upstash Redis Setup Guide

Complete guide for setting up Upstash Redis for rate limiting in THC Plus.

## Overview

Upstash Redis provides serverless Redis for distributed rate limiting across Vercel's serverless functions. This ensures rate limits work correctly even when requests are handled by different function instances.

**Features:**
- Distributed rate limiting (works across multiple serverless instances)
- Sliding window algorithm (more accurate than fixed window)
- Analytics dashboard to monitor usage
- Free tier: 10,000 commands/day

---

## Why Rate Limiting?

Rate limiting protects your application from:
1. **Spam submissions** - Prevents users from flooding the contact form
2. **Abuse attempts** - Limits automated age verification bypass attempts
3. **API abuse** - Protects backend services from excessive requests
4. **Cost control** - Prevents excessive database writes and email sends

**Current Limits:**
- Contact form: 3 submissions per hour per IP
- Age verification: 10 attempts per hour per IP
- API routes: 100 requests per 15 minutes per IP

---

## Step 1: Create Upstash Account

1. Go to [https://upstash.com](https://upstash.com)
2. Click "Get Started Free"
3. Sign up with GitHub, Google, or email
4. No credit card required for free tier

---

## Step 2: Create Redis Database

1. After logging in, click "Create Database"
2. Configure database:
   - **Name:** `thc-plus-ratelimit`
   - **Type:** Regional (cheaper, sufficient for rate limiting)
   - **Region:** Choose closest to your primary users (e.g., `us-east-1` for East Coast)
   - **Primary Region:** Yes
   - **Read Regions:** None (not needed for rate limiting)
3. Click "Create"

---

## Step 3: Get Connection Credentials

After database is created:

1. Navigate to your database dashboard
2. Scroll to **REST API** section
3. Copy the following:
   - **UPSTASH_REDIS_REST_URL** (looks like: `https://xxxxx.upstash.io`)
   - **UPSTASH_REDIS_REST_TOKEN** (long alphanumeric string)

---

## Step 4: Update Environment Variables

Add these to your `.env.local` file:

```bash
# Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=https://xxxxx-xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxQ==
```

---

## Step 5: Configure Vercel Environment Variables

For production deployments:

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings → Environment Variables**
4. Add the following variables:

| Variable Name | Value | Environments |
|---------------|-------|--------------|
| `UPSTASH_REDIS_REST_URL` | Your REST URL | Production, Preview, Development |
| `UPSTASH_REDIS_REST_TOKEN` | Your REST token | Production, Preview, Development |

5. Redeploy your application

---

## Step 6: Test Rate Limiting

### Test Contact Form Rate Limit (Local)

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000/#contact`
3. Submit the contact form 3 times quickly
4. On the 4th submission, you should see:
   ```
   Too many submissions. Please try again in 60 minutes.
   ```

### Test Age Verification Rate Limit

1. Clear your cookies (or use incognito mode)
2. Navigate to `http://localhost:3000/age-verification`
3. Accept age verification 10 times (clear cookies between attempts)
4. On the 11th attempt, you should see the rate limit error

### Monitor in Upstash Dashboard

1. Go to your Upstash database dashboard
2. Click on the **Data Browser** tab
3. You should see keys like:
   - `@ratelimit/contact-form:abc123...`
   - `@ratelimit/age-verification:def456...`
4. Click on a key to see its value and TTL (time to live)

---

## Features Enabled

### ✅ Sliding Window Algorithm
More accurate than fixed window:
- Fixed window: User submits 3 times at 10:59, then 3 more at 11:01 (6 in 2 minutes)
- Sliding window: Looks at last 60 minutes, so only allows 3 total

### ✅ Automatic Expiry
Keys automatically expire when rate limit window passes (no manual cleanup needed)

### ✅ Privacy-Safe
IP addresses are hashed (SHA-256) before being used as keys, so raw IPs are never stored in Redis

### ✅ Graceful Degradation
If Redis is unavailable, rate limiting is disabled (fail open) to maintain user experience

---

## Monitoring & Analytics

### Check Usage

1. Go to Upstash dashboard → Your database → **Metrics** tab
2. View graphs for:
   - Commands per second
   - Storage usage
   - Latency
3. Ensure you're staying within free tier (10,000 commands/day)

### Analytics Dashboard

1. Go to Upstash dashboard → Your database → **Analytics** tab
2. View top keys (which rate limiters are triggered most)
3. Identify potential abuse patterns

---

## Troubleshooting

### Issue: Rate limiting not working

**Check:**
1. Environment variables are set correctly in `.env.local`
2. Server was restarted after adding env vars
3. No ad blockers or VPN interfering
4. IP address is being captured (check console logs)

**Debug:**
```typescript
// Add to src/lib/rate-limit.ts temporarily
console.log('Redis config:', {
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN ? 'SET' : 'MISSING',
})
```

### Issue: "Too many requests" shown immediately

**Possible causes:**
1. Multiple browser tabs/windows counting toward same limit
2. Browser is reusing same IP address
3. Testing too quickly without waiting for window to reset

**Solution:**
```bash
# Clear all rate limit keys in Upstash dashboard
# Go to Data Browser → Select all @ratelimit/* keys → Delete
```

### Issue: Redis connection errors

**Check:**
1. Upstash database is running (check dashboard)
2. REST API credentials are correct
3. No firewall blocking upstash.io domain

**Test connection:**
```bash
curl https://your-url.upstash.io/ping \
  -H "Authorization: Bearer YOUR_TOKEN"
# Should return: {"result":"PONG"}
```

---

## Cost Management

**Free Tier Limits:**
- 10,000 commands/day
- 256 MB storage
- 1 GB bandwidth

**Typical Usage:**
- Contact form submission: 2 commands (SET + GET) = ~200 commands/day
- Age verification: 2 commands = ~500 commands/day
- **Total:** ~700 commands/day (well within free tier)

**To Stay Within Free Tier:**

1. **Don't use for session storage** - Use Next.js cookies instead
2. **Don't cache data** - Use for rate limiting only
3. **Monitor usage** - Set up alerts at 8,000 commands/day

**Paid Tiers (if needed):**
- Pay as you go: $0.2 per 100K commands ($2/month for 1M commands)
- Pro: $10/month (1M commands, 1 GB storage)

---

## Best Practices

### 1. Use Hashed Identifiers
Always hash IP addresses before using as rate limit keys:
```typescript
const hashedIp = hashIpAddress(ipAddress)
await checkRateLimit(hashedIp, contactFormRateLimit)
```

### 2. Set Appropriate Limits
- Too strict: Frustrates legitimate users
- Too loose: Doesn't prevent abuse
- **Recommendation:** Start conservative, loosen based on analytics

### 3. Provide Clear Error Messages
```typescript
if (!rateLimitResult.success) {
  const resetTime = getTimeUntilReset(rateLimitResult.reset)
  return {
    error: `Too many submissions. Please try again in ${resetTime}.`
  }
}
```

### 4. Test Rate Limits Regularly
- Verify limits work as expected
- Check error messages are user-friendly
- Monitor for false positives (legitimate users blocked)

---

## Advanced Configuration

### Custom Rate Limits

Create new rate limiters in `src/lib/rate-limit.ts`:

```typescript
// Example: Stricter limit for admin login attempts
export const adminLoginRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 attempts per 15 min
      analytics: true,
      prefix: '@ratelimit/admin-login',
    })
  : null
```

### Per-User Rate Limiting

Instead of IP-based, use user ID for authenticated users:

```typescript
const identifier = user ? user.id : hashIpAddress(ipAddress)
await checkRateLimit(identifier, apiRateLimit)
```

### Burst Allowance

Allow burst traffic with token bucket algorithm:

```typescript
export const burstApiRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.tokenBucket(10, '10 s', 3), // 10 tokens, refill 3 per 10s
      analytics: true,
      prefix: '@ratelimit/burst-api',
    })
  : null
```

---

## Security Considerations

### ✅ IP Hashing
Raw IP addresses are never stored in Redis - always hashed with SHA-256

### ✅ Fail Open
If Redis is down, requests are allowed (prioritizes availability over security)

### ✅ No PII Storage
Rate limit keys contain only hashed identifiers, no personally identifiable information

### ⚠️ VPN/Proxy Bypass
Users can bypass IP-based rate limiting with VPNs. For critical operations, combine with:
- Email verification
- CAPTCHA (reCAPTCHA, hCaptcha)
- Device fingerprinting

---

## Next Steps

1. ✅ Upstash Redis is configured
2. ✅ Rate limiting is implemented
3. ⏳ Create Upstash account and database
4. ⏳ Add environment variables
5. ⏳ Test rate limits in development
6. ⏳ Deploy to production
7. ⏳ Monitor usage in Upstash dashboard
8. ⏳ Adjust limits based on analytics

---

## Resources

- [Upstash Documentation](https://docs.upstash.com/)
- [Upstash Rate Limiting](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)
- [Algorithms Explained](https://upstash.com/docs/redis/sdks/ratelimit-ts/algorithms)
- [Upstash Dashboard](https://console.upstash.com/)

---

**Status:** ✅ Rate limiting integration complete - waiting for Upstash account setup
