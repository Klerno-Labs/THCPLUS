import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../card'

describe('Card Components', () => {
  describe('Card', () => {
    it('should render card element', () => {
      render(<Card data-testid="card">Card content</Card>)
      const card = screen.getByTestId('card')

      expect(card).toBeInTheDocument()
      expect(card).toHaveTextContent('Card content')
    })

    it('should apply custom className', () => {
      render(<Card className="custom-class" data-testid="card">Content</Card>)
      const card = screen.getByTestId('card')

      expect(card).toHaveClass('custom-class')
    })

    it('should forward ref', () => {
      const ref = { current: null }
      render(<Card ref={ref}>Content</Card>)

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })

    it('should have correct default classes', () => {
      render(<Card data-testid="card">Content</Card>)
      const card = screen.getByTestId('card')

      expect(card).toHaveClass('rounded-lg')
      expect(card).toHaveClass('border')
      expect(card).toHaveClass('bg-card')
      expect(card).toHaveClass('shadow-sm')
    })

    it('should accept additional HTML attributes', () => {
      render(<Card data-testid="card" role="region" aria-label="Card">Content</Card>)
      const card = screen.getByTestId('card')

      expect(card).toHaveAttribute('role', 'region')
      expect(card).toHaveAttribute('aria-label', 'Card')
    })
  })

  describe('CardHeader', () => {
    it('should render card header', () => {
      render(<CardHeader data-testid="header">Header content</CardHeader>)
      const header = screen.getByTestId('header')

      expect(header).toBeInTheDocument()
      expect(header).toHaveTextContent('Header content')
    })

    it('should have correct default classes', () => {
      render(<CardHeader data-testid="header">Header</CardHeader>)
      const header = screen.getByTestId('header')

      expect(header).toHaveClass('flex')
      expect(header).toHaveClass('flex-col')
      expect(header).toHaveClass('space-y-1.5')
      expect(header).toHaveClass('p-6')
    })

    it('should apply custom className', () => {
      render(<CardHeader className="custom-header" data-testid="header">Header</CardHeader>)
      const header = screen.getByTestId('header')

      expect(header).toHaveClass('custom-header')
    })
  })

  describe('CardTitle', () => {
    it('should render card title as h3', () => {
      render(<CardTitle>Card Title</CardTitle>)
      const title = screen.getByText('Card Title')

      expect(title).toBeInTheDocument()
      expect(title.tagName).toBe('H3')
    })

    it('should have correct default classes', () => {
      render(<CardTitle data-testid="title">Title</CardTitle>)
      const title = screen.getByTestId('title')

      expect(title).toHaveClass('text-2xl')
      expect(title).toHaveClass('font-semibold')
      expect(title).toHaveClass('tracking-tight')
    })

    it('should apply custom className', () => {
      render(<CardTitle className="custom-title">Title</CardTitle>)
      const title = screen.getByText('Title')

      expect(title).toHaveClass('custom-title')
    })
  })

  describe('CardDescription', () => {
    it('should render card description as paragraph', () => {
      render(<CardDescription>Description text</CardDescription>)
      const description = screen.getByText('Description text')

      expect(description).toBeInTheDocument()
      expect(description.tagName).toBe('P')
    })

    it('should have correct default classes', () => {
      render(<CardDescription data-testid="description">Description</CardDescription>)
      const description = screen.getByTestId('description')

      expect(description).toHaveClass('text-sm')
      expect(description).toHaveClass('text-muted-foreground')
    })
  })

  describe('CardContent', () => {
    it('should render card content', () => {
      render(<CardContent data-testid="content">Main content</CardContent>)
      const content = screen.getByTestId('content')

      expect(content).toBeInTheDocument()
      expect(content).toHaveTextContent('Main content')
    })

    it('should have correct default classes', () => {
      render(<CardContent data-testid="content">Content</CardContent>)
      const content = screen.getByTestId('content')

      expect(content).toHaveClass('p-6')
      expect(content).toHaveClass('pt-0')
    })
  })

  describe('CardFooter', () => {
    it('should render card footer', () => {
      render(<CardFooter data-testid="footer">Footer content</CardFooter>)
      const footer = screen.getByTestId('footer')

      expect(footer).toBeInTheDocument()
      expect(footer).toHaveTextContent('Footer content')
    })

    it('should have correct default classes', () => {
      render(<CardFooter data-testid="footer">Footer</CardFooter>)
      const footer = screen.getByTestId('footer')

      expect(footer).toHaveClass('flex')
      expect(footer).toHaveClass('items-center')
      expect(footer).toHaveClass('p-6')
      expect(footer).toHaveClass('pt-0')
    })
  })

  describe('Complete Card', () => {
    it('should render complete card with all parts', () => {
      render(
        <Card data-testid="card">
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>Test Content</CardContent>
          <CardFooter>Test Footer</CardFooter>
        </Card>
      )

      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
      expect(screen.getByText('Test Content')).toBeInTheDocument()
      expect(screen.getByText('Test Footer')).toBeInTheDocument()
    })
  })
})
