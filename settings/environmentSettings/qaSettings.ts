import { EnvironmentSettings } from 'settings/types/EnvironmentSettings'

export const qaSettings: EnvironmentSettings = {
  uiUrls: {
    conduit: 'https://conduit.bondaracademy.com',
    admin: 'https://admin.bondaracademy.com'
  },
  apiUrls: {
    conduit: 'https://conduit-api.bondaracademy.com',
    admin: 'https://admin-api.bondaracademy.com/api'
  },
  database: {
    serverName: 'qa-conduit.local'
  }
}
