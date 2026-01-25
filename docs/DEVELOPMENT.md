# THC Plus - Development Guide

## Table of Contents

- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Development Workflow](#development-workflow)
- [Database Management](#database-management)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Debugging](#debugging)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Node.js**: v18.x or later (LTS recommended)
- **npm**: v9.x or later (comes with Node.js)
- **Git**: Latest version
- **VS Code** (recommended): With extensions:
  - ESLint
  - Prettier
  - Prisma
  - Tailwind CSS IntelliSense
  - GitLens

### Recommended Tools

- **Postman** or **Thunder Client**: For API testing
- **TablePlus** or **Prisma Studio**: For database inspection
- **GitHub CLI**: For PR management

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd 3rdcoastsmokecompany
```

### 2. Install Dependencies

```bash
npm install
```

This will install all dependencies and set up Husky pre-commit hooks automatically.

### 3. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Fill in the required values in `.env`:

```env
# Database - Get from Vercel Postgres
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."

# Email - Get from Resend (https://resend.com)
RESEND_API_KEY="re_xxxxxxxxxxxxx"
RESEND_FROM_EMAIL="info@thcplus.com"

# Site Configuration
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NODE_ENV="development"

# Authentication - Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Error Tracking - Get from Sentry (https://sentry.io)
NEXT_PUBLIC_SENTRY_DSN="https://xxxxx@xxxxx.ingest.sentry.io/xxxxx"
SENTRY_AUTH_TOKEN="sntrys_xxxxx" # Only needed for source maps upload in production

# Rate Limiting - Get from Upstash (https://upstash.com)
UPSTASH_REDIS_REST_URL="https://xxxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="xxxxx"

# Admin (Initial Setup)
ADMIN_EMAIL="admin@thcplus.com"
ADMIN_PASSWORD="changeme123" # CHANGE THIS AFTER FIRST LOGIN
```

### 4. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Seed database with initial admin user
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Verify Setup

1. Navigate to the site - you should see the age verification page
2. Click "I am 21 or older" - you should be redirected to the homepage
3. Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
4. Log in with the credentials from `.env` (ADMIN_EMAIL and ADMIN_PASSWORD)
5. You should see the admin dashboard

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Feature branches (e.g., `feature/add-payment`)
- `fix/*` - Bug fix branches (e.g., `fix/contact-form-validation`)

### Creating a New Feature

```bash
# Create a new branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# Make your changes...

# Run checks before committing
npm run lint:fix
npm run type-check
npm run test

# Commit your changes (Husky will run pre-commit hooks)
git add .
git commit -m "feat: add your feature description"

# Push to remote
git push origin feature/your-feature-name

# Create a pull request on GitHub
```

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: fix bug in contact form
docs: update README
style: format code with prettier
refactor: reorganize database queries
test: add unit tests for utils
chore: update dependencies
```

### Pre-commit Hooks

Husky runs the following checks before each commit:

1. **Lint & format** staged files with ESLint and Prettier
2. **Type-check** TypeScript files
3. **Run tests** for changed files

If any check fails, the commit will be aborted. Fix the issues and try again.

## Database Management

### Prisma Commands

```bash
# Generate Prisma client (after schema changes)
npm run db:generate

# Push schema changes to database (development only)
npm run db:push

# Create a migration (before deploying)
npx prisma migrate dev --name your_migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open Prisma Studio (GUI for database)
npm run db:studio

# Seed database
npm run db:seed
```

### Making Schema Changes

1. Edit `prisma/schema.prisma`
2. Run `npm run db:generate` to update Prisma client
3. Create a migration: `npx prisma migrate dev --name add_new_field`
4. Update TypeScript code to use new fields
5. Update seed script if necessary

### Inspecting Database

```bash
# Open Prisma Studio (recommended)
npm run db:studio

# Or use TablePlus/DBeaver with connection string from .env
```

## Testing

### Unit Tests (Vitest)

```bash
# Run all unit tests
npm run test

# Run tests in watch mode (recommended during development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### E2E Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests in UI mode (recommended for debugging)
npm run test:e2e:ui

# Run E2E tests in debug mode
npm run test:e2e:debug

# Run specific test file
npx playwright test e2e/age-verification.spec.ts
```

### Accessibility Tests

Accessibility tests are included in the E2E test suite:

```bash
npm run test:e2e -- accessibility.spec.ts
```

### Writing Tests

**Unit Test Example** (`src/lib/__tests__/utils.test.ts`):

```typescript
import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('cn utility', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('should handle conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
  })
})
```

**E2E Test Example** (`e2e/contact-form.spec.ts`):

```typescript
import { test, expect } from '@playwright/test'

test('should submit contact form successfully', async ({ page }) => {
  await page.goto('http://localhost:3000')

  // Accept age verification
  await page.click('text=I am 21 or older')

  // Fill contact form
  await page.fill('#name', 'Test User')
  await page.fill('#email', 'test@example.com')
  await page.fill('#message', 'This is a test message')

  // Submit
  await page.click('button[type="submit"]')

  // Verify success message
  await expect(page.locator('text=Message sent successfully')).toBeVisible()
})
```

## Code Quality

### Linting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Formatting

```bash
# Format all files with Prettier
npm run format

# Check formatting without modifying files
npm run format:check
```

### Type Checking

```bash
# Run TypeScript compiler (no emit, just type-checking)
npm run type-check
```

### Running All Checks

```bash
# Run lint + type-check + test + build (same as CI)
npm run ci:lint
npm run ci:test
npm run ci:build
```

## Debugging

### VS Code Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Server Actions Debugging

Add `console.log` or use Node.js debugger:

```typescript
export async function submitContactForm(data: ContactFormData) {
  console.log('Form data:', data) // This logs to terminal
  debugger // This breaks in VS Code debugger
  // ...
}
```

### Database Debugging

```bash
# Enable Prisma query logging
# Add to prisma/schema.prisma:
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["tracing"]
}

# Then in your code:
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})
```

### Sentry Debugging

In development, Sentry events are not sent. To test Sentry:

```typescript
// Add to a page to trigger a test error
throw new Error('Test Sentry error')
```

Then check your Sentry dashboard.

## Common Tasks

### Adding a New Page

```bash
# Create a new route
mkdir src/app/new-page
touch src/app/new-page/page.tsx
```

```typescript
// src/app/new-page/page.tsx
export default function NewPage() {
  return (
    <div>
      <h1>New Page</h1>
    </div>
  )
}
```

### Adding a New Component

```bash
touch src/app/components/sections/new-section.tsx
```

```typescript
// src/app/components/sections/new-section.tsx
'use client' // Add this if component uses hooks/interactivity

export function NewSection() {
  return (
    <section>
      {/* Component code */}
    </section>
  )
}
```

### Adding a New Server Action

```bash
touch src/app/actions/new-action.ts
```

```typescript
// src/app/actions/new-action.ts
'use server'

import { prisma } from '@/lib/db'
import type { ApiResponse } from '@/types'

export async function newAction(data: any): Promise<ApiResponse<any>> {
  try {
    // Your logic here
    return { success: true, data: result }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}
```

### Adding a New API Route

```bash
mkdir -p src/app/api/new-endpoint
touch src/app/api/new-endpoint/route.ts
```

```typescript
// src/app/api/new-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Your logic here
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Adding a New Database Model

1. Edit `prisma/schema.prisma`:

```prisma
model NewModel {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())

  @@index([name])
  @@map("new_models")
}
```

2. Generate migration:

```bash
npx prisma migrate dev --name add_new_model
```

3. Generate Prisma client:

```bash
npm run db:generate
```

### Updating Environment Variables

1. Edit `.env` locally
2. Update `.env.example` with new variable (without actual value)
3. Update `src/lib/env.ts` to validate new variable:

```typescript
const envSchema = z.object({
  // ... existing vars
  NEW_VAR: z.string().min(1),
})
```

4. Update Vercel environment variables for production

## Troubleshooting

### Port 3000 Already in Use

```bash
# Find and kill process using port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Prisma Client Not Found

```bash
# Regenerate Prisma client
npm run db:generate
```

### Database Connection Issues

1. Check `.env` has correct `POSTGRES_PRISMA_URL`
2. Verify database is running (Vercel Postgres dashboard)
3. Check network connection
4. Try `npx prisma db push` to sync schema

### TypeScript Errors After Git Pull

```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# Regenerate Prisma client
npm run db:generate

# Restart VS Code TypeScript server
# In VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### Tests Failing Locally But Pass in CI

```bash
# Clear Vitest cache
rm -rf node_modules/.vitest

# Reinstall Playwright browsers
npx playwright install

# Run tests in same environment as CI
NODE_ENV=test npm run test
```

### Husky Hooks Not Running

```bash
# Reinstall Husky
npm run prepare

# Check .husky/pre-commit is executable
chmod +x .husky/pre-commit
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Clear TypeScript cache
rm -rf tsconfig.tsbuildinfo

# Rebuild
npm run build
```

### Email Not Sending in Development

1. Check `RESEND_API_KEY` in `.env`
2. Verify email address is verified in Resend dashboard
3. Check Resend logs for errors
4. Try test email:

```typescript
import { resend } from '@/lib/email'

const result = await resend.emails.send({
  from: 'info@thcplus.com',
  to: 'your-email@example.com',
  subject: 'Test',
  html: '<p>Test email</p>',
})

console.log(result)
```

### Rate Limiting Issues

```bash
# Clear Redis cache (requires Upstash CLI or dashboard)
# Or wait for rate limit window to expire

# Temporarily disable rate limiting in development:
# Edit src/lib/rate-limit.ts:
if (process.env.NODE_ENV === 'development') {
  return { success: true, limit: 10, remaining: 10, reset: Date.now() }
}
```

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)

## Getting Help

1. Check this documentation
2. Search existing GitHub issues
3. Check [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
4. Check [TESTING.md](./TESTING.md) for testing guides
5. Create a new GitHub issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)

---

**Last Updated**: 2026-01-24
**Version**: 1.0.0
