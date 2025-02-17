import { expect } from '@playwright/test'
import { testRailConfig } from 'core/testRail/testRailConfig'
import { logAPIErrorDetailsOnFailure } from 'core/api/apiLogger'

// Types
import { FluentRestClient } from 'core/api/types/FluentRestClient'
import { GetTestResponse } from 'core/testRail/api/types/GetTestResponse'

// Enums
import { ResponseStatusCodes } from 'core/api/types/StatusCodes'

/**
 * Retrieves the tests associated with a specific test run.
 *
 * @param client - The fluent API client used to make the request.
 * @param runId - The ID of the test run for which to retrieve the tests.
 * @param expectedStatusCode - The expected HTTP status code (default is 200 OK).
 * @returns A promise that resolves to an array of test responses (`GetTestResponse[]`).
 *
 * @throws {Error} - Throws an error if the HTTP response status code does not match the expected status code.
 *
 * This function performs a GET request to retrieve tests related to a given test run,
 * checks that the response status matches the expected status code, and logs error details if the status code does not match.
 */
export const getTestsForRun = async (
  client: FluentRestClient,
  runId: number,
  expectedStatusCode = ResponseStatusCodes.OK
) => {
  const response = await client
    .withUrl(`${testRailConfig.partialUrl}/get_tests/${runId}`)
    .executeGetAsync()

  await logAPIErrorDetailsOnFailure(response, expectedStatusCode)

  expect(response.status()).toBe(expectedStatusCode)

  return response.json() as Promise<GetTestResponse[]>
}
