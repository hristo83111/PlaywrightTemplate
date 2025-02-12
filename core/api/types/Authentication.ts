import { AuthenticationType } from 'core/api/types/AuthenticationType'

export interface Authentication {
  authType: AuthenticationType
  authValue: string
}
