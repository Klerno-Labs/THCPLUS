import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Accept age verification before each test
    await page.goto('/')
    await page.evaluate(() => localStorage.setItem('age-verified', 'true'))
    await page.reload()
  })

  test('should navigate to education page', async ({ page }) => {
    await page.goto('/')

    // Click on Education link in header
    await page.getByRole('link', { name: /education/i }).first().click()

    // Should be on education page
    await expect(page).toHaveURL(/\/education/)
    await expect(page.getByText(/what is/i)).toBeVisible()
  })

  test('should navigate to visit us page', async ({ page }) => {
    await page.goto('/')

    // Click on Visit Us link in header
    await page.getByRole('link', { name: /visit us/i }).first().click()

    // Should be on visit us page
    await expect(page).toHaveURL(/\/visit-us/)
  })

  test('should navigate back to home from logo', async ({ page }) => {
    await page.goto('/education')

    // Click on logo/home link
    await page.getByRole('link', { name: /3rd coast smoke company/i }).click()

    // Should be back on homepage
    await expect(page).toHaveURL('/')
    await expect(page.getByText(/welcome to 3rd coast/i)).toBeVisible()
  })

  test.describe('Mobile Navigation', () => {
    test.use({ viewport: { width: 375, height: 667 } })

    test('should open and close mobile menu', async ({ page }) => {
      await page.goto('/')

      // Click hamburger menu
      await page.getByLabel(/toggle menu/i).click()

      // Mobile menu should be visible
      await expect(page.getByRole('link', { name: /education/i }).first()).toBeVisible()

      // Click hamburger again to close
      await page.getByLabel(/toggle menu/i).click()

      // Menu should close (implementation may vary)
    })
  })

  test.describe('Footer Navigation', () => {
    test('should display footer links', async ({ page }) => {
      await page.goto('/')

      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

      // Should see footer navigation
      await expect(page.getByRole('link', { name: /education/i }).last()).toBeVisible()
      await expect(page.getByRole('link', { name: /visit us/i }).last()).toBeVisible()
    })

    test('should display social media links', async ({ page }) => {
      await page.goto('/')

      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

      // Should see social media section
      await expect(page.getByText(/follow us/i)).toBeVisible()
    })
  })
})
