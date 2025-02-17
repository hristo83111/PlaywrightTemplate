import { createClient } from 'core/api/createRestClient'
import { HttpCredentials } from 'core/api/types/HttpCredentials'
import { testRailConfig } from 'core/testRail/testRailConfig'

/**
 * Creates and returns a `FluentRestClient` instance configured to interact with the TestRail API.
 *
 * This function retrieves the TestRail username, password, and base URL from the configuration, validates that the required credentials are present,
 * and then initializes a REST client with basic authentication using the provided credentials.
 *
 * @throws Error - If the `TESTRAIL_USERNAME` or `TESTRAIL_PASSWORD` environment variables are not set, an error will be thrown.
 *
 * @returns A `FluentRestClient` instance that is authenticated with the TestRail API and ready to perform requests.
 *
 * @example
 * const testRailClient = await getTestRailClient()
 * const response = await testRailClient
 *   .withUrl('/get_cases/123')
 *   .executeGetAsync()
 */
export const getTestRailClient = async () => {
  const { username, password, baseUrl } = testRailConfig

  if (!username || !password) {
    throw Error(
      'The environment variables TESTRAIL_USERNAME and TESTRAIL_PASSWORD are required.'
    )
  }

  const credentials: HttpCredentials = {
    username: username,
    password: password,
    send: 'always'
  }

  const client = await createClient(baseUrl)

  return client.withBaseAuthentication(credentials)
}
