# Testing Documentation

This project uses a comprehensive testing setup with Vitest for unit/component tests and Playwright for E2E tests.

## Quick Start

```bash
# Run all unit tests
npm test

# Run unit tests in watch mode
npm run test:watch

# Run unit tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run all tests (CI)
npm run ci:test
```

## Testing Stack

- **Vitest**: Fast unit test runner with native ESM support
- **React Testing Library**: Component testing utilities
- **Playwright**: Cross-browser E2E testing
- **Happy-DOM**: Lightweight DOM implementation for tests

## Unit & Component Tests

### Location

- Utility tests: `src/lib/__tests__/`
- Component tests: `src/app/components/**/__tests__/`

### Example: Testing a Component

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyComponent } from '../my-component'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles user interactions', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<MyComponent onClick={handleClick} />)
    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Coverage Requirements

- **Target**: 85% coverage for all metrics (lines, functions, branches, statements)
- **Run**: `npm run test:coverage`
- **Report**: Generated in `coverage/` directory

## E2E Tests

### Location

All E2E tests are in the `e2e/` directory.

### Example: Testing a User Flow

```typescript
import { test, expect } from '@playwright/test'

test.describe('User Flow', () => {
  test('should complete checkout', async ({ page }) => {
    await page.goto('/')

    // Navigate and interact
    await page.getByRole('button', { name: /add to cart/i }).click()
    await page.getByRole('link', { name: /checkout/i }).click()

    // Assertions
    await expect(page).toHaveURL('/checkout')
    await expect(page.getByText(/order summary/i)).toBeVisible()
  })
})
```

### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode (visual debugger)
npm run test:e2e:ui

# Run with debug mode (step-by-step)
npm run test:e2e:debug

# Run specific test file
npx playwright test e2e/age-verification.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed
```

### Browser Coverage

Tests run across:

- Chromium (Desktop)
- Firefox (Desktop)
- WebKit (Desktop Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

## Best Practices

### Unit Tests

1. **Test user behavior, not implementation**

   ```typescript
   // ✅ Good
   await user.click(screen.getByRole('button', { name: /submit/i }))

   // ❌ Bad
   fireEvent.click(getByTestId('submit-btn'))
   ```

2. **Use semantic queries**
   - Prefer: `getByRole`, `getByLabelText`, `getByText`
   - Avoid: `getByTestId`, `getByClassName`

3. **Mock external dependencies**
   ```typescript
   vi.mock('next/navigation', () => ({
     useRouter: () => ({ push: vi.fn() }),
   }))
   ```

### E2E Tests

1. **Test critical user journeys**
   - Age verification flow
   - Contact form submission
   - Navigation across pages
   - Mobile responsiveness

2. **Use Page Object Model for complex flows**

   ```typescript
   class CheckoutPage {
     constructor(private page: Page) {}

     async fillShippingInfo(info: ShippingInfo) {
       await this.page.fill('[name="address"]', info.address)
       // ...
     }
   }
   ```

3. **Handle async operations properly**

   ```typescript
   // Wait for navigation
   await Promise.all([page.waitForNavigation(), page.click('button')])

   // Wait for API calls
   await page.waitForResponse((resp) => resp.url().includes('/api/'))
   ```

## CI Integration

Tests run automatically on:

- Every push to `master`
- Every pull request
- Pre-push git hook (local)

### CI Configuration

```yaml
# .github/workflows/ci.yml
- name: Run tests
  run: npm run ci:test
```

## Troubleshooting

### Tests failing in CI but passing locally

- Check Node version matches CI (v20+)
- Run with `--no-cache` flag
- Check for timezone/locale-dependent tests

### E2E tests timing out

- Increase timeout in `playwright.config.ts`
- Check if dev server is starting correctly
- Use `await page.waitForLoadState('networkidle')`

### Mock not working

- Ensure mock is defined before import
- Use `vi.hoisted()` for top-level mocks
- Clear mocks between tests with `vi.clearAllMocks()`

## Next Steps

1. **Expand Coverage**: Add tests for remaining components
2. **Visual Regression**: Set up Playwright visual comparisons
3. **Performance Testing**: Add Lighthouse CI
4. **Accessibility Testing**: Integrate @axe-core/playwright

## Resources

- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Docs](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
