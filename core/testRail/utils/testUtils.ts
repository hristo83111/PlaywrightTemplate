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
import { FluentRestClient } from 'core/api/types/FluentRestClient'
import { ResponseStatusCodes } from 'core/api/types/StatusCodes'
import { ErrorResponse } from 'core/testRail/api/types/ErrorResponse'
import { AddResultForCaseRequest } from 'core/testRail/api/types/AddResultForCaseRequest'
import { GetResultForCase } from 'core/testRail/api/types/GetResultsForCase'

// Enums
import { TestCaseStatusId } from 'core/testRail/enums/TestCaseStatusId'

/**
 * Determines if a test case should be added to the run based on the result of an API request.
 *
 * This function checks whether the specified test case has an active test in the given test run.
 * If no active test is found, the test case is eligible to be added to the run.
 * The function considers the response from `getResultForCase` to determine the case status and decides whether to include it.
 *
 * @param client - The `FluentRestClient` instance used to make API requests.
 * @param runId - The ID of the test run to check the case against.
 * @param caseId - The ID of the test case to be checked.
 * @returns A `Promise` that resolves to `true` if the case should be added to the run, or `false` if it should not.
 * @throws If an unexpected error occurs while checking the test case.
 */
const shouldCaseBeAddedToRun = async (
  client: FluentRestClient,
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

/**
 * Retrieves the latest test result based on the highest ID from a list of test results.
 *
 * This function uses the `reduce` method to iterate over the array of `GetResultForCase` objects,
 * comparing their `id` fields to find the most recent test result, which is identified by the highest ID.
 *
 * @param results - An array of `GetResultForCase` objects containing test results.
 * @returns The latest `GetResultForCase` object based on the highest `id`.
 */
const getLatestTestResult = (results: GetResultForCase[]) =>
  results.reduce((prev, curr) => (curr.id > prev.id ? curr : prev))

/**
 * Maps the status of a test run to a corresponding TestCaseStatusId.
 *
 * This function takes the status from the provided `testInfo` object and converts it into a numeric
 * TestCaseStatusId. It handles statuses such as 'skipped', 'passed', and various failure conditions.
 * If the status is not recognized, an error is thrown.
 *
 * @param testInfo - An object containing details about the test, including its status.
 * @returns The corresponding TestCaseStatusId based on the test's status.
 * @throws Error - If the status is unrecognized.
 */
const getTestStatus = (testInfo: TestInfo) => {
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

/**
 * Generates a formatted string containing detailed information about a test run.
 *
 * This function takes the test information and constructs a summary that includes key details
 * like the test case ID, test title, spec file, test status, retry count, project name, environment,
 * the most recent URL, and the duration of the test. It also formats any errors that occurred during the test.
 *
 * @param page - The Playwright page object, used to retrieve the most recent URL for the test.
 * @param testInfo - An object containing details about the test run (e.g., title, status, duration, etc.).
 * @param caseId - The unique ID of the test case being executed.
 * @returns A string containing formatted test information.
 */
const getTestInfo = (page: Page, testInfo: TestInfo, caseId: number) => {
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
    `Environment: ${process.env.ENVIRONMENT ?? 'QA'}`,
    `Most recent URL: ${page.url()}`,
    `Duration: ${formatDuration(duration)}`,
    `Playwright Test 🎭`,
    `${formatTestInfoError(errors)}`
  ]
    .filter(Boolean)
    .join('\n')
}

/**
 * Fetches the list of case IDs associated with a specific test run.
 *
 * This function retrieves the test cases for the given test run ID using the `getTestsForRun` function
 * and extracts the `case_id` from the results. If no cases are found, an empty array is returned.
 *
 * @param client - The FluentRestClient instance used for making API requests.
 * @param runId - The ID of the test run to retrieve the case IDs for.
 * @returns A promise that resolves to an array of case IDs.
 */
const getCaseIdsForRun = async (client: FluentRestClient, runId: number) => {
  const caseIds = await getTestsForRun(client, runId).then(
    result => result?.map(test => test.case_id) ?? []
  )

  return caseIds
}

/**
 * Checks if a specific test case has passed in a given test run.
 *
 * This function fetches the test results for a specific test case in a given test run,
 * and determines whether the latest result indicates the test case passed or not.
 * It considers a test passed if the latest result's `status_id` is equal to `TestCaseStatusId.AutomationPassed`.
 *
 * If the request to fetch the test results fails or if no results are found, it returns `false`.
 *
 * @param client - The FluentRestClient instance used to make the request.
 * @param testRunId - The ID of the test run to check the test case result for.
 * @param caseId - The ID of the test case whose result needs to be checked.
 *
 * @returns A boolean indicating whether the test case passed (`true`) or not (`false`).
 *
 * @example
 * const isPassed = await isTestPassed(client, 12345, 67890);
 * console.log(isPassed); // Logs true if the test passed, false otherwise.
 */
export const isTestPassed = async (
  client: FluentRestClient,
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

/**
 * Extracts test case IDs from a given title string.
 *
 * This function searches for substrings in the title that follow the pattern `@C` and are followed by one or more digits.
 * It returns an array of numbers representing the extracted test case IDs.
 * The regular expression ensures that the `@C` is explicitly before the digits, preventing it from matching cases like `AC01`.
 *
 * @param title - The title string containing the case IDs preceded by `@C`.
 *
 * @returns An array of numbers representing the extracted test case IDs.
 *
 * @example
 * const caseIds = getCaseIdsForTitle("Test for @C123 and @C456");
 * console.log(caseIds); // Outputs: [123, 456]
 */
export const getCaseIdsForTitle = (title: string): number[] =>
  (title.match(/(?<=@C)\d+/g) || []).map(Number)

/**
 * Ensures that a test case is added to a specific test run if it is not already included.
 *
 * This function first checks if the test case should be added to the run by invoking the `shouldCaseBeAddedToRun` function.
 * If the test case needs to be added, it retrieves the current list of case IDs in the test run, appends the provided `caseId`,
 * and then updates the test run with the updated list of case IDs.
 *
 * @param client - The FluentRestClient instance to interact with the API.
 * @param testRunId - The ID of the test run to which the test case should be added.
 * @param caseId - The ID of the test case to be added to the test run.
 *
 * @returns A promise that resolves when the operation is completed.
 *
 * @throws Will throw an error if the case should be added and the update operation fails.
 *
 * @example
 * await ensureCaseAddedToRun(client, 12345, 67890);
 */
export const ensureCaseAddedToRun = async (
  client: FluentRestClient,
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

/**
 * Submits the result of a test case execution to the TestRail system for a specific test run.
 *
 * This function formats the test result information into a request object and sends it to TestRail by calling the
 * `addResultForCase` API. The result includes the status of the test (pass, fail, etc.), a detailed comment about the test,
 * and other relevant test info such as duration, environment, and any errors that occurred.
 *
 * @param client - The FluentRestClient instance used to interact with the TestRail API.
 * @param page - The Playwright Page object that contains the URL and other details about the test's execution context.
 * @param testInfo - The information about the test case execution, including status, retry count, and errors.
 * @param testRunId - The ID of the test run where the test result should be submitted.
 * @param caseId - The ID of the test case whose result is being submitted.
 *
 * @returns A promise that resolves once the result has been submitted to TestRail.
 *
 * @throws Will throw an error if submitting the result to TestRail fails.
 *
 * @example
 * await submitTestResult(client, page, testInfo, 12345, 67890);
 */
export const submitTestResult = async (
  client: FluentRestClient,
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
