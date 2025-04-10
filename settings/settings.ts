import { prodSettings } from 'settings/environmentSettings/prodSettings'
import { qaSettings } from 'settings/environmentSettings/qaSettings'
import { stageSettings } from 'settings/environmentSettings/stageSettimgs'
import {
  ConstSettings,
  constSettings
} from 'settings/environmentSettings/constSettings'

// Types
import { EnvironmentSettings } from 'settings/types/EnvironmentSettings'
import { EnvironmentName } from 'settings/types/EnvironmentName'

type Settings = EnvironmentSettings & ConstSettings

export const getSettings = (): Settings => {
  const environment = getEnvironment()

  const getEnvironmentSettings = () => {
    switch (environment) {
      case EnvironmentName.QA:
        return qaSettings
      case EnvironmentName.Stage:
        return stageSettings
      case EnvironmentName.Prod:
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

export const getEnvironment = (): EnvironmentName => {
  const environment = process.env.ENVIRONMENT

  switch (environment) {
    case 'QA':
      return EnvironmentName.QA
    case 'Stage':
      return EnvironmentName.Stage
    case 'Prod':
      return EnvironmentName.Prod
    default:
      throw Error('Environment is not set. Have to be QA | Stage | Prod.')
  }
}
