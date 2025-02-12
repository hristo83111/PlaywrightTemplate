import { APIRequestContext, request } from '@playwright/test'
import { ReadStream } from 'fs'

// Types
import { RestBuilder } from 'core/api/types/RestBuilder'
import { APIRequest } from 'core/api/types/APIRequest'
import { Authentication } from 'core/api/types/Authentication'
import { AuthenticationType } from 'core/api/types/AuthenticationType'
import { BaseAuthentication } from 'core/api/types/BaseAuthentication'

/* eslint-disable */
export const restBuilder = (): RestBuilder => {
  let client: APIRequestContext
  let initialRequestState: APIRequest

  const createInitialRequestState = () => {
    initialRequestState = { url: '', options: { timeout: 90000 } }
  }

  return {
    async createClient(baseUrl: string, authentication?: Authentication) {
      const headers: Record<string, string> = {}

      if (authentication) {
        headers.Authorization =
          authentication.authType === AuthenticationType.JWT
            ? `Bearer ${authentication.authValue}`
            : `Basic ${authentication.authValue}`
      }

      client = await request.newContext({
        baseURL: baseUrl,
        extraHTTPHeaders: headers,
        ignoreHTTPSErrors: true
      })

      return this
    },

    async createClientWithBaseAuth(
      baseUrl: string,
      baseAuthentication: BaseAuthentication
    ) {
      client = await request.newContext({
        baseURL: baseUrl,
        ignoreHTTPSErrors: true,
        httpCredentials: {
          username: baseAuthentication.username,
          password: baseAuthentication.password,
          send: 'always'
        }
      })

      return this
    },

    withUrl(url: string) {
      createInitialRequestState()
      initialRequestState.url = url

      return this
    },

    withHeaders(headers: Record<string, string>) {
      initialRequestState.options.headers = {
        ...initialRequestState.options.headers,
        ...headers
      }

      return this
    },

    withParams(params: Record<string, string | number | boolean>) {
      initialRequestState.options.params = params

      return this
    },

    withForm(form: Record<string, string | number | boolean>) {
      initialRequestState.options.form = form
      return this
    },

    withBody(body: Record<string, any>) {
      initialRequestState.options.data = body

      return this
    },

    withMultiPart(
      multipart: Record<
        string,
        | string
        | number
        | boolean
        | ReadStream
        | { name: string; mimeType: string; buffer: Buffer }
      >
    ) {
      initialRequestState.options.multipart = multipart

      return this
    },

    executeGetAsync: async () =>
      await client.get(initialRequestState.url, initialRequestState.options),

    executePostAsync: async () =>
      await client.post(initialRequestState.url, initialRequestState.options),

    executePutAsync: async () =>
      await client.put(initialRequestState.url, initialRequestState.options),

    executePatchAsync: async () =>
      await client.patch(initialRequestState.url, initialRequestState.options),

    executeDeleteAsync: async () =>
      await client.delete(initialRequestState.url, initialRequestState.options)
  }
}
