import { test, expect } from '@playwright/test'

test.describe('Portfolio Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('loads the redesigned professional profile', async ({ page }) => {
    await expect(page).toHaveTitle(/Emmanuel Inambao/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Emmanuel')
    await expect(page.getByText('Systems Engineer').first()).toBeVisible()
    await expect(page.getByText('AI • IoT • ROBOTICS')).toBeVisible()
  })

  test('has working primary navigation links', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Primary navigation' })
    await expect(nav).toBeVisible()

    for (const label of ['About', 'Projects', 'Experience', 'Skills', 'Contact']) {
      await expect(nav.getByRole('link', { name: label, exact: true })).toBeVisible()
    }
  })

  test('toggles the mobile menu and closes with Escape', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 })

    const menuButton = page.getByRole('button', { name: 'Open menu' })
    await expect(menuButton).toBeVisible()
    await menuButton.click()

    const mobileMenu = page.locator('#mobile-menu')
    await expect(mobileMenu).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(mobileMenu).toBeHidden()
  })

  test('exposes the requested project filters and projects', async ({ page }) => {
    await page.locator('#projects').scrollIntoViewIfNeeded()

    for (const filter of [
      'All',
      'AI',
      'IoT',
      'Robotics',
      'Mobile',
      'Embedded Systems',
      'Full-Stack',
    ]) {
      await expect(page.getByRole('button', { name: filter, exact: true })).toBeVisible()
    }

    await expect(page.getByRole('heading', { name: 'Denuel One Pro AI X' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Smart Walking Stick' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Cooking Oil Dispenser' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Quotation Management System' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Livestock Collar Tracker' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Robotics and Embedded Systems' })).toBeVisible()
  })

  test('filters projects without removing accessible project text', async ({ page }) => {
    await page.locator('#projects').scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: 'Robotics', exact: true }).click()

    await expect(page.getByRole('heading', { name: 'Robotics and Embedded Systems' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Denuel One Pro AI X' })).toHaveCount(0)
  })

  test('opens and closes a project case study modal with the keyboard', async ({ page }) => {
    await page.locator('#projects').scrollIntoViewIfNeeded()

    const firstProject = page.locator('#projects article').first()
    await firstProject.getByRole('button', { name: 'View Case Study' }).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('heading', { name: 'Denuel One Pro AI X' })).toBeVisible()
    await expect(dialog.getByText('Current status')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })

  test('has SEO metadata and skip navigation', async ({ page }) => {
    const description = page.locator('meta[name="description"]')
    await expect(description).toHaveAttribute('content', /Systems Engineer/)
    await expect(page.locator('a[href="#main-content"]')).toHaveCount(1)
  })
})

test.describe('Public Routes', () => {
  test('navigates to blog page', async ({ page }) => {
    await page.goto('/blog')
    await expect(page).toHaveTitle(/Blog/)
  })

  test('navigates to case studies page', async ({ page }) => {
    await page.goto('/case-studies')
    await expect(page).toHaveTitle(/Case Studies/)
    await expect(page.getByRole('heading', { name: 'Case Studies', level: 1 })).toBeVisible()
  })

  test('renders a direct case study route', async ({ page }) => {
    await page.goto('/case-studies/cooking-oil-dispenser')
    await expect(page).toHaveTitle(/Cooking Oil Dispenser/)
    await expect(page.getByRole('heading', { name: 'Cooking Oil Dispenser', level: 1 })).toBeVisible()
    await expect(page.getByText('Working prototype / active product development.')).toBeVisible()
  })

  test('navigates to resume page', async ({ page }) => {
    await page.goto('/resume')
    await expect(page.locator('h1')).toContainText('Emmanuel Inambao')
  })

  test('navigates to changelog page', async ({ page }) => {
    await page.goto('/changelog')
    await expect(page.locator('h1')).toContainText('Changelog')
  })

  test('shows 404 for unknown routes', async ({ page }) => {
    await page.goto('/nonexistent-page')
    await expect(page.locator('body')).toContainText(/not found|404/i)
  })
})

test.describe('Contact Form', () => {
  test('contains required project enquiry fields', async ({ page }) => {
    await page.goto('/')
    await page.locator('#contact').scrollIntoViewIfNeeded()

    await expect(page.locator('#contact-name')).toBeVisible()
    await expect(page.locator('#contact-email')).toBeVisible()
    await expect(page.locator('#contact-project-type')).toBeVisible()
    await expect(page.locator('#contact-budget')).toBeVisible()
    await expect(page.locator('#contact-message')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Submit Project Enquiry' })).toBeVisible()
    await expect(page.getByText(/Written communication is preferred/i)).toBeVisible()
  })

  test('uses native validation for required fields', async ({ page }) => {
    await page.goto('/')
    await page.locator('#contact').scrollIntoViewIfNeeded()

    await page.getByRole('button', { name: 'Submit Project Enquiry' }).click()

    const nameValidity = await page.locator('#contact-name').evaluate(
      (input: HTMLInputElement) => input.validity.valueMissing,
    )
    expect(nameValidity).toBe(true)
  })
})

test.describe('RSS Feed', () => {
  test('returns valid RSS XML', async ({ page }) => {
    const response = await page.goto('/api/rss')
    expect(response?.status()).toBe(200)
    expect(response?.headers()['content-type']).toContain('application/rss+xml')
  })
})

test.describe('Accessibility', () => {
  test('has one visible primary heading on the homepage', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
  })

  test('provides alt text for rendered images', async ({ page }) => {
    await page.goto('/')
    const images = page.locator('img')
    const count = await images.count()

    for (let index = 0; index < Math.min(count, 8); index += 1) {
      const alt = await images.nth(index).getAttribute('alt')
      expect(alt).toBeTruthy()
    }
  })
})
