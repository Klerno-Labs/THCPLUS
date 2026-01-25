import { MetadataRoute } from 'next'

/**
 * Dynamic Robots.txt Generation
 *
 * Controls search engine crawler access to pages.
 * Blocks admin routes and allows public pages.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thcplus.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/_next'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
