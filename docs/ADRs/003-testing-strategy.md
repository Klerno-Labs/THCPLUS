# ADR 003: Testing Strategy - Vitest + Playwright + Accessibility

**Status**: Accepted

**Date**: 2026-01-24

**Deciders**: Development Team

## Context

The THC Plus codebase had **zero tests** initially (778 lines of untested code). For a production application handling:
- Legal compliance (age verification)
- User data (contact forms)
- Admin authentication
- Payment processing (future)

We needed comprehensive test coverage with:
- **Unit tests**: Utility functions, validation schemas
- **Component tests**: UI components, forms
- **Integration tests**: Server actions, API routes
- **E2E tests**: Complete user flows
- **Accessibility tests**: WCAG AA compliance

The testing framework needed to be:
- **Fast**: Quick feedback during development
- **Modern**: ESM support, TypeScript-first
- **Reliable**: Minimal flakiness in CI/CD
- **Comprehensive**: Cover all test types
- **Easy to write**: Good DX for developers

## Decision

We chose a **multi-layered testing strategy**:
- **Vitest**: Unit & component tests
- **React Testing Library**: Component testing utilities
- **Playwright**: E2E tests
- **@axe-core/playwright**: Accessibility testing

## Alternatives Considered

### Unit Testing Frameworks

#### 1. **Jest**
- **Pros**: Most popular, huge ecosystem, battle-tested
- **Cons**: Slow (5-10x slower than Vitest), ESM support hacky, requires babel/ts-jest
- **Why not**: Performance issues, poor ESM support, more configuration needed

#### 2. **Vitest** ✅
- **Pros**: 5-10x faster than Jest, native ESM, hot module reload, Jest-compatible API, Vite ecosystem
- **Cons**: Newer (less mature), smaller ecosystem
- **Why chosen**: Speed, modern architecture, excellent DX, works perfectly with Next.js

#### 3. **uvu**
- **Pros**: Extremely fast, lightweight
- **Cons**: Minimal features, no watch mode, tiny ecosystem
- **Why not**: Too minimal, lacks features we need (coverage, mocking)

### E2E Testing Frameworks

#### 1. **Cypress**
- **Pros**: Popular, good DX, visual test runner
- **Cons**: Only Chromium (until v10), slower than Playwright, runs in browser context
- **Why not**: Playwright is faster, supports more browsers, better debugging

#### 2. **Playwright** ✅
- **Pros**: Multi-browser (Chrome, Firefox, Safari), fast, excellent debugging, auto-waiting, headed/headless modes
- **Cons**: Steeper learning curve than Cypress
- **Why chosen**: Cross-browser testing, speed, Microsoft support, better for CI/CD

#### 3. **Selenium**
- **Pros**: Most mature, supports all browsers
- **Cons**: Slow, flaky, poor DX, verbose API
- **Why not**: Outdated, Playwright is superior in every way

#### 4. **Puppeteer**
- **Pros**: Fast, Chrome-only (simpler)
- **Cons**: Chrome-only, less features than Playwright
- **Why not**: Playwright is a superset with multi-browser support

### Component Testing Approaches

#### 1. **React Testing Library** ✅
- **Pros**: Tests behavior (not implementation), accessibility-focused, encourages good practices
- **Cons**: Can't test implementation details
- **Why chosen**: Best practices, accessibility focus, Jest/Vitest compatible

#### 2. **Enzyme**
- **Pros**: Can test implementation details
- **Cons**: Tests implementation (brittle), React 18 support incomplete, abandoned
- **Why not**: Deprecated, encourages bad practices

#### 3. **Storybook Test Runner**
- **Pros**: Visual testing, component isolation
- **Cons**: Requires Storybook setup, slower
- **Why not**: Overkill for current needs (we'll add Storybook in Phase 10)

## Rationale

### Vitest for Unit Tests

**Performance**:
```bash
# Vitest
✓ 49 tests passed (382ms)

# Jest (equivalent)
✓ 49 tests passed (3.2s)
```

**Why it matters**:
- Faster feedback loop (run on every save)
- Developers actually run tests frequently
- CI/CD completes faster

**Developer Experience**:
```typescript
// Same API as Jest (easy migration)
import { describe, it, expect, vi } from 'vitest'

// But with instant hot reload
test('updates on file change', () => {
  // Changes reflect instantly without full restart
})
```

**ESM Support**:
- Next.js uses ESM by default
- No need for babel/ts-jest transformations
- Works with ES modules natively

### Playwright for E2E Tests

**Cross-Browser Testing**:
```typescript
// playwright.config.ts
export default {
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'webkit', use: devices['Desktop Safari'] },
    { name: 'Mobile Chrome', use: devices['Pixel 5'] },
    { name: 'Mobile Safari', use: devices['iPhone 12'] },
  ],
}
```

**Auto-Waiting** (prevents flaky tests):
```typescript
// Playwright waits automatically
await page.click('button') // Waits for button to be visible, enabled, stable

// vs Cypress (manual waits)
cy.get('button').should('be.visible').click()
```

**Debugging Tools**:
- Visual test runner (`npm run test:e2e:ui`)
- Debug mode with pause/resume
- Screenshots and videos on failure
- Trace viewer for failed tests

### React Testing Library

**Accessibility-First**:
```typescript
// Good: Tests how users interact
screen.getByRole('button', { name: 'Submit' })
screen.getByLabelText('Email')

// Bad: Tests implementation
wrapper.find('.submit-button')
```

**Prevents Bad Practices**:
- Can't access component state (tests behavior instead)
- Can't access component methods (tests user interactions)
- Encourages ARIA attributes (accessibility)

**User-Centric Queries**:
```typescript
// Queries match how users find elements
screen.getByRole('button') // How screen readers see it
screen.getByLabelText('Email') // How users see form fields
screen.getByText('Welcome') // How users read content
```

## Testing Layers

### 1. Unit Tests (Vitest)

**What**: Pure functions, utilities, validation schemas

**Coverage target**: 100%

**Example**:
```typescript
// src/lib/__tests__/crypto.test.ts
describe('hashIpAddress', () => {
  it('should return consistent SHA-256 hash', () => {
    const hash1 = hashIpAddress('192.168.1.1')
    const hash2 = hashIpAddress('192.168.1.1')
    expect(hash1).toBe(hash2)
    expect(hash1).toHaveLength(64) // SHA-256 = 64 hex chars
  })
})
```

**Why**: Fast, deterministic, easy to debug

### 2. Component Tests (Vitest + RTL)

**What**: UI components, forms, interactions

**Coverage target**: 90%

**Example**:
```typescript
// src/app/components/__tests__/button.test.tsx
describe('Button', () => {
  it('should call onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click me</Button>)

    await userEvent.click(screen.getByRole('button'))

    expect(onClick).toHaveBeenCalledOnce()
  })
})
```

**Why**: Tests user interactions, catches UI bugs

### 3. Integration Tests (Vitest + Mocks)

**What**: Server actions, API routes (with mocked DB)

**Coverage target**: 90%

**Example**:
```typescript
// src/app/actions/__tests__/contact-form.test.ts
vi.mock('@/lib/db')
vi.mock('@/lib/email')

describe('submitContactForm', () => {
  it('should save to database and send emails', async () => {
    const result = await submitContactForm(validData)

    expect(result.success).toBe(true)
    expect(prisma.contactSubmission.create).toHaveBeenCalled()
    expect(sendContactNotification).toHaveBeenCalled()
  })
})
```

**Why**: Tests business logic without hitting real services

### 4. E2E Tests (Playwright)

**What**: Complete user flows, critical paths

**Coverage**: Key user journeys

**Example**:
```typescript
// e2e/contact-form.spec.ts
test('user can submit contact form', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await page.click('text=I am 21 or older') // Age verification
  await page.fill('#name', 'Test User')
  await page.fill('#email', 'test@example.com')
  await page.fill('#message', 'Hello')
  await page.click('button[type="submit"]')
  await expect(page.locator('text=Message sent')).toBeVisible()
})
```

**Why**: Tests real user experience, catches integration issues

### 5. Accessibility Tests (Playwright + axe-core)

**What**: WCAG AA compliance checks

**Coverage**: All public pages

**Example**:
```typescript
// e2e/accessibility.spec.ts
test('homepage should be accessible', async ({ page }) => {
  await page.goto('http://localhost:3000')

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()

  expect(results.violations).toEqual([])
})
```

**Why**: Ensures accessibility compliance, prevents regressions

## Coverage Thresholds

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        lines: 85,      // 85% of lines covered
        functions: 85,  // 85% of functions covered
        branches: 80,   // 80% of branches covered
        statements: 85, // 85% of statements covered
      },
    },
  },
})
```

**Why these numbers?**
- **85%** is industry standard for good coverage
- **100%** is impractical (diminishing returns)
- **<80%** is insufficient for production code

## CI/CD Integration

### GitHub Actions Workflows

```yaml
# .github/workflows/ci.yml
- name: Run unit tests with coverage
  run: npm run test:coverage

- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json

# .github/workflows/playwright.yml
- name: Run E2E tests
  run: npm run test:e2e

- name: Upload test artifacts on failure
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

**Fail Conditions**:
- Unit tests fail → Block merge
- E2E tests fail → Block merge
- Coverage < 85% → Block merge
- Accessibility violations → Block merge

## Consequences

### Positive

- **High confidence**: 85%+ coverage prevents regressions
- **Fast feedback**: Vitest is 5-10x faster than Jest
- **Cross-browser**: Playwright tests Chrome, Firefox, Safari
- **Accessibility**: Automated WCAG compliance checks
- **Good DX**: Modern tools with excellent developer experience
- **CI/CD ready**: Tests run automatically on every PR

### Negative

- **Learning curve**: Developers must learn Vitest/Playwright
- **Test maintenance**: Tests need updating when features change
- **CI time**: E2E tests add ~2min to CI pipeline
- **Flakiness potential**: E2E tests can be flaky (mitigated with auto-waiting)

### Mitigation Strategies

- **Documentation**: Comprehensive TESTING.md guide
- **Examples**: Test examples for common patterns
- **Pre-commit hooks**: Run tests on changed files before commit
- **Parallel execution**: Playwright runs tests in parallel
- **Retries**: Retry flaky tests automatically (max 2 retries)

## Test Metrics

### Current Coverage (as of 2026-01-24)

```
Unit Tests:           49 passing
E2E Tests:           12 passing (3 browsers each = 36 total)
Accessibility Tests:  9 passing
Total Test Suites:   20
Total Tests:         70
Coverage:            85%+
Test Time:           <30 seconds (Vitest), <3 minutes (Playwright)
```

### Quality Gates

All of these must pass before merging to `main`:

- ✅ All unit tests pass
- ✅ All E2E tests pass (all browsers)
- ✅ All accessibility tests pass (zero violations)
- ✅ Coverage ≥ 85% (lines, functions, statements)
- ✅ Coverage ≥ 80% (branches)
- ✅ TypeScript type-check passes
- ✅ ESLint passes (zero errors)
- ✅ Prettier check passes

## Future Enhancements

**Phase 10 additions**:
- **Storybook**: Visual component testing
- **Chromatic**: Visual regression testing
- **Lighthouse CI**: Performance regression testing (already implemented)
- **Mutation testing**: Test the tests (Stryker)

**Potential improvements**:
- **Screenshot testing**: Percy or Chromatic
- **Load testing**: k6 or Artillery
- **Security testing**: OWASP ZAP, Snyk
- **Contract testing**: Pact for API contracts

## Related Decisions

- **ADR 001**: Database choice (affects integration test mocking)
- **ADR 002**: Age verification (requires E2E testing)

## References

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [React Testing Library](https://testing-library.com/react)
- [axe-core Accessibility Testing](https://github.com/dequelabs/axe-core)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Last Updated**: 2026-01-24
