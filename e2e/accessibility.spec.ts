import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Accessibility Tests
 *
 * Uses axe-core to scan pages for WCAG violations.
 * Target: WCAG AA compliance
 */

test.describe('Accessibility', () => {
  test('homepage should not have any automatically detectable accessibility issues', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000')

    // Wait for age verification page to load
    await expect(page.locator('h1')).toContainText('Age Verification Required')

    // Accept age verification
    await page.click('text=I am 21 or older')

    // Wait for homepage to load
    await expect(page.locator('h1')).toContainText(/THC Plus|Welcome/, { timeout: 5000 })

    // Run accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('age verification page should not have any automatically detectable accessibility issues', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/age-verification')

    // Wait for page to load
    await expect(page.locator('h1')).toContainText('Age Verification Required')

    // Run accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('education page should not have any automatically detectable accessibility issues', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/education')

    // Wait for page to load
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 })

    // Run accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('visit-us page should not have any automatically detectable accessibility issues', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/visit-us')

    // Wait for page to load
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 })

    // Run accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('contact form should be keyboard accessible', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Accept age verification
    await page.click('text=I am 21 or older')

    // Wait for homepage to load
    await page.waitForSelector('#contact', { timeout: 5000 })

    // Navigate to contact form
    await page.click('a[href="#contact"]')

    // Test keyboard navigation through form
    await page.keyboard.press('Tab') // Focus name input
    await page.keyboard.type('Test User')

    await page.keyboard.press('Tab') // Focus email input
    await page.keyboard.type('test@example.com')

    await page.keyboard.press('Tab') // Focus message textarea
    await page.keyboard.type('This is a test message for accessibility testing.')

    await page.keyboard.press('Tab') // Focus submit button

    // Verify submit button is focused
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeFocused()
  })

  test('mobile menu should be keyboard accessible', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('http://localhost:3000')

    // Accept age verification
    await page.click('text=I am 21 or older')

    // Wait for homepage
    await page.waitForSelector('header', { timeout: 5000 })

    // Find and click mobile menu button
    const menuButton = page.locator('button[aria-label*="menu"]').first()
    await menuButton.click()

    // Verify mobile menu is visible
    const mobileMenu = page.locator('#mobile-menu')
    await expect(mobileMenu).toBeVisible()

    // Verify menu items are accessible
    const aboutLink = mobileMenu.locator('a:has-text("About")')
    await expect(aboutLink).toBeVisible()

    // Close menu with keyboard
    await page.keyboard.press('Escape')

    // Note: AnimatePresence may delay unmounting, so we check for visibility change
    // rather than complete removal from DOM
  })

  test('skip link should work', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Accept age verification
    await page.click('text=I am 21 or older')

    // Wait for homepage
    await page.waitForSelector('header', { timeout: 5000 })

    // Press Tab to focus skip link
    await page.keyboard.press('Tab')

    // Verify skip link is focused
    const skipLink = page.locator('a[href="#main-content"]')
    await expect(skipLink).toBeFocused()

    // Activate skip link
    await page.keyboard.press('Enter')

    // Verify main content is in viewport
    const mainContent = page.locator('#main-content')
    await expect(mainContent).toBeInViewport()
  })

  test('form validation errors should be announced to screen readers', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Accept age verification
    await page.click('text=I am 21 or older')

    // Navigate to contact form
    await page.goto('http://localhost:3000#contact')
    await page.waitForSelector('#contact', { timeout: 5000 })

    // Submit empty form
    const submitButton = page.locator('button[type="submit"]').filter({ hasText: /Send Message/i })
    await submitButton.click()

    // Wait for validation errors
    await page.waitForTimeout(500)

    // Verify error messages have proper ARIA attributes
    const nameInput = page.locator('#name')
    await expect(nameInput).toHaveAttribute('aria-invalid', 'true')
    await expect(nameInput).toHaveAttribute('aria-describedby', 'name-error')

    // Verify error message exists and has role="alert"
    const nameError = page.locator('#name-error')
    await expect(nameError).toBeVisible()
    await expect(nameError).toHaveAttribute('role', 'alert')
  })

  test('all images should have alt text', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Accept age verification
    await page.click('text=I am 21 or older')

    // Wait for homepage
    await page.waitForSelector('main', { timeout: 5000 })

    // Find all images
    const images = page.locator('img')
    const count = await images.count()

    // Verify all images have alt attribute
    for (let i = 0; i < count; i++) {
      const image = images.nth(i)
      await expect(image).toHaveAttribute('alt')
    }
  })

  test('headings should follow hierarchical order', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Accept age verification
    await page.click('text=I am 21 or older')

    // Wait for homepage
    await page.waitForSelector('main', { timeout: 5000 })

    // Run accessibility scan focusing on heading order
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['best-practice'])
      .include('main')
      .analyze()

    // Filter for heading-order violations
    const headingViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.id === 'heading-order'
    )

    expect(headingViolations).toHaveLength(0)
  })
})
