import { APIResponse } from '@playwright/test'
import { ReadStream } from 'fs'
import { Authentication } from 'core/api/types/Authentication'
import { BaseAuthentication } from 'core/api/types/BaseAuthentication'

export interface RestBuilder {
  createClient: (
    baseUrl: string,
    authentication?: Authentication
  ) => Promise<RestBuilder>
  createClientWithBaseAuth: (
    baseUrl: string,
    baseAuthentication: BaseAuthentication
  ) => Promise<RestBuilder>
  withUrl: (url: string) => RestBuilder
  withHeaders: (headers: Record<string, string>) => RestBuilder
  withParams: (params: Record<string, string | number | boolean>) => RestBuilder
  withForm: (form: Record<string, string | number | boolean>) => RestBuilder
  withBody: (body: unknown) => RestBuilder
  withMultiPart: (
    multipart: Record<
      string,
      | string
      | number
      | boolean
      | ReadStream
      | { name: string; mimeType: string; buffer: Buffer }
    >
  ) => RestBuilder
  executeGetAsync: () => Promise<APIResponse>
  executePostAsync: () => Promise<APIResponse>
  executePutAsync: () => Promise<APIResponse>
  executePatchAsync: () => Promise<APIResponse>
  executeDeleteAsync: () => Promise<APIResponse>
}
