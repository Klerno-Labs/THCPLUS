/**
 * Product Data
 *
 * Mock product data for the inventory showcase.
 * In a production environment, this would be replaced with database queries.
 */

import { Product } from '@/types/product'

export const products: Product[] = [
  // Vapes
  {
    id: 'vape-002',
    name: 'THCA Live Resin Vape',
    description:
      'High-potency THCA live resin cartridge with full-spectrum terpenes. Compatible with 510 thread batteries.',
    category: 'vapes',
    price: 39.99,
    image: '/images/products/placeholder.svg',
    inStock: true,
    featured: true,
    cannabinoids: ['THCA'],
    thcContent: '90% THCA',
    labTested: true,
    strainType: 'Hybrid',
    brand: 'Live Resin Co',
    size: '1g',
  },
  {
    id: 'vape-003',
    name: 'HHC Vape Pen - Tropical',
    description:
      'Smooth HHC vape with tropical fruit flavor profile. Perfect for relaxation and mood elevation.',
    category: 'vapes',
    price: 34.99,
    image: '/images/products/placeholder.svg',
    inStock: true,
    cannabinoids: ['HHC'],
    thcContent: '92% HHC',
    labTested: true,
    flavors: ['Tropical', 'Citrus'],
    brand: 'Premium Vapes',
    size: '2g',
  },

  // Edibles
  {
    id: 'edible-002',
    name: 'CBD Gummies - Sleep Formula',
    description:
      'CBD-infused gummies with melatonin and chamomile for restful sleep. Non-psychoactive.',
    category: 'edibles',
    price: 19.99,
    image: '/images/products/placeholder.svg',
    inStock: true,
    cannabinoids: ['CBD', 'CBN'],
    cbdContent: '25mg CBD + 5mg CBN per piece',
    labTested: true,
    flavors: ['Berry'],
    brand: 'Sleep Well',
    size: '250mg CBD total',
  },
  {
    id: 'edible-003',
    name: 'THCP Gummies - Watermelon',
    description:
      'Ultra-potent THCP gummies with refreshing watermelon flavor. For experienced users only.',
    category: 'edibles',
    price: 39.99,
    image: '/images/products/placeholder.svg',
    inStock: false,
    cannabinoids: ['THCP'],
    thcContent: '10mg THCP per piece',
    labTested: true,
    flavors: ['Watermelon'],
    brand: 'Power Edibles',
    size: '100mg total',
  },

  // Flower
  {
    id: 'flower-001',
    name: 'THCA Flower - Purple Haze',
    description:
      'Premium indoor-grown THCA flower. Purple Haze is a sativa-dominant hybrid known for uplifting effects.',
    category: 'flower',
    price: 49.99,
    image: '/images/products/placeholder.svg',
    inStock: true,
    featured: true,
    cannabinoids: ['THCA'],
    thcContent: '28% THCA',
    labTested: true,
    strainType: 'Sativa',
    brand: 'Premium Flower Co',
    size: '7g (1/4 oz)',
  },
  {
    id: 'flower-002',
    name: 'CBD Flower - Lifter',
    description:
      'High-CBD hemp flower with less than 0.3% THC. Perfect for relaxation without intoxication.',
    category: 'flower',
    price: 29.99,
    image: '/images/products/placeholder.svg',
    inStock: true,
    cannabinoids: ['CBD'],
    cbdContent: '18% CBD',
    thcContent: '<0.3% THC',
    labTested: true,
    strainType: 'Hybrid',
    brand: 'CBD Flower Co',
    size: '7g (1/4 oz)',
  },
  {
    id: 'flower-003',
    name: 'THCA Flower - Indica Blend',
    description:
      'Relaxing indica-dominant THCA flower blend. Perfect for evening use and unwinding.',
    category: 'flower',
    price: 44.99,
    image: '/images/products/placeholder.svg',
    inStock: true,
    cannabinoids: ['THCA'],
    thcContent: '25% THCA',
    labTested: true,
    strainType: 'Indica',
    brand: 'Premium Flower Co',
    size: '7g (1/4 oz)',
  },

  // Concentrates
  {
    id: 'concentrate-002',
    name: 'Live Resin - Sour Diesel',
    description:
      'Premium THCA live resin with full terpene preservation. Intense flavor and potency.',
    category: 'concentrates',
    price: 44.99,
    image: '/images/products/placeholder.svg',
    inStock: true,
    featured: true,
    cannabinoids: ['THCA'],
    thcContent: '88% THCA',
    labTested: true,
    strainType: 'Sativa',
    brand: 'Live Resin Co',
    size: '1g',
  },

  // Pre-Rolls
  {
    id: 'preroll-001',
    name: 'THCA Pre-Roll Pack',
    description:
      'Pack of 5 premium THCA pre-rolls. Convenient and ready to smoke. Mixed strain varieties.',
    category: 'pre-rolls',
    price: 39.99,
    image: '/images/products/placeholder.svg',
    inStock: true,
    cannabinoids: ['THCA'],
    thcContent: '26% THCA average',
    labTested: true,
    brand: 'Pre-Roll Co',
    size: '5-pack (0.5g each)',
  },
  {
    id: 'preroll-002',
    name: 'CBD Pre-Rolls - Relaxation',
    description: 'High-CBD pre-rolls for stress relief and relaxation. No psychoactive effects.',
    category: 'pre-rolls',
    price: 24.99,
    image: '/images/products/placeholder.svg',
    inStock: true,
    cannabinoids: ['CBD'],
    cbdContent: '16% CBD',
    labTested: true,
    brand: 'CBD Pre-Roll Co',
    size: '5-pack (0.5g each)',
  },

  // Tinctures
  {
    id: 'tincture-001',
    name: 'CBD Oil Tincture - 1000mg',
    description: 'Full-spectrum CBD oil tincture. Easy sublingual dosing with included dropper.',
    category: 'tinctures',
    price: 49.99,
    image: '/images/products/placeholder.svg',
    inStock: true,
    cannabinoids: ['CBD'],
    cbdContent: '1000mg CBD total',
    labTested: true,
    brand: 'Pure Tinctures',
    size: '30ml',
  },
  // Accessories
  {
    id: 'accessory-001',
    name: 'Premium Glass Pipe',
    description: 'Hand-blown glass pipe with unique color pattern. Durable borosilicate glass.',
    category: 'accessories',
    price: 29.99,
    image: '/images/products/placeholder.svg',
    inStock: true,
    brand: 'Glass Art',
  },
  {
    id: 'accessory-002',
    name: 'Portable Grinder',
    description:
      '4-piece aluminum grinder with kief catcher. Precision-machined teeth for consistent grinding.',
    category: 'accessories',
    price: 19.99,
    image: '/images/products/placeholder.svg',
    inStock: true,
    brand: 'Accessories Plus',
  },
  {
    id: 'accessory-003',
    name: 'Storage Jar Set',
    description:
      'Set of 3 airtight glass jars for flower storage. UV-protected glass preserves freshness.',
    category: 'accessories',
    price: 24.99,
    image: '/images/products/placeholder.svg',
    inStock: true,
    brand: 'Storage Solutions',
  },
]

// Helper functions
export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id)
}

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((product) => product.category === category)
}

export const getFeaturedProducts = (): Product[] => {
  return products.filter((product) => product.featured === true)
}

export const getInStockProducts = (): Product[] => {
  return products.filter((product) => product.inStock === true)
}
