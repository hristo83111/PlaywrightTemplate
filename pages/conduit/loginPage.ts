import { Page } from '@playwright/test'

// Utils
import { step } from 'core/utils/step'

// Types
import { UserCredentials } from 'testData/types/UserCredentials'

const getLocators = (page: Page) => {
  return {
    emailTextbox: page.getByRole('textbox', { name: 'Email' }),
    passwordTextbox: page.getByRole('textbox', { name: 'Password' }),
    signInButton: page.getByRole('button', { name: 'Sign in' })
  }
}

const getActions = (page: Page) => {
  const locators = getLocators(page)

  const login = async (userCredentials: UserCredentials) => {
    await step('Successful login', async () => {
      const { email, password } = userCredentials

      await locators.emailTextbox.fill(email)
      await locators.passwordTextbox.fill(password)
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
