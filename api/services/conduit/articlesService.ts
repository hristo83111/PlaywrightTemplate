import { expect } from 'fixtures/fixture'
import { logAPIErrorDetailsOnFailure } from 'core/api/apiLogger'

// Types
import { ArticleRequest } from 'api/types/conduit/ArticleRequest'
import { FluentRestClient } from 'core/api/types/FluentRestClient'
import { ResponseStatusCodes } from 'core/api/types/StatusCodes'

export const createArticleService = (client: FluentRestClient) => ({
  /**
   * Sends a request to create an article.
   * @param request The article request payload.
   * @param expectedStatusCode The expected response status code.
   * @returns The response body as the generic type T.
   */
  postArticle: async <T>(
    request: ArticleRequest,
    expectedStatusCode = ResponseStatusCodes.Created
  ) => {
    const response = await client
      .withUrl('/api/articles/')
      .withBody(request)
      .executePostAsync()

    await logAPIErrorDetailsOnFailure(response, expectedStatusCode, request)
    expect(response.status()).toEqual(expectedStatusCode)

    return response.json() as T
  },

  /**
   * Sends a request to retrieve an article by its ID.
   * @param articleId The ID of the article.
   * @param expectedStatusCode The expected response status code.
   * @returns The response body as the generic type T.
   */
  getArticle: async <T>(
    articleId: string,
    expectedStatusCode = ResponseStatusCodes.OK
  ) => {
    const response = await client
      .withUrl(`/api/articles/${articleId}`)
      .executeGetAsync()

    await logAPIErrorDetailsOnFailure(response, expectedStatusCode)
    expect(response.status()).toEqual(expectedStatusCode)

    return response.json() as T
  },

  /**
   * Sends a request to delete an article by its ID.
   * @param articleId The ID of the article.
   * @param expectedStatusCode The expected response status code.
   */
  deleteArticle: async (
    articleId: string,
    expectedStatusCode = ResponseStatusCodes.NoContent
  ) => {
    const response = await client
      .withUrl(`/api/articles/${articleId}`)
      .executeDeleteAsync()

    await logAPIErrorDetailsOnFailure(response, expectedStatusCode)
    expect(response.status()).toEqual(expectedStatusCode)
  },

  /**
   * Sends a request to retrieve all articles.
   * @param expectedStatusCode The expected response status code.
   * @returns The response body as the generic type T.
   */
  getAllArticles: async <T>(expectedStatusCode = ResponseStatusCodes.OK) => {
    const response = await client.withUrl('/api/articles').executeGetAsync()

    await logAPIErrorDetailsOnFailure(response, expectedStatusCode)
    expect(response.status()).toEqual(expectedStatusCode)

    return response.json() as T
  }
})
