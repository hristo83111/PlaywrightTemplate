import { testRail } from 'core/testRail/testRail'
import { testRailConfig } from 'core/testRail/testRailConfig'

export default async () => {
  const { enabled, testRunId } = testRailConfig

  if (enabled && !testRunId) {
    process.env.TESTRAIL_TEST_RUN_ID = await testRail.addTestRun()
  }
}
