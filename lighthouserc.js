module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/education',
        'http://localhost:3000/faq',
        'http://localhost:3000/visit-us',
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        // Resource budgets
        'resource-summary:script:size': ['error', { maxNumericValue: 150000 }],
        'resource-summary:image:size': ['error', { maxNumericValue: 300000 }],
        'resource-summary:font:size': ['error', { maxNumericValue: 100000 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
