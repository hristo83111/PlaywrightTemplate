import { testRailConfig } from 'core/testRail/testRailConfig12'

// Controllers
import { getCasesForSuite } from 'core/testRail/api/controllers/cases'

// Utils
import { formatTestRunDate } from 'core/testRail/utils/formatUtils'

// Types
import { RestBuilder } from 'core/api/types/RestBuilder'
import { GetCaseResponse } from 'core/testRail/api/types/GetCaseResponse'

// Enums
import { CaseFilterCondition } from 'core/testRail/enums/CaseFilterCondition'
import { Project } from 'core/testRail/enums/Project'
import { SuiteId } from 'core/testRail/enums/SuiteId'
import { AddRunRequest } from 'core/testRail/api/types/AddRunRequest'

const getSuiteIdByProject = (projectKey: keyof typeof Project) => {
  switch (projectKey) {
    case 'MCOL':
      return SuiteId.MCOL
    case 'FNDA':
      return SuiteId.FNDA
    case 'MCOLCPI':
      return SuiteId.CPI
    default:
      throw new Error(`No SuiteId mapped for project key: ${projectKey}`)
  }
}

export const resolveTestRunId = (runId?: number): number => {
  const testRunId = runId || +testRailConfig.testRunId!

  if (!testRunId) {
    throw new Error(
      'The environment variable TESTRAIL_TEST_RUN_ID is required.'
    )
  }

  return testRunId
}

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

const getFilteredCaseIds = async (
  client: RestBuilder,
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

export const getProjectIdByProjectKey = (projectKey: keyof typeof Project) => {
  switch (projectKey) {
    case 'MCOL':
      return Project.MCOL
    case 'FNDA':
      return Project.FNDA
    case 'MCOLCPI':
      return Project.MCOLCPI
    default:
      throw new Error(`No ProjectId mapped for project key: ${projectKey}`)
  }
}

export const createAddRunRequest = async (
  client: RestBuilder,
  projectId: number,
  projectKey: keyof typeof Project,
  caseFilterCondition: CaseFilterCondition
) => {
  const suitId = getSuiteIdByProject(projectKey)

  const runName = `${
    testRailConfig.runName ||
    `${projectKey} ${process.env.MC_ENV || 'QB'} Automated Regression Pack`
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
