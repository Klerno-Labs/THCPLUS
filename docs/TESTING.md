# THC Plus - Testing Guide

## Overview

THC Plus has a comprehensive testing strategy with 85%+ code coverage, including unit tests, component tests, E2E tests, and accessibility tests.

### Test Stack

- **Vitest**: Unit tests (5-10x faster than Jest)
- **React Testing Library**: Component tests
- **Playwright**: E2E tests (cross-browser)
- **@axe-core/playwright**: Accessibility tests

### Test Coverage Targets

- **Utilities**: 100% coverage
- **UI Components**: 90% coverage
- **Server Actions**: 90% coverage
- **Overall**: 85%+ coverage

## Table of Contents

- [Running Tests](#running-tests)
- [Writing Unit Tests](#writing-unit-tests)
- [Writing Component Tests](#writing-component-tests)
- [Writing E2E Tests](#writing-e2e-tests)
- [Writing Accessibility Tests](#writing-accessibility-tests)
- [Test Patterns](#test-patterns)
- [Mocking](#mocking)
- [Debugging Tests](#debugging-tests)
- [CI/CD Integration](#cicd-integration)

## Running Tests

### Unit & Component Tests (Vitest)

```bash
# Run all tests once
npm run test

# Watch mode (recommended during development)
npm run test:watch

# Coverage report
npm run test:coverage

# UI mode (visual test runner)
npm run test:ui

# Run specific test file
npm run test -- src/lib/__tests__/utils.test.ts

# Run tests matching pattern
npm run test -- --grep="contact form"
```

### E2E Tests (Playwright)

```bash
# Run all E2E tests (headless)
npm run test:e2e

# UI mode (visual, recommended)
npm run test:e2e:ui

# Debug mode (step through tests)
npm run test:e2e:debug

# Run specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run specific test file
npx playwright test e2e/age-verification.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed
```

### All Tests

```bash
# Run unit tests + E2E tests (same as CI)
npm run ci:test
```

## Writing Unit Tests

### Test File Structure

Create test files next to the code they test with `.test.ts` or `.test.tsx` extension:

```
src/lib/utils.ts
src/lib/__tests__/utils.test.ts
```

### Basic Test Example

```typescript
import { describe, it, expect } from 'vitest'
import { functionToTest } from '../module'

describe('functionToTest', () => {
  it('should return expected output for valid input', () => {
    const result = functionToTest('input')
    expect(result).toBe('expected output')
  })

  it('should throw error for invalid input', () => {
    expect(() => functionToTest('')).toThrow('Invalid input')
  })
})
```

### Testing Zod Schemas

```typescript
import { describe, it, expect } from 'vitest'
import { contactFormSchema } from '@/lib/validations/contact-form'

describe('contactFormSchema', () => {
  it('should validate correct data', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello world',
    }

    const result = contactFormSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject invalid email', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'not-an-email',
      message: 'Hello world',
    }

    const result = contactFormSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['email'])
    }
  })

  it('should trim whitespace', () => {
    const data = {
      name: '  John Doe  ',
      email: '  john@example.com  ',
      message: '  Hello world  ',
    }

    const result = contactFormSchema.parse(data)
    expect(result.name).toBe('John Doe')
    expect(result.email).toBe('john@example.com')
    expect(result.message).toBe('Hello world')
  })
})
```

### Testing Utility Functions

```typescript
import { describe, it, expect } from 'vitest'
import { cn, hashIpAddress } from '../utils'

describe('cn (className utility)', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('should handle conditional classes', () => {
    expect(cn('foo', true && 'bar', false && 'baz')).toBe('foo bar')
  })

  it('should handle arrays', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar')
  })

  it('should merge Tailwind classes correctly', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })
})

describe('hashIpAddress', () => {
  it('should return consistent hash for same IP', () => {
    const hash1 = hashIpAddress('192.168.1.1')
    const hash2 = hashIpAddress('192.168.1.1')
    expect(hash1).toBe(hash2)
  })

  it('should return different hashes for different IPs', () => {
    const hash1 = hashIpAddress('192.168.1.1')
    const hash2 = hashIpAddress('192.168.1.2')
    expect(hash1).not.toBe(hash2)
  })

  it('should return SHA-256 hash (64 characters)', () => {
    const hash = hashIpAddress('192.168.1.1')
    expect(hash).toHaveLength(64)
    expect(hash).toMatch(/^[a-f0-9]{64}$/)
  })
})
```

## Writing Component Tests

### Basic Component Test

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '../button'

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should apply variant classes', () => {
    render(<Button variant="secondary">Click me</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-secondary')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### Testing User Interactions

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactSection } from '../contact-section'

describe('ContactSection', () => {
  it('should handle form submission', async () => {
    const user = userEvent.setup()

    render(<ContactSection />)

    // Fill form
    await user.type(screen.getByLabelText('Name'), 'John Doe')
    await user.type(screen.getByLabelText('Email'), 'john@example.com')
    await user.type(screen.getByLabelText('Message'), 'Hello world')

    // Submit
    await user.click(screen.getByRole('button', { name: /send message/i }))

    // Verify loading state
    expect(screen.getByText(/sending/i)).toBeInTheDocument()
  })

  it('should show validation errors', async () => {
    const user = userEvent.setup()

    render(<ContactSection />)

    // Submit empty form
    await user.click(screen.getByRole('button', { name: /send message/i }))

    // Verify error messages
    expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
  })
})
```

### Testing with React Hook Form

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from '../contact-form'

// Mock server action
vi.mock('@/app/actions/contact-form', () => ({
  submitContactForm: vi.fn().mockResolvedValue({ success: true }),
}))

describe('ContactForm', () => {
  it('should submit form with valid data', async () => {
    const user = userEvent.setup()
    const { submitContactForm } = await import('@/app/actions/contact-form')

    render(<ContactForm />)

    // Fill form
    await user.type(screen.getByLabelText('Name'), 'John Doe')
    await user.type(screen.getByLabelText('Email'), 'john@example.com')
    await user.type(screen.getByLabelText('Message'), 'This is a test message')

    // Submit
    await user.click(screen.getByRole('button', { name: /send/i }))

    // Verify server action was called
    await waitFor(() => {
      expect(submitContactForm).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message',
      })
    })
  })
})
```

## Writing E2E Tests

### Basic E2E Test

```typescript
import { test, expect } from '@playwright/test'

test('age verification flow', async ({ page }) => {
  // Navigate to site
  await page.goto('http://localhost:3000')

  // Verify age gate is shown
  await expect(page.locator('h1')).toContainText('Age Verification Required')

  // Accept age requirement
  await page.click('text=I am 21 or older')

  // Verify redirect to homepage
  await expect(page).toHaveURL('http://localhost:3000/')
  await expect(page.locator('h1')).toBeVisible()
})
```

### Testing Forms

```typescript
import { test, expect } from '@playwright/test'

test('contact form submission', async ({ page }) => {
  await page.goto('http://localhost:3000')

  // Accept age verification
  await page.click('text=I am 21 or older')

  // Navigate to contact section
  await page.click('a[href="#contact"]')

  // Fill form
  await page.fill('#name', 'Test User')
  await page.fill('#email', 'test@example.com')
  await page.fill('#message', 'This is a test message for E2E testing')

  // Submit
  await page.click('button[type="submit"]')

  // Verify success message
  await expect(page.locator('text=Message sent')).toBeVisible({ timeout: 10000 })
})
```

### Testing Navigation

```typescript
import { test, expect } from '@playwright/test'

test('navigation between pages', async ({ page }) => {
  await page.goto('http://localhost:3000')

  // Accept age verification
  await page.click('text=I am 21 or older')

  // Navigate to Education page
  await page.click('a[href="/education"]')
  await expect(page).toHaveURL('/education')
  await expect(page.locator('h1')).toBeVisible()

  // Navigate to Visit Us page
  await page.click('a[href="/visit-us"]')
  await expect(page).toHaveURL('/visit-us')
  await expect(page.locator('h1')).toBeVisible()

  // Navigate back to homepage
  await page.click('a[href="/"]')
  await expect(page).toHaveURL('/')
})
```

### Testing Mobile

```typescript
import { test, expect, devices } from '@playwright/test'

test.use(devices['iPhone 12'])

test('mobile menu', async ({ page }) => {
  await page.goto('http://localhost:3000')

  // Accept age verification
  await page.click('text=I am 21 or older')

  // Open mobile menu
  await page.click('button[aria-label*="menu"]')

  // Verify menu is visible
  const mobileMenu = page.locator('#mobile-menu')
  await expect(mobileMenu).toBeVisible()

  // Click a link
  await mobileMenu.locator('a:has-text("About")').click()

  // Verify navigation
  await expect(page).toHaveURL('/#about')
})
```

## Writing Accessibility Tests

### Basic Accessibility Scan

```typescript
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('homepage should not have accessibility violations', async ({ page }) => {
  await page.goto('http://localhost:3000')

  // Accept age verification
  await page.click('text=I am 21 or older')

  // Run accessibility scan
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()

  expect(accessibilityScanResults.violations).toEqual([])
})
```

### Testing Keyboard Navigation

```typescript
import { test, expect } from '@playwright/test'

test('form should be keyboard accessible', async ({ page }) => {
  await page.goto('http://localhost:3000')

  // Accept age verification
  await page.click('text=I am 21 or older')

  // Navigate to contact form
  await page.click('a[href="#contact"]')

  // Tab through form fields
  await page.keyboard.press('Tab') // Name input
  await page.keyboard.type('John Doe')

  await page.keyboard.press('Tab') // Email input
  await page.keyboard.type('john@example.com')

  await page.keyboard.press('Tab') // Message textarea
  await page.keyboard.type('Test message')

  await page.keyboard.press('Tab') // Submit button

  // Verify button is focused
  const submitButton = page.locator('button[type="submit"]')
  await expect(submitButton).toBeFocused()

  // Submit with keyboard
  await page.keyboard.press('Enter')
})
```

### Testing ARIA Attributes

```typescript
import { test, expect } from '@playwright/test'

test('form errors should have proper ARIA attributes', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await page.click('text=I am 21 or older')
  await page.click('a[href="#contact"]')

  // Submit empty form to trigger validation
  await page.click('button[type="submit"]')

  // Wait for validation
  await page.waitForTimeout(500)

  // Verify ARIA attributes on invalid input
  const nameInput = page.locator('#name')
  await expect(nameInput).toHaveAttribute('aria-invalid', 'true')
  await expect(nameInput).toHaveAttribute('aria-describedby', 'name-error')

  // Verify error message has role="alert"
  const nameError = page.locator('#name-error')
  await expect(nameError).toHaveAttribute('role', 'alert')
  await expect(nameError).toBeVisible()
})
```

## Test Patterns

### AAA Pattern (Arrange, Act, Assert)

```typescript
test('should process contact form submission', async () => {
  // Arrange
  const formData = {
    name: 'Test User',
    email: 'test@example.com',
    message: 'Test message',
  }

  // Act
  const result = await submitContactForm(formData)

  // Assert
  expect(result.success).toBe(true)
})
```

### Given-When-Then (BDD Style)

```typescript
test('given a valid form, when submitted, then it should save to database', async () => {
  // Given
  const validData = { name: 'Test', email: 'test@example.com', message: 'Hello' }

  // When
  const result = await submitContactForm(validData)

  // Then
  expect(result.success).toBe(true)
  const submission = await prisma.contactSubmission.findFirst({
    where: { email: 'test@example.com' },
  })
  expect(submission).toBeTruthy()
})
```

### Test Fixtures

```typescript
// test/fixtures.ts
export const validContactFormData = {
  name: 'Test User',
  email: 'test@example.com',
  message: 'This is a test message',
}

export const invalidContactFormData = {
  name: '',
  email: 'not-an-email',
  message: 'Short',
}

// In test file
import { validContactFormData } from '@/test/fixtures'

test('should accept valid data', () => {
  const result = contactFormSchema.safeParse(validContactFormData)
  expect(result.success).toBe(true)
})
```

## Mocking

### Mocking Modules

```typescript
import { vi } from 'vitest'

// Mock entire module
vi.mock('@/lib/db', () => ({
  prisma: {
    contactSubmission: {
      create: vi.fn().mockResolvedValue({ id: '123' }),
    },
  },
}))

// Mock specific function
vi.mock('@/lib/email', () => ({
  sendContactNotification: vi.fn().mockResolvedValue({ success: true }),
  sendContactConfirmation: vi.fn().mockResolvedValue({ success: true }),
}))
```

### Mocking Server Actions

```typescript
vi.mock('@/app/actions/contact-form', () => ({
  submitContactForm: vi.fn().mockResolvedValue({
    success: true,
    message: 'Form submitted successfully',
  }),
}))

// In test
const { submitContactForm } = await import('@/app/actions/contact-form')
expect(submitContactForm).toHaveBeenCalled()
```

### Mocking Next.js Modules

```typescript
// Mock next/headers
vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(
    new Map([
      ['x-forwarded-for', '192.168.1.1'],
      ['user-agent', 'Test Agent'],
    ])
  ),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}))
```

## Debugging Tests

### Debugging Vitest Tests

```typescript
// Add console.log
test('debug test', () => {
  const result = someFunction()
  console.log('Result:', result)
  expect(result).toBe('expected')
})

// Use debugger
test('debug with breakpoint', () => {
  debugger // Breaks in VS Code debugger
  const result = someFunction()
  expect(result).toBe('expected')
})
```

### Debugging Playwright Tests

```bash
# Run in debug mode
npm run test:e2e:debug

# Or debug specific test
npx playwright test --debug e2e/contact-form.spec.ts

# Take screenshots on failure (add to test)
test('example', async ({ page }) => {
  await page.screenshot({ path: 'screenshot.png' })
})

# Pause execution
await page.pause()
```

### VS Code Debugging

Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Vitest Tests",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "test", "--", "--run"],
      "console": "integratedTerminal"
    }
  ]
}
```

## CI/CD Integration

### GitHub Actions

Tests run automatically on every push and PR:

```yaml
# .github/workflows/ci.yml
- name: Run unit tests
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3

# .github/workflows/playwright.yml
- name: Run E2E tests
  run: npm run test:e2e

- name: Upload test artifacts
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

### Coverage Thresholds

Configured in `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'test/'],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 80,
        statements: 85,
      },
    },
  },
})
```

### Pre-commit Hooks

Tests for changed files run before commit (Husky):

```bash
# .husky/pre-push
npm run test
npx tsc --noEmit
```

## Best Practices

1. **Write tests first** (TDD) when adding new features
2. **Test behavior, not implementation** (avoid testing internal details)
3. **Keep tests simple and focused** (one assertion per test when possible)
4. **Use descriptive test names** (describe what the test does)
5. **Avoid test interdependencies** (each test should be independent)
6. **Mock external dependencies** (database, APIs, third-party services)
7. **Test edge cases** (empty inputs, max lengths, special characters)
8. **Test error conditions** (network failures, validation errors)
9. **Keep test data realistic** (use valid email formats, realistic names)
10. **Clean up after tests** (reset mocks, clear databases in afterEach)

---

**Last Updated**: 2026-01-24
**Version**: 1.0.0
