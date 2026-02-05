/**
 * Product Type Definitions
 *
 * Defines the structure for product data used throughout the application.
 */

export type ProductCategory =
  | 'vapes'
  | 'edibles'
  | 'flower'
  | 'concentrates'
  | 'pre-rolls'
  | 'accessories'
  | 'tinctures'
  | 'topicals'

export type CannabinoIDType = 'Delta-10' | 'THCA' | 'THCP' | 'HHC' | 'CBD' | 'CBG' | 'CBN'

export interface Product {
  id: string
  name: string
  description: string
  category: ProductCategory
  price?: number
  image: string
  inStock: boolean
  featured?: boolean
  cannabinoids?: CannabinoIDType[]
  thcContent?: string
  cbdContent?: string
  labTested?: boolean
  strainType?: 'Indica' | 'Sativa' | 'Hybrid'
  flavors?: string[]
  brand?: string
  size?: string
}

export interface ProductFilters {
  category?: ProductCategory
  cannabinoid?: CannabinoIDType
  inStockOnly?: boolean
  searchQuery?: string
}
