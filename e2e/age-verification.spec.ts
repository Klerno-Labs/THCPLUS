import { test, expect } from '@playwright/test'

test.describe('Age Verification', () => {
  test('should redirect to age verification when not verified', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/age-verification')
  })

  test('should allow access after age verification', async ({ page, context }) => {
    await page.goto('/age-verification')

    // Click "I am 21 or older" button
    const verifyButton = page.getByRole('button', { name: /i am 21 or older/i })
    await expect(verifyButton).toBeVisible()
    await verifyButton.click()

    // Should redirect to home page
    await expect(page).toHaveURL('/')

    // Verify session cookie is set
    const cookies = await context.cookies()
    const sessionCookie = cookies.find((c) => c.name.includes('age-verified'))
    expect(sessionCookie).toBeDefined()
  })

  test('should maintain verification across navigation', async ({ page }) => {
    // First verify age
    await page.goto('/age-verification')
    await page.getByRole('button', { name: /i am 21 or older/i }).click()
    await expect(page).toHaveURL('/')

    // Navigate to other pages
    await page.goto('/education')
    await expect(page).not.toHaveURL('/age-verification')

    await page.goto('/faq')
    await expect(page).not.toHaveURL('/age-verification')
  })

  test('should have accessible age verification page', async ({ page }) => {
    await page.goto('/age-verification')

    // Check for heading
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()

    // Check for button accessibility
    const button = page.getByRole('button', { name: /i am 21 or older/i })
    await expect(button).toBeVisible()
    await expect(button).toBeEnabled()
  })
})
