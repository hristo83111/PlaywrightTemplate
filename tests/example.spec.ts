import { test, expect } from '@playwright/test'

test('has title', { tag: ['@regression', '@smoke'] }, async ({ page }) => {
  await page.goto('https://playwright.dev/')

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/)
  console.log(process.env.ENVIRONMENT)
})

test('get started link', { tag: ['@regression'] }, async ({ page }) => {
  await page.goto('https://playwright.dev/')

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click()

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole('heading', { name: 'Installation' })
  ).toBeVisible()
})
