import { expect } from '@playwright/test'
import { testRailConfig } from 'core/testRail/testRailConfig12'
import { logAPIErrorDetailsOnFailure } from 'core/api/apiLogger'

// Types

import { AddResultForCaseRequest } from 'core/testRail/api/types/AddResultForCaseRequest'
import { RestBuilder } from 'core/api/types/RestBuilder'

// Enums
import { ResponseStatusCodes } from 'core/api/types/StatusCodes'

export const addResultForCase = async (
  client: RestBuilder,
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

export const getResultForCase = async <T>(
  client: RestBuilder,
  runId: number,
  caseId: number
) => {
  const response = await client
    .withUrl(
      `${testRailConfig.partialUrl}/get_results_for_case/${runId}/${caseId}`
    )
    .executeGetAsync()

  const responseBodyAsJson = (await response.json()) as T

  return { response, responseBodyAsJson }
}
