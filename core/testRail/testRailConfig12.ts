export const testRailConfig = {
  baseUrl: 'https://apptestrail',
  partialUrl: '/index.php?/api/v2',
  username: process.env.TESTRAIL_USERNAME || '',
  password: process.env.TESTRAIL_PASSWORD || '',
  enabled: process.env.TESTRAIL_ENABLED === 'TRUE',
  testRunId: process.env.TESTRAIL_TEST_RUN_ID,
  project: process.env.TESTRAIL_PROJECT,
  casesFilter: process.env.TESTRAIL_CASES_FILTER,
  runName: process.env.TESTRAIL_RUN_NAME,
  updateRun: process.env.TESTRAIL_UPDATE_RUN === 'TRUE'
}
