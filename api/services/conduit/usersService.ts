import { expect } from 'fixtures/fixture'
import { logAPIErrorDetailsOnFailure } from 'core/api/apiLogger'

// Types
import { UserRequest } from 'api/types/conduit/UserRequest'
import { FluentRestClient } from 'core/api/types/FluentRestClient'
import { ResponseStatusCodes } from 'core/api/types/StatusCodes'

/**
 * Sends a login request to the API and validates the response.
 *
 * @template T - The expected response type.
 * @param client - The API client used to send the request.
 * @param request - The user login request payload.
 * @param expectedStatusCode - The expected HTTP status code (default: 200 OK).
 * @returns The parsed JSON response as type T.
 */
export const postLogin = async <T>(
  client: FluentRestClient,
  request: UserRequest,
  expectedStatusCode = ResponseStatusCodes.OK
) => {
  const response = await client
    .withUrl('/api/users/login')
    .withBody(request)
    .executePostAsync()

  await logAPIErrorDetailsOnFailure(response, expectedStatusCode, request)

  expect(response.status()).toEqual(expectedStatusCode)

  return response.json() as T
}

/**
 * Sends a request to create a new user and validates the response.
 *
 * @template T - The expected response type.
 * @param client - The API client used to send the request.
 * @param request - The user creation request payload.
 * @param expectedStatusCode - The expected HTTP status code (default: 201 Created).
 * @param shouldLogError - Whether to log API error details on failure (default: true).
 * @returns The parsed JSON response as type T.
 */
export const postUser = async <T>(
  client: FluentRestClient,
  request: UserRequest,
  expectedStatusCode = ResponseStatusCodes.Created,
  shouldLogError = true
) => {
  const response = await client
    .withUrl('/api/users')
    .withBody(request)
    .executePostAsync()

  if (shouldLogError) {
    await logAPIErrorDetailsOnFailure(response, expectedStatusCode, request)
  }

  expect(response.status()).toEqual(expectedStatusCode)

  return response.json() as T
}
