import { Page } from '@playwright/test'

const getLocators = (page: Page) => {
  return {
    homeLink: page.getByRole('link', { name: 'Home' }),
    signInLink: page.getByRole('link', { name: 'Sign in' }),
    signUpLink: page.getByRole('link', { name: 'Sign up' }),
    usernameLink: (username: string) =>
      page.getByRole('link', { name: username })
  }
}

export const buildHomePage = (page: Page) => ({
  locators: getLocators(page)
})

export type HomePage = ReturnType<typeof buildHomePage>
