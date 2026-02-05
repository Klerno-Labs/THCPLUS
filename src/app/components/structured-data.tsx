/**
 * Structured Data (JSON-LD)
 *
 * Provides rich search results and local business information to search engines.
 * Helps with Google Maps, local search, and knowledge panels.
 *
 * @see https://developers.google.com/search/docs/appearance/structured-data/local-business
 */

export function LocalBusinessStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TobaccoStore',
    name: '3rd Coast Smoke Company',
    description:
      'Premium hemp products store in Houston, TX. Offering CBD, THCA, HHC, and other high-quality hemp products with lab testing and expert guidance.',
    image: 'https://thcplus.com/og-image.png',
    '@id': 'https://thcplus.com',
    url: 'https://thcplus.com',
    telephone: '(346) 206-3949',
    email: 'info@thcplus.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '8302 N Eldridge Pkwy',
      addressLocality: 'Houston',
      addressRegion: 'TX',
      postalCode: '77041',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 29.9382,
      longitude: -95.5698,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '10:00',
        closes: '23:00',
      },
    ],
    priceRange: '$$',
    acceptsReservations: false,
    servesCuisine: null,
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 29.7604,
        longitude: -95.3698,
      },
      geoRadius: '50000', // 50km radius
    },
    sameAs: ['https://www.instagram.com/thcplusnwhouston/'],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function FAQStructuredData() {
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Are your products lab tested?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all our products undergo rigorous third-party lab testing to ensure purity, potency, and safety. Lab reports are available upon request.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need to be 21 to purchase?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, you must be 21 years or older to purchase hemp products from 3rd Coast Smoke Company. We verify age upon entry to our website and store.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are your store hours?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We are open daily Monday through Sunday until 11:00 PM.',
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
    />
  )
}
