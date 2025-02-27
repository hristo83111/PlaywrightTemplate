import { Page } from '@playwright/test'

// Utils
import { step } from 'core/utils/step'

// Types
import { UserCredentials } from 'testData/types/UserCredentials'

const getLocators = (page: Page) => {
  return {
    usernameTextbox: page.getByRole('textbox', { name: 'Username' }),
    emailTextbox: page.getByRole('textbox', { name: 'Email' }),
    passwordTextbox: page.getByRole('textbox', { name: 'Password' }),
    signUpButton: page.getByRole('button', { name: 'Sign up' })
  }
}

const getActions = (page: Page) => {
  const locators = getLocators(page)

  const register = async (userCredentials: UserCredentials) => {
    await step('Seccessful registration', async () => {
      const { username, email, password } = userCredentials

      await locators.usernameTextbox.fill(username!)
      await locators.emailTextbox.fill(email)
      await locators.passwordTextbox.fill(password)
      await locators.signUpButton.click()
    })
  }

  return {
    register
  }
}

export const buildRegisterPage = (page: Page) => ({
  locators: getLocators(page),
  actions: getActions(page)
})

export type RegisterPage = ReturnType<typeof buildRegisterPage>
