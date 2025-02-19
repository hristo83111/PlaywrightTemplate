import { faker } from '@faker-js/faker'
import { constData } from 'testData/constData'

// Types
import { ArticleRequest } from 'api/types/conduit/ArticleRequest'
import { ArticleResponse } from 'api/types/conduit/ArticleResponse'
import { UserCredentials } from 'testData/types/UserCredentials'

/**
 * Creates an ArticleRequest object with default values.
 * If a title is provided, it will be used; otherwise, a random title is generated.
 *
 * @param {string} [title] - Optional title for the article.
 * @returns {ArticleRequest} - The generated ArticleRequest object.
 */
export const createArticleResquest = (title?: string): ArticleRequest => ({
  article: {
    title:
      title ?? `${constData.titleName} ${faker.number.int({ max: 1000000 })}`,
    description: 'Test description',
    body: 'Test body',
    tagList: ['Test tag']
  }
})

/**
 * Creates an ArticleResponse object based on the provided ArticleRequest and UserCredentials.
 * The ArticleResponse contains the article details along with the author's username.
 *
 * @param {ArticleRequest} articleRequest - The request containing article details.
 * @param {UserCredentials} userCredentials - The user credentials containing the author's information.
 * @returns {ArticleResponse} - The constructed ArticleResponse object.
 */
export const createArticleResponse = (
  articleRequest: ArticleRequest,
  userCredentials: UserCredentials
) => {
  const { title, description, body, tagList } = articleRequest.article

  const articleResponse: Partial<ArticleResponse> = {
    article: {
      title: title,
      description: description,
      body: body,
      tagList: tagList,
      author: {
        username: userCredentials.username!
      }
    }
  }

  return articleResponse
}
