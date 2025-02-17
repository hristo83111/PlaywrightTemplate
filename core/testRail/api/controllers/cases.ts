import { expect } from '@playwright/test'
import { logAPIErrorDetailsOnFailure } from 'core/api/apiLogger'

// Types
import { FluentRestClient } from 'core/api/types/FluentRestClient'
import { ResponseStatusCodes } from 'core/api/types/StatusCodes'
import { GetCaseResponse } from 'core/testRail/api/types/GetCaseResponse'

// Enums
import { testRailConfig } from 'core/testRail/testRailConfig'

/**
 * Retrieves the cases for a specific test suite in a given project from TestRail.
 *
 * This method sends a GET request to the TestRail API endpoint to fetch the test cases for a suite
 * in the specified project. It performs the following:
 * - Constructs the URL with the provided `projectId` and `suiteId`.
 * - Executes the GET request using the `FluentRestClient`.
 * - Verifies that the response status code matches the expected status code (default is 200 OK).
 * - Logs API error details if the response status is not as expected.
 * - Returns the JSON response containing the list of test cases.
 *
 * @param client - The `FluentRestClient` used to send the request.
 * @param projectId - The ID of the project in TestRail.
 * @param suiteId - The ID of the test suite within the project.
 * @param expectedStatusCode - The expected HTTP status code (default is 200 OK).
 *
 * @returns Promise<GetCaseResponse[]> - A promise that resolves to an array of test cases.
 */
export const getCasesForSuite = async (
  client: FluentRestClient,
  projectId: number,
  suiteId: number,
  expectedStatusCode = ResponseStatusCodes.OK
) => {
  const response = await client
    .withUrl(
      `${testRailConfig.partialUrl}/get_cases/${projectId}&suite_id=${suiteId}`
    )
    .executeGetAsync()

  await logAPIErrorDetailsOnFailure(response, expectedStatusCode)

  expect(response.status()).toBe(expectedStatusCode)

  return response.json() as Promise<GetCaseResponse[]>
}
