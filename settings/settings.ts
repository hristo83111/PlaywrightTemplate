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
    switch (process.env.MC_ENVIRONMENT) {
      case 'Stage':
        return stageSettings
      case 'Prod':
        return prodSettings
      default:
        return qaSettings
    }
  }
  const environmentSetings = getEnvironmentSettings()

  return {
    ...environmentSetings,
    ...constSettings
  }
}

export const settings = getSettings()
