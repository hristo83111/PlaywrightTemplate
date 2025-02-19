import { expect, test } from 'fixtures/fixture'
import { users } from 'testData/users'

// Clients
import { getConduitClient } from 'api/clients/conduitClient'

// Services
import { createArticleService } from 'api/services/conduit/articlesService'

// Factories
import {
  createArticleResponse,
  createArticleResquest
} from 'api/factories/conduit/articleFactory'

// Utils
import { step } from 'core/utils/step'

// Types
import { ArticleResponse } from 'api/types/conduit/ArticleResponse'

test.describe('POST article ', () => {
  const articleTestData = [
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
      `201 Created - with all required properties ${testTitle}`,
      { tag: ['@regression'] },
      async () => {
        // Arrange
        const conduitClient = await getConduitClient(userCredentials)
        const articleService = createArticleService(conduitClient)
        const articleRequest = createArticleResquest()
        const expectedArticleResponse = createArticleResponse(
          articleRequest,
          userCredentials
        )

        const actualArticleResponse = await step(
          'Successful article creation',
          async () =>
            articleService.postArticle<ArticleResponse>(articleRequest)
        )

        await step('Assert article response 201', async () =>
          expect(actualArticleResponse).toMatchObject(expectedArticleResponse)
        )
      }
    )
  })
})
