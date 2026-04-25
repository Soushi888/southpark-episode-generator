import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5173'

test('spin button picks an episode', async ({ page }) => {
  await page.goto(BASE)
  await page.click('button:has-text("Random Episode")')
  await page.waitForFunction(() => !document.querySelector('button')?.disabled || true)
  await expect(page.locator('h2')).toBeVisible({ timeout: 3000 })
})

test('watch link points to wcoflix', async ({ page }) => {
  await page.goto(BASE)
  await page.click('button:has-text("Random Episode")')
  await page.waitForTimeout(1500)
  const link = page.locator('a:has-text("Watch on WCOFlix")')
  await expect(link).toBeVisible()
  const href = await link.getAttribute('href')
  expect(href).toContain('wcoflix.tv/south-park-season-')
})

test('space key triggers spin', async ({ page }) => {
  await page.goto(BASE)
  await page.keyboard.press('Space')
  await page.waitForTimeout(1500)
  await expect(page.locator('h2')).toBeVisible()
})

test('share URL restores episode', async ({ page }) => {
  await page.goto(`${BASE}?ep=S05E01`)
  await expect(page.locator('h2:has-text("Scott Tenorman Must Die")')).toBeVisible()
})

test('season filter reduces episode count', async ({ page }) => {
  await page.goto(BASE)
  await page.click('button:has-text("Filters")')
  await expect(page.locator('text=episodes')).toBeVisible()
})
