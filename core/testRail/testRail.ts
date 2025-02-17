import { Page, TestInfo } from '@playwright/test'
import { testRailConfig } from 'core/testRail/testRailConfig'

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

/**
 * Adds the test result to TestRail for the given test case(s).
 *
 * This function retrieves the test case IDs from the test title and submits the test result to TestRail.
 * If the test case is not yet included in the test run, it ensures that the case is added before submitting the result.
 *
 * - Resolves the test run ID.
 * - Retrieves the TestRail client.
 * - Extracts case IDs from the test title.
 * - Ensures each case is added to the test run if necessary.
 * - Submits the test result for each case.
 *
 * @param page - The Playwright `Page` instance, used to retrieve the latest test execution details.
 * @param testInfo - The test execution details, including the title from which case IDs are extracted.
 * @param runId - (Optional) The TestRail test run ID. If not provided, the function resolves it from configuration.
 * @returns A `Promise` that resolves when all test results are submitted.
 */
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

/**
 * Determines if a test should be skipped based on its execution status in TestRail.
 *
 * This function checks if the test cases associated with the given test title have already passed
 * in the specified test run. If any of the test cases has already passed, the function returns `true`,
 * indicating that the test should be skipped. If no test case IDs are found in the test title or
 * if none of the cases have passed, it returns `false`, indicating that the test should be executed.
 *
 * - The function retrieves the case IDs from the test title.
 * - It checks each case's status in the specified test run to determine if it has passed.
 * - If the test case has passed, it logs the Case ID and skips the execution.
 *
 * @param testInfo - The test information, including the title which is used to extract case IDs.
 * @param runId - The test run ID to check for the case statuses (optional). If not provided, the function uses the default run ID from configuration.
 * @returns A `Promise` that resolves to `true` if the test should be skipped (i.e., any of the test cases have passed), or `false` if the test should be executed.
 */
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

/**
 * Creates and adds a new test run in TestRail for a specified project, with an optional case filter condition.
 *
 * This function validates the provided project key and case filter condition. If any of the parameters are missing
 * or invalid, it throws an error with a detailed message. It retrieves the necessary configuration, constructs the
 * test run request, and submits the new test run to TestRail. The function returns the ID of the newly created test run.
 *
 * - If no project is provided, it defaults to the project defined in the configuration.
 * - If no case filter condition is provided, it defaults to the condition from the configuration.
 * - It checks whether the project key and case filter condition are valid before proceeding.
 *
 * @param project - The project key used to identify the project in TestRail (optional). If not provided, defaults to the project in the configuration.
 * @param caseFilterCondition - The condition used to filter the cases (optional). If not provided, defaults to the condition in the configuration.
 * @returns A `Promise` that resolves to the ID of the newly created test run.
 * @throws Error if the project key or case filter condition is invalid or missing.
 */
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
