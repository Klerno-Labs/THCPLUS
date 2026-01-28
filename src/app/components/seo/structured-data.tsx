/**
 * Structured Data Component
 *
 * Provides JSON-LD structured data for search engines.
 * Implements LocalBusiness schema for THC Plus smoke shop.
 *
 * @see https://schema.org/LocalBusiness
 * @see https://developers.google.com/search/docs/appearance/structured-data/local-business
 */

import Script from 'next/script'

export function LocalBusinessStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'THC Plus',
    description:
      'Premium hemp and CBD products including vapes, edibles, flower, and concentrates. Locally owned smoke shop serving the community.',
    image: 'https://thcplus.com/images/cross2.png',
    '@id': 'https://thcplus.com',
    url: 'https://thcplus.com',
    telephone: '+1-XXX-XXX-XXXX', // TODO: Add real phone number
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Main Street', // TODO: Add real address
      addressLocality: 'City',
      addressRegion: 'State',
      postalCode: '12345',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 0.0, // TODO: Add real coordinates
      longitude: 0.0,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '10:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '11:00',
        closes: '21:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '12:00',
        closes: '18:00',
      },
    ],
    sameAs: [
      // TODO: Add social media URLs
      // 'https://www.facebook.com/thcplus',
      // 'https://www.instagram.com/thcplus',
      // 'https://twitter.com/thcplus',
    ],
  }

  return (
    <Script
      id="local-business-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

interface FAQItem {
  question: string
  answer: string
}

interface FAQStructuredDataProps {
  items: FAQItem[]
}

export function FAQStructuredData({ items }: FAQStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <Script
      id="faq-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
