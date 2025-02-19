import { settings } from 'settings/settings'
import { faker } from '@faker-js/faker'

// Types
import { UserRequest } from 'api/types/conduit/UserRequest'
import { UserResponse } from 'api/types/conduit/UserResponse'
import { UserCredentials } from 'testData/types/UserCredentials'
import { ErrorResponse } from 'api/types/ErrorResponse'

/**
 * Creates a user request payload for API calls.
 *
 * @param userCredentials - Optional user credentials. If not provided, random values will be generated.
 * @returns A `UserRequest` object containing the user's details.
 */
export const createUserRequest = (
  userCredentials?: UserCredentials
): UserRequest => ({
  user: {
    username: userCredentials?.username ?? faker.internet.username(),
    email: userCredentials?.email ?? faker.internet.email(),
    password: userCredentials?.password ?? settings.password
  }
})

/**
 * Creates a user response object based on provided user credentials.
 *
 * @param userCredentials - The user credentials containing email and username.
 * @returns A `UserResponse` object with the user's details.
 */
export const createUserResponse = (
  userCredentials: UserCredentials
): Partial<UserResponse> => ({
  user: {
    email: userCredentials.email,
    username: userCredentials.username!
  }
})

/**
 * Creates a standardized error response object.
 *
 * @returns An `ErrorResponse` object containing error messages for email and username.
 */
export const createErrorResponse = (): ErrorResponse => {
  const errorMessage = 'has already been taken'

  return {
    errors: {
      email: [errorMessage],
      username: [errorMessage]
    }
  }
}
