/**
 * Product Card Component
 *
 * Displays a single product with its details and badges.
 * Used in the products/inventory page grid layout.
 */

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/types/product'
import { Card, CardContent } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'

interface ProductCardProps {
  product: Product
}

const PLACEHOLDER_IMAGE = '/images/products/placeholder.svg'

export function ProductCard({ product }: ProductCardProps) {
  const [imageSrc, setImageSrc] = useState(product.image)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  return (
    <>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div
          className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer"
          onClick={() => setIsLightboxOpen(true)}
        >
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageSrc(PLACEHOLDER_IMAGE)}
          />

          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}

          {/* Featured Badge */}
          {product.featured && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-emerald-500 hover:bg-emerald-600">Featured</Badge>
            </div>
          )}

          {/* Lab Tested Badge */}
          {product.labTested && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-white/90 text-gray-900">
                ✓ Lab Tested
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-6">
          {/* Category Badge */}
          <div className="mb-3">
            <Badge variant="outline" className="text-xs capitalize">
              {product.category.replace('-', ' ')}
            </Badge>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-lg mb-3 line-clamp-2 min-h-[3.5rem]">{product.name}</h3>

          {/* Cannabinoid Badges */}
          {product.cannabinoids && product.cannabinoids.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {product.cannabinoids.map((cannabinoid) => (
                <Badge
                  key={cannabinoid}
                  variant="secondary"
                  className="text-xs bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                >
                  {cannabinoid}
                </Badge>
              ))}
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{product.description}</p>
        </CardContent>
      </Card>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div
            className="relative max-w-4xl max-h-[90vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        </div>
      )}
    </>
  )
}
