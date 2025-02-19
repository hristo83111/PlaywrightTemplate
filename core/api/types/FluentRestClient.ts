import { APIResponse } from '@playwright/test'
import { ReadStream } from 'fs'
import { HttpCredentials } from 'core/api/types/HttpCredentials'

/**
 * FluentRestClient defines a fluent interface for making HTTP requests with optional authentication, headers, parameters, body, and multipart data.
 *
 * This client allows you to build an HTTP request step by step, chaining methods for setting:
 * - Authentication (withoutAuthentication, withAuthorizationHeader, withBaseAuthentication)
 * - Request URL, headers, parameters, form data, body, and multipart content
 *
 * After configuring the request, one of the execute methods (GET, POST, PUT, PATCH, DELETE) can be used to make the request and retrieve the response.
 */
export type FluentRestClient = {
  /**
   * Sets the Authorization header with a provided value (e.g., Bearer token).
   *
   * @param authorizationValue - The value for the Authorization header (e.g., 'Bearer token').
   * @returns FluentRestClient - the updated instance of the client with the Authorization header.
   */
  withAuthorizationHeader: (
    authorizationValue: string
  ) => Promise<FluentRestClient>

  /**
   * Sets basic authentication credentials.
   *
   * @param credentials - The HTTP credentials object containing username and password.
   * @returns FluentRestClient - the updated instance of the client with basic authentication.
   */
  withBaseAuthentication: (
    credentials: HttpCredentials
  ) => Promise<FluentRestClient>

  /**
   * Sets the request URL.
   *
   * @param url - The URL for the HTTP request.
   * @returns FluentRestClient - the updated instance of the client with the specified URL.
   */
  withUrl: (url: string) => FluentRestClient

  /**
   * Adds additional headers to the request.
   *
   * @param headers - A record of key-value pairs representing request headers.
   * @returns FluentRestClient - the updated instance of the client with additional headers.
   */
  withRequestHeaders: (headers: Record<string, string>) => FluentRestClient

  /**
   * Sets the query parameters for the request.
   *
   * @param params - A record of query parameters (key-value pairs).
   * @returns FluentRestClient - the updated instance of the client with the specified parameters.
   */
  withParams: (
    params: Record<string, string | number | boolean>
  ) => FluentRestClient

  /**
   * Sets the form data for a form submission.
   *
   * @param form - A record of form fields (key-value pairs).
   * @returns FluentRestClient - the updated instance of the client with the form data.
   */
  withForm: (
    form: Record<string, string | number | boolean>
  ) => FluentRestClient

  /**
   * Sets the request body data (e.g., for POST or PUT requests).
   *
   * @param body - The data to be sent in the request body.
   * @returns FluentRestClient - the updated instance of the client with the body data.
   */
  withBody: (body: unknown) => FluentRestClient

  /**
   * Sets the multipart form data for file uploads.
   *
   * @param multipart - A record of multipart form fields, including files and other data.
   * @returns FluentRestClient - the updated instance of the client with the multipart data.
   */
  withMultiPart: (
    multipart: Record<
      string,
      | string
      | number
      | boolean
      | ReadStream
      | { name: string; mimeType: string; buffer: Buffer }
    >
  ) => FluentRestClient

  /**
   * Executes a GET request with the configured options.
   *
   * @returns Promise<APIResponse> - the response from the GET request.
   */
  executeGetAsync: () => Promise<APIResponse>

  /**
   * Executes a POST request with the configured options.
   *
   * @returns Promise<APIResponse> - the response from the POST request.
   */
  executePostAsync: () => Promise<APIResponse>

  /**
   * Executes a PUT request with the configured options.
   *
   * @returns Promise<APIResponse> - the response from the PUT request.
   */
  executePutAsync: () => Promise<APIResponse>

  /**
   * Executes a PATCH request with the configured options.
   *
   * @returns Promise<APIResponse> - the response from the PATCH request.
   */
  executePatchAsync: () => Promise<APIResponse>

  /**
   * Executes a DELETE request with the configured options.
   *
   * @returns Promise<APIResponse> - the response from the DELETE request.
   */
  executeDeleteAsync: () => Promise<APIResponse>
}
