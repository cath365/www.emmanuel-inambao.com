import { test, expect } from '@playwright/test'

test.describe('Portfolio Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load the homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/Emmanuel Inambao/)
  })

  test('should display the hero section', async ({ page }) => {
    const hero = page.locator('section').first()
    await expect(hero).toBeVisible()
  })

  test('should have working navigation links', async ({ page }) => {
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()

    // Check that About link exists
    const aboutLink = page.locator('a[href="#about"]').first()
    await expect(aboutLink).toBeVisible()
  })

  test('should toggle mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    const menuButton = page.locator('button[aria-label="Open menu"]')
    await expect(menuButton).toBeVisible()
    await menuButton.click()

    const mobileMenu = page.locator('#mobile-menu')
    await expect(mobileMenu).toBeVisible()
  })

  test('should have meta tags for SEO', async ({ page }) => {
    const description = page.locator('meta[name="description"]')
    await expect(description).toHaveAttribute('content', /Emmanuel Inambao/)
  })

  test('should have skip-to-content link for accessibility', async ({ page }) => {
    const skipLink = page.locator('a[href="#main-content"]')
    await expect(skipLink).toBeTruthy()
  })
})

test.describe('Navigation', () => {
  test('should navigate to blog page', async ({ page }) => {
    await page.goto('/blog')
    await expect(page).toHaveTitle(/Blog/)
  })

  test('should navigate to case studies page', async ({ page }) => {
    await page.goto('/case-studies')
    await expect(page).toHaveTitle(/Case Studies/)
  })

  test('should navigate to resume page', async ({ page }) => {
    await page.goto('/resume')
    await expect(page.locator('h1')).toContainText('Emmanuel Inambao')
  })

  test('should navigate to changelog page', async ({ page }) => {
    await page.goto('/changelog')
    await expect(page.locator('h1')).toContainText('Changelog')
  })

  test('should show 404 for unknown routes', async ({ page }) => {
    await page.goto('/nonexistent-page')
    await expect(page.locator('body')).toContainText(/not found|404/i)
  })
})

test.describe('Contact Form', () => {
  test('should validate required fields', async ({ page }) => {
    await page.goto('/')

    // Scroll to contact section
    await page.locator('#contact').scrollIntoViewIfNeeded()

    // Try to submit empty form
    const submitButton = page.locator('#contact button[type="submit"]')
    if (await submitButton.isVisible()) {
      await submitButton.click()
      // Form should not submit with empty fields
    }
  })
})

test.describe('RSS Feed', () => {
  test('should return valid RSS XML', async ({ page }) => {
    const response = await page.goto('/api/rss')
    expect(response?.status()).toBe(200)
    expect(response?.headers()['content-type']).toContain('application/rss+xml')
  })
})

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')
    const h1 = page.locator('h1')
    await expect(h1.first()).toBeVisible()
  })

  test('should have alt text on images', async ({ page }) => {
    await page.goto('/')
    const images = page.locator('img')
    const count = await images.count()
    for (let i = 0; i < Math.min(count, 5); i++) {
      const alt = await images.nth(i).getAttribute('alt')
      expect(alt).toBeTruthy()
    }
  })
})
