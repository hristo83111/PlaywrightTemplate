import { EnvironmentSettings } from 'settings/types/EnvironmentSettings'

export const stageSettings: EnvironmentSettings = {
  uiUrls: {
    conduit: 'https://conduit.stage.bondaracademy.com',
    admin: 'https://admin.stage.bondaracademy.com'
  },
  apiUrls: {
    conduit: 'https://conduit-api.stage.bondaracademy.com/api',
    admin: 'https://cadmin-api.stage.bondaracademy.com/api'
  },
  database: {
    serverName: 'stage-conduit.local'
  }
}
