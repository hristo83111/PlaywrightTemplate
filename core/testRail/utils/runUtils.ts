import { testRailConfig } from 'core/testRail/testRailConfig'

// Controllers
import { getCasesForSuite } from 'core/testRail/api/controllers/cases'

// Utils
import { formatTestRunDate } from 'core/testRail/utils/formatUtils'

// Types
import { FluentRestClient } from 'core/api/types/FluentRestClient'
import { AddRunRequest } from 'core/testRail/api/types/AddRunRequest'
import { GetCaseResponse } from 'core/testRail/api/types/GetCaseResponse'

// Enums
import { CaseFilterCondition } from 'core/testRail/enums/CaseFilterCondition'
import { Project } from 'core/testRail/enums/Project'
import { SuiteId } from 'core/testRail/enums/SuiteId'

/**
 * Retrieves the corresponding SuiteId for a given project key.
 *
 * This function takes a `projectKey` (which should be one of the keys from the `Project` enum)
 * and returns the associated `SuiteId` based on a predefined mapping. If no mapping is found
 * for the provided `projectKey`, it throws an error.
 *
 * @param projectKey - The key of the project (must be one of the keys in the `Project` enum).
 *
 * @returns The corresponding `SuiteId` for the given project key.
 *
 * @throws {Error} Throws an error if no SuiteId is mapped for the provided project key.
 *
 * @example
 * const suiteId = getSuiteIdByProject('BSOM');  // Returns SuiteId.BSOM
 *
 * @example
 * const suiteId = getSuiteIdByProject('UNKNOWN');  // Throws an error
 */
const getSuiteIdByProject = (projectKey: keyof typeof Project) => {
  switch (projectKey) {
    case 'BSOM':
      return SuiteId.BSOM
    case 'RTIS':
      return SuiteId.RTIS
    default:
      throw new Error(`No SuiteId mapped for project key: ${projectKey}`)
  }
}

/**
 * Returns a filter condition function based on the provided `caseFilterCondition`.
 *
 * This function takes a `CaseFilterCondition` enum value and returns a corresponding filter function that can be applied to
 * an array of test cases. The returned filter function checks the specified condition on each `testCase` and returns `true`
 * or `false` based on whether the condition is met.
 *
 * @param caseFilterCondition - A condition that determines which filter to apply. It is based on the `CaseFilterCondition` enum.
 *
 * @returns A function that takes a `testCase` object and returns a boolean based on the filter condition.
 *
 * @throws {Error} Throws an error if the provided `caseFilterCondition` is unsupported.
 *
 * @example
 * const isAutomatedFilter = getFilterCondition(CaseFilterCondition.IsAutomated);
 * const isAutomated = isAutomatedFilter(testCase); // Returns true if the test case is automated
 */
const getFilterCondition = (caseFilterCondition: CaseFilterCondition) => {
  switch (caseFilterCondition) {
    case CaseFilterCondition.IsAutomated:
      return (testCase: GetCaseResponse) => testCase.custom_is_automated === 1
    case CaseFilterCondition.IsProductionTest:
      return (testCase: GetCaseResponse) => testCase.custom_is_production_test
    case CaseFilterCondition.IsMobileTest:
      return (testCase: GetCaseResponse) => testCase.custom_is_mobile_test
    case CaseFilterCondition.IsRegressionType:
      return (testCase: GetCaseResponse) => testCase.type_id === 9
    case CaseFilterCondition.IsAPITest:
      return (testCase: GetCaseResponse) =>
        testCase.custom_automation_type === 0
    case CaseFilterCondition.IsUITest:
      return (testCase: GetCaseResponse) =>
        testCase.custom_automation_type === 1
    default:
      throw new Error('Unsupported filter condition')
  }
}

/**
 * Fetches and filters the case IDs based on the provided filter condition.
 *
 * This function retrieves all the test cases for the given `projectId` and `suiteId`, and then applies the specified
 * filter condition to return a list of case IDs that match the condition. If the condition is `CaseFilterCondition.EmptyRun`,
 * it returns an empty array immediately.
 *
 * @param client - The instance of `FluentRestClient` used to make API requests.
 * @param projectId - The ID of the project from which test cases will be fetched.
 * @param suiteId - The ID of the suite from which test cases will be fetched.
 * @param caseFilterCondition - The filter condition based on the `CaseFilterCondition` enum. This determines which cases to return.
 *
 * @returns A promise that resolves to an array of test case IDs that match the specified filter condition.
 *
 * @throws {Error} If the filter condition is unsupported (handled by the `getFilterCondition` function).
 *
 * @example
 * const filteredCaseIds = await getFilteredCaseIds(client, 1, 100, CaseFilterCondition.IsAutomated);
 * // Returns the IDs of all automated test cases from the given suite and project.
 */
const getFilteredCaseIds = async (
  client: FluentRestClient,
  projectId: number,
  suiteId: number,
  caseFilterCondition: CaseFilterCondition
) => {
  if (caseFilterCondition === CaseFilterCondition.EmptyRun) {
    return []
  }

  const cases: GetCaseResponse[] = await getCasesForSuite(
    client,
    projectId,
    suiteId
  )
  const filterCondition = getFilterCondition(caseFilterCondition)

  return cases.filter(filterCondition).map(testCase => testCase.id)
}

/**
 * Resolves the Test Run ID either from the provided `runId` or the environment variable `TESTRAIL_TEST_RUN_ID`.
 *
 * This function first checks if a `runId` is provided. If not, it attempts to use the `TESTRAIL_TEST_RUN_ID` environment variable
 * (parsed as a number). If neither is available, it throws an error, indicating that the `TESTRAIL_TEST_RUN_ID` is required.
 *
 * @param runId - Optional parameter that can be provided to specify the Test Run ID.
 *
 * @returns The resolved Test Run ID as a number.
 *
 * @throws {Error} Throws an error if neither `runId` nor the `TESTRAIL_TEST_RUN_ID` environment variable is available.
 *
 * @example
 * const testRunId = resolveTestRunId(123);  // Returns 123
 *
 * @example
 * const testRunId = resolveTestRunId();  // Returns value from environment variable or throws an error
 */
export const resolveTestRunId = (runId?: number): number => {
  const testRunId = runId || +testRailConfig.testRunId!

  if (!testRunId) {
    throw new Error(
      'The environment variable TESTRAIL_TEST_RUN_ID is required.'
    )
  }

  return testRunId
}

/**
 * Retrieves the project ID associated with the given project key.
 *
 * This function maps a project key (e.g., 'BSOM', 'RTIS') to a corresponding project ID from the `Project` enum.
 * If the project key does not match any of the predefined keys, it throws an error indicating that no project ID is mapped for the provided key.
 *
 * @param projectKey - A key from the `Project` enum representing the project (e.g., 'BSOM', 'RTIS').
 *
 * @returns The project ID associated with the provided project key.
 *
 * @throws {Error} If the project key is not mapped to any project ID in the `Project` enum.
 *
 * @example
 * const projectId = getProjectIdByProjectKey('BSOM');
 * // Returns Project.BSOM if the key is 'BSOM'.
 */
export const getProjectIdByProjectKey = (projectKey: keyof typeof Project) => {
  switch (projectKey) {
    case 'BSOM':
      return Project.BSOM
    case 'RTIS':
      return Project.RTIS
    default:
      throw new Error(`No ProjectId mapped for project key: ${projectKey}`)
  }
}

/**
 * Creates an "Add Run" request for TestRail based on the provided project and filter conditions.
 *
 * This function constructs an `AddRunRequest` object that contains the necessary details to create
 * a new test run in TestRail, including the suite ID, run name, description, and filtered case IDs.
 * The function uses various utility methods to build the name and description for the run and applies
 * any necessary case filters based on the provided `CaseFilterCondition`.
 *
 * @param client - The `FluentRestClient` instance used to interact with the API.
 * @param projectId - The ID of the project for which the run is being created.
 * @param projectKey - The project key from the `Project` enum (e.g., 'BSOM', 'RTIS').
 * @param caseFilterCondition - The filter condition that defines which test cases to include in the run (e.g., automated, regression).
 *
 * @returns An `AddRunRequest` object that contains the details for the test run to be created.
 *
 * @example
 * const addRunRequest = await createAddRunRequest(client, 123, 'BSOM', CaseFilterCondition.IsAutomated);
 * // Returns an AddRunRequest with filtered cases based on automation condition.
 */
export const createAddRunRequest = async (
  client: FluentRestClient,
  projectId: number,
  projectKey: keyof typeof Project,
  caseFilterCondition: CaseFilterCondition
) => {
  const suitId = getSuiteIdByProject(projectKey)

  const runName = `${
    testRailConfig.runName ||
    `${projectKey} ${process.env.MC_ENVIRONMENT || 'QA'} Automated Regression Pack`
  }  ${formatTestRunDate()}`

  const runDescription = `Playwright Test 🎭. Test run created ${formatTestRunDate()} (UTC)`

  const filteredCaseIds = await getFilteredCaseIds(
    client,
    projectId,
    suitId,
    caseFilterCondition
  )

  const addRunRequest: AddRunRequest = {
    suite_id: suitId,
    name: runName,
    description: runDescription,
    include_all: false,
    case_ids: filteredCaseIds
  }

  return addRunRequest
}
