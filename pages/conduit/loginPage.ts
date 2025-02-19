import { Page } from '@playwright/test'

// Utils
import { step } from 'core/utils/step'

// Types
import { UserCredentials } from 'testData/types/UserCredentials'

const getLocators = (page: Page) => {
  return {
    emailInput: page.getByRole('textbox', { name: 'Email' }),
    passwordInput: page.getByRole('textbox', { name: 'Password' }),
    signInButton: page.getByRole('button', { name: 'Sign in' })
  }
}

const getActions = (page: Page) => {
  const locators = getLocators(page)

  const login = async (userCredentials: UserCredentials) => {
    await step('Login successfully', async () => {
      const { email, password } = userCredentials

      await locators.emailInput.fill(email)
      await locators.passwordInput.fill(password)
      await locators.signInButton.click()
    })
  }

  return {
    login
  }
}

export const buildLoginPage = (page: Page) => ({
  locators: getLocators(page),
  actions: getActions(page)
})

export type LoginPage = ReturnType<typeof buildLoginPage>
