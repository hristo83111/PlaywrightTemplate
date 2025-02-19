import { expect, test } from 'fixtures/fixture'
import { users } from 'testData/users'

// Clients
import { getConduitClient } from 'api/clients/conduitClient'

// Services
import { postUser } from 'api/services/conduit/usersService'

// Factories
import {
  createErrorResponse,
  createUserRequest,
  createUserResponse
} from 'api/factories/conduit/usersFactory'

// Utils
import { step } from 'core/utils/step'

// Types
import { UserResponse } from 'api/types/conduit/UserResponse'
import { ErrorResponse } from 'api/types/ErrorResponse'
import { ResponseStatusCodes } from 'core/api/types/StatusCodes'

test.describe('POST users ', () => {
  test('201 Created - with all requied properties @C123', async () => {
    // Arrange
    const conduitClient = await getConduitClient()
    const userRequest = createUserRequest()
    const expectedUserResponse = createUserResponse(userRequest.user)

    const actualUserResponse = await step(
      'Successful user creation',
      async () => postUser<UserResponse>(conduitClient, userRequest)
    )

    await step('Assert user response 201', async () =>
      expect(actualUserResponse).toMatchObject(expectedUserResponse)
    )
  })

  test(
    '422 Unprocessable - with existing username and password @C4545',
    { tag: ['@regression'] },
    async () => {
      // Arrange
      const userCredentials = users.uk
      const conduitClient = await getConduitClient()
      const userRequest = createUserRequest(userCredentials)
      const expectedUserResponse = createErrorResponse()

      const actualUserResponse = await step(
        'Unsuccessful user creation',
        async () =>
          postUser<ErrorResponse>(
            conduitClient,
            userRequest,
            ResponseStatusCodes.Unprocessable
          )
      )

      await step('Assert user response 422', async () =>
        expect(actualUserResponse).toStrictEqual(expectedUserResponse)
      )
    }
  )
})
