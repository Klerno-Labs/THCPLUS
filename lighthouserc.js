/**
 * Lighthouse CI Configuration
 *
 * Defines performance budgets and thresholds for automated Lighthouse audits.
 * Fails CI if any category scores drop below the defined thresholds.
 *
 * @see https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
 */

module.exports = {
  ci: {
    collect: {
      // URLs to audit
      url: [
        'http://localhost:3000',
        'http://localhost:3000/visit-us',
        // Age verification page can't be tested easily due to middleware
      ],
      numberOfRuns: 3, // Run 3 times and take median
      settings: {
        // Emulate mobile device
        preset: 'desktop',
        // Disable throttling for consistent results in CI
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      // Performance budgets - fail CI if scores drop below these thresholds
      assertions: {
        // Category scores (0-1 scale)
        'categories:performance': ['error', { minScore: 0.9 }], // 90+ performance score
        'categories:accessibility': ['error', { minScore: 1.0 }], // 100 accessibility
        'categories:best-practices': ['error', { minScore: 0.95 }], // 95+ best practices
        'categories:seo': ['error', { minScore: 0.95 }], // 95+ SEO

        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }], // < 2s
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }], // < 2.5s
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }], // < 0.1
        'total-blocking-time': ['error', { maxNumericValue: 300 }], // < 300ms
        'speed-index': ['error', { maxNumericValue: 3000 }], // < 3s

        // Resource hints
        'uses-rel-preconnect': 'off',
        'uses-rel-preload': 'off',

        // Image optimization
        'modern-image-formats': 'warn',
        'offscreen-images': 'warn',
        'uses-optimized-images': 'warn',

        // JavaScript
        'unused-javascript': 'warn',
        'unminified-javascript': 'error',

        // Best practices
        'uses-http2': 'error',
        'uses-passive-event-listeners': 'warn',
        'no-document-write': 'error',
        'uses-text-compression': 'error',
      },
    },
    upload: {
      // Upload results to temporary public storage
      target: 'temporary-public-storage',
    },
  },
}
