# Performance Optimization Guide

This document outlines the performance optimization setup, monitoring, and best practices for the THC Plus website.

## Current Performance Targets

### Lighthouse Scores

- **Performance**: 90+ (Target: 95+)
- **Accessibility**: 95+ (Target: 100)
- **Best Practices**: 90+ (Target: 100)
- **SEO**: 90+ (Target: 100)

### Core Web Vitals

- **First Contentful Paint (FCP)**: < 2.0s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Total Blocking Time (TBT)**: < 300ms

### Resource Budgets

- **JavaScript Bundle**: < 150 KB (gzipped)
- **Images**: < 300 KB total per page
- **Fonts**: < 100 KB total

## Performance Monitoring

### Bundle Analysis

Analyze your JavaScript bundle size:

```bash
npm run analyze
```

This will:

1. Build the production bundle
2. Open an interactive visualization showing:
   - Size of each chunk
   - Size of dependencies
   - Opportunities for code splitting

**What to look for:**

- Duplicate dependencies
- Unused libraries
- Large dependencies that could be lazy-loaded
- Opportunities for dynamic imports

### Lighthouse Audits

Run Lighthouse locally:

```bash
# Start development server
npm run dev

# In another terminal
npm run lighthouse
```

This runs Lighthouse against:

- Homepage (`/`)
- Education page (`/education`)
- FAQ page (`/faq`)
- Visit Us page (`/visit-us`)

Results are saved to `.lighthouseci/` directory.

### Continuous Monitoring

Lighthouse runs automatically on:

- Every pull request
- Every push to `master`

View results in GitHub Actions artifacts.

## Optimization Techniques

### 1. Code Splitting

**Current Implementation:**

- Next.js automatic code splitting per route
- Dynamic imports for heavy components

**Example of dynamic import:**

```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false, // Client-side only if appropriate
})
```

**When to use:**

- Components only needed on interaction (modals, dropdowns)
- Heavy third-party libraries
- Components below the fold

### 2. Image Optimization

**Current Setup:**

- Using `next/image` for automatic optimization
- WebP and AVIF formats enabled
- Lazy loading by default

**Best Practices:**

```typescript
import Image from 'next/image'

// ✅ Good: Specify dimensions
<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={false} // Only true for above-fold images
/>

// ❌ Bad: Missing dimensions (causes CLS)
<Image src="/image.jpg" alt="Description" fill />
```

**Image Guidelines:**

- Use appropriate formats (WebP/AVIF for photos, SVG for icons)
- Compress images before uploading (TinyPNG, Squoosh)
- Serve responsive images with `sizes` prop
- Use `priority` only for above-the-fold images

### 3. Font Optimization

**Current Setup:**

- Google Fonts loaded via `next/font`
- Fonts are self-hosted and optimized

**Configuration:**

```typescript
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevents invisible text
  variable: '--font-inter',
})
```

**Tips:**

- Only load font weights you use
- Use `font-display: swap` to prevent FOIT
- Subset fonts to reduce size

### 4. JavaScript Optimization

**Tree Shaking:**

- Import only what you need from libraries

```typescript
// ✅ Good: Named imports
import { format } from 'date-fns'

// ❌ Bad: Default import (includes entire library)
import dateFns from 'date-fns'
```

**Lazy Loading:**

```typescript
// Lazy load Framer Motion for non-critical animations
const MotionDiv = dynamic(() => import('framer-motion').then((mod) => mod.motion.div), {
  ssr: false,
})
```

### 5. Prefetching & Preloading

**Next.js Link Prefetching:**

```typescript
// Automatic prefetching on hover (default)
<Link href="/page">Link</Link>

// Disable prefetch for less important pages
<Link href="/page" prefetch={false}>Link</Link>
```

**Critical Resources:**

```typescript
// In <head> for critical resources
<link rel="preload" href="/critical.woff2" as="font" crossOrigin="anonymous" />
```

### 6. Caching Strategy

**Current Setup:**

- Static pages cached indefinitely
- Dynamic pages revalidated on-demand
- Assets cached with long expiry

**API Route Caching:**

```typescript
export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  // API logic
}
```

## Performance Checklist

### Before Deployment

- [ ] Run `npm run analyze` and check bundle size
- [ ] Run `npm run lighthouse` and verify scores
- [ ] Check Core Web Vitals in Chrome DevTools
- [ ] Test on slow 3G connection
- [ ] Test on low-end devices (throttled CPU)

### After Deployment

- [ ] Monitor real user metrics in Vercel Analytics
- [ ] Check Lighthouse CI results in GitHub Actions
- [ ] Monitor Sentry for performance issues
- [ ] Review bundle size changes in PR

## Common Performance Issues

### Issue: Large JavaScript Bundle

**Diagnosis:**

```bash
npm run analyze
```

**Solutions:**

1. Lazy load components not needed immediately
2. Use dynamic imports for routes
3. Remove unused dependencies
4. Replace large libraries with lighter alternatives

### Issue: Slow LCP

**Causes:**

- Large hero images not optimized
- Blocking resources in `<head>`
- Slow server response

**Solutions:**

1. Optimize largest image on page
2. Use `priority` prop on hero images
3. Preload critical resources
4. Implement caching

### Issue: High CLS

**Causes:**

- Images without dimensions
- Web fonts loading
- Ads or embeds

**Solutions:**

1. Always specify image dimensions
2. Use `font-display: swap`
3. Reserve space for dynamic content

### Issue: Long TBT

**Causes:**

- Large JavaScript execution
- Heavy third-party scripts
- Unoptimized React renders

**Solutions:**

1. Code split large components
2. Defer non-critical scripts
3. Use React.memo() for expensive renders
4. Optimize animations (use CSS/GPU acceleration)

## Monitoring Tools

### Built-in Monitoring

- Vercel Analytics (Real User Monitoring)
- Lighthouse CI (Synthetic monitoring)
- Bundle Analyzer (Build-time analysis)

### Chrome DevTools

1. **Performance Tab**: Record and analyze runtime performance
2. **Network Tab**: Check resource loading
3. **Lighthouse Tab**: Run audits locally
4. **Coverage Tab**: Find unused CSS/JS

### Command Line

```bash
# Analyze bundle
npm run analyze

# Run Lighthouse
npm run lighthouse

# Check bundle size
npm run build && du -sh .next/static/chunks/*.js
```

## Resources

- [Next.js Performance Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Lighthouse Docs](https://developer.chrome.com/docs/lighthouse/)
