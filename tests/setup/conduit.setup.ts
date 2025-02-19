import { test as setup } from 'fixtures/fixture'
import { users } from 'testData/users'

// Clients
import { getConduitClient } from 'api/clients/conduitClient'

// Services
import { postUser } from 'api/services/conduit/usersService'

// Types
import { UserRequest } from 'api/types/conduit/UserRequest'
import { ResponseStatusCodes } from 'core/api/types/StatusCodes'
import { step } from 'core/utils/step'

setup('Create users', async () => {
  for (const user in users) {
    const userCredentials = users[user]

    try {
      // Arrange
      const conduitClient = await getConduitClient()
      const userRequest: UserRequest = {
        user: userCredentials
      }
      await step('Create user if not exist', async () =>
        postUser(conduitClient, userRequest, ResponseStatusCodes.Created, false)
      )
    } catch {
      console.log(
        `User with email: ${userCredentials.email} is already created.`
      )
    }
  }
})
