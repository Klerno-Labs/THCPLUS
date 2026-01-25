# THC Plus - Quick Start Guide

Get THC Plus running locally in **5 minutes**.

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Git
- A code editor (VS Code recommended)

## 1. Clone & Install (1 minute)

```bash
# Clone the repository
git clone <repository-url>
cd 3rdcoastsmokecompany

# Install dependencies
npm install
```

## 2. Environment Setup (2 minutes)

```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` and add **minimum required** variables:

```env
# Database (create at vercel.com/storage)
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."

# Email (get free key at resend.com)
RESEND_API_KEY="re_xxxxxxxxxxxxx"
RESEND_FROM_EMAIL="info@thcplus.com"

# Site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NODE_ENV="development"

# Auth (generate: openssl rand -base64 32)
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Rate Limiting (create at upstash.com)
UPSTASH_REDIS_REST_URL="https://xxxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="xxxxx"

# Admin
ADMIN_EMAIL="admin@thcplus.com"
ADMIN_PASSWORD="changeme123"
```

## 3. Database Setup (1 minute)

```bash
# Generate Prisma client
npm run db:generate

# Create tables
npm run db:push

# Seed admin user
npm run db:seed
```

## 4. Start Development Server (30 seconds)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 5. Verify Everything Works (30 seconds)

### Test Age Verification
1. Visit [http://localhost:3000](http://localhost:3000)
2. You should see age verification page
3. Click "I am 21 or older"
4. Should redirect to homepage ✅

### Test Contact Form
1. Scroll to contact section
2. Fill out form:
   - Name: Test User
   - Email: test@example.com
   - Message: Test message
3. Click "Send Message"
4. Should see success toast ✅

### Test Admin Dashboard
1. Visit [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Login with credentials from `.env`
3. Should see dashboard ✅

---

## Next Steps

### Run Tests

```bash
# Unit tests (Vitest)
npm run test

# E2E tests (Playwright)
npm run test:e2e

# All tests
npm run ci:test
```

### Code Quality

```bash
# Lint
npm run lint

# Format
npm run format

# Type check
npm run type-check
```

### Database

```bash
# Open Prisma Studio (database GUI)
npm run db:studio
```

---

## Troubleshooting

### "Prisma Client not found"

```bash
npm run db:generate
```

### "Database connection failed"

Check your `POSTGRES_PRISMA_URL` in `.env` is correct.

### "Emails not sending"

1. Verify `RESEND_API_KEY` is correct
2. Check sender email is verified in Resend dashboard
3. Check Resend logs for errors

### Port 3000 already in use

```bash
# Kill process (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

---

## Useful Links

- **Documentation**: [docs/](docs/) folder
- **Architecture**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Development Guide**: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- **Testing Guide**: [docs/TESTING.md](docs/TESTING.md)
- **Deployment**: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

## Getting Help

1. Check [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for detailed setup
2. Check [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for system design
3. Search existing GitHub issues
4. Create a new issue with detailed description

---

**Ready to build!** 🚀
