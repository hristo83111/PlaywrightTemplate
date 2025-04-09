import { prodSettings } from 'settings/environmentSettings/prodSettings'
import { qaSettings } from 'settings/environmentSettings/qaSettings'
import { stageSettings } from 'settings/environmentSettings/stageSettimgs'
import {
  ConstSettings,
  constSettings
} from 'settings/environmentSettings/constSettings'
import { EnvironmentSettings } from 'settings/types/EnvironmentSettings'

type Settings = EnvironmentSettings & ConstSettings

const getSettings = (): Settings => {
  const getEnvironmentSettings = () => {
    switch (process.env.ENVIRONMENT) {
      case 'QA':
        return qaSettings
      case 'Stage':
        return stageSettings
      case 'Prod':
        return prodSettings
      default:
        throw Error('Environment is not set.')
    }
  }
  const environmentSetings = getEnvironmentSettings()

  return {
    ...environmentSetings,
    ...constSettings
  }
}

export const settings = getSettings()
