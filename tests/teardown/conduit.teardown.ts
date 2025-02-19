import { test as teardown } from 'fixtures/fixture'
import { users } from 'testData/users'
import { constData } from 'testData/constData'

// Clients
import { getConduitClient } from 'api/clients/conduitClient'

// Services
import { createArticleService } from 'api/services/conduit/articlesService'

// Types
import { ArticlesResponse } from 'api/types/conduit/ArticlesResponse'
import { step } from 'core/utils/step'

teardown('Delete data', async () => {
  for (const user in users) {
    // Arrange
    const userCredentials = users[user]
    const conduitClient = await getConduitClient(userCredentials)
    const articleService = createArticleService(conduitClient)

    const articlesResponse = await step('Get all articles', async () =>
      articleService.getAllArticles<ArticlesResponse>()
    )

    await step(
      `Delete all articles with title ${constData.titleName}`,
      async () => {
        for (const article of articlesResponse.articles) {
          if (article.title.includes(constData.titleName)) {
            await articleService.deleteArticle(article.slug!)
          }
        }
      }
    )
  }
})
