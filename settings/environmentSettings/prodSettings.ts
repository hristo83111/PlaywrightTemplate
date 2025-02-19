import { EnvironmentSettings } from 'settings/types/EnvironmentSettings'

export const prodSettings: EnvironmentSettings = {
  uiUrls: {
    conduit: 'https://conduit.prod.bondaracademy.com',
    admin: 'https://admin.prod.bondaracademy.com'
  },
  apiUrls: {
    conduit: 'https://conduit-api.prod.bondaracademy.com/api',
    admin: 'https://admin-api.prod.bondaracademy.com/api'
  }
}
