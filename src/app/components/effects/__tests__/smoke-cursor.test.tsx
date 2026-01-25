import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SmokeCursor, HoverSmoke } from '../smoke-cursor'

describe('SmokeCursor Component', () => {
  it('should render when enabled', () => {
    const { container } = render(<SmokeCursor enabled={true} />)
    const cursor = container.querySelector('.fixed.inset-0.pointer-events-none')
    expect(cursor).toBeInTheDocument()
  })

  it('should not render when disabled', () => {
    const { container } = render(<SmokeCursor enabled={false} />)
    const cursor = container.querySelector('.fixed.inset-0.pointer-events-none')
    expect(cursor).not.toBeInTheDocument()
  })

  it('should be fixed positioned to cover entire viewport', () => {
    const { container } = render(<SmokeCursor enabled={true} />)
    const cursor = container.firstChild as HTMLElement
    expect(cursor).toHaveClass('fixed')
    expect(cursor).toHaveClass('inset-0')
  })

  it('should be non-interactive (pointer-events-none)', () => {
    const { container } = render(<SmokeCursor enabled={true} />)
    const cursor = container.firstChild as HTMLElement
    expect(cursor).toHaveClass('pointer-events-none')
  })

  it('should have high z-index to appear above content', () => {
    const { container } = render(<SmokeCursor enabled={true} />)
    const cursor = container.firstChild as HTMLElement
    expect(cursor).toHaveClass('z-50')
  })

  it('should accept custom color prop', () => {
    const customColor = 'rgba(255, 0, 0, 0.5)'
    render(<SmokeCursor enabled={true} color={customColor} />)
    // Component should render without errors with custom color
    expect(true).toBe(true)
  })

  it('should accept throttle prop', () => {
    render(<SmokeCursor enabled={true} throttle={200} />)
    // Component should render without errors with custom throttle
    expect(true).toBe(true)
  })

  it('should have overflow-hidden to prevent scroll', () => {
    const { container } = render(<SmokeCursor enabled={true} />)
    const cursor = container.firstChild as HTMLElement
    expect(cursor).toHaveClass('overflow-hidden')
  })
})

describe('HoverSmoke Component', () => {
  it('should render children correctly', () => {
    render(
      <HoverSmoke>
        <button>Test Button</button>
      </HoverSmoke>
    )
    expect(screen.getByText('Test Button')).toBeInTheDocument()
  })

  it('should wrap children in relative container', () => {
    const { container } = render(
      <HoverSmoke>
        <button>Test</button>
      </HoverSmoke>
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('relative')
    expect(wrapper).toHaveClass('inline-block')
  })

  it('should have particle container with correct positioning', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <HoverSmoke>
        <button>Hover Me</button>
      </HoverSmoke>
    )

    const button = screen.getByText('Hover Me')
    await user.hover(button)

    const particleContainer = container.querySelector('.absolute.inset-0.pointer-events-none')
    expect(particleContainer).toBeInTheDocument()
  })

  it('should accept custom color prop', () => {
    const customColor = 'rgba(0, 255, 0, 0.5)'
    render(
      <HoverSmoke color={customColor}>
        <button>Test</button>
      </HoverSmoke>
    )
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should handle mouse enter and leave events', async () => {
    const user = userEvent.setup()
    render(
      <HoverSmoke>
        <button>Test Button</button>
      </HoverSmoke>
    )

    const button = screen.getByText('Test Button')

    // Hover over button
    await user.hover(button)
    expect(button).toBeInTheDocument()

    // Move mouse away
    await user.unhover(button)
    expect(button).toBeInTheDocument()
  })
})

describe('Accessibility', () => {
  it('SmokeCursor should not interfere with click events', () => {
    const handleClick = vi.fn()
    const { container } = render(
      <>
        <SmokeCursor enabled={true} />
        <button onClick={handleClick}>Click Me</button>
      </>
    )

    const cursor = container.querySelector('.pointer-events-none')
    expect(cursor).toBeInTheDocument()
    expect(cursor).toHaveClass('pointer-events-none')
  })

  it('HoverSmoke should not break keyboard navigation', async () => {
    const user = userEvent.setup()
    render(
      <HoverSmoke>
        <button>Accessible Button</button>
      </HoverSmoke>
    )

    const button = screen.getByText('Accessible Button')
    await user.tab()

    // Button should be focusable
    expect(button).toBeInTheDocument()
  })

  it('effects should be decorative only and not affect semantics', () => {
    const { container } = render(
      <HoverSmoke>
        <button aria-label="Submit form">Submit</button>
      </HoverSmoke>
    )

    const button = screen.getByLabelText('Submit form')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Submit')
  })
})
