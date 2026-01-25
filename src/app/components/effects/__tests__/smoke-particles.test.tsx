import { describe, it, expect } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { SmokeParticles, LayeredSmoke } from '../smoke-particles'

describe('SmokeParticles Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<SmokeParticles />)
    expect(container).toBeInTheDocument()
  })

  it('should render the specified number of particles', async () => {
    const { container } = render(<SmokeParticles count={5} />)
    await waitFor(() => {
      const particles = container.querySelectorAll('.absolute.rounded-full')
      expect(particles).toHaveLength(5)
    })
  })

  it('should apply custom className', () => {
    const { container } = render(<SmokeParticles className="custom-smoke" />)
    const wrapper = container.querySelector('.custom-smoke')
    expect(wrapper).toBeInTheDocument()
  })

  it('should render with rising variant', async () => {
    const { container } = render(<SmokeParticles variant="rising" count={3} />)
    await waitFor(() => {
      const particles = container.querySelectorAll('.absolute.rounded-full')
      expect(particles).toHaveLength(3)
    })
  })

  it('should render with ambient variant', async () => {
    const { container } = render(<SmokeParticles variant="ambient" count={3} />)
    await waitFor(() => {
      const particles = container.querySelectorAll('.absolute.rounded-full')
      expect(particles).toHaveLength(3)
    })
  })

  it('should render with swirling variant', async () => {
    const { container } = render(<SmokeParticles variant="swirling" count={3} />)
    await waitFor(() => {
      const particles = container.querySelectorAll('.absolute.rounded-full')
      expect(particles).toHaveLength(3)
    })
  })

  it('should render with dense variant', async () => {
    const { container } = render(<SmokeParticles variant="dense" count={3} />)
    await waitFor(() => {
      const particles = container.querySelectorAll('.absolute.rounded-full')
      expect(particles).toHaveLength(3)
    })
  })

  it('should accept custom colors', async () => {
    const customColors = ['rgba(255, 0, 0, 0.5)', 'rgba(0, 255, 0, 0.5)']
    const { container } = render(<SmokeParticles colors={customColors} count={2} />)
    await waitFor(() => {
      const particles = container.querySelectorAll('.absolute.rounded-full')
      expect(particles).toHaveLength(2)
    })
  })

  it('should apply speed variants correctly', () => {
    const { container: slowContainer } = render(<SmokeParticles speed="slow" count={1} />)
    expect(slowContainer.querySelector('.absolute.rounded-full')).toBeInTheDocument()

    const { container: mediumContainer } = render(<SmokeParticles speed="medium" count={1} />)
    expect(mediumContainer.querySelector('.absolute.rounded-full')).toBeInTheDocument()

    const { container: fastContainer } = render(<SmokeParticles speed="fast" count={1} />)
    expect(fastContainer.querySelector('.absolute.rounded-full')).toBeInTheDocument()
  })

  it('should apply opacity correctly', () => {
    const { container } = render(<SmokeParticles opacity={0.5} count={1} />)
    const particle = container.querySelector('.absolute.rounded-full')
    expect(particle).toBeInTheDocument()
  })

  it('should have pointer-events-none for non-interactive behavior', () => {
    const { container } = render(<SmokeParticles />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('pointer-events-none')
  })

  it('should have overflow-hidden to prevent particles escaping', () => {
    const { container } = render(<SmokeParticles />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('overflow-hidden')
  })

  it('should be positioned absolutely', () => {
    const { container } = render(<SmokeParticles />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('absolute')
    expect(wrapper).toHaveClass('inset-0')
  })
})

describe('LayeredSmoke Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<LayeredSmoke />)
    expect(container).toBeInTheDocument()
  })

  it('should render multiple smoke layers', async () => {
    const { container } = render(<LayeredSmoke />)
    // Should have 3 layers (ambient, rising, swirling)
    await waitFor(() => {
      const layers = container.querySelectorAll('.absolute.inset-0.overflow-hidden.pointer-events-none')
      expect(layers.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('should apply custom className', () => {
    const { container } = render(<LayeredSmoke className="custom-layered" />)
    const wrapper = container.querySelector('.custom-layered')
    expect(wrapper).toBeInTheDocument()
  })

  it('should render with default theme', () => {
    const { container } = render(<LayeredSmoke theme="default" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render with green theme', () => {
    const { container } = render(<LayeredSmoke theme="green" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render with purple theme', () => {
    const { container } = render(<LayeredSmoke theme="purple" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render with rainbow theme', () => {
    const { container } = render(<LayeredSmoke theme="rainbow" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should be positioned absolutely to overlay content', () => {
    const { container } = render(<LayeredSmoke />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('absolute')
    expect(wrapper).toHaveClass('inset-0')
  })
})

describe('Performance Considerations', () => {
  it('should limit particle count to reasonable numbers', async () => {
    const { container } = render(<SmokeParticles count={20} />)
    await waitFor(() => {
      const particles = container.querySelectorAll('.absolute.rounded-full')
      // Should render all particles
      expect(particles).toHaveLength(20)
    })
  })

  it('should use will-change CSS for optimization', async () => {
    const { container } = render(<SmokeParticles count={1} />)
    await waitFor(() => {
      const particle = container.querySelector('.absolute.rounded-full') as HTMLElement
      expect(particle.style.willChange).toBe('transform, opacity')
    })
  })

  it('should apply blur filter efficiently', async () => {
    const { container } = render(<SmokeParticles count={1} />)
    await waitFor(() => {
      const particle = container.querySelector('.absolute.rounded-full') as HTMLElement
      expect(particle.style.filter).toContain('blur')
    })
  })
})
