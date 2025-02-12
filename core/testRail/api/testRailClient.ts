import { restBuilder } from 'core/api/restBuilder'
import { testRailConfig } from 'core/testRail/testRailConfig12'

export const getTestRailClient = async () => {
  const { username, password, baseUrl } = testRailConfig

  if (!username || !password) {
    throw Error(
      'The environment variables TESTRAIL_USERNAME and TESTRAIL_PASSWORD are required.'
    )
  }

  return restBuilder().createClientWithBaseAuth(baseUrl, {
    username: username,
    password: password
  })
}
