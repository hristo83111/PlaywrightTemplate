import { getSettings } from 'settings/settings'
import { UserCredentials } from 'testData/types/UserCredentials'

export const users: Record<string, UserCredentials> = {
  uk: {
    username: 'ukUser',
    email: 'ukUser@test.com',
    password: getSettings().password
  },
  us: {
    username: 'usUser',
    email: 'usUser@tets.com',
    password: getSettings().password
  }
}
