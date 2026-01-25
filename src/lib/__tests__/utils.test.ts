import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })

  it('should handle conflicting Tailwind classes', () => {
    // tailwind-merge should keep the last class when conflicts exist
    expect(cn('px-4', 'px-2')).toBe('px-2')
  })

  it('should handle conditional classes with clsx', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active')
  })

  it('should filter out falsy values', () => {
    expect(cn('base', false && 'hidden', null, undefined, 'visible')).toBe(
      'base visible'
    )
  })

  it('should merge complex Tailwind classes', () => {
    expect(cn('hover:bg-blue-500', 'hover:bg-red-500')).toBe('hover:bg-red-500')
  })

  it('should handle array inputs', () => {
    expect(cn(['px-4', 'py-2'], 'bg-blue-500')).toBe('px-4 py-2 bg-blue-500')
  })

  it('should handle empty inputs', () => {
    expect(cn()).toBe('')
  })

  it('should handle variant combinations', () => {
    const variant = 'primary'
    const size = 'lg'
    expect(
      cn(
        'base-class',
        variant === 'primary' && 'text-white bg-primary',
        size === 'lg' && 'px-8 py-4'
      )
    ).toBe('base-class text-white bg-primary px-8 py-4')
  })

  it('should properly merge padding classes', () => {
    expect(cn('p-4', 'px-8')).toBe('p-4 px-8')
  })

  it('should handle responsive modifiers', () => {
    expect(cn('text-sm', 'md:text-base', 'lg:text-lg')).toBe(
      'text-sm md:text-base lg:text-lg'
    )
  })
})
