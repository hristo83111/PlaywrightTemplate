import { test as baseTest, expect } from '@playwright/test'
import { buildLoginPage, LoginPage } from 'pages/conduit/loginPage'

type TestOptions = {
  loginPage: LoginPage
}

export const test = baseTest.extend<TestOptions>({
  loginPage: async ({ page }, use) => {
    await use(buildLoginPage(page))
  }
})

export { expect }
