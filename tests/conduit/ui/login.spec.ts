import { expect, test } from 'fixtures/fixture'
import { users } from 'testData/users'
import { CommonTestData } from 'tests/types/CommonTestData'

test.describe('Susseccful login ', () => {
  const articleTestData: CommonTestData[] = [
    {
      userCredentials: users.uk,
      testTitle: 'UK @C1111'
    },
    {
      userCredentials: users.us,
      testTitle: 'US @C2222'
    }
  ]

  articleTestData.forEach(({ userCredentials, testTitle }) => {
    test(
      `with ${testTitle}`,
      { tag: ['@regression'] },
      async ({ homePage, loginPage }) => {
        await homePage.locators.signInLink.click()
        await loginPage.actions.login(userCredentials)

        await expect(
          homePage.locators.usernameLink(userCredentials.username!)
        ).toBeVisible()
      }
    )
  })
})
