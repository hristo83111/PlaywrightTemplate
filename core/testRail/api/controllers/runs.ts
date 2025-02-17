import { expect } from '@playwright/test'
import { testRailConfig } from 'core/testRail/testRailConfig'
import { logAPIErrorDetailsOnFailure } from 'core/api/apiLogger'

// Types
import { FluentRestClient } from 'core/api/types/FluentRestClient'
import { UpdateRunRequest } from 'core/testRail/api/types/UpdateRunRequest'
import { AddRunRequest } from 'core/testRail/api/types/AddRunRequest'
import { AddRunResponse } from 'core/testRail/api/types/AddRunResponse'

// Enums
import { ResponseStatusCodes } from 'core/api/types/StatusCodes'

/**
 * Updates a test run in TestRail with the provided data.
 *
 * This method sends a POST request to the TestRail API to update a specific test run with the
 * provided `updateRunRequest` data. It performs the following steps:
 * - Constructs the API URL with the provided `runId`.
 * - Sets the request body to the provided `updateRunRequest`.
 * - Executes the POST request using the `FluentRestClient`.
 * - Logs API error details if the response status is not as expected.
 * - Verifies that the response status code matches the expected status code (default is 200 OK).
 *
 * @param client - The `FluentRestClient` used to send the request.
 * @param runId - The ID of the test run to be updated.
 * @param updateRunRequest - The request body containing the data to update the test run.
 * @param expectedStatusCode - The expected HTTP status code (default is 200 OK).
 *
 * @returns void
 */
export const updateRun = async (
  client: FluentRestClient,
  runId: number,
  updateRunRequest: UpdateRunRequest,
  expectedStatusCode = ResponseStatusCodes.OK
) => {
  const response = await client
    .withUrl(`${testRailConfig.partialUrl}/update_run/${runId}`)
    .withBody(updateRunRequest)
    .executePostAsync()

  await logAPIErrorDetailsOnFailure(
    response,
    expectedStatusCode,
    updateRunRequest
  )

  expect(response.status()).toBe(expectedStatusCode)
}

/**
 * Adds a new test run to a project in TestRail.
 *
 * This method sends a POST request to the TestRail API to add a new test run to the specified project
 * with the provided `addRunRequest` data. It performs the following steps:
 * - Constructs the API URL with the provided `projectId`.
 * - Sets the request body to the provided `addRunRequest`.
 * - Executes the POST request using the `FluentRestClient`.
 * - Logs API error details if the response status is not as expected.
 * - Verifies that the response status code matches the expected status code (default is 200 OK).
 * - Returns the parsed response body as a `Promise<AddRunResponse>`.
 *
 * @param client - The `FluentRestClient` used to send the request.
 * @param projectId - The ID of the project to which the test run will be added.
 * @param addRunRequest - The request body containing the data to create the test run.
 * @param expectedStatusCode - The expected HTTP status code (default is 200 OK).
 *
 * @returns A promise that resolves to the parsed response body of type `AddRunResponse`.
 */
export const addRun = async (
  client: FluentRestClient,
  projectId: number,
  addRunRequest: AddRunRequest,
  expectedStatusCode = ResponseStatusCodes.OK
) => {
  const response = await client
    .withUrl(`${testRailConfig.partialUrl}/add_run/${projectId}`)
    .withBody(addRunRequest)
    .executePostAsync()

  await logAPIErrorDetailsOnFailure(response, expectedStatusCode, addRunRequest)

  expect(response.status()).toBe(expectedStatusCode)

  return response.json() as Promise<AddRunResponse>
}
