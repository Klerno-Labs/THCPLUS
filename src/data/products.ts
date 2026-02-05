/**
 * Product Data
 *
 * Real product inventory for 3rd Coast Smoke Company.
 * In a production environment, this would be replaced with database queries.
 */

import { Product } from '@/types/product'

export const products: Product[] = [
  // FLOWER
  {
    id: 'flower-001',
    name: 'Whiteboy Cookies',
    description:
      'A potent hybrid strain with a sweet, earthy aroma. Known for its relaxing effects and creamy cookie flavor profile. Perfect for evening relaxation.',
    category: 'flower',
    price: 45.0,
    image: '/images/products/White Boy Cookies.jpg',
    inStock: true,
    featured: true,
    cannabinoids: ['THCA'],
    thcContent: '28% THCA',
    labTested: true,
    strainType: 'Hybrid',
    size: '3.5g (1/8 oz)',
  },
  {
    id: 'flower-002',
    name: 'Lemon Zkittlez',
    description:
      'Bright citrus notes meet sweet candy flavors in this sativa-dominant hybrid. Uplifting and energizing effects with a tangy lemon kick.',
    category: 'flower',
    price: 45.0,
    image: '/images/products/Lenon Zkittles.jpg',
    inStock: true,
    featured: true,
    cannabinoids: ['THCA'],
    thcContent: '26% THCA',
    labTested: true,
    strainType: 'Sativa',
    size: '3.5g (1/8 oz)',
  },
  {
    id: 'flower-003',
    name: 'Hi Berry Chew',
    description:
      'Sweet berry flavors dominate this indica-leaning hybrid. Smooth smoke with relaxing body effects and a fruity berry finish.',
    category: 'flower',
    price: 45.0,
    image: '/images/products/Hi Berry Chew.jpg',
    inStock: true,
    cannabinoids: ['THCA'],
    thcContent: '25% THCA',
    labTested: true,
    strainType: 'Hybrid',
    size: '3.5g (1/8 oz)',
  },
  {
    id: 'flower-004',
    name: 'Mac Flurry',
    description:
      'A premium hybrid with creamy vanilla notes and potent effects. Dense, frosty buds with exceptional bag appeal and powerful relaxation.',
    category: 'flower',
    price: 50.0,
    image: '/images/products/Mac Flurry.jpg',
    inStock: true,
    featured: true,
    cannabinoids: ['THCA'],
    thcContent: '30% THCA',
    labTested: true,
    strainType: 'Hybrid',
    size: '3.5g (1/8 oz)',
  },
  {
    id: 'flower-005',
    name: 'Gelato 33',
    description:
      'The classic Gelato phenotype with sweet dessert flavors and balanced hybrid effects. Smooth, creamy smoke with hints of citrus and berries.',
    category: 'flower',
    price: 50.0,
    image: '/images/products/Gelato 33.jpg',
    inStock: true,
    featured: true,
    cannabinoids: ['THCA'],
    thcContent: '29% THCA',
    labTested: true,
    strainType: 'Hybrid',
    size: '3.5g (1/8 oz)',
  },
  {
    id: 'flower-006',
    name: 'Donut Shop',
    description:
      'Indulgent bakery flavors with sweet dough and glaze notes. This indica-dominant strain delivers deep relaxation and stress relief.',
    category: 'flower',
    price: 45.0,
    image: '/images/products/Donut Shop.jpg',
    inStock: true,
    cannabinoids: ['THCA'],
    thcContent: '27% THCA',
    labTested: true,
    strainType: 'Indica',
    size: '3.5g (1/8 oz)',
  },
  {
    id: 'flower-007',
    name: 'Ice Cream Cake',
    description:
      "Rich, creamy vanilla and sweet dough flavors make this indica a dessert lover's dream. Heavy-hitting relaxation for evening use.",
    category: 'flower',
    price: 50.0,
    image: '/images/products/Ice Cream Cake.jpg',
    inStock: true,
    featured: true,
    cannabinoids: ['THCA'],
    thcContent: '28% THCA',
    labTested: true,
    strainType: 'Indica',
    size: '3.5g (1/8 oz)',
  },
  {
    id: 'flower-008',
    name: 'Motor Breath',
    description:
      'Powerful indica with diesel and earthy notes. Known for its strong sedative effects and pungent aroma. Perfect for deep relaxation.',
    category: 'flower',
    price: 48.0,
    image: '/images/products/Motor Breath.jpg',
    inStock: true,
    cannabinoids: ['THCA'],
    thcContent: '32% THCA',
    labTested: true,
    strainType: 'Indica',
    size: '3.5g (1/8 oz)',
  },
  {
    id: 'flower-009',
    name: 'Mochi',
    description:
      'Exotic hybrid with sweet, fruity flavors and a smooth finish. Balanced effects provide both mental clarity and physical relaxation.',
    category: 'flower',
    price: 50.0,
    image: '/images/products/mochi.jpg',
    inStock: true,
    featured: true,
    cannabinoids: ['THCA'],
    thcContent: '29% THCA',
    labTested: true,
    strainType: 'Hybrid',
    size: '3.5g (1/8 oz)',
  },

  // CONCENTRATES
  {
    id: 'concentrate-001',
    name: 'Pineapple Express',
    description:
      'Tropical pineapple flavors with energizing sativa effects. Premium live resin concentrate with full terpene preservation.',
    category: 'concentrates',
    price: 40.0,
    image: '/images/products/Pineapple Express.jpg',
    inStock: true,
    featured: true,
    cannabinoids: ['THCA'],
    thcContent: '85% THCA',
    labTested: true,
    strainType: 'Sativa',
    size: '1g',
  },
  {
    id: 'concentrate-002',
    name: 'MAC',
    description:
      'Miracle Alien Cookies concentrate with complex flavors and potent effects. High-quality extraction with exceptional purity.',
    category: 'concentrates',
    price: 45.0,
    image: '/images/products/MAC.jpg',
    inStock: true,
    featured: true,
    cannabinoids: ['THCA'],
    thcContent: '88% THCA',
    labTested: true,
    strainType: 'Hybrid',
    size: '1g',
  },
  {
    id: 'concentrate-003',
    name: 'Cookies N Creme',
    description:
      'Sweet vanilla cookie flavors in a smooth, potent concentrate. Hybrid effects provide balanced relaxation and euphoria.',
    category: 'concentrates',
    price: 42.0,
    image: '/images/products/Cookie N Creme.jpg',
    inStock: true,
    cannabinoids: ['THCA'],
    thcContent: '86% THCA',
    labTested: true,
    strainType: 'Hybrid',
    size: '1g',
  },
  {
    id: 'concentrate-004',
    name: 'Sour Tangie',
    description:
      'Bright citrus and tangerine flavors with uplifting sativa effects. Premium concentrate with intense terpene profile.',
    category: 'concentrates',
    price: 40.0,
    image: '/images/products/Sour Tanger.jpg',
    inStock: true,
    cannabinoids: ['THCA'],
    thcContent: '84% THCA',
    labTested: true,
    strainType: 'Sativa',
    size: '1g',
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
