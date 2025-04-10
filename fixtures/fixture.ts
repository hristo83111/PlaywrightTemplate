import { test as baseTest, expect } from '@playwright/test'
import { getSettings } from 'settings/settings'

// Pages
import { buildHomePage, HomePage } from 'pages/conduit/homePage'
import { buildLoginPage, LoginPage } from 'pages/conduit/loginPage'
import { buildRegisterPage, RegisterPage } from 'pages/conduit/registerPage'

type TestOptions = {
  homePage: HomePage
  loginPage: LoginPage
  registerPage: RegisterPage
}

export const test = baseTest.extend<TestOptions>({
  page: async ({ page }, use) => {
    await page.goto(getSettings().uiUrls.conduit)
    await use(page)
  },

  homePage: async ({ page }, use) => {
    await use(buildHomePage(page))
  },

  loginPage: async ({ page }, use) => {
    await use(buildLoginPage(page))
  },

  registerPage: async ({ page }, use) => {
    await use(buildRegisterPage(page))
  }
})

export { expect }
