import { Page, TestInfo } from '@playwright/test'

// Controllers
import {
  addResultForCase,
  getResultForCase
} from 'core/testRail/api/controllers/results'
import { getTestsForRun } from 'core/testRail/api/controllers/tests'
import { updateRun } from 'core/testRail/api/controllers/runs'

// Utils
import {
  formatDuration,
  formatTestInfoError
} from 'core/testRail/utils/formatUtils'

// Types
import { RestBuilder } from 'core/api/types/RestBuilder'
import { ErrorResponse } from 'core/testRail/api/types/ErrorResponse'
import { AddResultForCaseRequest } from 'core/testRail/api/types/AddResultForCaseRequest'
import { GetResultForCase } from 'core/testRail/api/types/GetResultsForCase'

// Enums
import { TestCaseStatusId } from 'core/testRail/enums/TestCaseStatusId'
import { ResponseStatusCodes } from 'core/api/types/StatusCodes'

const shouldCaseBeAddedToRun = async (
  client: RestBuilder,
  runId: number,
  caseId: number
) => {
  const noActiveTestCase =
    'No (active) test found for the run/case combination.'
  const { response, responseBodyAsJson } = await getResultForCase(
    client,
    runId,
    caseId
  )

  if (response.status() === ResponseStatusCodes.OK) {
    return false
  }

  if (
    response.status() === ResponseStatusCodes.BadRequest &&
    (responseBodyAsJson as ErrorResponse).error === noActiveTestCase
  ) {
    return true
  }

  throw new Error(
    `Unexpected error while checking test case ${caseId}: ${JSON.stringify(
      responseBodyAsJson
    )}`
  )
}

const getLatestTestResult = (results: GetResultForCase[]) =>
  results.reduce((prev, curr) => (curr.id > prev.id ? curr : prev))

export const isTestPassed = async (
  client: RestBuilder,
  testRunId: number,
  caseId: number
) => {
  const { responseBodyAsJson, response } = await getResultForCase(
    client,
    testRunId,
    caseId
  )

  if (!response.ok()) {
    console.warn(`Failed to fetch results for Case ID: ${caseId}`)

    return false
  }

  const results = responseBodyAsJson as GetResultForCase[]

  if (results.length === 0) return false

  const latestResult = getLatestTestResult(results)

  return latestResult.status_id === TestCaseStatusId.AutomationPassed
}

export const getTestStatus = (testInfo: TestInfo) => {
  switch (testInfo.status) {
    case 'skipped':
      return TestCaseStatusId.Skipped

    case 'passed':
      return TestCaseStatusId.AutomationPassed

    case 'failed':
    case 'timedOut':
    case 'interrupted':
      return TestCaseStatusId.AutomationFailed

    default:
      throw Error(`No such status: ${testInfo.status}`)
  }
}

export const getTestInfo = (page: Page, testInfo: TestInfo, caseId: number) => {
  const { title, titlePath, status, retry, project, duration, errors } =
    testInfo

  const specFile = titlePath.toString().split(',')[0]

  return [
    `Test Case: C${caseId}`,
    `Title: ${title}`,
    `Spec file: ${specFile}`,
    `Status: ${status}`,
    `Attempt: ${retry + 1}`,
    `Project: ${project.name}`,
    `Environment: ${process.env.MC_ENV ?? 'QB'}`,
    `Most recent URL: ${page.url()}`,
    `Duration: ${formatDuration(duration)}`,
    `Playwright Test 🎭`,
    `${formatTestInfoError(errors)}`
  ]
    .filter(Boolean)
    .join('\n')
}

export const getCaseIdsForRun = async (client: RestBuilder, runId: number) => {
  const caseIds = await getTestsForRun(client, runId).then(
    result => result?.map(test => test.case_id) ?? []
  )

  return caseIds
}

// (?<=@C): Ensures that \d+ (digits) are preceded by @C explicitly, so it won't match AC01
export const getCaseIdsForTitle = (title: string): number[] =>
  (title.match(/(?<=@C)\d+/g) || []).map(Number)

export const ensureCaseAddedToRun = async (
  client: RestBuilder,
  testRunId: number,
  caseId: number
): Promise<void> => {
  const shouldCaseBeAdded = await shouldCaseBeAddedToRun(
    client,
    testRunId,
    caseId
  )

  if (shouldCaseBeAdded) {
    const runCaseIds = await getCaseIdsForRun(client, testRunId)
    runCaseIds.push(caseId)

    await updateRun(client, testRunId, {
      include_all: false,
      case_ids: runCaseIds
    })
  }
}

export const submitTestResult = async (
  client: RestBuilder,
  page: Page,
  testInfo: TestInfo,
  testRunId: number,
  caseId: number
): Promise<void> => {
  const adResultForCaseRequest: AddResultForCaseRequest = {
    status_id: getTestStatus(testInfo),
    comment: getTestInfo(page, testInfo, caseId)
  }

  await addResultForCase(client, testRunId, caseId, adResultForCaseRequest)
}
