import { withSentryConfig } from '@sentry/nextjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  poweredByHeader: false,
  compress: true,

  // Enable instrumentation for Sentry
  experimental: {
    instrumentationHook: true,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Prevent clickjacking attacks by disallowing the site to be embedded in iframes
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Control referrer information sent with requests
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          // Restrict browser features and APIs
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Content Security Policy - restrict sources for scripts, styles, etc.
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com *.google-analytics.com *.google.com www.gstatic.com cdn.vercel-insights.com *.sentry.io",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              "font-src 'self' fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' *.google-analytics.com *.analytics.google.com *.googletagmanager.com *.google.com vitals.vercel-insights.com *.sentry.io *.vercel.app",
              "frame-src 'self' *.google.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
          // Enable browser XSS protection (legacy, but good for older browsers)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Strict Transport Security - enforce HTTPS (only in production)
          ...(process.env.NODE_ENV === 'production'
            ? [
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=63072000; includeSubDomains; preload',
                },
              ]
            : []),
        ],
      },
    ]
  },
}

// Sentry configuration options
const sentryWebpackPluginOptions = {
  // Suppresses source map uploading logs during build
  silent: true,

  // Organization and project names for Sentry
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Auth token for uploading source maps
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Automatically annotate React components for better error messages
  reactComponentAnnotation: {
    enabled: true,
  },

  // Disable telemetry
  telemetry: false,

  // Upload source maps in CI/production only
  disableServerWebpackPlugin: process.env.NODE_ENV !== 'production',
  disableClientWebpackPlugin: process.env.NODE_ENV !== 'production',

  // Hide source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry debug code in production
  widenClientFileUpload: true,
}

// Wrap config with Sentry for automatic instrumentation
export default withSentryConfig(nextConfig, sentryWebpackPluginOptions)
