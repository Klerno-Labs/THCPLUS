# Performance Baseline - THC Plus Website

Generated: 2026-01-26

## Executive Summary

**Current Status:** 🟡 Needs Optimization

The website currently exceeds performance budgets, particularly for JavaScript bundle size. This baseline establishes current metrics and identifies optimization opportunities.

## Bundle Analysis Results

### JavaScript Bundle Size

| Metric                 | Current    | Target | Status                  |
| ---------------------- | ---------- | ------ | ----------------------- |
| Homepage First Load JS | **307 KB** | 150 KB | 🔴 **104% over budget** |
| Shared JS              | 197 KB     | -      | -                       |
| Middleware             | 34.4 KB    | -      | ✅ Acceptable           |

### Chunk Breakdown

**Shared Chunks (197 KB total):**

1. `chunks/141-89db41a23d5a1115.js` - **101 KB** (largest chunk)
   - Likely contains: Framer Motion, React, other core dependencies
   - **Optimization Priority: HIGH**

2. `chunks/52774a7f-680fc84c35009d60.js` - **38.3 KB**
   - Likely contains: Form libraries, validation

3. `chunks/fd9d1056-2199668df9fde147.js` - **53.8 KB**
   - Likely contains: UI components, utilities

4. Other shared chunks - **2.98 KB** ✅

### Route-Specific Sizes

| Route                | Page JS | First Load JS | Status         |
| -------------------- | ------- | ------------- | -------------- |
| `/` (Homepage)       | 51.4 KB | 307 KB        | 🔴 Over budget |
| `/education`         | 6.56 KB | 249 KB        | 🟡 Near budget |
| `/faq`               | 3.88 KB | 246 KB        | 🟡 Near budget |
| `/visit-us`          | 6.13 KB | 251 KB        | 🟡 Near budget |
| `/age-verification`  | 2.11 KB | 255 KB        | 🟡 Near budget |
| `/admin/login`       | 2.1 KB  | 221 KB        | ✅ Acceptable  |
| `/admin/submissions` | 3.93 KB | 219 KB        | ✅ Acceptable  |

## Image Analysis

### Current Image Usage

**External Images (Unsplash):**

1. Hero section: `https://images.unsplash.com/.../photo-1536924430914-91f9e2041b83`
   - Size: ~2 MB unoptimized
   - **Issue:** CSS background-image, not using next/image
   - **Priority: HIGH**

2. About section: `https://images.unsplash.com/.../photo-1556742049-0cfed4f6a45d`
   - Size: ~1.5 MB unoptimized
   - **Issue:** CSS background-image, not using next/image
   - **Priority: HIGH**

3. Visit Us page: Same image as About section
   - **Issue:** Duplicate loading, CSS background-image
   - **Priority: MEDIUM**

**Local Images:**

- `public/images/cross2.png` - 84 KB
  - Status: ✅ Acceptable size

### Image Optimization Issues

- ❌ **Not using next/image** for automatic optimization
- ❌ **No WebP/AVIF conversion** (missing 30-50% compression)
- ❌ **No lazy loading** for below-fold images
- ❌ **No responsive srcset** (serving full size to mobile)
- ❌ **External CDN dependency** (Unsplash) adds latency

**Estimated Savings:** ~5-8 MB per page load with proper optimization

## Performance Budgets

### Current Status

| Resource Type | Budget | Current    | Status             |
| ------------- | ------ | ---------- | ------------------ |
| JavaScript    | 150 KB | **307 KB** | 🔴 **+104%**       |
| Images        | 300 KB | ~2-3 MB    | 🔴 **+900%**       |
| Fonts         | 100 KB | Unknown    | 🟡 Need to measure |

## Identified Optimization Opportunities

### High Priority (Critical)

1. **Code Split Framer Motion** (~60-80 KB savings)
   - Current: Loaded in shared bundle
   - Solution: Dynamic import for animations
   - Files: [hero-section.tsx](src/app/components/sections/hero-section.tsx), [about-section.tsx](src/app/components/sections/about-section.tsx)

2. **Optimize Unsplash Images** (~2-3 MB savings)
   - Current: CSS background-images, unoptimized
   - Solution: Download locally, use next/image with WebP/AVIF
   - Files: [hero-section.tsx:15](src/app/components/sections/hero-section.tsx#L15), [about-section.tsx:84](src/app/components/sections/about-section.tsx#L84), [visit-us/page.tsx:270](src/app/visit-us/page.tsx#L270)

3. **Tree-shake unused dependencies** (TBD KB savings)
   - Analyze bundle to identify unused exports
   - Solution: Review imports, remove unused libraries

### Medium Priority

4. **Lazy load admin components**
   - Admin routes currently bundle auth/form libraries
   - Solution: Dynamic imports for admin-only code

5. **Optimize font loading**
   - Measure current font size
   - Ensure font-display: swap
   - Subset fonts if needed

6. **Remove duplicate Unsplash image**
   - Same image used in About and Visit Us
   - Solution: Use shared optimized image

### Low Priority

7. **Split vendor chunks further**
   - Consider extracting React into separate chunk
   - May improve caching but adds HTTP requests

## Next Steps

### Phase 1: Critical Optimizations (Week 1)

- [ ] Convert Unsplash background images to next/image
- [ ] Download and optimize images locally (WebP/AVIF)
- [ ] Dynamic import Framer Motion components
- [ ] Re-measure bundle size

### Phase 2: JavaScript Optimization (Week 1-2)

- [ ] Analyze bundle composition with Bundle Analyzer visualization
- [ ] Identify and remove unused dependencies
- [ ] Tree-shake large libraries
- [ ] Implement lazy loading for below-fold components

### Phase 3: Fine-tuning (Week 2)

- [ ] Optimize font loading
- [ ] Implement responsive image srcsets
- [ ] Add preload hints for critical resources
- [ ] Test on slow 3G connection

### Phase 4: Verification (Week 2)

- [ ] Run Lighthouse audit (target: 90+ performance)
- [ ] Verify Core Web Vitals (LCP < 2.5s, CLS < 0.1)
- [ ] Test on real devices
- [ ] Update performance budgets in CI/CD

## Performance Targets

### After Optimization

| Metric                 | Target  | Expected Result |
| ---------------------- | ------- | --------------- |
| First Load JS          | 150 KB  | ~120-140 KB     |
| LCP                    | < 2.5s  | ~1.5-2.0s       |
| CLS                    | < 0.1   | ~0.05           |
| FID                    | < 100ms | ~50ms           |
| Lighthouse Performance | 90+     | 92-95           |

## Sentry Deprecation Warnings

**Issue:** Two Sentry deprecation warnings during build:

1. `reactComponentAnnotation` is deprecated
2. `sentry.client.config.ts` should be renamed to `instrumentation-client.ts`

**Impact:** Low (warnings only, functionality works)
**Priority:** Medium (should fix before Sentry v11 or Turbopack migration)

## Build Warnings

**Webpack Cache Warnings:**

- Serializing large strings (139 KB, 200 KB) impacts deserialization
- **Impact:** Slightly slower dev builds
- **Priority:** Low (doesn't affect production)

## Resources

- Bundle Analyzer Report: `.next/analyze/client.html`
- Build Output: `npm run build`
- Next.js Bundle Analysis: `ANALYZE=true npm run build`

---

**Conclusion:** The website requires significant optimization, primarily around JavaScript bundle size (104% over budget) and image optimization (~900% over budget). The identified optimizations should reduce First Load JS by ~50% and image sizes by ~90%.
