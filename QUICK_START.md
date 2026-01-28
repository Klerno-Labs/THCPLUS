# Quick Start - Development Mode

## Issue: "Verifying..." Stuck on Age Verification?

The age verification is trying to connect to services that aren't configured yet. Here are your options:

---

## Option 1: Quick Test Mode (Skip Configuration)

The age verification requires:

- ✅ Rate limiting (already bypasses if Redis not configured)
- ❌ Database logging (tries to connect even in dev mode)
- ❌ Session creation (needs cookies)

**To test locally without backend:**

1. Go to: `http://localhost:3001/`
2. You'll be redirected to age verification
3. If stuck, open browser console (F12) to see the error

**The issue**: Database connection is required even in development mode for legal compliance logging.

---

## Option 2: Minimal Configuration (20 minutes)

Set up just the database to make it work:

### Step 1: Create Free Database

```bash
# Option A: Vercel Postgres (Recommended)
1. Go to: https://vercel.com/dashboard
2. Create a new Postgres database (free tier)
3. Copy the connection strings

# Option B: Local Postgres
1. Install PostgreSQL locally
2. Create a database: `createdb thcplus`
3. Connection string: postgresql://localhost:5432/thcplus
```

### Step 2: Update .env.local

```bash
# Add these lines to .env.local:
POSTGRES_PRISMA_URL="postgresql://your-connection-string?pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgresql://your-connection-string"
```

### Step 3: Run Migrations

```bash
cd "c:\Users\Somli\OneDrive\Desktop\Smoke Shop\3rdcoastsmokecompany"

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start dev server
npm run dev
```

### Step 4: Test

1. Visit `http://localhost:3000`
2. Click "I am 21 or older"
3. Should redirect to homepage with session created

---

## Option 3: Full Production Setup

Follow the complete checklist:

- See: `docs/PRODUCTION_CHECKLIST.md`
- Estimated time: 7-11 hours
- Sets up all services (database, email, Redis, etc.)

---

## What's Currently Working (No Config Needed)

✅ **Frontend Features**:

- Homepage
- Products page (with fallback images)
- Education page
- FAQ page
- Visit Us page
- Navigation
- Responsive design
- Animations

✅ **What Doesn't Work Without Config**:

- ❌ Age verification (needs database)
- ❌ Contact form submission (needs email + database)
- ❌ Admin dashboard (needs database + auth)

---

## Troubleshooting

### Error: "Verifying..." stuck forever

**Cause**: Database not configured

**Fix**:

1. Check browser console (F12) for specific error
2. Look for database connection errors
3. Either:
   - Configure database (Option 2 above), OR
   - Comment out database logging temporarily (see below)

### Temporary Development Bypass (Not for Production!)

If you just want to see the UI without backend:

1. Edit `src/app/actions/verify-age.ts`
2. Around line 74-91, comment out the database save:

```typescript
// 6. Save to database for legal compliance (optional in development)
try {
  // TEMPORARILY DISABLED FOR DEV
  // await prisma.ageVerification.create({
  //   data: {
  //     sessionId,
  //     ipAddress: hashedIp,
  //     userAgent,
  //     expiresAt,
  //   },
  // })
  console.log('DEV MODE: Skipping database save')
} catch (dbError) {
  // ...
}
```

3. Restart server: `npm run dev`
4. Now age verification will work (but not log to database)

**⚠️ Remember**: This is ONLY for local testing. Production REQUIRES database logging for legal compliance!

---

## Current Server Status

Your dev server is running on: **http://localhost:3001**
(Port 3000 was in use, so it used 3001)

To check what's happening:

1. Open browser to `http://localhost:3001`
2. Open Developer Console (F12)
3. Go to Network tab
4. Try age verification
5. Look for failed requests in red

---

## Next Steps

1. **For quick testing**: Use temporary bypass above
2. **For real development**: Set up database (Option 2)
3. **For production**: Follow full checklist

Need help? Check the browser console for specific error messages!
