import { expect } from '@playwright/test'
import { testRailConfig } from 'core/testRail/testRailConfig'
import { logAPIErrorDetailsOnFailure } from 'core/api/apiLogger'

// Types
import { FluentRestClient } from 'core/api/types/FluentRestClient'
import { AddResultForCaseRequest } from 'core/testRail/api/types/AddResultForCaseRequest'

// Enums
import { ResponseStatusCodes } from 'core/api/types/StatusCodes'

/**
 * Adds the result for a specific test case in a given test run on TestRail.
 *
 * This method sends a POST request to the TestRail API to add a result for a specific case in
 * the given test run. It performs the following steps:
 * - Constructs the API URL with the provided `runId` and `caseId`.
 * - Sets the body of the request with the provided `addResultForCaseRequest` data.
 * - Executes the POST request using the `FluentRestClient`.
 * - Logs API error details if the response status is not as expected.
 * - Verifies that the response status code matches the expected status code (default is 200 OK).
 *
 * @param client - The `FluentRestClient` used to send the request.
 * @param runId - The ID of the test run in TestRail.
 * @param caseId - The ID of the test case within the test run.
 * @param addResultForCaseRequest - The request body containing the result to be added for the test case.
 * @param expectedStatusCode - The expected HTTP status code (default is 200 OK).
 *
 * @returns void
 */
export const addResultForCase = async (
  client: FluentRestClient,
  runId: number,
  caseId: number,
  addResultForCaseRequest: AddResultForCaseRequest,
  expectedStatusCode = ResponseStatusCodes.OK
) => {
  const response = await client
    .withUrl(
      `${testRailConfig.partialUrl}/add_result_for_case/${runId}/${caseId}`
    )
    .withBody(addResultForCaseRequest)
    .executePostAsync()

  await logAPIErrorDetailsOnFailure(
    response,
    expectedStatusCode,
    addResultForCaseRequest
  )

  expect(response.status()).toBe(expectedStatusCode)
}

/**
 * Retrieves the results for a specific test case within a given test run.
 *
 * @param client - The fluent API client used to make the request.
 * @param runId - The ID of the test run.
 * @param caseId - The ID of the test case.
 * @param expectedStatusCode - The expected HTTP status code (default is 200 OK).
 * @returns An object containing the response and the parsed JSON body as the specified generic type.
 *
 * @throws {Error} - Throws an error if the HTTP response status code does not match the expected status code.
 *
 * @template T - The expected response type for the case result, ensuring that the response body is parsed correctly as the specified type.
 */
export const getResultForCase = async <T>(
  client: FluentRestClient,
  runId: number,
  caseId: number,
  expectedStatusCode = ResponseStatusCodes.OK
) => {
  const response = await client
    .withUrl(
      `${testRailConfig.partialUrl}/get_results_for_case/${runId}/${caseId}`
    )
    .executeGetAsync()

  await logAPIErrorDetailsOnFailure(response, expectedStatusCode)

  expect(response.status()).toBe(expectedStatusCode)

  const responseBodyAsJson = (await response.json()) as T

  return { response, responseBodyAsJson }
}
