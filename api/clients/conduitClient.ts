import { getSettings } from 'settings/settings'

// Clients
import { createRestClient } from 'core/api/restClient'

// Services
import { postLogin } from 'api/services/conduit/usersService'

// Types
import { UserRequest } from 'api/types/conduit/UserRequest'
import { UserResponse } from 'api/types/conduit/UserResponse'
import { FluentRestClient } from 'core/api/types/FluentRestClient'
import { UserCredentials } from 'testData/types/UserCredentials'

/**
 * Authenticates a user and retrieves an access token.
 *
 * @param client - The FluentRestClient instance to make the API request.
 * @param userCredentials - The user's email and password for authentication.
 * @returns The access token for the authenticated user.
 */
const getAccessToken = async (
  client: FluentRestClient,
  userCredentials: UserCredentials
) => {
  const userRequest: UserRequest = {
    user: {
      email: userCredentials.email,
      password: userCredentials.password
    }
  }
  const loginResponse = await postLogin<UserResponse>(client, userRequest)

  return loginResponse.user.token
}

/**
 * Creates and returns a configured Conduit API client.
 *
 * @param userCredentials - Optional user credentials for authentication.
 * @returns A FluentRestClient instance, authenticated if credentials are provided.
 */
export const getConduitClient = async (userCredentials?: UserCredentials) => {
  const client = await createRestClient(getSettings().apiUrls.conduit)

  if (userCredentials) {
    const accessToken = await getAccessToken(client, userCredentials)

    return client.withAuthorizationHeader(`Token ${accessToken}`)
  }

  return client
}
