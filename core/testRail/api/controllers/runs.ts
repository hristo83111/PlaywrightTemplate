import { expect } from '@playwright/test'
import { testRailConfig } from 'core/testRail/testRailConfig12'
import { logAPIErrorDetailsOnFailure } from 'core/api/apiLogger'

// Types
import { RestBuilder } from 'core/api/types/RestBuilder'
import { UpdateRunRequest } from 'core/testRail/api/types/UpdateRunRequest'
import { AddRunRequest } from 'core/testRail/api/types/AddRunRequest'
import { AddRunResponse } from 'core/testRail/api/types/AddRunResponse'

// Enums
import { ResponseStatusCodes } from 'core/api/types/StatusCodes'

export const updateRun = async (
  client: RestBuilder,
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

export const addRun = async (
  client: RestBuilder,
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
