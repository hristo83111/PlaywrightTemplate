import { expect } from '@playwright/test'
import { testRailConfig } from 'core/testRail/testRailConfig12'
import { logAPIErrorDetailsOnFailure } from 'core/api/apiLogger'

// Types
import { RestBuilder } from 'core/api/types/RestBuilder'
import { GetTestResponse } from 'core/testRail/api/types/GetTestResponse'

// Enums
import { ResponseStatusCodes } from 'core/api/types/StatusCodes'

export const getTestsForRun = async (
  client: RestBuilder,
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
