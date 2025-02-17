import { APIRequestContext, request } from '@playwright/test'
import { ReadStream } from 'fs'

// Types
import { APIRequest } from 'core/api/types/APIRequest'
import { HttpCredentials } from 'core/api/types/HttpCredentials'
import { AuthenticationParams } from 'core/api/types/AuthenticationParams'
import { FluentRestClient } from 'core/api/types/FluentRestClient'

/**
 * Creates a new REST client configured with the provided base URL and optional authentication parameters.
 *
 * This function initializes a new client context, sets authentication (if needed), and provides a fluent interface for building and executing HTTP requests.
 *
 * @param baseUrl - The base URL to be used for all requests made by this client.
 *
 * @returns A promise that resolves to an instance of `FluentRestClient`, which can be used to build requests using fluent chain methods.
 *
 * The returned `FluentRestClient` offers methods for:
 * - Adding authorization headers or authentication credentials
 * - Setting the URL, request headers, query parameters, form data, request body, or multipart data for a request
 * - Executing HTTP requests (GET, POST, PUT, PATCH, DELETE) asynchronously
 *
 * The client supports both authenticated and unauthenticated requests, based on the provided authentication parameters.
 *
 * @example
 * const client = await createClient('https://api.example.com')
 * const response = await client
 *   .withAuthorizationHeader('Bearer my-jwt-token')
 *   .withUrl('/endpoint')
 *   .withBody({ key: 'value' })
 *   .executePostAsync()
 */
export const createClient = async (
  baseUrl: string
): Promise<FluentRestClient> => {
  let authenticationParams: AuthenticationParams = {}
  let client: APIRequestContext
  let initialRequestState: APIRequest

  const initializeClient = async () => {
    client = await request.newContext({
      baseURL: baseUrl,
      ignoreHTTPSErrors: true,
      extraHTTPHeaders: authenticationParams.extraHTTPHeaders,
      httpCredentials: authenticationParams.httpCredentials
    })
  }

  const createInitialRequestState = () => {
    initialRequestState = { url: '', options: { timeout: 90000 } }
  }

  const setAuthentication = async (params: AuthenticationParams = {}) => {
    authenticationParams = params
    await initializeClient()
  }

  await initializeClient()

  const restClient: FluentRestClient = {
    withoutAuthentication: async () => {
      await setAuthentication({})
      return restClient
    },

    withAuthorizationHeader: async (authorizationValue: string) => {
      await setAuthentication({
        extraHTTPHeaders: { Authorization: authorizationValue }
      })
      return restClient
    },

    withBaseAuthentication: async (credentials: HttpCredentials) => {
      await setAuthentication({ httpCredentials: credentials })
      return restClient
    },

    withUrl: (url: string) => {
      createInitialRequestState()
      initialRequestState.url = url
      return restClient
    },

    withRequestHeaders: (headers: Record<string, string>) => {
      initialRequestState.options.headers = {
        ...initialRequestState.options.headers,
        ...headers
      }
      return restClient
    },

    withParams: (params: Record<string, string | number | boolean>) => {
      initialRequestState.options.params = params
      return restClient
    },

    withForm: (form: Record<string, string | number | boolean>) => {
      initialRequestState.options.form = form
      return restClient
    },

    withBody: (body: unknown) => {
      initialRequestState.options.data = body
      return restClient
    },

    withMultiPart: (
      multipart: Record<
        string,
        | string
        | number
        | boolean
        | ReadStream
        | { name: string; mimeType: string; buffer: Buffer }
      >
    ) => {
      initialRequestState.options.multipart = multipart
      return restClient
    },

    executeGetAsync: async () =>
      await client.get(initialRequestState.url, initialRequestState.options),

    executePostAsync: async () =>
      await client.post(initialRequestState.url, initialRequestState.options),

    executePutAsync: async () =>
      await client.put(initialRequestState.url, initialRequestState.options),

    executePatchAsync: async () =>
      await client.patch(initialRequestState.url, initialRequestState.options),

    executeDeleteAsync: async () =>
      await client.delete(initialRequestState.url, initialRequestState.options)
  }

  return restClient
}
