import { Page, TestInfo } from '@playwright/test'
import { testRailConfig } from 'core/testRail/testRailConfig12'

// Clients
import { getTestRailClient } from 'core/testRail/api/testRailClient'

// Controllers
import { addRun } from 'core/testRail/api/controllers/runs'

// Utils
import {
  createAddRunRequest,
  getProjectIdByProjectKey,
  resolveTestRunId
} from 'core/testRail/utils/runUtils'
import {
  ensureCaseAddedToRun,
  getCaseIdsForTitle,
  isTestPassed,
  submitTestResult
} from 'core/testRail/utils/testUtils'

// Enums
import { Project } from 'core/testRail/enums/Project'
import { CaseFilterCondition } from 'core/testRail/enums/CaseFilterCondition'

const addTestResult = async (
  page: Page,
  testInfo: TestInfo,
  runId?: number
) => {
  const testRunId = resolveTestRunId(runId)
  const testRailClient = await getTestRailClient()
  const caseIds = getCaseIdsForTitle(testInfo.title)

  if (caseIds.length === 0) {
    console.warn('No case IDs found in the test title.')

    return
  }

  for (const caseId of caseIds) {
    await ensureCaseAddedToRun(testRailClient, testRunId, caseId)
    await submitTestResult(testRailClient, page, testInfo, testRunId, caseId)
  }
}

const shouldSkipTestExecution = async (testInfo: TestInfo, runId?: number) => {
  const testRunId = resolveTestRunId(runId)
  const testRailClient = await getTestRailClient()
  const caseIds = getCaseIdsForTitle(testInfo.title)

  if (caseIds.length === 0) {
    console.warn('No case IDs found in the test title.')

    return false
  }

  for (const caseId of caseIds) {
    if (await isTestPassed(testRailClient, testRunId, caseId)) {
      console.log(`Skipping test for Case ID: ${caseId}, already passed.`)

      return true
    }
  }

  return false
}

const addTestRun = async (
  project?: keyof typeof Project,
  caseFilterCondition?: CaseFilterCondition
) => {
  const projectKey = project || (testRailConfig.project as keyof typeof Project)

  if (!projectKey || !Object.keys(Project).includes(projectKey)) {
    throw new Error(
      `Invalid or missing project. Provide a valid project or set the TESTRAIL_PROJECT environment variable to one of: ${Object.keys(
        Project
      )
        .filter(key => isNaN(Number(key)))
        .join(', ')}`
    )
  }

  const condition =
    caseFilterCondition || (+testRailConfig.casesFilter! as CaseFilterCondition)

  if (!condition || !Object.values(CaseFilterCondition).includes(condition)) {
    const validFilterConditions = Object.entries(CaseFilterCondition)
      .map(([key, value]) => `${value} = ${key}`)
      .join(', ')

    throw new Error(
      `Invalid or missing cases filter. Provide a valid cases filter or set TESTRAIL_CASES_FILTER environment variable to one of: ${validFilterConditions}`
    )
  }

  const testRailClient = await getTestRailClient()
  const projectId = getProjectIdByProjectKey(projectKey)

  const addRunRequest = await createAddRunRequest(
    testRailClient,
    projectId,
    projectKey,
    condition
  )

  const addRunResponse = await addRun(testRailClient, projectId, addRunRequest)

  return addRunResponse.id.toString()
}

export const testRail = {
  addTestResult,
  shouldSkipTestExecution,
  addTestRun
}
