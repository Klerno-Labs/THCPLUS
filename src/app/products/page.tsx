'use client'

/**
 * Products Page
 *
 * Displays all products in a filterable grid layout.
 * Includes category filtering, search, and cannabinoid filters.
 */

import { useState, useMemo } from 'react'
import { products } from '@/data/products'
import { ProductCard } from '@/app/components/products/product-card'
import { Badge } from '@/app/components/ui/badge'
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/button'
import type { ProductCategory, CannabinoIDType } from '@/types/product'

const categories: { value: ProductCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Products' },
  { value: 'vapes', label: 'Vapes' },
  { value: 'edibles', label: 'Edibles' },
  { value: 'flower', label: 'Flower' },
  { value: 'concentrates', label: 'Concentrates' },
  { value: 'pre-rolls', label: 'Pre-Rolls' },
  { value: 'tinctures', label: 'Tinctures' },
  { value: 'accessories', label: 'Accessories' },
]

const cannabinoids: CannabinoIDType[] = ['Delta-8', 'Delta-9', 'THCA', 'HHC', 'CBD', 'CBN']

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all')
  const [selectedCannabinoid, setSelectedCannabinoid] = useState<CannabinoIDType | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)

  // Filter products based on all criteria
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false
      }

      // Cannabinoid filter
      if (
        selectedCannabinoid &&
        (!product.cannabinoids || !product.cannabinoids.includes(selectedCannabinoid))
      ) {
        return false
      }

      // In stock filter
      if (inStockOnly && !product.inStock) {
        return false
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query)
        )
      }

      return true
    })
  }, [selectedCategory, selectedCannabinoid, searchQuery, inStockOnly])

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('all')
    setSelectedCannabinoid(null)
    setSearchQuery('')
    setInStockOnly(false)
  }

  const hasActiveFilters =
    selectedCategory !== 'all' || selectedCannabinoid !== null || searchQuery !== '' || inStockOnly

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Premium Selection</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our curated collection of high-quality hemp and CBD products. All products are
            lab-tested and legally compliant.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Search products by name, brand, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value as ProductCategory | 'all')}
                  className={`cursor-pointer transition-all ${
                    selectedCategory === category.value
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Cannabinoid Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Cannabinoid Type</h3>
            <div className="flex flex-wrap gap-2">
              {cannabinoids.map((cannabinoid) => (
                <Badge
                  key={cannabinoid}
                  onClick={() =>
                    setSelectedCannabinoid(selectedCannabinoid === cannabinoid ? null : cannabinoid)
                  }
                  className={`cursor-pointer transition-all ${
                    selectedCannabinoid === cannabinoid
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cannabinoid}
                </Badge>
              ))}
            </div>
          </div>

          {/* Additional Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">In Stock Only</span>
            </label>

            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline" size="sm" className="ml-auto">
                Clear All Filters
              </Button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredProducts.length}</span> of{' '}
          <span className="font-semibold">{products.length}</span> products
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </div>
        )}
      </div>
    </div>
  )
}
