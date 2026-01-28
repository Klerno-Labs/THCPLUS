/**
 * Lighthouse CI Configuration
 *
 * Performance thresholds for CI/CD pipeline.
 * Fails the build if scores drop below thresholds.
 *
 * @see https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
 */

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'Ready',
      startServerReadyTimeout: 30000,
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/products',
        'http://localhost:3000/education',
        'http://localhost:3000/faq',
        'http://localhost:3000/visit-us',
      ],
      numberOfRuns: 3, // Run 3 times and use median
    },
    assert: {
      assertions: {
        // Performance: Target 95+
        'categories:performance': ['error', { minScore: 0.95 }],

        // Accessibility: Target 100
        'categories:accessibility': ['error', { minScore: 1.0 }],

        // Best Practices: Target 100
        'categories:best-practices': ['error', { minScore: 1.0 }],

        // SEO: Target 100
        'categories:seo': ['error', { minScore: 1.0 }],

        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],

        // Resource optimization
        'unused-javascript': ['warn', { maxLength: 0 }],
        'unused-css-rules': ['warn', { maxLength: 0 }],
        'uses-optimized-images': 'error',
        'modern-image-formats': 'warn',
        'uses-text-compression': 'error',
        'uses-responsive-images': 'error',

        // Security & Best Practices
        'is-on-https': 'off', // Local testing is HTTP
        'uses-http2': 'off', // Local testing doesn't use HTTP/2
        'no-vulnerable-libraries': 'error',
      },
    },
    upload: {
      target: 'temporary-public-storage', // Uploads results to temporary storage
    },
  },
}
