import { expect } from '@playwright/test'
import { logAPIErrorDetailsOnFailure } from 'core/api/apiLogger'

// Types

import { GetCaseResponse } from 'core/testRail/api/types/GetCaseResponse'
import { RestBuilder } from 'core/api/types/RestBuilder'

// Enums
import { testRailConfig } from 'core/testRail/testRailConfig12'
import { ResponseStatusCodes } from 'core/api/types/StatusCodes'

export const getCasesForSuite = async (
  client: RestBuilder,
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
