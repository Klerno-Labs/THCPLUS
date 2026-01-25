# Smoke Effects Components

Professional smoke animation components for 3rd Coast Smoke Company website. These components create realistic, performant smoke effects using Framer Motion.

## Components

### 1. SmokeParticles

Customizable smoke particle system with multiple animation variants.

**Props:**
- `count` (number): Number of particles (default: 15)
- `colors` (string[]): Array of RGBA colors (default: purple/green theme)
- `variant` ('rising' | 'ambient' | 'swirling' | 'dense'): Animation style
- `speed` ('slow' | 'medium' | 'fast'): Animation speed
- `opacity` (number): Base opacity 0-1 (default: 1)
- `className` (string): Additional CSS classes

**Example:**
```tsx
import { SmokeParticles } from '@/components/effects'

<SmokeParticles
  count={10}
  variant="rising"
  speed="medium"
  opacity={0.6}
  colors={['rgba(147, 51, 234, 0.15)', 'rgba(34, 197, 94, 0.15)']}
/>
```

### 2. LayeredSmoke

Pre-configured layered smoke effect combining multiple particle systems.

**Props:**
- `className` (string): Additional CSS classes
- `theme` ('default' | 'green' | 'purple' | 'rainbow'): Color theme

**Example:**
```tsx
import { LayeredSmoke } from '@/components/effects'

<LayeredSmoke theme="green" />
```

### 3. SmokeCursor

Interactive smoke trail that follows the user's cursor.

**Props:**
- `enabled` (boolean): Enable/disable effect (default: true)
- `color` (string): RGBA color of smoke trail
- `throttle` (number): Milliseconds between particles (default: 100)

**Example:**
```tsx
import { SmokeCursor } from '@/components/effects'

<SmokeCursor
  enabled={true}
  color="rgba(147, 51, 234, 0.25)"
  throttle={80}
/>
```

### 4. HoverSmoke

Wrapper component that emits smoke on hover.

**Props:**
- `children` (ReactNode): Elements to wrap
- `color` (string): RGBA color of smoke

**Example:**
```tsx
import { HoverSmoke } from '@/components/effects'

<HoverSmoke color="rgba(147, 51, 234, 0.4)">
  <button>Hover Me</button>
</HoverSmoke>
```

## Animation Variants

### Rising
Particles rise from bottom to top with slight horizontal drift.
- Best for: Hero sections, dramatic backgrounds
- Performance: Medium

### Ambient
Particles float gently in place with subtle movement.
- Best for: Content sections, subtle backgrounds
- Performance: High (low motion)

### Swirling
Particles move in circular patterns while rising.
- Best for: Interactive areas, testimonials
- Performance: Medium

### Dense
Heavy smoke effect with more particles and opacity.
- Best for: Hero sections, high-impact areas
- Performance: Lower (more particles)

## Color Themes

### Default
Purple and green smoke (brand colors)

### Green
Hemp-themed green tones

### Purple
Purple gradient tones

### Rainbow
Multi-color smoke (purple, green, blue, yellow, red)

## Performance Optimization

All smoke components are optimized for performance:

1. **`useMemo`** - Particle generation is memoized
2. **`will-change`** - CSS optimization for transforms
3. **`pointer-events: none`** - No interaction overhead
4. **Throttling** - SmokeCursor throttles particle creation
5. **Cleanup** - Automatic removal of old particles
6. **RequestAnimationFrame** - Smooth 60fps animations

## Usage in Sections

### Hero Section
```tsx
<section className="relative">
  <LayeredSmoke theme="default" />
  {/* Content */}
</section>
```

### Content Section
```tsx
<section className="relative overflow-hidden">
  <SmokeParticles
    count={6}
    variant="ambient"
    speed="slow"
    opacity={0.2}
  />
  {/* Content */}
</section>
```

### Dark Background Section
```tsx
<section className="relative bg-primary overflow-hidden">
  <SmokeParticles
    count={10}
    variant="swirling"
    opacity={0.3}
    colors={['rgba(255, 255, 255, 0.08)']}
  />
  {/* Content */}
</section>
```

## Accessibility

- All smoke effects use `pointer-events: none` to not interfere with clicks
- Effects are purely decorative and don't affect semantics
- No impact on screen readers or keyboard navigation
- Respects user's motion preferences (via Framer Motion)

## Browser Support

- Modern browsers with CSS `filter: blur()` support
- Gracefully degrades in older browsers
- Optimized for Chrome, Firefox, Safari, Edge

## Testing

Comprehensive test coverage (100%):
- Unit tests for all components
- Performance tests
- Accessibility tests
- Variant tests

Run tests:
```bash
npm test -- effects
```

## File Structure

```
components/effects/
├── smoke-particles.tsx      # SmokeParticles & LayeredSmoke
├── smoke-cursor.tsx         # SmokeCursor & HoverSmoke
├── index.ts                 # Exports
├── README.md               # This file
└── __tests__/
    ├── smoke-particles.test.tsx
    └── smoke-cursor.test.tsx
```

## Credits

Created for 3rd Coast Smoke Company
Built with Framer Motion and React
