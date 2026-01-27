import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test.beforeEach(async ({ context }) => {
    // Set age verification cookie to bypass age gate
    await context.addCookies([
      {
        name: 'age-verified',
        value: 'true',
        domain: 'localhost',
        path: '/',
        expires: Date.now() / 1000 + 86400,
      },
    ])
  })

  test('should navigate to all main pages', async ({ page }) => {
    await page.goto('/')

    // Navigate to Education
    await page
      .getByRole('link', { name: /education/i })
      .first()
      .click()
    await expect(page).toHaveURL('/education')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/hemp education/i)

    // Navigate to FAQ
    await page.getByRole('link', { name: /faq/i }).first().click()
    await expect(page).toHaveURL('/faq')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      /frequently asked questions/i
    )

    // Navigate to Visit Us
    await page
      .getByRole('link', { name: /visit us/i })
      .first()
      .click()
    await expect(page).toHaveURL('/visit-us')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/visit our store/i)
  })

  test('should navigate using header links', async ({ page }) => {
    await page.goto('/')

    // Click About link in header
    const aboutLink = page.locator('header').getByRole('link', { name: /about/i })
    await aboutLink.click()

    // Should scroll to about section
    await expect(page).toHaveURL('/#about')
  })

  test('should have working mobile navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Open mobile menu
    const menuButton = page.getByRole('button', { name: /open menu/i })
    await expect(menuButton).toBeVisible()
    await menuButton.click()

    // Click navigation link
    const educationLink = page.getByRole('link', { name: /education/i }).first()
    await educationLink.click()

    await expect(page).toHaveURL('/education')
  })

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/')

    // Check main navigation has proper ARIA
    const nav = page.locator('nav[aria-label="Main navigation"]')
    await expect(nav).toBeVisible()

    // Check all links are keyboard accessible
    await page.keyboard.press('Tab')
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
    expect(focusedElement).toBeTruthy()
  })

  test('should navigate back to home from logo', async ({ page }) => {
    await page.goto('/education')

    // Click logo
    const logo = page.getByRole('link', { name: /thc plus home/i })
    await logo.click()

    await expect(page).toHaveURL('/')
  })
})
