import { HttpCredentials } from 'core/api/types/HttpCredentials'

export interface AuthenticationParams {
  extraHTTPHeaders?: Record<string, string>
  httpCredentials?: HttpCredentials
}
